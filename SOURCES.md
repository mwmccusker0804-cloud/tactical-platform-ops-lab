# Official references — reviewed 2026-10-11 UTC

The following informed the new integrations and lessons. Local version pinning improves repeatability; it does not guarantee absence of vulnerabilities. Review upstream advisories before any real deployment. No external tools below are needed for the offline map itself.

- Prometheus collection and architecture: https://prometheus.io/docs/introduction/overview/
- Prometheus releases (3.13.4), Alertmanager (0.34.1), Blackbox Exporter (0.29.0): https://prometheus.io/download/
- Alertmanager configuration and routing: https://prometheus.io/docs/alerting/latest/configuration/
- Multi-target exporter / Blackbox pattern: https://prometheus.io/docs/guides/multi-target-exporter/
- Loki 3.7.0 Docker setup: https://grafana.com/docs/loki/latest/setup/install/docker/
- Loki configuration: https://grafana.com/docs/loki/latest/configure/examples/
- Alloy 1.20.1 release: https://github.com/grafana/alloy/releases/tag/v1.20.1
- Alloy Kafka consumer: https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.kafka/
- Alloy file reader: https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.file/
- Grafana Loki queries: https://grafana.com/docs/loki/latest/query/
- Grafana provisioning: https://grafana.com/docs/grafana/latest/administration/provisioning/
- Grafana OSS download (13.2.3 reused from v3): https://grafana.com/grafana/download
- Redpanda local setup (v26.2.4 / Console v3.12.0 retained from v3): https://docs.redpanda.com/current/get-started/quick-start/
- Wazuh Docker setup (4.14.8 retained from v3): https://documentation.wazuh.com/current/deployment-options/docker/wazuh-container.html
- Keycloak identity integration: https://www.keycloak.org/securing-apps/overview
- Flux reconciliation: https://fluxcd.io/flux/concepts/
- cert-manager lifecycle: https://cert-manager.io/docs/usage/certificate/
- OpenTelemetry Collector: https://opentelemetry.io/docs/collector/
- Velero file-system backup: https://velero.io/docs/v1.18/file-system-backup/

Python's official 3.12.12 slim Bookworm image runs the original standard-library demo/inbox code. Only the exercise data volume is writable; no Docker socket is mounted. These are learning services, not hardened public endpoints.

## v4.1 Active Directory references
See ACTIVE-DIRECTORY-LAB.md for the Microsoft Learn sources checked on 11 October 2026.
