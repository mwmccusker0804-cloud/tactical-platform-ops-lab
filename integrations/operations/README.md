# Operations lab — logs, measurements, probes and notifications

This is an optional real Docker Compose exercise alongside UDS, not an installation inside UDS. It adds Loki, Alloy, Blackbox Exporter and Alertmanager, with its own Prometheus/Grafana and a tiny training HTTP app. It never modifies your native monitoring installation or mission-api. Start with the interactive Deployment map; every scenario there is a browser simulation.

## 1. Choose one session on your 16 GB PC

Run from the extracted v4 project directory in Ubuntu. Verify `ls local/operations_lab.py`. Keep the bridge terminal running for the learning UI. In another terminal, stop the native monitoring helper with Ctrl+C if it is running. Stop other labs while preserving data:

```bash
k3d cluster stop uds
docker compose -f integrations/redpanda/compose.yml stop
```

If Wazuh was prepared and is running, run `python3 local/siem.py stop`. If it was never prepared, skip that command. No cluster rebuild or deletion is needed.

```bash
python3 local/operations_lab.py check
python3 local/operations_lab.py validate
python3 local/operations_lab.py up
python3 local/operations_lab.py status
```

`validate` may download pinned images; it runs vendor configuration checkers and creates stopped-job resources. `up` starts eight containers. Their combined memory limits are 2176 MiB, plus Docker/OS overhead. Six GB Docker memory and 10 GB disk free are basic guards, not guaranteed fit. On Docker hosts below 12 GiB the helper refuses startup alongside other containers. Check Docker Desktop disk capacity too. Downloads require internet initially; this is not a prepared air-gap bundle.

## 2. Open the tools

| Tool | Windows browser address | Meaning |
|---|---|---|
| Demo app | http://localhost:18080 | Each visit generates a fictional request log |
| Training inbox | http://localhost:18081 | JSON showing local alert notifications |
| Operations Grafana | http://localhost:13000 | Separate database; first login admin/admin, then change password |
| Operations Prometheus | http://localhost:19090 | Only the new exercise's metrics |
| Alertmanager | http://localhost:19093 | Grouped alerts, silences and resolution |
| Loki readiness | http://localhost:13100/ready | `ready` means service ready, not log ingestion verified |

Native Grafana on 3000 and Prometheus on 9090 remain separate. New Grafana has provisioned Prometheus/Loki data sources and the **TPOL v4 · operations exercise** dashboard. No API keys, paid cloud accounts, emails or Slack messages are created. Ports are bound to localhost; internal services communicate on the Compose network. These HTTP lab endpoints have no enterprise authentication/TLS.

## 3. Follow one request

1. Open the demo twice.
2. In Operations Grafana, open the supplied dashboard. Allow 30–60 seconds for initial collection.
3. `up{job="demo-metrics"}` and `probe_success{job="demo-probe"}` should be 1. The first means scraping works; the second means the HTTP probe succeeds.
4. In Explore choose **Operations Loki**, query `{job="tpol-operations"}`. Find a fresh `event:"request"` from source `demo`.
5. If there are no records, check `python3 local/operations_lab.py logs`, time range and the Loki data source. A green ready endpoint is not sufficient.

Actual path: demo JSON file → Alloy file reader → Loki → Grafana. Metrics go directly from demo/Blackbox to Prometheus. No metrics are consumed from Redpanda.

## 4. Break, investigate, restore

```bash
python3 local/operations_lab.py break-demo
```

This stops ONLY the exercise demo. It does not touch mission-api. After roughly 45–90 seconds: probe_success becomes 0, Prometheus shows TrainingDemoUnavailable firing, Alertmanager receives it, and the local inbox records `firing`. Timing includes scraping, the 30-second rule hold, and notification grouping.

```bash
python3 local/operations_lab.py restore-demo
```

