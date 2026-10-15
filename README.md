# Tactical Platform Operations Lab v4.3

New: Python 100 companion tab, 13 runnable Python lessons, fictional data, progress export/import and optional read-only UDS snapshot collection. See PYTHON-LAB.md. Existing desktop launcher and platform integrations are retained.

# Tactical Platform Operations Lab v4.1

**Windows desktop launcher:** extract the entire folder, then double-click `INSTALL-DESKTOP.cmd`. See [DESKTOP-LAUNCHER.md](DESKTOP-LAUNCHER.md) for automatic startup, profile switching and shutdown.

Updated interactive network diagram and a nine-stage mock Active Directory lab. Start with UPGRADE.md when moving from v4. No workload rebuild is needed.

- Compact SVG topology; clickable components and connections, layer filters, zoom/fit and simulated flow.
- Four arrangements: overview, existing lab, operations, future planning. Five guided incidents retained.
- AD practice: domain/DNS prerequisites, OUs, group, user review/create, membership, domain join, first sign-in, permission verification, recovery/offboarding.
- No real directory or Windows changes. See ACTIVE-DIRECTORY-LAB.md.

# Tactical Platform Operations Lab v4.0

An independent personal learning lab for Windows + Ubuntu WSL2. Not affiliated with or endorsed by Defense Unicorns. **Existing lab owners: start with UPGRADE.md. No workload rebuild required.**

## New in v4

- Interactive topology: 28 components, three views, clickable explanations, accessible connection lists and five guided scenarios.
- Optional real Loki + Alloy + Blackbox Exporter + Alertmanager exercise with a separate Prometheus/Grafana, demo service and local notification inbox.
- Optional real Redpanda → Alloy → Loki integration using your existing broker network.
- Identity, secrets/PKI, GitOps, registries, traces, device telemetry, storage, backup and resilience planning.
- Isolated fictional backup/restore CLI drill with byte verification.
- 18 lessons, 90 questions and explanations for all 270 answer options; existing progress preserved.
- New male military unicorn operations artwork and bounded responsive images.

## Start the learning app

Run from this extracted directory in Ubuntu:

```bash
python3 local/bridge.py --context k3d-uds
```

Open http://localhost:8765 in Windows and authorize with the terminal token for live reads/actions. Keep it private. The interactive map, lessons and simulations work without optional services. Existing cluster operations retain their local-context, namespace and ownership guards.

Read DEPLOYMENT-GUIDE.md for explanations and integrations/operations/README.md for the new optional real lab. The new operations helper changes only its own exercise containers. It never creates cloud resources or sends external messages.

## Limits

This is a training lab, not production infrastructure. No paid API is required by the code. Image downloads, local resources and applicable third-party license terms still apply. On a 16 GB PC run capacity-heavy labs in separate sessions. No Windows/UDS/Docker deployment was performed by the build process; verify the actual data paths using the guides. See QA-NOTES.md and SOURCES.md.

Keep the original worksheet and artwork references in ARTWORK.md. Existing v3 Redpanda, SIEM, monitoring and live fault/restore features are retained.
