import json
from pathlib import Path
source = Path(__file__).resolve().parents[1] / "data" / "pods.json"
pods = json.loads(source.read_text())
for pod in pods["items"]:
    status = pod.get("status", {})
    containers = status.get("containerStatuses", [])
    ready = bool(containers) and all(c.get("ready", False) for c in containers)
    restarts = sum(c.get("restartCount", 0) for c in containers)
    review = status.get("phase") != "Running" or not ready or restarts >= 3
    print(pod["metadata"]["name"], "REVIEW" if review else "OBSERVE", restarts)
