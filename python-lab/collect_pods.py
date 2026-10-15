"""Read-only UDS pod snapshot; explicit context, loopback API, no cluster changes."""
import argparse
import json
from pathlib import Path
import subprocess
from urllib.parse import urlsplit
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--context',required=True)
a=p.parse_args()
if a.context!='k3d-uds':p.error('This exercise only supports your local k3d-uds context.')
command=['uds','zarf','tools','kubectl','--context',a.context,'--request-timeout=15s']
try:
    config=json.loads(subprocess.check_output(command+['config','view','--minify','-o','json'],text=True,timeout=20))
    endpoint=config['clusters'][0]['cluster']['server']
    if urlsplit(endpoint).hostname not in ('127.0.0.1','localhost','::1'):raise ValueError('Expected a loopback API address.')
    pods=json.loads(subprocess.check_output(command+['get','pods','-n','tpol-training','-o','json'],text=True,timeout=20))
    # Store only the fields used by the lesson, not a whole workload specification.
    filtered={'items':[{'metadata':{'name':x['metadata']['name']},'status':{'phase':x.get('status',{}).get('phase','Unknown'),'containerStatuses':[{'ready':c.get('ready',False),'restartCount':c.get('restartCount',0)} for c in x.get('status',{}).get('containerStatuses',[])]}} for x in pods['items']]}
    output=Path(__file__).resolve().parent/'reports'/'live-pods.json'
    output.parent.mkdir(exist_ok=True);output.write_text(json.dumps(filtered,indent=2))
    print('Saved read-only snapshot:',output)
    print('The original data/pods.json sample is unchanged. Review live-pods.json before using it in lesson 13.')
except (OSError,ValueError,KeyError,IndexError,subprocess.SubprocessError) as error:
    p.exit(1,'Collection failed: '+str(error)+'\nCheck Docker, cluster readiness and the uds command.\n')
