#!/usr/bin/env python3
"""Optional Wazuh lab. Explicit CLI operations only; no browser-triggered installation."""
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
from observability import STATE

ROOT=Path(__file__).resolve().parents[1]
HOME=Path.home()/'tpol-siem'
REPO=HOME/'wazuh-docker'
SINGLE=REPO/'single-node'
CONFIG=HOME/'compose.json'
VERSION='v4.14.8'

def command(argv, capture=False, cwd=None, input=None):
    p=subprocess.run(argv,cwd=cwd,text=True,input=input,stdout=subprocess.PIPE if capture else None,check=True)
    return p.stdout if capture else ''

def compose(*args,capture=False,input=None):
    return command(['docker','compose','-p','tpol-siem','-f',str(CONFIG),*args],capture=capture,input=input)

def transform(config):
    """Only dashboard port is published. Manager/indexer stay within this Compose network."""
    config['name']='tpol-siem'
    for service in config['services'].values():
        service['ports']=[];service['restart']='no';service.pop('container_name',None)
    config['services']['wazuh.dashboard']['ports']=[{'target':5601,'published':'8443','host_ip':'127.0.0.1','protocol':'tcp'}]
    config['services']['wazuh.manager']['volumes'] += [
        {'type':'bind','source':str(STATE),'target':'/var/log/tpol','read_only':True},
        {'type':'bind','source':str(HOME/'tpol-rules.xml'),'target':'/var/ossec/etc/rules/tpol_rules.xml','read_only':True},
    ]
    # Compose config normalizes resource names using the original project name.
    for section in ('volumes','networks'):
        for key,value in config.get(section,{}).items():
            if not value.get('external'):value['name']='tpol-siem_'+key
    return config

def prepare():
    HOME.mkdir(parents=True,exist_ok=True,mode=0o700)
    STATE.mkdir(parents=True,exist_ok=True,mode=0o700)
    (STATE/'bridge.jsonl').touch(exist_ok=True)
    (STATE/'training.jsonl').touch(exist_ok=True)
    if not REPO.exists():
        command(['git','clone','--depth','1','--branch',VERSION,'https://github.com/wazuh/wazuh-docker.git',str(REPO)])
    tag=command(['git','describe','--tags','--exact-match'],capture=True,cwd=REPO).strip()
    if tag!=VERSION:raise RuntimeError('Existing Wazuh checkout version differs; keeping it unchanged.')
    conf=SINGLE/'config/wazuh_cluster/wazuh_manager.conf'
    text=conf.read_text()
    if '/var/log/tpol/bridge.jsonl' not in text:
        addition='\n'.join('<localfile><log_format>json</log_format><location>/var/log/tpol/'+name+'</location></localfile>' for name in ['bridge.jsonl','training.jsonl'])
        pos=text.rfind('</ossec_config>')
        if pos<0:raise RuntimeError('Unexpected manager configuration')
        conf.write_text(text[:pos]+addition+'\n'+text[pos:])
    shutil.copy2(ROOT/'integrations/siem/tpol-rules.xml',HOME/'tpol-rules.xml')
    config=json.loads(command(['docker','compose','-p','tpol-siem','-f',str(SINGLE/'docker-compose.yml'),'config','--format','json'],capture=True,cwd=SINGLE))
    CONFIG.write_text(json.dumps(transform(config),indent=2));CONFIG.chmod(0o600)
    print('Prepared Wazuh 4.14.8 and local rules. Nothing started. Only localhost:8443 will be published.')

def preflight():
    info=json.loads(command(['docker','info','--format','{{json .}}'],capture=True))
    if info.get('MemTotal',0)<8_000_000_000 or info.get('NCPU',0)<4:
        raise RuntimeError('Wazuh lab requires at least 8 GB Docker memory and 4 CPUs. Use browser exercises or a separate host.')
    if shutil.disk_usage(HOME).free<50_000_000_000:
        raise RuntimeError('Less than 50 GB free on this filesystem. Also check Docker Desktop virtual disk capacity.')
    containers=command(['docker','ps','--format','{{.Names}}'],capture=True).splitlines()
    if info['MemTotal']<12*1024**3 and any(not n.startswith('tpol-siem-') for n in containers):
        raise RuntimeError('Small-host profile: stop the UDS cluster and other lab containers first. No services were stopped by this helper.')
    if info['MemTotal']<12*1024**3:
        for port in [9090,3000]:
            try:
                with socket.create_connection(('127.0.0.1',port),timeout=1):
                    raise RuntimeError('Small-host profile: stop the native monitoring session first (Ctrl+C in its terminal).')
            except OSError: pass
    if int(Path('/proc/sys/vm/max_map_count').read_text())<262144:
        raise RuntimeError('Set the Docker-host vm.max_map_count to 262144 using the SIEM guide; no kernel changes made here.')
    print('Basic capacity checks passed; this does not guarantee runtime fit. Check Docker virtual disk has 50 GB free.')

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('action',choices=['prepare','check','up','stop','status','test-rule','sample']);a=p.parse_args()
    try:
        if a.action=='prepare':prepare();return
        if not CONFIG.exists():raise RuntimeError('Run python3 local/siem.py prepare first.')
        if a.action=='check':preflight()
        elif a.action=='up':
            preflight()
            cert=SINGLE/'config/wazuh_indexer_ssl_certs/root-ca.pem'
            if not cert.exists():command(['docker','compose','-p','tpol-siem','-f','generate-indexer-certs.yml','run','--rm','generator'],cwd=SINGLE)
            compose('up','-d');print('Startup requested, not yet verified. Run status and test-rule; then open https://localhost:8443.')
        elif a.action=='stop':compose('stop');print('Stopped Wazuh; all volumes preserved.')
        elif a.action=='status':compose('ps')
        elif a.action=='test-rule':
            sample=json.dumps({'source':'tpol-bridge','event':'authorization','outcome':'denied','training':True})
            compose('exec','-T','wazuh.manager','/var/ossec/bin/wazuh-logtest',input=sample+'\n')
            print('Look for rule id 100101. logtest tests a rule; it does not prove indexing or dashboard ingestion.')
        elif a.action=='sample':
            event={'timestamp':datetime.now(timezone.utc).isoformat(),'source':'tpol-bridge','event':'authorization','outcome':'denied','training':True,'note':'Harmless synthetic test, no login attempted'}
            with (STATE/'training.jsonl').open('a') as f:f.write(json.dumps(event)+'\n')
            print('Appended synthetic event. In Wazuh search rule.id:100101 and confirm data.training:true plus current timestamp.')
    except (RuntimeError,OSError,ValueError,subprocess.CalledProcessError) as exc:p.exit(1,str(exc)+'\n')
if __name__=='__main__':main()
