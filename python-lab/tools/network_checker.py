"""Check an explicit list of local lab TCP services; no scans or remote targets."""
import socket
TARGETS=[('Training UI','127.0.0.1',8765),('Grafana','127.0.0.1',3000),('Prometheus','127.0.0.1',9090)]
def check(host,port):
    if host not in ('127.0.0.1','::1'):raise ValueError('This beginner exercise accepts loopback IPs only')
    try:
        with socket.create_connection((host,port),timeout=2):return 'TCP reachable'
    except OSError as e:return 'TCP unavailable: '+str(e)
if __name__=='__main__':
    for name,host,port in TARGETS:print(f'{name} ({host}:{port}): {check(host,port)}')
    print('A successful TCP connection does not prove application login or dashboard health.')
