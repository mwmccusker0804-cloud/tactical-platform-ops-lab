import json
from urllib.request import urlopen
from urllib.error import URLError
url = "http://127.0.0.1:3000/api/health"
try:
    with urlopen(url, timeout=3) as response:
        health = json.load(response)
    print("Database:", health.get("database", "not reported"))
except (URLError, TimeoutError, OSError, ValueError) as error:
    print(f"Health request failed: {error}")
