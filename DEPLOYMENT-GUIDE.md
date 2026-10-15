# v4.1 interactive map update

The deployment tab now uses a compact SVG topology with four arrangements. Select components for explanation, select arrows for connection meaning, filter by data type, animate paths, and zoom/fit. At phone widths scroll inside the diagram. Simulate selected outage marks the selected component and dependent paths; restore clears the simulation. Amber downstream nodes mean a path is affected, not that every service has stopped. Map actions never call a live mutation endpoint.

Open the new Active Directory lab for the browser-only user onboarding workflow. See ACTIVE-DIRECTORY-LAB.md. Its planned identity-to-SIEM arrow is not an installed Wazuh feed.

# Deployment school — version 4

This lab teaches how components cooperate. It is an independent learning project, not an official Defense Unicorns architecture or a production-ready deployment. The example programs are choices to evaluate, not a requirement to run every product. Your single Windows PC remains one failure domain.

## Follow the three map views

1. **Your lab arrangement**: mission-api in UDS, metrics through a pod port-forward to native Prometheus/Grafana, and your separate Redpanda Compose broker. Prior success is labeled historical; check current evidence before acting.
2. **Optional v4 operations**: a separate real practice stack for logs, HTTP availability and local notifications. The map's guided animation is always a simulation; only terminal commands in the guide change real containers.
3. **Future deployment planning**: identity, secrets, delivery, supply chain, device telemetry, storage and resilience. These capabilities are explained but not automatically provisioned.

## Plain-language program catalog

| Need | Example programs | What they do | Included here |
|---|---|---|---|
| Metrics | Prometheus, exporters | Record numeric measurements over time | Existing native setup; optional separate operations stack |
| Dashboards | Grafana | Query data sources and display evidence | Existing native setup; optional provisioned operations dashboard |
| Log collection | Grafana Alloy | Read selected sources and forward records | Exercise files; optional Kafka-compatible consumer |
| Log storage | Loki | Store/search logs using labels and log queries | Optional operations stack |
| Availability | Blackbox Exporter | Test a configured endpoint | Demo HTTP probe, not whole-network monitoring |
| Alert routing | Alertmanager | Group, silence and route alerts | Local training inbox only |
| Event streaming | Redpanda | Retain records for consumers with independent progress | Existing Compose lab and new Alloy-to-Loki path |
| Security analysis | Wazuh | Decode events, apply rules, index alerts and display them | Existing separate-session setup; local verification required |
| Identity | Keycloak | Centralize sign-in and application identity integration | Map and lesson only |
| Secrets/trust | Secret manager, cert-manager | Control credentials and certificate lifecycle | Map and lesson only |
| Desired-state delivery | Flux or Argo CD | Reconcile reviewed desired configuration | Map and lesson only |
| Artifact supply | Registry, Trivy, signature tooling | Retain images; inspect composition, vulnerabilities and origin | Planning checklist; no scanner auto-installed |
| Traces | OpenTelemetry Collector, Tempo | Follow an instrumented request across services | Map and lesson only |
| Recovery | Velero, native database backup tools | Capture supported state and restore it | Planning plus isolated fictional file-restore drill |
| Device telemetry | SNMP exporter, Windows exporter, node_exporter | Translate supported device/host readings | Planning only; no device enrollment |

Loki usually feeds Grafana. Kibana is associated with Elasticsearch; OpenSearch Dashboards with OpenSearch. They are alternatives for different backend choices, not mandatory extra viewers for Loki. No Elasticsearch/OpenSearch stack is added here. Wazuh's own deployment includes its indexer and dashboard.

## The service story

**Measurement:** a service exposes a number → Prometheus scrapes → Grafana queries.

**Log:** a service writes an event → Alloy collects → Loki stores → Grafana searches.

**Alert:** a probe fails → Prometheus evaluates a rule → Alertmanager routes → the local inbox receives. A dashboard and a notification are different outputs.

