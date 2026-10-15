import unittest
from unittest.mock import patch, Mock
import subprocess
import desktop

class DesktopTests(unittest.TestCase):
    def setUp(self): desktop.CHILDREN.clear()
    def tearDown(self): desktop.CHILDREN.clear()

    def test_http_failure_does_not_report_ready(self):
        with patch.object(desktop,'http_ready',side_effect=OSError('refused')), patch.object(desktop.time,'monotonic',side_effect=[0,0,181]), patch.object(desktop.time,'sleep'):
            with self.assertRaisesRegex(RuntimeError,'did not become ready'):
                desktop.wait_for('test',lambda:desktop.http_ready('unused'))

    def test_dead_child_fails_readiness(self):
        desktop.CHILDREN.append(Mock(poll=Mock(return_value=1)))
        with self.assertRaisesRegex(RuntimeError,'service exited'):
            desktop.wait_for('test',lambda:True)

    def test_cleanup_only_live_owned_processes(self):
        dead=Mock(pid=10,poll=Mock(return_value=0))
        live=Mock(pid=11,poll=Mock(return_value=None))
        desktop.CHILDREN.extend([dead,live])
        with patch.object(desktop.os,'killpg') as kill:
            desktop.cleanup()
            kill.assert_called_once_with(11,desktop.signal.SIGINT)
        dead.wait.assert_not_called()

    def test_api_failure_does_not_deploy(self):
        lab=Mock()
        lab.k.side_effect=[None,RuntimeError('forbidden')]
        with patch('bridge.Lab',return_value=lab), patch.object(desktop,'run',return_value='[{"name":"uds"}]'), patch.object(desktop,'wait_for'), patch.object(desktop,'script') as script:
            with self.assertRaisesRegex(RuntimeError,'forbidden'): desktop.start_uds(False)
            script.assert_not_called()

    def test_existing_app_is_reused(self):
        lab=Mock(); lab.k.side_effect=[None,'deployment.apps/mission-api',None]
        with patch('bridge.Lab',return_value=lab), patch.object(desktop,'run',return_value='[{"name":"uds"}]'), patch.object(desktop,'wait_for'), patch.object(desktop,'spawn'), patch.object(desktop.Path,'exists',return_value=True), patch.object(desktop,'script') as script:
            desktop.start_uds(False)
            script.assert_not_called()

    def test_missing_app_builds_then_deploys(self):
        lab=Mock(); lab.k.side_effect=[None,'',None]
        with patch('bridge.Lab',return_value=lab), patch.object(desktop,'run',return_value='[{"name":"uds"}]'), patch.object(desktop,'wait_for'), patch.object(desktop,'spawn'), patch.object(desktop.Path,'exists',return_value=True), patch.object(desktop.Path,'glob',return_value=[]), patch.object(desktop,'script') as script:
            desktop.start_uds(False)
            self.assertEqual(script.call_args_list[0].args,('labctl.py','build'))
            self.assertEqual(script.call_args_list[1].args,('labctl.py','deploy','--context','k3d-uds'))

if __name__=='__main__': unittest.main()
