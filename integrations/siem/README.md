# Wazuh SIEM integration — separate optional lab

## Scope and capacity

The browser event exercises are simulations. The authenticated connector audit is real local activity from this application. The optional Wazuh deployment is an actual manager, indexer and dashboard, with training rules and collection of the connector's JSON files. No Windows agent, Kubernetes API audit feed, radio or network-device log source is enrolled automatically.

Wazuh's current single-node Docker guidance calls for at least 4 cores, 8 GB RAM for the Docker host and 50 GB storage. Your measured Docker allocation is 8.25 GB decimal (about 7.7 GiB), with 16 GB physical RAM. It is near the minimum, not a guarantee of comfortable operation. Use a Wazuh-only session; if it still runs out of memory, stop it and use the browser exercises or a separate appropriately sized host. Do not keep increasing WSL allocation until Windows becomes unstable.

## Prepare (does not start services)

Requirements: Docker Desktop with Ubuntu integration, Docker Compose v2, Git, Python, internet for initial image/config downloads. Run from the v3 app directory:

```bash
python3 local/siem.py prepare
```

This clones the official `wazuh/wazuh-docker` tag `v4.14.8` into `~/tpol-siem/wazuh-docker`, resolves its Compose configuration, adds two JSON localfile sources and `tpol-rules.xml`, and writes `~/tpol-siem/compose.json`. It publishes only the dashboard on loopback port 8443, avoiding the UDS gateway on 443. Manager, enrollment, syslog and indexer ports are not published. The configuration contains upstream lab credentials; keep it private. Do not commit that runtime file.

The helper never deletes volumes, changes UDS manifests, changes kernel settings or starts Wazuh during prepare. It does not install Docker or Git.

## Switch sessions

Stop native monitoring with Ctrl+C in its supervisor terminal (or each old foreground terminal if you still use those). Stop your existing UDS cluster; do not delete it:

```bash
k3d cluster stop uds
docker compose -f integrations/redpanda/compose.yml stop
python3 local/siem.py check
```

If other containers remain on this low-memory host, identify and stop only the workloads you own. The helper refuses a combined session below 12 GiB allocated to Docker. It checks local filesystem free space; separately confirm Docker Desktop's virtual disk has enough capacity.

## Kernel prerequisite

Wazuh's indexer needs `vm.max_map_count` of at least 262144 on the Docker host. Check in Ubuntu:

```bash
sysctl vm.max_map_count
```

If below that, the documented WSL adjustment is:

```bash
sudo sysctl -w vm.max_map_count=262144
```

This changes a kernel limit, not the amount of allocated RAM. It may need to be reapplied after WSL restarts. If the indexer still reports a low value, check Docker Desktop's backend environment; do not assume every WSL distribution uses an identical kernel configuration. The helper checks the visible WSL value but cannot guarantee the Desktop backend's value without a running container.

## Start and verify

```bash
python3 local/siem.py up
python3 local/siem.py status
python3 local/siem.py test-rule
```

`up` generates the upstream self-signed certificates if missing and starts only the `tpol-siem` project. `status` lists containers; it is not a claim of security coverage. The rule test should report custom rule **100101** for the supplied JSON authorization denial. This test exercises decoding/rules, not ingestion into the indexer.

Open https://localhost:8443. The locally generated certificate is not publicly trusted; inspect that you are opening your intended local lab. Upstream fresh-lab login: `admin` / `SecretPassword`. This is a default training credential, not a personal password. Use the official password-change procedure linked below before extending access beyond this local exercise; the deployment here binds only loopback and uses no external account.

After the manager and dashboard are ready, run:

```bash
python3 local/siem.py sample
```

In Wazuh's security events/threat hunting view, choose a recent time range and search `rule.id:100101`. Confirm a current record with `data.training:true`. The helper appends a fictional denial to a dedicated training file; it does not attempt any real login. Confirming the record in the dashboard is the end-to-end ingestion check. Keep screenshots or notes of the timestamp and rule ID if you want training evidence.

## Real connector events

The v3 bridge appends token-free JSON to `~/.local/share/tpol-lab/bridge.jsonl` by default. Wazuh reads that directory through a read-only bind mount. The second file, `training.jsonl`, contains deliberately synthetic test events. The bridge can run while UDS is stopped: connector access events still work, while cluster status/actions report unavailable.

- 100100: connector event decoded.
- 100101: connector authorization denied.
- 100102: connector operation completed; inspect change context, not automatic malicious classification.

The app's small repeated-denial exercise is separate teaching logic; these Wazuh rules do not implement that time-window correlation. Retained audit files rotate at roughly 2 MB with two backups. The app reads at most the latest 100 events from the current file. A bearer session identifies access to the bridge, not a named human user. App audit logs are not tamper-proof forensic evidence.

## Troubleshoot

If the dashboard remains unavailable, inspect your project's logs:

```bash
docker compose -p tpol-siem -f ~/tpol-siem/compose.json logs --tail=80 wazuh.indexer wazuh.manager wazuh.dashboard
```

Early dashboard-to-indexer connection failures can happen during startup. Persistent failures require reading the logs for memory, kernel limit, certificate or configuration errors. If the rule test works but no dashboard event arrives, confirm the manager is reading training.jsonl, the sample was appended after startup, the search time range is current, and the indexer/Filebeat path is healthy. Do not disable TLS verification or security policy to hide the problem.

## Stop and return to UDS

```bash
python3 local/siem.py stop
k3d cluster start uds
python3 local/monitoring.py run --context k3d-uds
```

Volumes remain intact. `restart: no` prevents this optional stack from automatically consuming resources after Docker restarts. The browser security exercises remain available without Wazuh.

## Sources and maintenance

Reviewed 2026-10-10. Pinned lab release, not an automatic updater. Review upstream security releases before ongoing use.

- https://documentation.wazuh.com/current/deployment-options/docker/wazuh-container.html
- https://documentation.wazuh.com/current/deployment-options/docker/changing-default-password.html
- https://documentation.wazuh.com/current/user-manual/ruleset/rules/custom.html
- https://documentation.wazuh.com/current/user-manual/reference/ossec-conf/localfile.html
- https://github.com/wazuh/wazuh-docker/tree/v4.14.8

Wazuh images and upstream deployment files have their own licenses. This app's helper references the upstream project instead of repackaging its images. Windows/real-cluster deployment was not executed in the release build environment; verify using the steps above on your machine.
