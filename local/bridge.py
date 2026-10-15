#!/usr/bin/env python3
"""Loopback-only UDS training connector. Python standard library, no cloud API."""
import argparse
import observability
import hmac
import json
import os
from pathlib import Path
import secrets
import shutil
import subprocess
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
NS = 'tpol-training'
APP = 'mission-api'
OWNER = 'tpol-lab-v2'
LABEL = 'training.tpol.dev/owner'
FILES = {'/': 'index.html', '/index.html': 'index.html', '/app.js': 'app.js', '/styles.css':'styles.css', '/learning.js':'learning.js', '/learning-data.js':'learning-data.js', '/assets/linux-worksheet.png':'assets/linux-worksheet.png', '/assets/unicorn-workshop.png':'assets/unicorn-workshop.png', '/live.js': 'live.js', '/sw.js': 'sw.js', '/manifest.webmanifest': 'manifest.webmanifest', '/icon.svg': 'icon.svg'}
FILES.update({'/curriculum.js': 'curriculum.js', '/quiz.js': 'quiz.js', '/exercises.js': 'exercises.js', '/operations.js': 'operations.js', '/assets/unicorn-rf-operations.png': 'assets/unicorn-rf-operations.png', '/assets/unicorn-rf-field.png': 'assets/unicorn-rf-field.png', '/integrations/monitoring/tactical-dashboard.json': 'integrations/monitoring/tactical-dashboard.json', '/integrations/monitoring/README.md': 'integrations/monitoring/README.md', '/integrations/siem/README.md': 'integrations/siem/README.md', '/integrations/redpanda/README.md': 'integrations/redpanda/README.md', '/UPGRADE.md': 'UPGRADE.md'})
FILES.update({p: p.lstrip('/') for p in ['/directory.js','/ACTIVE-DIRECTORY-LAB.md','/deployment.js','/deployment-data.js','/assets/unicorn-operations-v4.png','/integrations/operations/README.md','/DEPLOYMENT-GUIDE.md','/SOURCES.md']})
FILES.update({p: p.lstrip('/') for p in ['/python.js','/python-data.js','/PYTHON-LAB.md']})
FILES.update({p: p.lstrip('/') for p in ['/python-projects.js','/python-projects-data.js','/assets/python-hunters.png']})
MIME = {'.json':'application/json', '.md':'text/plain; charset=utf-8', '.html':'text/html', '.css':'text/css', '.png':'image/png', '.js':'text/javascript', '.svg':'image/svg+xml', '.webmanifest':'application/manifest+json'}

def run(argv, timeout=25):
    try:
        p = subprocess.run(argv, capture_output=True, text=True, timeout=timeout, stdin=subprocess.DEVNULL)
    except FileNotFoundError:
        raise RuntimeError(f'{argv[0]} is not installed or not on PATH.')
    except subprocess.TimeoutExpired:
        raise RuntimeError('Command timed out. Check Docker and cluster connectivity, then refresh.')
    if p.returncode:
        raise RuntimeError((p.stderr or p.stdout or 'Command failed')[-6000:])
    return p.stdout

