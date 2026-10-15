import copy
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import observability as obs
import monitoring
import siem
import test_bridge

class V3HTTPTests(test_bridge.HTTPTests):
    def test_new_reads_require_token(self):
        for path in ['/api/monitoring','/api/security-events']:
            self.assertEqual(self.request(path,auth=False)[0],401)
        with patch('observability.monitoring',return_value={'metrics':{},'errors':{'scrape':'unavailable'}}):
            code,body,_=self.request('/api/monitoring')
            self.assertEqual(code,200);self.assertIn('unavailable',body.decode())
    def test_no_private_downloads(self):
        for path in ['/local/observability.py','/local/siem.py','/bridge.jsonl','/integrations/siem/tpol-rules.xml']:
            self.assertEqual(self.request(path,auth=False)[0],404)
        for path in ['/quiz.js','/operations.js','/integrations/monitoring/tactical-dashboard.json']:
            self.assertEqual(self.request(path,auth=False)[0],200)

class EvidenceTests(unittest.TestCase):
    def test_no_data_is_not_zero(self):
        def response(url):
            if '/query?' in url:return {'status':'success','data':{'result':[]}}
            if '/targets?' in url:return {'data':{'activeTargets':[]}}
            return {'database':'ok'}
        with patch.object(obs,'get_json',side_effect=response):result=obs.monitoring()
        self.assertEqual(result['metrics']['scrape'],[]);self.assertEqual(result['targets'],[])
    def test_failed_service_is_explicit(self):
        with patch.object(obs,'get_json',side_effect=OSError('refused')):result=obs.monitoring()
        self.assertEqual(len(result['errors']),5);self.assertFalse(result['grafana'])
    def test_only_selected_target_returned(self):
        def response(url):
            if '/query?' in url:return {'status':'success','data':{'result':[{'metric':{'job':'mission-api'},'value':[1,'0']}]}}
            if '/targets?' in url:return {'data':{'activeTargets':[{'labels':{'job':'other'},'health':'up'},{'labels':{'job':'mission-api','instance':'127.0.0.1:9898'},'health':'down','lastError':'refused'}]}}
            return {'database':'ok'}
        with patch.object(obs,'get_json',side_effect=response):result=obs.monitoring()
        self.assertEqual(len(result['targets']),1);self.assertEqual(result['targets'][0]['health'],'down')
    def test_redirect_refused(self):
        with self.assertRaises(RuntimeError):obs.NoRedirect().redirect_request(None,None,None,None,None,None)
    def test_audit_record_contains_no_headers(self):
        with tempfile.TemporaryDirectory() as d,patch.object(obs,'STATE',Path(d)),patch.object(obs,'_LOG',None):
            obs.audit('authorization','denied');records=obs.events()['events'];self.assertEqual(len(records),1)
            self.assertEqual(set(records[0]),{'timestamp','source','event','outcome','action','training'})
            for h in list(obs._LOG.handlers):h.close();obs._LOG.removeHandler(h)

class SetupTests(unittest.TestCase):
    def test_monitoring_preserves_existing_settings(self):
        with tempfile.TemporaryDirectory() as d,patch.object(monitoring,'HOME',Path(d)):
            config=Path(d)/'training.yml';config.write_text('my existing jobs')
            ds=Path(d)/'grafana/conf/provisioning/datasources';ds.mkdir(parents=True);(ds/'mine.yml').write_text('existing')
            monitoring.configure()
            self.assertEqual(config.read_text(),'my existing jobs');self.assertEqual(len(list(ds.iterdir())),1)
    def test_siem_no_public_manager_or_indexer(self):
        base={'services':{k:{'ports':[{'published':'443'}],'volumes':[]} for k in ['wazuh.manager','wazuh.indexer','wazuh.dashboard']},'volumes':{'data':{'name':'single-node_data'}},'networks':{'default':{'name':'single-node_default'}}}
        value=siem.transform(copy.deepcopy(base))
        self.assertEqual(value['services']['wazuh.manager']['ports'],[])
        self.assertEqual(value['services']['wazuh.indexer']['ports'],[])
        self.assertEqual(value['services']['wazuh.dashboard']['ports'][0]['host_ip'],'127.0.0.1')
        self.assertEqual(value['services']['wazuh.dashboard']['ports'][0]['published'],'8443')
        self.assertEqual(value['volumes']['data']['name'],'tpol-siem_data')
        self.assertTrue(all(s['restart']=='no' for s in value['services'].values()))
if __name__=='__main__':unittest.main()
