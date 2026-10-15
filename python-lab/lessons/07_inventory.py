devices = [
    {"name": "radio-gateway", "site": "lab", "managed": True},
    {"name": "demo-switch", "site": "lab", "managed": False},
]
for device in devices:
    if not device["managed"]:
        print(device["name"])
