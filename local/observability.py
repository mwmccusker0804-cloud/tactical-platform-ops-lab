"""Fixed loopback reads and token-free connector audit records. No shell execution."""
import json
import logging
from logging.handlers import RotatingFileHandler
import os
from pathlib import Path
import threading
import time
from datetime import datetime, timezone
from urllib.request import Request, build_opener, ProxyHandler, HTTPRedirectHandler

STATE = Path(os.environ.get('TPOL_STATE_DIR', str(Path.home() / '.local/share/tpol-lab'))).expanduser()
_LOCK = threading.Lock()
_LOG = None
QUERIES = {
    'scrape': 'up{job="mission-api"}',
    'memory_mib': 'process_resident_memory_bytes{job="mission-api"} / 1024 / 1024',
    'cpu_cores': 'rate(process_cpu_seconds_total{job="mission-api"}[5m])',
    'goroutines': 'go_goroutines{job="mission-api"}',
}
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        raise RuntimeError('Redirect refused: local service check must stay on its fixed endpoint.')

def get_json(url):
    opener = build_opener(ProxyHandler({}), NoRedirect())
    with opener.open(Request(url, headers={'Accept': 'application/json'}), timeout=2) as res:
        raw = res.read(1_000_001)
        if len(raw) > 1_000_000: raise RuntimeError('Response too large')
        return json.loads(raw)

def audit(event, outcome, action=''):
    global _LOG
    with _LOCK:
        if _LOG is None:
            STATE.mkdir(parents=True, exist_ok=True, mode=0o700)
            _LOG = logging.getLogger('tpol.audit'); _LOG.propagate = False; _LOG.setLevel(logging.INFO)
            handler = RotatingFileHandler(STATE / 'bridge.jsonl', maxBytes=2_000_000, backupCount=2)
            handler.setFormatter(logging.Formatter('%(message)s')); _LOG.addHandler(handler)
            os.chmod(STATE / 'bridge.jsonl', 0o600)
        record = {'timestamp': datetime.now(timezone.utc).isoformat(), 'source': 'tpol-bridge',
                  'event': event, 'outcome': outcome, 'action': action, 'training': False}
        _LOG.info(json.dumps(record))

def events():
    path = STATE / 'bridge.jsonl'
    if not path.exists(): return {'events': [], 'scope': 'Connector activity only; not Windows or Kubernetes audit coverage.'}
    with path.open('rb') as f:
        f.seek(0, 2); size = f.tell(); f.seek(max(0, size - 120_000))
        if size > 120_000: f.readline()
        lines = f.read().decode('utf-8', errors='replace').splitlines()[-100:]
    records = []
    for line in lines:
        try: records.append(json.loads(line))
        except ValueError: pass
    return {'events': records, 'scope': 'Last 100 connector records; no tokens, passwords, or command output recorded.'}

def monitoring():
    from urllib.parse import urlencode
    result = {'observedAt': datetime.now(timezone.utc).isoformat(), 'metrics': {}, 'errors': {},
              'scope': 'Local Prometheus job mission-api through a pod port-forward. Not ingress or whole-cluster health.'}
    for name, query in QUERIES.items():
        try:
            data = get_json('http://127.0.0.1:9090/api/v1/query?' + urlencode({'query': query}))
            if data.get('status') != 'success': raise RuntimeError('Prometheus query failed')
            values = data.get('data', {}).get('result', [])
            result['metrics'][name] = [{'labels': x.get('metric', {}), 'timestamp': x['value'][0],
                                        'value': x['value'][1]} for x in values]
        except Exception as exc: result['errors'][name] = str(exc)[:250]
    try:
        targets = get_json('http://127.0.0.1:9090/api/v1/targets?state=active')['data']['activeTargets']
        result['targets'] = [{'health': t.get('health'), 'lastScrape': t.get('lastScrape'),
                              'lastError': t.get('lastError'), 'instance': t.get('labels',{}).get('instance')}
                             for t in targets if t.get('labels',{}).get('job') == 'mission-api']
    except Exception as exc: result['errors']['targets'] = str(exc)[:250]
    try:
        result['grafana'] = get_json('http://127.0.0.1:3000/api/health').get('database') == 'ok'
    except Exception: result['grafana'] = False
    return result

def operations():
    """Fixed, authenticated read-only evidence for the separate operations exercise."""
    from urllib.parse import urlencode
    result={'observedAt':datetime.now(timezone.utc).isoformat(),'checks':{}}
    for name,query in [('Demo scrape','up{job="demo-metrics"}'),('HTTP probe','probe_success{job="demo-probe"}'),('Firing rules','ALERTS{alertstate="firing"}')]:
        try:
            data=get_json('http://127.0.0.1:19090/api/v1/query?'+urlencode({'query':query}))
            if data.get('status')!='success':raise RuntimeError('Query rejected')
            rows=data.get('data',{}).get('result',[])
            result['checks'][name]='; '.join((x.get('metric',{}).get('alertname',x.get('metric',{}).get('instance','sample'))+': '+str(x['value'][1])) for x in rows[:10]) or ('No firing rules returned; verify targets separately.' if name=='Firing rules' else 'No samples. This does not mean healthy.')
        except Exception as e:result['checks'][name]='Unavailable: '+str(e)[:160]
    try:result['checks']['Operations Grafana']='Database responding' if get_json('http://127.0.0.1:13000/api/health').get('database')=='ok' else 'Database not ready'
    except Exception:result['checks']['Operations Grafana']='Unavailable'
    try:
        events=get_json('http://127.0.0.1:18081/').get('events',[])
        notifications=[e for e in events if e.get('event')=='notification']
        result['checks']['Local inbox']=('Latest notification: '+str(notifications[-1].get('status'))+' at '+str(notifications[-1].get('timestamp'))) if notifications else 'Responding; no notification in recent records.'
    except Exception:result['checks']['Local inbox']='Unavailable'
    return result
