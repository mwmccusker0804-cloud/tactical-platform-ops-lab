import json
import threading
import unittest
from unittest.mock import patch
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from bridge import Lab, Handler, ThreadingHTTPServer, NS, APP, LABEL, OWNER

class LabTests(unittest.TestCase):
    def test_remote_context_rejected(self):
        for value in ['prod','k3d-uds;id','k3d-uds\n']:
            with self.assertRaises(RuntimeError): Lab(value)

    def test_remote_api_rejected(self):
        lab=Lab('k3d-uds')
        with patch.object(lab,'obj',return_value={'clusters':[{'cluster':{'server':'https://prod.example:6443'}}]}):
            with self.assertRaises(RuntimeError):lab.guard()

    def test_missing_ownership_rejected(self):
        lab=Lab('k3d-uds')
        with patch.object(lab,'obj',side_effect=[{'clusters':[{'cluster':{'server':'https://127.0.0.1:6443'}}]},{'metadata':{'labels':{}}}]),patch.object(lab,'k'):
            with self.assertRaises(RuntimeError): lab.guard(True)

    def test_actions_fixed_and_scoped(self):
        lab=Lab('k3d-uds')
        with patch.object(lab,'guard'),patch.object(lab,'k',return_value='ok') as k:
            for action in ['scale-down','break-service','bad-start','restore','events','logs','previous-logs','describe','policies']:lab.action(action)
            self.assertEqual(k.call_count,10)
            for call in k.call_args_list:
                self.assertEqual(call.args[:2],('-n',NS))
                self.assertNotIn('delete',call.args)
            with self.assertRaises(ValueError):lab.action('shell; rm')

    def test_context_pinned_in_command(self):
        with patch('bridge.run',return_value='ok') as invoke:
            Lab('k3d-uds').k('get','pods')
            self.assertEqual(invoke.call_args.args[0][:6],['uds','zarf','tools','kubectl','--context','k3d-uds'])

class FakeLab:
    """HTTP/UI fixture only; never included as a selectable real connector mode."""
    def __init__(self):self.replicas=1;self.selector=APP;self.bad=False
    def action(self,a):
        if a=='scale-down':self.replicas=0
        elif a=='break-service':self.selector='broken'
        elif a=='bad-start':self.bad=True
        elif a=='restore':self.replicas=1;self.selector=APP;self.bad=False
        elif a not in ['events','logs','previous-logs','describe','policies']:raise ValueError('Unknown action')
        return 'fixture result: '+a
    def status(self):
        ready=self.replicas if not self.bad else 0
        pods=[] if not self.replicas else [{'metadata':{'name':'mission-api-test'},'status':{'containerStatuses':[{'name':APP,'ready':bool(ready),'restartCount':0,'state':{'waiting':{'reason':'RunContainerError'}} if self.bad else {'running':{}}}]}}]
        return {'context':'k3d-test-fixture','namespace':NS,'observedAt':'2026-10-08T23:00:00Z','errors':{},'nodes':[], 'pods':pods,'deployments':[{'metadata':{'name':APP},'spec':{'replicas':self.replicas},'status':{'readyReplicas':ready}}],'services':[], 'endpoints':[{'endpoints':[{'conditions':{'ready':True}}]}] if ready and self.selector==APP else [],'packages':[{'metadata':{'name':NS},'status':{'phase':'Ready'}}]}

def serve(port=0):
    s=ThreadingHTTPServer(('127.0.0.1',port),Handler);s.lab=FakeLab();s.token='fixture-token'
    threading.Thread(target=s.serve_forever,daemon=True).start();return s

class HTTPTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.s=serve();cls.url=f'http://127.0.0.1:{cls.s.server_port}'
    @classmethod
    def tearDownClass(cls):cls.s.shutdown();cls.s.server_close()
    def request(self,path,body=None,auth=True,origin=None,host=None):
        headers={}
        if auth:headers['Authorization']='Bearer fixture-token'
        if body is not None:headers.update({'Content-Type':'application/json','Origin':origin or self.url})
        if host:headers['Host']=host
        req=Request(self.url+path,data=json.dumps(body).encode() if body is not None else None,headers=headers)
        try:
            with urlopen(req) as r:return r.status,r.read(),r.headers
        except HTTPError as e:return e.code,e.read(),e.headers
    def test_static_and_no_source_leak(self):
        self.assertEqual(self.request('/')[0],200)
        for path in ['/local/bridge.py','/package/zarf.yaml','/../local/bridge.py']:
            self.assertEqual(self.request(path)[0],404)
    def test_session_without_cluster(self):
        with patch.object(self.s.lab, 'status', side_effect=RuntimeError('cluster stopped')):
            self.assertEqual(self.request('/api/session',auth=False)[0],401)
            code,body,_=self.request('/api/session')
            self.assertEqual(code,200)
            self.assertEqual(json.loads(body),{'authorized':True})
    def test_learning_assets(self):
        for path in ['/styles.css','/learning.js','/learning-data.js','/assets/linux-worksheet.png','/assets/unicorn-workshop.png']:
            self.assertEqual(self.request(path,auth=False)[0],200)
    def test_auth_and_host(self):
        self.assertEqual(self.request('/api/status',auth=False)[0],401)
        self.assertEqual(self.request('/api/status',host='evil.example')[0],403)
        code,_,headers=self.request('/api/status');self.assertEqual(code,200);self.assertEqual(headers['Cache-Control'],'no-store')
    def test_origin_and_action_validation(self):
        self.assertEqual(self.request('/api/action',{'action':'restore'},origin='https://evil.example')[0],403)
        self.assertEqual(self.request('/api/action',{'action':'shell'})[0],400)
        self.assertEqual(self.request('/api/action',{'action':'restore','command':'x'})[0],400)
        self.assertEqual(self.request('/api/action',{'action':'restore'})[0],200)

if __name__=='__main__':unittest.main(verbosity=2)
