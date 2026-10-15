#!/usr/bin/env python3
"""Explicit lifecycle controls for the optional v4 operations exercise; no existing services changed."""
import argparse,json,subprocess,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CONFIG=ROOT/'integrations/operations/compose.yml'
def run(*args,capture=False):
    p=subprocess.run(args,text=True,check=True,stdout=subprocess.PIPE if capture else None)
    return p.stdout if capture else ''
def compose(*args):return run('docker','compose','-f',str(CONFIG),*args)
def check():
    info=json.loads(run('docker','info','--format','{{json .}}',capture=True))
    if info.get('MemTotal',0)<6_000_000_000:raise RuntimeError('Allocate at least 6 GB to Docker for this isolated training session.')
    if shutil.disk_usage(ROOT).free<10_000_000_000:raise RuntimeError('Need 10 GB free for images and lab data; also check Docker virtual disk space.')
    names=run('docker','ps','--format','{{.Names}}',capture=True).splitlines()
    if info['MemTotal']<12*1024**3 and any(not n.startswith('tpol-operations-') for n in names):
        raise RuntimeError('Small-host profile: stop UDS, Redpanda and Wazuh first. No containers were stopped. Read the operations guide.')
    print('Basic capacity checks passed. Container memory limits total 2176 MiB; allow overhead. This is not a performance guarantee.')
    compose('config','--quiet')
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('action',choices=['check','up','stop','status','logs','break-demo','restore-demo','validate']);a=p.parse_args()
    try:
        if a.action=='check':check()
        elif a.action=='up':check();compose('up','-d')
        elif a.action=='stop':compose('stop')
        elif a.action=='status':compose('ps')
        elif a.action=='logs':compose('logs','--tail','50')
        elif a.action=='break-demo':compose('stop','demo')
        elif a.action=='restore-demo':compose('up','-d','demo')
        elif a.action=='validate':
            compose('config','--quiet')
            compose('run','--rm','--no-deps','--entrypoint','/bin/promtool','prometheus','check','config','/etc/prometheus/prometheus.yml')
            compose('run','--rm','--no-deps','--entrypoint','/bin/amtool','alertmanager','check-config','/etc/alertmanager/alertmanager.yml')
            compose('run','--rm','--no-deps','loki','-config.file=/etc/loki/config.yml','-verify-config=true')
            compose('run','--rm','--no-deps','alloy','validate','/etc/alloy/config.alloy')
    except (OSError,ValueError,RuntimeError,subprocess.CalledProcessError) as exc:p.exit(1,str(exc)+'\n')
if __name__=='__main__':main()
