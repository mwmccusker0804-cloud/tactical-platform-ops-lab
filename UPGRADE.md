# Upgrade to v4.1 - topology repair and mock Active Directory

1. In your running app, export Lessons progress and notes as a precaution. Keep the same browser and `http://localhost:8765` origin to retain existing local progress.
2. Stop only the connector with Ctrl+C in its Ubuntu terminal. There is no need to rebuild the workload or delete/recreate your UDS cluster.
3. Extract the v4.1 ZIP into a new folder. Run its connector from the folder containing `index.html` and `local`. Do not delete your old folder, built Zarf package, monitoring data or Docker volumes. If retaining the same project folder instead, replace the supplied app files together, including `local/bridge.py`, `sw.js`, `deployment.js`, `deployment-data.js` and the new `directory.js`.
4. From the extracted v4.1 project folder in Ubuntu, run:

```bash
python3 local/bridge.py --context k3d-uds
```

5. Open `http://localhost:8765`. Reload after the updated service worker activates. Check the header says **v4.1**. If it still shows v4.0, close all tabs for this app, reopen online and reload. Do not clear all site data: that would erase locally saved progress.
6. Open **Deployment map**: the large hero is hidden in this view, the diagram has bounded dimensions, and zoom/filters/paths are interactive. Select a component and use **Simulate selected outage** to highlight downstream dependencies; **Restore simulation** clears it without touching real services. Start with **Deployment overview**; choose **Your existing lab** for your established arrangement. On a phone, scroll inside the map rather than the entire page to inspect its full width.
7. Open **Active Directory lab** and follow all nine stages. It needs no extra server, VM, Windows license or RAM allocation because it is a mock exercise.
8. For live UDS controls, authorize again using the new connector token. The maps and AD practice never invoke live cluster changes.

The original package version remains 2.0.0; this is an app release 4.1. Native Prometheus/Grafana and optional Redpanda, operations and Wazuh procedures are unchanged. AD progress uses its own storage key; existing v3 lessons and v4 readiness keys are preserved.

---

# Upgrade to version 4.0

Keep your v3 folder as rollback and extract v4 to a new folder. Stop only the old bridge with Ctrl+C, change to the new project directory, verify `ls local/bridge.py`, then run:

```bash
python3 local/bridge.py --context k3d-uds
```

Open the SAME origin, normally http://localhost:8765. Authorize with the new token. Confirm FIELD NOTES / v4.0 and the Deployment map tab. If old styles persist, use Ctrl+F5 once and reopen the tab. Avoid clearing site data because it holds learning progress.

No UDS workload build or deploy is needed. The entire package directory remains unchanged. Native monitoring data, Wazuh data and your Redpanda records remain in their existing locations. The v4 app retains all 70 existing question IDs and the same progress store, adding 20 new checks. Older v3 exports import into v4; export with v4 before switching back because older versions ignore new question IDs. The map readiness checklist is a separate self-reported local store.

Start with Deployment map → Your lab arrangement. Follow a simulated walkthrough. For real new services, read integrations/operations/README.md FIRST: it explains the separate memory-conscious session, ports, local acceptance and return to UDS. Opening the tab installs nothing.

New Grafana uses 13000 and new Prometheus 19090; native versions still use 3000/9090. No existing data-source configuration is overwritten. Wazuh remains a separate session. Identity, secrets, GitOps, tracing and HA are planning lessons, not automatically deployed software.

Rollback: stop the v4 bridge and optional operations containers, return to the v3 folder, and start its bridge. If assets stay stale, unregister the service worker through browser developer tools without deleting local storage.

---
Previous v3 upgrade details follow for users coming from v2.

# Upgrade to Tactical Platform Operations Lab 3.0

This release updates the learning app and adds local integration tools. Your mission-api image and Kubernetes manifests remain at workload-package version 2.0.0. **Do not rebuild or redeploy that workload just to upgrade the app.**

## Keep what is already working

- Keep the old app folder as a rollback copy, including its built Zarf archive.
- Keep `~/tpol-monitoring` intact. It contains your existing Prometheus measurements, Grafana database, credentials and dashboards.
- Continue using the same browser origin, normally `http://localhost:8765`. Browser progress is tied to the hostname and port. `127.0.0.1` is a different origin.
- Version 2.1's five completion markers remain under `tpol-done`. Version 3 has a separate 70-question progress store. It displays the earlier completion count without treating old answers as passes on new questions.

## Install the app update

1. Extract the ZIP to a new folder on Windows. Locate the enclosed `tactical-platform-ops-lab` directory.
2. In the old connector terminal, press Ctrl+C. This stops the web connector, not the cluster.
3. In Ubuntu, `cd` into the new extracted app folder. You can use Windows Explorer's address bar to copy the real path, then map `C:\` to `/mnt/c/` and quote the whole path. Do not type a placeholder username.
4. Run `pwd` and `ls local/bridge.py` to verify you are in the right folder.
5. Run:

```bash
python3 local/bridge.py --context k3d-uds
```

6. Open `http://localhost:8765`, refresh, and confirm `FIELD NOTES / v3.0` appears. Paste the new session token in Live UDS Lab → Connection settings. Do not reuse the token from a stopped bridge.
7. If an old tab keeps showing the old version, close it and reopen the URL. A hard refresh may be needed once. Do not clear all site data as a first step because that removes study progress.

## Monitoring: reuse your existing installation

The old three-terminal setup remains usable. For the new supervised session, stop the old port-forward, Prometheus and Grafana foreground commands with Ctrl+C, then run from the v3 app directory:

```bash
python3 local/monitoring.py run --context k3d-uds
```

This starts only missing processes, retries a failed port-forward, and leaves existing listeners alone. It does not assume that an occupied port is healthy. Check Monitoring → Read local metrics and Prometheus Targets. Ctrl+C stops only processes it started. Saved data remains in `~/tpol-monitoring`.

If tools are genuinely missing, run `python3 local/monitoring.py install` first. This downloads pinned binaries from official servers and verifies checksums. It requires Linux amd64 and Python 3.12+ for the installer archive extraction. The bridge itself uses Python 3.10+.

Import `integrations/monitoring/tactical-dashboard.json` through Grafana → Dashboards → New → Import. Map the Prometheus input to whichever working data source you already created. This creates a separate dashboard, not a replacement for your existing ones.

## Optional labs

- Redpanda: open its tab and follow the single-broker exercise. Stop Wazuh first on this 16 GB PC.
- Wazuh: read `integrations/siem/README.md` before startup. Prepare/check commands are separate from up. The full stack is not installed merely by opening the app.
- Offline learning and both browser simulations work without optional services. Live readings cannot work while the required local services are stopped.

## Roll back

Stop the v3 bridge, return to the old app folder, and start its bridge on the same port. Use a new token and refresh. You may need to unregister the v3 service worker through browser Developer Tools → Application → Service Workers, then refresh; do not delete local storage. V3 study exports remain valid for v3, not for the old five-question engine.