**Stream:** a configured producer writes → Redpanda retains → a configured consumer reads. The v4 optional consumer forwards training records into Loki. A shared network does not automatically connect every tool.

**Trace:** instrumented services emit linked spans → a collector routes → a trace backend stores. This is planned, not installed.

## Start with the operations exercise

Read `integrations/operations/README.md`. It provides start/stop commands, expected evidence and failure recovery. Use only the exercise's `break-demo` command for that drill; it stops the practice HTTP app, not the existing UDS workload.

Your available memory is finite. Keep Wazuh in a separate session. The basic operations helper checks capacity and refuses to start on a small Docker host alongside other containers. The optional Redpanda-to-Loki exercise deliberately adds services after baseline startup; inspect memory before that extra step. Container limits prevent unlimited growth but cannot guarantee acceptable performance.

## Identity and permissions exercise

Write a two-row access matrix: an observer may read dashboards; an operator may perform an approved restore. For each, state one action that must fail. In a future identity deployment, test with the actual intended role, not an all-powerful administrator. Keep recovery access and a credential-rotation procedure.

SSO authenticates a user; application and Kubernetes permissions still need mapping. Certificates require correct names, expiry, time and CA trust. Do not fix a production trust failure by disabling verification.

## Recovery drill — safe, fictional files only

```bash
python3 local/recovery_drill.py
```

This creates a NEW temporary directory, a fictional source file, a ZIP backup, an isolated restore directory and a JSON report. It verifies the recovered bytes by SHA-256. The source receives a second event after the backup, so the restored copy has one record while the source has two. This demonstrates recovery-point loss. It never modifies Grafana, Prometheus, Redpanda, Wazuh or Kubernetes data. The report gives the directory so you can inspect it; your OS may later clean temporary directories.

A real backup plan also records: owner, supported consistency method, encryption and key recovery, independent destination, retention, restore permissions, dependencies and a scheduled restore test. RPO is acceptable data-loss time; RTO is acceptable restoration time. A fast file extraction is not an application RTO measurement. Never rehearse over your only working database.

## Change, GitOps and offline delivery

Before changing a real workload, record:

- Intended effect and who owns the resource.
- Reviewed configuration, image digest and applicable signatures/SBOM.
- Storage/schema compatibility and prior known-good version.
- Validation evidence and a tested rollback procedure.
- DNS, time, certificate, identity, registry and external-service dependencies.

A GitOps reconciler may undo manual changes. Coordinate emergency changes with the desired-state owner. Choose one controller ownership model instead of installing competing reconcilers over the same resources.

For a disconnected exercise, make an inventory of required images, charts, CLI tools, package archives, licenses and trust material. Rehearse installation and recovery without external connectivity. The browser's offline cache covers learning assets; it does not package all service images. External threat feeds and remote operations require connectivity or an approved transfer workflow.

## Glossary

- **Exporter:** exposes measurements in a format a collector can read.
- **Scrape:** one metrics collection request.
- **Probe:** a test of a specified network/application behavior.
- **Ingestion:** receipt of data by a backend; verify the specific new record.
- **Reconciliation:** comparing actual state to declared desired state and correcting differences.
- **RBAC:** permissions grouped by role.
- **PKI:** certificate-based identity and trust infrastructure.
- **Retention:** how long data is kept; not a substitute for backups.
- **Failure domain:** resources likely to fail together, such as one PC or site.
- **SLO:** an agreed measurable service objective, with a time window and scope.
- **RPO/RTO:** acceptable data-loss interval / target restoration time.
- **Consumer lag:** records not yet processed by a consumer group.

## What is not claimed

No automatic Windows, SATCOM, router, firewall or Kubernetes audit ingestion. No production hardening, multi-node failover, external notification delivery or full UDS platform installation. The new configurations still require real-machine acceptance tests. Use the app's readiness notebook to record what you have actually verified.
