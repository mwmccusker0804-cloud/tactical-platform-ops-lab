import sys,unittest
from pathlib import Path
from unittest.mock import patch,MagicMock
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from log_analyzer import analyze
from inventory import summarize
from network_checker import check
class Projects(unittest.TestCase):
 def test_threshold_and_bad_records(self):
  r=analyze(['user=a result=failed','bad record','user=a result=failed','user=b result=success'],2)
  self.assertEqual(r['total_failed'],2);self.assertEqual(r['malformed_records'],1);self.assertTrue(r['investigation_recommended'])
 def test_success_and_empty(self):
  self.assertFalse(analyze([])['investigation_recommended']);self.assertEqual(analyze(['user=a result=success'])['accounts_with_failures'],0)
 def test_inventory_validation(self):
  with self.assertRaises(ValueError):summarize([{'name':'demo','status':'maybe'}])
  self.assertIn('ALERT',summarize([{'name':'demo','status':'OFFLINE'}]))
 def test_remote_rejected(self):
  with self.assertRaises(ValueError):check('192.0.2.1',80)
 def test_local_socket_success_and_failure(self):
  with patch('network_checker.socket.create_connection',return_value=MagicMock()):self.assertEqual(check('127.0.0.1',8765),'TCP reachable')
  with patch('network_checker.socket.create_connection',side_effect=ConnectionRefusedError('refused')):self.assertIn('unavailable',check('127.0.0.1',8765))
if __name__=='__main__':unittest.main()
