#!/usr/bin/env python3
"""Build/deploy training assets with explicit context and isolated temporary kubeconfig."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
from bridge import Lab, ROOT, NS, LABEL, OWNER, run

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('action',choices=['check','build','deploy'])
    p.add_argument('--context')
    args=p.parse_args()
    if args.action=='check':
        for title,cmd in [('Kernel',['uname','-r']),('UDS',['uds','version']),('Docker',['docker','info','--format','CPUs={{.NCPU}} RAM(bytes)={{.MemTotal}}']),('k3d',['k3d','version']),('Contexts',['uds','zarf','tools','kubectl','config','get-contexts'])]:
            print('\n'+title)
            try: print(run(cmd))
            except RuntimeError as e: print('CHECK FAILED:',e)
        print('Disk space for this folder (GiB):',round(shutil.disk_usage(ROOT).free/2**30,1))
        print('Compare Docker allocation against 4 CPUs / 10 GiB RAM, plus 40 GiB free disk for full UDS demo. See START-HERE.md.')
        return
    if args.action=='build':
        subprocess.run(['uds','zarf','package','create','--confirm'],cwd=ROOT/'package',check=True)
        print('Package built. This is the transfer artifact for the offline delivery exercise.')
        return
    if not args.context: p.error('deploy requires --context k3d-uds (or your local k3d context)')
    lab=Lab(args.context);lab.guard()
    # Never adopt a pre-existing namespace belonging to another app.
    existing=lab.obj('get','namespace',NS,'--ignore-not-found') if lab.k('get','namespace',NS,'--ignore-not-found').strip() else None
    if existing and existing.get('metadata',{}).get('labels',{}).get(LABEL)!=OWNER:
        raise RuntimeError('Namespace already exists without training ownership. Refusing deployment.')
    packages=list((ROOT/'package').glob('zarf-package-tpol-training-*-2.0.0.tar.zst'))
    arch={'x86_64':'amd64','aarch64':'arm64'}.get(os.uname().machine,os.uname().machine)
    packages=[x for x in packages if f'-{arch}-' in x.name]
    if len(packages)!=1: raise RuntimeError('Run python3 local/labctl.py build first. Expected one package matching this CPU architecture.')
    # Flatten only the explicitly selected context; never rewrite the user's kubeconfig.
    config=lab.k('config','view','--minify','--flatten','--raw')
    with tempfile.TemporaryDirectory(prefix='tpol-kube-') as folder:
        path=Path(folder)/'config';path.write_text(config);path.chmod(0o600)
        env=dict(os.environ,KUBECONFIG=str(path))
        subprocess.run(['uds','zarf','package','deploy',str(packages[0]),'--confirm'],env=env,check=True)
    print('Package deployment completed. Start the connector and inspect readiness. App: https://tpol-training.uds.dev')

if __name__=='__main__':
    try: main()
    except (RuntimeError,subprocess.CalledProcessError) as e:
        raise SystemExit(str(e))
