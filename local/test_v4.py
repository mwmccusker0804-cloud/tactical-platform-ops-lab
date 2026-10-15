import unittest,tempfile,json,sys,subprocess,os,socket,time
from pathlib import Path
from unittest.mock import patch
from urllib.request import urlopen,Request
import observability as obs
import recovery_drill
from test_bridge import HTTPTests

class OperationsHTTP(HTTPTests):
    def test_operations_requires_token_and_returns_fixed_snapshot(self):
        self.assertEqual(self.request('/api/operations',auth=False)[0],401)
        with patch.object(obs,'operations',return_value={'checks':{'Demo scrape':'Unavailable'}}):
            code,body,_=self.request('/api/operations');self.assertEqual(code,200);self.assertIn(b'Unavailable',body)
    def test_v4_assets_and_source_boundaries(self):
        for path in ['/deployment.js','/deployment-data.js','/DEPLOYMENT-GUIDE.md','/integrations/operations/README.md']:
            self.assertEqual(self.request(path,auth=False)[0],200)
        for path in ['/local/operations_lab.py','/integrations/operations/compose.yml','/integrations/operations/exercise_server.py']:
            self.assertEqual(self.request(path,auth=False)[0],404)
class NewEvidence(unittest.TestCase):
    def test_fixed_operations_addresses_and_missing_data(self):
        seen=[]
        def response(url):
            seen.append(url)
            if 'query?' in url:return {'status':'success','data':{'result':[]}}
            if '13000' in url:return {'database':'ok'}
            return {'events':[]}
        with patch.object(obs,'get_json',side_effect=response):result=obs.operations()
        self.assertEqual(len(result['checks']),5);self.assertIn('No samples',result['checks']['HTTP probe'])
        self.assertTrue(all(url.startswith(('http://127.0.0.1:19090/','http://127.0.0.1:13000/','http://127.0.0.1:18081/')) for url in seen))
    def test_operations_failures_are_not_success(self):
        with patch.object(obs,'get_json',side_effect=OSError('refused')):result=obs.operations()
        self.assertTrue(all('Unavailable' in v for v in result['checks'].values()))
    def test_restore_is_isolated_and_preserves_later_source_record(self):
        with tempfile.TemporaryDirectory() as d:
            sentinel=Path(d)/'untouched';sentinel.write_text('keep')
            result=recovery_drill.drill(d)
            self.assertTrue(result['bytes_verified']);self.assertEqual(result['restored_records'],1);self.assertEqual(result['source_records'],2);self.assertEqual(sentinel.read_text(),'keep')
    def test_real_training_inbox_http(self):
        with tempfile.TemporaryDirectory() as d:
            with socket.socket() as s:s.bind(('127.0.0.1',0));port=s.getsockname()[1]
            script=Path(__file__).resolve().parents[1]/'integrations/operations/exercise_server.py'
            p=subprocess.Popen([sys.executable,str(script),'inbox'],env={**os.environ,'PORT':str(port),'TPOL_EVENTS':d},stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
            try:
                for _ in range(50):
                    try:
                        with urlopen(f'http://127.0.0.1:{port}/health',timeout=.2) as f:self.assertEqual(json.load(f)['mode'],'inbox')
                        break
                    except OSError:time.sleep(.02)
                else:self.fail('Inbox did not start')
                for status in ['firing','resolved']:
                    payload=json.dumps({'status':status,'alerts':[{'labels':{'alertname':'TrainingDemoUnavailable'},'status':status}],'secret':'never store this'}).encode()
                    with urlopen(Request(f'http://127.0.0.1:{port}/alerts',data=payload,headers={'Content-Type':'application/json'})) as f:self.assertEqual(f.status,200)
                with urlopen(f'http://127.0.0.1:{port}/') as f:data=json.load(f)
                self.assertEqual(data['events'][-1]['status'],'resolved');self.assertNotIn('never store this',json.dumps(data))
            finally:p.terminate();p.communicate(timeout=5)
if __name__=='__main__':unittest.main()
