#!/usr/bin/env python3
"""Install optional local tools, or supervise a monitoring session. No sudo or cluster mutations."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tarfile
import time
from urllib.request import urlopen
from bridge import Lab

ROOT = Path(__file__).resolve().parents[1]
HOME = Path.home() / 'tpol-monitoring'
DOWNLOADS = {
 'prometheus': ('https://github.com/prometheus/prometheus/releases/download/v3.13.4/prometheus-3.13.4.linux-amd64.tar.gz','87f21a66f96c597a189cef8d640e8921b621fc17a9feff707c332c4f3b3ddd56','prometheus-3.13.4.linux-amd64'),
 'grafana': ('https://dl.grafana.com/grafana/release/13.2.3/grafana_13.2.3_36482603486_linux_amd64.tar.gz','6107ad27016296aac38e0d7ffa8753ab540b5541ad27e94790f771289d733235','grafana'),
}
def listening(port):
    try:
        with socket.create_connection(('127.0.0.1',port),timeout=1): return True
    except OSError: return False

def install():
    if os.uname().machine != 'x86_64': raise RuntimeError('Bundled installer is Linux amd64 only. Use vendor downloads for your architecture.')
    HOME.mkdir(parents=True,exist_ok=True)
    for name,(url,digest,folder) in DOWNLOADS.items():
        dest=HOME/folder; binary=dest/('bin/grafana' if name=='grafana' else 'prometheus')
        if binary.exists():
            print(f'Keeping existing {name}: {binary}'); continue
        archive=HOME/(name+'.download.tar.gz')
        print(f'Downloading {name} from official release server…',flush=True)
        with urlopen(url,timeout=60) as src, archive.open('wb') as target: shutil.copyfileobj(src,target)
        if hashlib.file_digest(archive.open('rb'),'sha256').hexdigest()!=digest:
            raise RuntimeError(f'Checksum mismatch for {name}. No extraction performed.')
        staging=HOME/(name+'-extract')
        staging.mkdir(exist_ok=True)
        with tarfile.open(archive) as tf:
            for member in tf.getmembers():
                target=(staging/member.name).resolve()
                if not target.is_relative_to(staging.resolve()) or member.issym() or member.islnk():
                    raise RuntimeError('Unsafe archive entry')
            tf.extractall(staging,filter='data')
        dirs=[x for x in staging.iterdir() if x.is_dir()]
        if len(dirs)!=1: raise RuntimeError('Unexpected archive layout')
        dirs[0].rename(dest); staging.rmdir(); archive.unlink()
    print('Tools ready. Existing dashboards and data were preserved.')

def configure():
    HOME.mkdir(parents=True,exist_ok=True)
    config=HOME/'training.yml'
    if not config.exists(): shutil.copy2(ROOT/'integrations/monitoring/prometheus.yml',config)
    dest=HOME/'grafana/conf/provisioning/datasources/tpol-v3.yml'
    # Keep all existing data sources; add through UI if provisioning was already configured.
    existing=list(dest.parent.glob('*.yml'))+list(dest.parent.glob('*.yaml'))
    if not existing:
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_text('apiVersion: 1\ndatasources:\n  - name: Training Prometheus\n    uid: training-prometheus\n    type: prometheus\n    access: proxy\n    url: http://127.0.0.1:9090\n    isDefault: true\n    jsonData:\n      timeInterval: 15s\n')
    print('Configuration ready; existing training.yml and Grafana provisioning retained.')

def supervise(context):
    lab=Lab(context); lab.guard() # refuses a non-loopback cluster
    configure()
    processes={}; logdir=HOME/'session-logs'; logdir.mkdir(exist_ok=True)
    env=os.environ.copy();env.update(GF_SERVER_HTTP_ADDR='127.0.0.1',GF_SERVER_HTTP_PORT='3000')
    commands={
      'port-forward':(9898,lab.kube+['-n','tpol-training','port-forward','deployment/mission-api','9898:http'],None),
      'prometheus':(9090,[str(HOME/DOWNLOADS['prometheus'][2]/'prometheus'),'--config.file='+str(HOME/'training.yml'),'--storage.tsdb.path='+str(HOME/'data'),'--storage.tsdb.retention.time=24h','--web.listen-address=127.0.0.1:9090'],None),
      'grafana':(3000,[str(HOME/'grafana/bin/grafana'),'server'],str(HOME/'grafana')),
    }
    for name in ('prometheus','grafana'):
        if not listening(commands[name][0]) and not Path(commands[name][1][0]).is_file():
            raise RuntimeError(f'{name} binary missing. Run: python3 local/monitoring.py install')
    reused={name for name,(port,_,_) in commands.items() if listening(port)}
    print('Session running. Existing listeners are reused, not replaced:', ', '.join(sorted(reused)) or 'none')
    print('Grafana http://localhost:3000 | Prometheus http://localhost:9090 | logs: '+str(logdir))
    print('A listening port is not a health check. Verify monitoring in the app. Ctrl+C stops only processes started here.',flush=True)
    last={}
    try:
        while True:
            for name,(port,argv,cwd) in commands.items():
                p=processes.get(name)
                if p and p.poll() is None: continue
                if p:
                    print(f'{name} exited ({p.returncode}); see {logdir/name}.log',flush=True);processes.pop(name)
                if listening(port): continue
                if time.monotonic()-last.get(name,0)<10: continue
                # Re-check API destination before re-establishing a cluster connection.
                if name=='port-forward':
                    try: lab.guard()
                    except RuntimeError as exc:
                        print(str(exc),flush=True);last[name]=time.monotonic();continue
                with (logdir/(name+'.log')).open('a') as f:
                    processes[name]=subprocess.Popen(argv,cwd=cwd,env=env,stdout=f,stderr=subprocess.STDOUT,stdin=subprocess.DEVNULL)
                last[name]=time.monotonic();print('Started '+name,flush=True)
            time.sleep(2)
    except KeyboardInterrupt: print('\nStopping managed session; saved data remains.')
    finally:
        for p in processes.values():
            if p.poll() is None: p.terminate()
        for p in processes.values():
            try:p.wait(timeout=5)
            except subprocess.TimeoutExpired:p.kill();p.wait()

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('action',choices=['install','configure','run']);p.add_argument('--context',default='k3d-uds');a=p.parse_args()
    try:
        if a.action=='install':install();configure()
        elif a.action=='configure':configure()
        else:supervise(a.context)
    except (RuntimeError,OSError,ValueError) as exc:p.exit(1,str(exc)+'\n')
if __name__=='__main__':main()
