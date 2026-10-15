# v4.1 verification - 11 October 2026

- 40 existing Python connector/helper tests passed.
- DOM checks passed for four diagram arrangements, all nodes/edges, layer filtering, zoom/fit, simulated fault dependency propagation and restore, and five retained guided scenarios.
- Full AD journey passed: prerequisites, three OUs, correct group category/scope, invalid user rejection, review/create, excessive privilege rejection, DNS failure/recovery, join, initial credential/password-change gating, read allowed/write denied, disable/new-sign-in denial, enable/reset, lockout/unlock.
- Actual Chromium desktop (1440px) and mobile (390px) browser checks passed without JavaScript errors or page-level horizontal overflow. Desktop topology drawing height was about 391px. Screenshots reviewed locally.
- Reload retained mock AD progress and ended the simulated session. Existing lesson storage keys were not cleared.
- Actual Python connector served new AD assets. The v4.1 service worker cached the map and AD exercise; offline reload checks passed.
- No Windows Server, real AD domain or user was created. No live UDS, Wazuh, Redpanda or operations stack was changed or retested on the user's PC. Existing live controls retain the same authorization requirements.

# Version 4 verification — 2026-10-11 UTC

## This release

- 40 Python unit/HTTP tests passed, including inherited access/scope protections, authenticated operations evidence, static source restrictions, fixed loopback endpoints, explicit failure/no-data states, isolated restore and an actual local HTTP inbox receiving firing/resolved payloads.
- 90 question schemas verified: 18 modules, unique IDs and 270 explained options. Existing stream consumer/correlation behavior passed.
- jsdom exercised all tabs, 28 map components, three profiles, all five walkthroughs and their answers, readiness persistence, new evidence access/disconnect behavior, plus existing quiz, simulation and security interactions.
- JavaScript syntax and Python compilation passed. YAML/JSON parsing, localhost port bindings, no Docker socket mounts, HTML links/IDs and byte-identical workload package files checked.
- New artwork visually inspected. The new section includes explicit width/height bounds so art does not expand to its intrinsic dimensions.

## Important verification limits

No Docker daemon, Windows machine or UDS cluster is accessible here. Vendor containers have NOT been started or validated with their real binaries by this build. YAML parsing is not vendor configuration validation. Run `python3 local/operations_lab.py validate` locally, then follow integrations/operations/README.md for actual logs, metrics, alert and optional Redpanda ingestion checks. The local Python inbox test proves only its HTTP behavior, not Alertmanager delivery.

No full browser pixel-render or service-worker lifecycle run was completed here. jsdom checks DOM interactions, not visual layout. Verify v4 on desktop/mobile after upgrade. No production performance, security certification, failover or real backup restore is claimed. The restore drill uses fictional files only.

## Reproduce automated checks

```bash
python3 -m unittest discover -s local -p 'test*.py'
node tests/learning.cjs
```

Windows acceptance: preserve/export progress; restart the new bridge; confirm v4 header; click each map view and a scenario; verify native monitoring still uses existing data; validate/start the optional operations session; observe one new log and a firing/resolved notification; optionally verify a NEW Redpanda record in Loki. Stop optional services and return to your existing UDS cluster without deleting volumes.

---
Historical release notes follow; they are not additional v4 live-deployment results.

# Version 3.0 verification — 2026-10-10

## Verified for this release

- 24 Python unit/HTTP tests passed: connector access controls, fixed operations, new authenticated monitoring/audit endpoints, static-file restrictions, unavailable measurements, fixed target selection, redirect rejection, token-free audit records, preservation of monitoring configuration, and private Wazuh service ports.
- Node checks passed for 70 questions, 210 answer explanations, independent consumer-group progress, and the repeated-denial correlation window.
- jsdom interaction checks passed for lesson rendering, progress persistence, explanations, notes, stream production/consumption/reset, security cases, monitoring no-data behavior, clearing readings on disconnect, and tab selection.
- All JavaScript syntax checks passed; Python modules compiled. YAML, dashboard JSON and SIEM rule XML parsed. HTML local links and IDs checked.
- All workload package files are byte-for-byte unchanged from v2.1. No deployed workload upgrade is needed for the app update.
- Both new illustrations visually inspected: adult male military unicorn technicians working on RF and network equipment.

## Limits and local acceptance

The Windows computer, Docker engine, UDS cluster, native Prometheus/Grafana, Wazuh and Redpanda were not accessible to this build process. No live installation or deployment was performed. Setup configuration and fixtures do not prove real ingestion. Follow UPGRADE.md and each integration README to verify locally.

No browser visual-layout or service-worker lifecycle run was completed here; the browser download was unavailable. jsdom checks exercise DOM behavior, not pixel rendering. Check your desktop/mobile layout and that the v3 header appears after upgrade.

Run automated checks from the project directory:

```bash
python3 -m unittest discover -s local -p 'test*.py'
node tests/learning.cjs
```

Local acceptance: authorize the bridge; confirm your existing app remains ready; view a fresh Prometheus target and Grafana dashboard sample; complete/export/import a quiz session. In the optional Wazuh session, distinguish rule-test success from a freshly indexed training event. In the optional Redpanda session, produce and consume a fictional record. Stop optional services while retaining their data.

---
Historical verification below describes previous releases, not additional v3 live tests.

# v2.1 verification

Story: Windows browser live controls → authenticated loopback Python API → fixed UDS/kubectl commands against the explicitly selected local context → status and evidence displayed in the dashboard.

## v2.1 checks

- Ten Python tests passed, including authenticated session checks independent of cluster availability and serving all new learning/art assets.
- JavaScript DOM-model checks passed for initial authorization, valid token with unavailable cluster, recovery, revoked token, disabled actions and disconnect.
- Learning render/search checks passed: 12 troubleshooting guides, 10 code walkthroughs and 66 commands; no-match search verified.
- HTML asset paths, unique element IDs, seven sections and JavaScript element references checked. JavaScript syntax checks passed.
- No real cluster or browser rendering was tested for this update. Prior v2 fixture checks below describe the earlier baseline, not a new real-cluster run.

## Previous v2 baseline

- Ten Python unit/HTTP tests: token validation, Host and Origin checks, exact action-body validation, static-file allowlist, remote context rejection, remote API rejection, resource ownership enforcement, fixed namespace actions and context-pinned command construction.
- JavaScript event-handler integration through the real Python HTTP handler with a fixture lab and a DOM model: rejected token, successful connection, all three fault/restore flows, disconnect, disabled controls and cleared readings (14 HTTP requests).
- Existing simulator/lesson checks: malformed and invalid stored progress, both simulated faults, reset, correct/incorrect answers for five lessons, duplicate completion, reload persistence, unavailable storage.
- JavaScript/Python syntax and YAML parsing.

## Not verified here

- Actual Windows/WSL localhost forwarding or iPhone layout.
- Browser rendering or service-worker lifecycle. Chromium installation was attempted but the download was invalid in this environment.
- Real Docker/k3d/UDS deployment, admission policies, Zarf build/deploy, image pulls, ingress certificates, SSO or metrics. Docker and the user's cluster are not accessible here. YAML parsing is not Kubernetes/UDS admission validation.
- A real internet-disconnected redeployment.

Fixtures prove request/response behavior, not real Kubernetes execution. Live cluster validation starts with START-HERE.md on the user's PC. No action has been run on that PC by this build process.

Run the Python checks with `python3 local/test_bridge.py`. The connector itself has no fake-data runtime mode. Source fixtures are used only by tests.
