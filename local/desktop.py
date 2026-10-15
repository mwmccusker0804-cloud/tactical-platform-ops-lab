#!/usr/bin/env python3
"""Foreground desktop session. Never deletes clusters, volumes or existing workloads."""
import argparse
import fcntl
import json
import os
from pathlib import Path
import platform
import signal
import socket
import subprocess
import sys
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
CHILDREN = []

def run(*args, capture=False):
    p = subprocess.run(list(args), cwd=ROOT, check=True, text=True,
                       stdout=subprocess.PIPE if capture else None)
    return p.stdout if capture else ''

def script(name, *args):
    return run(sys.executable, '-u', str(ROOT/'local'/name), *args)

def spawn(name, *args):
    p = subprocess.Popen([sys.executable, '-u', str(ROOT/'local'/name), *args],
                         cwd=ROOT, start_new_session=True)
    CHILDREN.append(p)
    return p

def wait_for(label, fn, seconds=180):
    print('Waiting for '+label+' ...', flush=True)
    deadline = time.monotonic()+seconds
    last = ''
    while time.monotonic() < deadline:
        for child in CHILDREN:
            if child.poll() is not None:
                raise RuntimeError('A session service exited. Review the message above or ~/tpol-monitoring/session-logs.')
        try:
            if fn(): return
        except Exception as exc:
            last = str(exc)
        time.sleep(3)
    raise RuntimeError(label+' did not become ready. '+last)

def http_ready(url):
    with urllib.request.urlopen(url, timeout=3) as response:
        return response.status == 200

def listening(port):
    try:
        with socket.create_connection(('127.0.0.1', port), timeout=1): return True
    except OSError: return False

def compose(rel, *args):
    return run('docker', 'compose', '-f', str(ROOT/rel), *args)

def stop_stacks():
    # Only this project's known stacks; preserve all persistent data.
    compose('integrations/redpanda/compose.yml', 'stop')
    run('docker','compose','-f',str(ROOT/'integrations/operations/compose.yml'),
        '-f',str(ROOT/'integrations/operations/stream.compose.yml'),'stop')
    if (Path.home()/'tpol-siem/compose.json').exists(): script('siem.py','stop')
    clusters = json.loads(run('k3d','cluster','list','-o','json',capture=True))
    if any(c['name']=='uds' for c in clusters): run('k3d','cluster','stop','uds')

