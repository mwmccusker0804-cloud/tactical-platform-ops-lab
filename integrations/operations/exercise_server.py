"""Harmless HTTP target and local-only training alert inbox. No cluster controls."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json, sys, os, logging, threading
from logging.handlers import RotatingFileHandler
from datetime import datetime, timezone

MODE = sys.argv[1] if len(sys.argv)>1 else 'demo'
EVENTS = Path(os.environ.get('TPOL_EVENTS','/events'))
EVENTS.mkdir(parents=True,exist_ok=True)
LOG=logging.getLogger('training');LOG.setLevel(logging.INFO)
handler=RotatingFileHandler(EVENTS/(MODE+'.jsonl'),maxBytes=1_000_000,backupCount=2)
handler.setFormatter(logging.Formatter('%(message)s'));LOG.addHandler(handler)
COUNT=0;LOCK=threading.Lock()
def record(**data):
    LOG.info(json.dumps({'timestamp':datetime.now(timezone.utc).isoformat(),'source':MODE,'training':True,**data}))
class Handler(BaseHTTPRequestHandler):
    def log_message(self,*args):pass
    def reply(self,data,status=200,ctype='application/json'):
        raw=(json.dumps(data) if ctype=='application/json' else data).encode()
        self.send_response(status);self.send_header('Content-Type',ctype);self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
    def do_GET(self):
        global COUNT
        path=self.path.split('?')[0]
        if path=='/health':return self.reply({'status':'ok','training':True,'mode':MODE})
        if path=='/metrics' and MODE=='demo':
            with LOCK:n=COUNT
            return self.reply('# HELP tpol_demo_requests_total Requests to the training demo root.\n# TYPE tpol_demo_requests_total counter\ntpol_demo_requests_total '+str(n)+'\n',ctype='text/plain; version=0.0.4')
        if path=='/' and MODE=='demo':
            with LOCK:COUNT+=1
            record(event='request',outcome='success')
            return self.reply({'message':'Training request recorded. Find it in Grafana logs.','training':True})
        if path=='/' and MODE=='inbox':
            p=EVENTS/'inbox.jsonl'
            with p.open('rb') as f:
                f.seek(0,2);end=f.tell();f.seek(max(0,end-100_000))
                if end>100_000:f.readline()
                rows=f.read().decode(errors='replace').splitlines()[-30:]
            return self.reply({'scope':'Local training notifications, newest 30 records','events':[json.loads(x) for x in rows]})
        self.reply({'error':'Not found'},404)
    def do_POST(self):
        if MODE!='inbox' or self.path!='/alerts':return self.reply({'error':'Not found'},404)
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=65536:return self.reply({'error':'Body must be 1..65536 bytes'},413)
            data=json.loads(self.rfile.read(size));alerts=data.get('alerts',[])
            if not isinstance(alerts,list):raise ValueError()
            # Only whitelisted fields, not raw incoming headers, tokens or arbitrary payloads.
            clean=[{'name':str(a.get('labels',{}).get('alertname',''))[:100],'status':str(a.get('status',''))[:30]} for a in alerts[:30] if isinstance(a,dict)]
            record(event='notification',status=str(data.get('status',''))[:30],alerts=clean)
            self.reply({'accepted':len(clean)})
        except (ValueError,TypeError,AttributeError):self.reply({'error':'Invalid alert JSON'},400)
if __name__=='__main__':
    record(event='started')
    ThreadingHTTPServer(('0.0.0.0',int(os.environ.get('PORT','8080'))),Handler).serve_forever()
