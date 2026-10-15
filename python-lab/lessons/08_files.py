from pathlib import Path
source = Path(__file__).resolve().parents[1] / "data" / "events.log"
failed = 0
with source.open(encoding="utf-8") as log:
    for line in log:
        if "result=failed" in line:
            failed += 1
print(f"Failed events: {failed}")