def start_uds(redeploy):
    from bridge import Lab
    clusters = json.loads(run('k3d','cluster','list','-o','json',capture=True))
    if not any(c['name']=='uds' for c in clusters):
        raise RuntimeError('Existing uds cluster not found. Complete the basic UDS setup in START-HERE.md first.')
    run('k3d','cluster','start','uds')
    lab = Lab('k3d-uds')
    wait_for('UDS API and CRDs', lambda: (lab.guard() is None))
    lab.k('wait','--for=condition=Ready','nodes','--all','--timeout=180s')
    # Missing is distinct from an API/permission failure: errors must not trigger deployment.
    app = lab.k('get','deployment','mission-api','-n','tpol-training','--ignore-not-found','-o','name').strip()
    if redeploy or not app:
        arch = 'arm64' if platform.machine() in ('aarch64','arm64') else 'amd64'
        if not list((ROOT/'package').glob('zarf-package-tpol-training-'+arch+'-2.0.0.tar.zst')):
            script('labctl.py','build')
        script('labctl.py','deploy','--context','k3d-uds')
    lab.guard(require_app=True)
    lab.k('rollout','status','deployment/mission-api','-n','tpol-training','--timeout=180s')
    home = Path.home()/'tpol-monitoring'
    if not (home/'prometheus-3.13.4.linux-amd64/prometheus').exists() or not (home/'grafana/bin/grafana').exists():
        script('monitoring.py','install')
    spawn('monitoring.py','run','--context','k3d-uds')
    wait_for('Grafana', lambda: http_ready('http://127.0.0.1:3000/api/health'))
    wait_for('Prometheus', lambda: http_ready('http://127.0.0.1:9090/-/ready'))
    wait_for('application metrics', lambda: http_ready('http://127.0.0.1:9898/metrics'))
    print('Grafana: http://localhost:3000 | Prometheus: http://localhost:9090', flush=True)

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('profile',choices=['uds','redpanda','operations','wazuh','learning','stop'])
    p.add_argument('--redeploy',action='store_true')
    a = p.parse_args()
    state = Path.home()/'.local/state/tpol-launcher'
    state.mkdir(parents=True,exist_ok=True,mode=0o700)
    with (state/'session.lock').open('w') as lock:
        try: fcntl.flock(lock, fcntl.LOCK_EX|fcntl.LOCK_NB)
        except BlockingIOError:
            raise RuntimeError('A launcher is already open. Press Ctrl+C in that window before switching profiles or stopping stacks.')
        if a.profile != 'learning':
            wait_for('Docker Desktop / WSL integration',lambda: bool(run('docker','info','--format','{{.ServerVersion}}',capture=True)))
        if a.profile == 'stop':
            stop_stacks(); print('Known lab stacks stopped; data preserved.'); return
        if listening(8765):
            raise RuntimeError('Port 8765 is already in use. Close the previous bridge terminal first; it was not stopped automatically.')
        if a.profile in ('uds','redpanda'):
            names = run('docker','ps','--format','{{.Names}}',capture=True).splitlines()
            if any(n.startswith(('tpol-siem-', 'tpol-operations-')) for n in names):
                raise RuntimeError('Stop the Wazuh/Operations session first using launcher choice 6, then retry UDS.')
            start_uds(a.redeploy)
            if a.profile == 'redpanda':
                compose('integrations/redpanda/compose.yml','up','-d')
                wait_for('Redpanda Console',lambda: http_ready('http://127.0.0.1:8088'))
                compose('integrations/redpanda/compose.yml','exec','-T','redpanda','rpk','cluster','info')
                print('Redpanda Console: http://localhost:8088',flush=True)
        elif a.profile == 'operations':
            script('operations_lab.py','up')
            wait_for('operations Grafana',lambda: http_ready('http://127.0.0.1:13000/api/health'))
            wait_for('Loki',lambda: http_ready('http://127.0.0.1:13100/ready'))
            print('Operations Grafana: http://localhost:13000',flush=True)
        elif a.profile == 'wazuh':
            if not (Path.home()/'tpol-siem/compose.json').exists(): script('siem.py','prepare')
            script('siem.py','up'); script('siem.py','status')
            print('Wazuh startup requested: https://localhost:8443. Allow several minutes; dashboard readiness and event ingestion still need verification.',flush=True)
        spawn('bridge.py','--context','k3d-uds')
        wait_for('lab application',lambda: http_ready('http://127.0.0.1:8765'))
        print('TPOL_READY',flush=True)
        print('Keep this window open. Ctrl+C closes the connector and monitoring processes started here. Docker stacks remain running; choose Stop lab stacks to stop them.',flush=True)
        while True:
            time.sleep(3)
            if any(c.poll() is not None for c in CHILDREN):
                raise RuntimeError('A managed service exited. Review its terminal output/logs and relaunch.')

def cleanup():
    for child in reversed(CHILDREN):
        if child.poll() is None:
            os.killpg(child.pid,signal.SIGINT)
            try: child.wait(timeout=15)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid,signal.SIGTERM)
                try: child.wait(timeout=5)
                except subprocess.TimeoutExpired: os.killpg(child.pid,signal.SIGKILL)

if __name__ == '__main__':
    signal.signal(signal.SIGTERM,lambda *_: (_ for _ in ()).throw(KeyboardInterrupt()))
    try: main()
    except KeyboardInterrupt: print('\nSession closed.')
    except (RuntimeError,OSError,ValueError,subprocess.CalledProcessError) as exc:
        print('\nSTARTUP STOPPED: '+str(exc)+'\nSee DESKTOP-LAUNCHER.md. Existing data has not been deleted.',file=sys.stderr)
        sys.exit(1)
    finally: cleanup()
