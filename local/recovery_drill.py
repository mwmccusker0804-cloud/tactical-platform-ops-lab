#!/usr/bin/env python3
"""Isolated fictional backup/restore drill. Never reads or changes real lab databases."""
from pathlib import Path
import tempfile,json,hashlib,zipfile,time

def drill(parent=None):
    base=Path(tempfile.mkdtemp(prefix='tpol-restore-drill-',dir=parent))
    source=base/'fictional-source';source.mkdir();restore=base/'isolated-restore';restore.mkdir()
    content=json.dumps({'training':True,'records':[{'id':1,'link':'up'}]},indent=2).encode()
    (source/'records.json').write_bytes(content)
    digest=hashlib.sha256(content).hexdigest()
    with zipfile.ZipFile(base/'backup.zip','w') as z:z.writestr('records.json',content)
    # A later fictional event was not part of the backup.
    newer=json.loads(content);newer['records'].append({'id':2,'link':'degraded'})
    (source/'records.json').write_text(json.dumps(newer,indent=2))
    begin=time.monotonic()
    with zipfile.ZipFile(base/'backup.zip') as z:recovered=z.read('records.json')
    if hashlib.sha256(recovered).hexdigest()!=digest:raise RuntimeError('Integrity check failed')
    (restore/'records.json').write_bytes(recovered)
    result={'scope':'Fictional files only, not a real service backup','directory':str(base),'restored_records':len(json.loads(recovered)['records']),'source_records':len(newer['records']),'bytes_verified':True,'restore_seconds':round(time.monotonic()-begin,6),'lesson':'The newer record was not backed up. A fast file restore is not a measured application RTO.'}
    (base/'report.json').write_text(json.dumps(result,indent=2));return result
if __name__=='__main__':print(json.dumps(drill(),indent=2))
