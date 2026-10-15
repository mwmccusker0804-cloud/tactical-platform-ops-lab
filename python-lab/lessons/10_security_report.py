import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
events = json.loads((root / "data" / "events.json").read_text())
counts = {}
for event in events:
    if event["result"] == "failed":
        user = event["user"]
        counts[user] = counts.get(user, 0) + 1
report = {"training": True, "failed_by_user": counts}
output = root / "reports" / "security-summary.json"
output.parent.mkdir(exist_ok=True)
output.write_text(json.dumps(report, indent=2))
print(json.dumps(report, sort_keys=True))
