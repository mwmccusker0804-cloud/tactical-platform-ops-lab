"""Report fictional inventory; no network discovery."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def summarize(devices):
    if not isinstance(devices,list):raise ValueError('Expected a list of systems')
    lines=[]
    for device in devices:
        if not isinstance(device,dict) or not isinstance(device.get('name'),str) or device.get('status') not in ('ONLINE','OFFLINE'):
            raise ValueError('Each system needs a name and ONLINE/OFFLINE status')
        lines.append(f"{device['name']}: {device['status']}")
        if device['status']=='OFFLINE':lines.append(f"ALERT: {device['name']} requires investigation.")
    return '\n'.join(lines)
if __name__=='__main__':
    try:print(summarize(json.loads((ROOT/'data/sample_servers.json').read_text())))
    except (OSError,ValueError) as e:raise SystemExit('Inventory error: '+str(e))
