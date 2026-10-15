# Local monitoring integration

This is the native Ubuntu setup already exercised on your PC. The application pod serves metrics; a Kubernetes port-forward reaches one selected pod; Prometheus scrapes it; Grafana queries Prometheus. The bridge's authenticated Monitoring tab reads fixed loopback API endpoints and displays snapshots.

## Start

From the app folder:

```bash
python3 local/monitoring.py run --context k3d-uds
```

For a new machine, first run `python3 local/monitoring.py install`. The installer preserves existing binary folders, `training.yml`, dashboards and data. It is not an automatic security updater; review vendor releases when maintaining this lab.

Keep the session terminal open. Reused processes are not stopped by this helper. Managed processes are stopped on Ctrl+C. If the port-forward exits after a pod replacement, the helper retries. It will wait for a healthy pod rather than fabricate a healthy scrape. The fixed context must refer to a loopback API.

## Verify

1. `http://localhost:9090/targets`: mission-api should show UP after a scrape.
2. `http://localhost:3000`: sign into your local Grafana. Fresh default credentials are admin/admin; change the password at first login.
3. In Grafana, use your existing Prometheus data source. Native Grafana reaches native Prometheus at `http://127.0.0.1:9090`.
4. Import `tactical-dashboard.json`; select your actual Prometheus data source at import. Check Last 15 minutes and 15-second refresh.
5. Query `go_goroutines{job="mission-api"}`. A returned sample verifies querying. A flat graph is not itself a fault.
6. Authorize the app connector and choose Monitoring → Read local metrics. The target status and last scrape help distinguish current collection from old samples.

## What the panels mean

- Scrape success: 1 for a successful collection attempt, 0 for failure. This includes failures in the port-forward path.
- App RAM: resident bytes for the sample process, not total host or cluster memory.
- App CPU: rate of cumulative CPU seconds, expressed as cores. Several samples are needed.
- Go tasks: concurrent goroutines, not users or pods. No universal healthy count is assumed.

The Service-selector fault can leave this pod-forwarded scrape working. Test `https://tpol-training.uds.dev` separately to verify the actual app route. There is no automatic ingress probe, whole-cluster metrics feed, Windows agent, radio sensor or SIEM in these panels.

## Troubleshooting

- Connection refused on 9898: check the app pod and restart the forward/session.
- Prometheus query errors: inspect `~/tpol-monitoring/session-logs/prometheus.log` and existing `training.yml`. The helper preserves your config rather than overwriting custom jobs.
- Grafana fails: inspect its session log and confirm port 3000 is not used by something else.
- Data source absent: add Prometheus in Grafana Connections and run Save & test.
- Values are old or no data: check time range, target health, labels and scrape age. Never replace missing data with zero.
- Permission or architecture errors: use the vendor's correct binary for your Ubuntu architecture. Do not run this user-owned install with sudo.

Sources: https://prometheus.io/docs/prometheus/latest/getting_started/ ; https://prometheus.io/download/ ; https://grafana.com/docs/grafana/latest/administration/provisioning/ ; https://grafana.com/grafana/download?edition=oss&platform=linux