Verify probe_success returns to 1 and the inbox receives `resolved`. Historical firing messages remain as evidence. A silence suppresses notifications, not the fault itself. Missing probe collection has a separate alert. The inbox is local only: external notification delivery remains unconfigured.

## 5. Optional real Redpanda → Alloy → Loki path

This connects the broker you already used to the new log stack. It is a separate expanded session. Stop Wazuh and UDS, and inspect `docker stats --no-stream` before adding the 2 GiB Redpanda stack plus a 256 MiB Alloy consumer. If memory is tight, use the browser map exercise instead.

Start operations FIRST using its helper, then:

```bash
docker compose -f integrations/redpanda/compose.yml up -d
docker compose -f integrations/redpanda/compose.yml exec redpanda rpk cluster info
```

Ensure `rf-events` exists in Console. Create only if absent:

```bash
docker compose -f integrations/redpanda/compose.yml exec redpanda rpk topic create rf-events --partitions 1 --replicas 1
```

Start the additional Alloy consumer. This explicitly joins the existing Redpanda Docker network; it does not create a second broker:

```bash
docker compose -f integrations/operations/compose.yml -f integrations/operations/stream.compose.yml up -d stream-alloy
```

After startup, produce a NEW message (existing offsets may already be consumed):

```bash
echo '{"source":"training-radio","training":true,"link":"degraded","snr_db":4,"exercise":"v4-stream"}' | docker compose -f integrations/redpanda/compose.yml exec -T redpanda rpk topic produce rf-events
```

In Operations Grafana Explore, select Operations Loki and query `{job="rf-events"} |= "v4-stream"`. Finding the newly produced record verifies the pipeline. No actual radio is connected. No Wazuh integration is implied. Alloy's component health alone does not prove broker consumption. Diagnose with:

```bash
docker compose -f integrations/operations/compose.yml -f integrations/operations/stream.compose.yml logs --tail 50 stream-alloy
```

Stop the extra consumer before ending the exercise:

```bash
docker compose -f integrations/operations/compose.yml -f integrations/operations/stream.compose.yml stop stream-alloy
docker compose -f integrations/redpanda/compose.yml stop
```

## 6. Stop and return to UDS

```bash
python3 local/operations_lab.py stop
k3d cluster start uds
python3 local/monitoring.py run --context k3d-uds
```

The stop command preserves volumes. It cannot stop the optional stream consumer unless you used the explicit command above. Never use `down -v` to fix a routine error. Loki/Prometheus retain about 24 hours by configuration; deletion is asynchronous. File logs rotate at 1 MB, Docker logs at 5 MB. Monitor storage anyway. A retained volume is not a backup.

## What each new program teaches

- **Alloy:** the courier reading log files or Kafka-compatible topics.
- **Loki:** stores/searches logs; query it through Grafana.
- **Blackbox Exporter:** checks a URL like a client; this exercise probes an internal Docker URL, not your UDS ingress or entire network.
- **Alertmanager:** groups and routes alerts from Prometheus to the local inbox.
- **Prometheus/Grafana:** separate practice copies so your working native configuration stays intact.

## Troubleshooting

- File not found: run from the extracted project root, not `~`. Paths with spaces need quotes.
- Port conflict: `ss -ltnp`; identify the existing owner instead of killing unknown processes.
- Container exited: `status`, then `logs`. An image download succeeding does not mean service readiness.
- OOMKilled / exit 137: stop optional labs and reassess Docker memory. Do not keep restarting everything.
- Loki not ready immediately: wait for startup and inspect logs; do not delete its volume.
- Alert absent: inspect Prometheus Alerts, then Alertmanager, then inbox logs in that order.
- Grafana password: the operations database is separate from native Grafana. An existing volume retains its changed password.
- Redpanda external network absent: start the existing Redpanda Compose project first.
- TLS in a future real-device probe: configure its trusted CA; do not turn off verification as a production fix.

Official references and pinned-version sources are in SOURCES.md at project root. No full real-stack deployment was executed by the build environment; use these acceptance checks on your PC.