class Lab:
    def __init__(self, context):
        if not context.startswith('k3d-') or any(c not in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_' for c in context):
            raise RuntimeError('Choose a local k3d context, for example k3d-uds. Remote contexts are not supported.')
        self.context = context
        self.lock = threading.Lock()
        self.kube = ['uds', 'zarf', 'tools', 'kubectl', '--context', context, '--request-timeout=15s']

    def k(self, *args):
        return run(self.kube + list(args))

    def obj(self, *args):
        return json.loads(self.k(*args, '-o', 'json'))

    def guard(self, require_app=False):
        config = self.obj('config', 'view', '--minify')
        try:
            endpoint = config['clusters'][0]['cluster']['server']
        except (KeyError, IndexError, TypeError):
            raise RuntimeError('Selected context has no usable cluster configuration.')
        if urlsplit(endpoint).hostname not in ('127.0.0.1', 'localhost', '::1'):
            raise RuntimeError('This connector only accepts a loopback Kubernetes API for a local k3d lab.')
        self.k('get', 'crd', 'packages.uds.dev')
        if require_app:
            for kind,name,ns in [('namespace',NS,False),('deployment',APP,True),('service',APP,True)]:
                obj = self.obj('get', kind, name, *(['-n',NS] if ns else []))
                if obj.get('metadata',{}).get('labels',{}).get(LABEL) != OWNER:
                    raise RuntimeError('Training ownership label missing. Deploy the included package first; refusing to modify this resource.')

    def status(self):
        self.guard()
        result = {'context':self.context, 'namespace':NS, 'observedAt':__import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat()}
        queries = {
            'nodes':['get','nodes'],
            'pods':['get','pods','-n',NS],
            'deployments':['get','deployments','-n',NS],
            'services':['get','services','-n',NS],
            'endpoints':['get','endpointslices','-n',NS,'-l','kubernetes.io/service-name='+APP],
            'packages':['get','packages.uds.dev','-n',NS],
        }
        result['errors'] = {}
        for name, args in queries.items():
            try: result[name] = self.obj(*args).get('items',[])
            except RuntimeError as e: result[name]=[]; result['errors'][name]=str(e)
        return result

    def action(self, action):
        if action not in ('scale-down','break-service','bad-start','restore','events','logs','previous-logs','describe','policies'):
            raise ValueError('Unknown action')
        with self.lock:
            self.guard(require_app=True)
            base=['-n',NS]
            if action=='scale-down': return self.k(*base,'scale','deployment/'+APP,'--replicas=0')
            if action=='break-service':
                return self.k(*base,'patch','service',APP,'--type=merge','-p',json.dumps({'spec':{'selector':{'app':'no-matching-training-pod'}}}))
            if action=='bad-start':
                return self.k(*base,'patch','deployment',APP,'--type=strategic','-p',json.dumps({'spec':{'template':{'spec':{'containers':[{'name':APP,'command':['/does-not-exist-training-fault']}]}}}}))
            if action=='restore':
                output = self.k(*base,'patch','service',APP,'--type=merge','-p',json.dumps({'spec':{'selector':{'app':APP}}}))
                output += self.k(*base,'patch','deployment',APP,'--type=strategic','-p',json.dumps({'spec':{'replicas':1,'template':{'spec':{'containers':[{'name':APP,'command':None}]}}}}))
                return output+'\nRecovery requested. Refresh until pods are Ready and Service endpoints return; then test the application link.'
            if action=='events': return self.k(*base,'get','events','--sort-by=.metadata.creationTimestamp')
            if action in ('logs','previous-logs'):
                return self.k(*base,'logs','-l','app='+APP,'-c',APP,'--tail=80','--limit-bytes=12000',*(['--previous'] if action=='previous-logs' else []))
            if action=='policies': return self.k(*base,'get','networkpolicy,virtualservice,authorizationpolicy')
            return self.k(*base,'describe','deployment',APP)

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args): pass  # Do not log bearer tokens or request bodies.
    def reply(self, code, body, mime='application/json'):
        if not isinstance(body,bytes): body=json.dumps(body).encode()
        self.send_response(code)
        self.send_header('Content-Type',mime)
        self.send_header('Content-Length',str(len(body)))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Referrer-Policy','no-referrer')
        self.send_header('X-Frame-Options','DENY')
        self.end_headers();self.wfile.write(body)
    def valid_host(self):
        allowed={f'127.0.0.1:{self.server.server_port}',f'localhost:{self.server.server_port}'}
        return self.headers.get('Host') in allowed
    def auth(self):
        valid = hmac.compare_digest(self.headers.get('Authorization','').encode('utf-8'), ('Bearer '+self.server.token).encode('utf-8'))
        if not valid: observability.audit('authorization', 'denied')
        return valid
    def do_GET(self):
        if not self.valid_host(): return self.reply(403,{'error':'Invalid host'})
        path=urlsplit(self.path).path
        if path.startswith('/api/'):
            if not self.auth(): return self.reply(401,{'error':'Paste the session token printed in your Ubuntu terminal.'})
            if path=='/api/session':
                observability.audit('authorization', 'accepted')
                return self.reply(200,{'authorized':True})
            if path=='/api/operations': return self.reply(200,observability.operations())
            if path=='/api/monitoring': return self.reply(200,observability.monitoring())
            if path=='/api/security-events': return self.reply(200,observability.events())
            if path!='/api/status': return self.reply(404,{'error':'Unknown endpoint'})
            try: return self.reply(200,self.server.lab.status())
            except (RuntimeError,KeyError,ValueError) as e: return self.reply(503,{'error':str(e)})
        if path not in FILES: return self.reply(404,{'error':'Not found'})
        file=ROOT/FILES[path]
        return self.reply(200,file.read_bytes(),MIME.get(file.suffix,'text/plain'))
    def do_POST(self):
        if not self.valid_host(): return self.reply(403,{'error':'Invalid host'})
        if self.headers.get('Origin') != 'http://'+self.headers.get('Host',''): return self.reply(403,{'error':'Same-origin requests required'})
        if not self.auth(): return self.reply(401,{'error':'Invalid session token'})
        if self.path!='/api/action': return self.reply(404,{'error':'Unknown endpoint'})
        if self.headers.get('Content-Type','').split(';')[0]!='application/json': return self.reply(415,{'error':'JSON required'})
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=1024: return self.reply(400,{'error':'Invalid body size'})
            data=json.loads(self.rfile.read(size))
            if not isinstance(data,dict) or set(data)!={'action'} or not isinstance(data['action'],str): raise ValueError('Expected one action name')
            try:
                output = self.server.lab.action(data['action'])
            except (RuntimeError, ValueError):
                observability.audit('lab-action', 'failed', data['action'] if data['action'] in ('scale-down','break-service','bad-start','restore','events','logs','previous-logs','describe','policies') else 'unknown')
                raise
            observability.audit('lab-action', 'completed', data['action'])
            self.reply(200,{'output':output})
        except (ValueError,TypeError) as e: self.reply(400,{'error':str(e)})
        except RuntimeError as e: self.reply(503,{'error':str(e)})

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--context',required=True,help='Explicit local k3d context (see uds zarf tools kubectl config get-contexts)')
    parser.add_argument('--port',type=int,default=8765)
    args=parser.parse_args()
    lab=Lab(args.context)
    server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    server.lab=lab;server.token=secrets.token_urlsafe(32)
    print(f'\nOpen http://localhost:{args.port} in your Windows browser.\nChoose Live UDS Lab and paste this session token:\n\n{server.token}\n\nContext: {args.context} | Namespace: {NS}\nKeep this terminal open. Ctrl+C stops the connector.\n',flush=True)
    try: server.serve_forever()
    except KeyboardInterrupt: pass
    finally: server.server_close()
if __name__=='__main__': main()
