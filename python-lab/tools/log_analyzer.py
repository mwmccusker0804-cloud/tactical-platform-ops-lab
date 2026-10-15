"""Analyze fictional authentication records and report malformed lines explicitly."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
def analyze(lines,threshold=3):
    counts={};malformed=0;valid=0
    for line in lines:
        if not line.strip():continue
        try:
            fields=dict(part.split('=',1) for part in line.split())
            if not fields.get('user') or fields.get('result') not in ('failed','success'):raise ValueError('Invalid fields')
        except ValueError:
            malformed+=1;continue
        valid+=1
        if fields['result']=='failed':
            user=fields['user'];counts[user]=counts.get(user,0)+1
    total=sum(counts.values())
    return {'training':True,'valid_records':valid,'malformed_records':malformed,'total_failed':total,'accounts_with_failures':len(counts),'failed_by_user':counts,'investigation_recommended':total>=threshold,'threshold':threshold}
if __name__=='__main__':
    try:
        report=analyze((ROOT/'data/sample_auth.log').read_text().splitlines())
        target=ROOT/'reports/auth-report.json';target.parent.mkdir(exist_ok=True)
        target.write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
        print('Saved',target)
    except OSError as e:raise SystemExit('Log/report file error: '+str(e))
