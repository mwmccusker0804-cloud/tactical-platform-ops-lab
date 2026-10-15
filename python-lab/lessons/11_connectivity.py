import socket
host = "127.0.0.1"
port = 8765
try:
    with socket.create_connection((host, port), timeout=2):
        print("TCP listener reachable")
except OSError as error:
    print(f"TCP check failed: {error}")
