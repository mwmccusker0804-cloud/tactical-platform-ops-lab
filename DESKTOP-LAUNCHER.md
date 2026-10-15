# Desktop launcher — v4.1

## Install once on Windows

1. Extract the entire ZIP to a permanent folder. Do not run inside the ZIP. Keep your previous folder until the new one works; existing Docker volumes and Ubuntu home-directory monitoring/SIEM data are reused.
2. Close the old connector and native monitoring terminals with Ctrl+C.
3. Double-click **INSTALL-DESKTOP.cmd**. Enter the exact Ubuntu distribution shown in the list (for example Ubuntu). Choose your preferred sign-in profile.
4. Type YES only if you want a session to start at every Windows sign-in. Otherwise press Enter. A **Tactical Platform Lab** desktop shortcut is created either way.
5. Double-click the desktop shortcut and choose a session. The launcher starts Docker Desktop when needed, waits for Docker, starts the selected services and opens http://localhost:8765.
6. For Live UDS Lab, paste the session token printed in the launcher window into Connection settings and press Authorize. Tokens are not saved or put into browser URLs. Learning-only, Loki and Wazuh sessions do not require a healthy UDS cluster for the learning pages; live cluster controls remain unavailable when UDS is stopped.

Leave the launcher window open. Normal startup can take a few minutes. Initial downloads take longer and require internet access.

## Choose a session

| Choice | Starts | Where to look |
|---|---|---|
| 1 UDS | Existing uds cluster, training deployment if missing, native Prometheus/Grafana, metrics forwarding, connector | App 8765; Grafana 3000; Prometheus 9090 |
| 2 UDS + Redpanda | Everything in 1 plus the Redpanda broker and Console | Console 8088 |
| 3 Operations / Loki | Existing operations Compose stack including Loki, Alloy, Prometheus, Grafana, Alertmanager and practice endpoints, plus connector | Operations Grafana 13000 |
| 4 Wazuh | Prepares Wazuh if needed, runs existing capacity/kernel checks, starts SIEM containers, plus connector | https://localhost:8443 |
| 5 Learning only | Connector serving learning content, interactive map and mock Active Directory | App 8765; no Docker required |
| 6 Stop lab stacks | Stops known Redpanda, operations and Wazuh stacks and the uds cluster; retains volumes | Close the active launcher with Ctrl+C first |
| 7 Redeploy | Explicitly deploys the training package again, then starts UDS monitoring | May undo the training faults you were practicing |

On your 16 GB Windows PC, switch between UDS, Operations and Wazuh: press Ctrl+C in the active launcher, choose 6, then launch the new session. Unrelated containers are never stopped. Wazuh/Operations preflight checks may refuse startup if other workloads remain. UDS + Redpanda is heavier than UDS alone; use UDS alone if memory pressure occurs. This launcher does not install a complete production platform.

## What is automated, and what still needs setup?

- Existing Docker Desktop, Ubuntu WSL2 integration, Python, UDS CLI and k3d must already work. The launcher does not create a new cluster or reinstall UDS. Use START-HERE.md for initial platform setup.
- Normal UDS startup reuses the existing mission-api deployment. If absent, it builds the included package when necessary and deploys it. It never destroys/recreates the cluster. A broken existing workload is left for troubleshooting; startup may report a readiness timeout.
- Native monitoring binaries install only when missing, using the existing checksum-checked installer (Linux amd64, Python 3.12+). Existing configuration is retained. Initial Grafana credentials/data-source configuration follow the monitoring guide; the launcher does not reset your settings.
- Redpanda containers and Console start automatically. Existing topics/data remain; the launcher does not produce synthetic events or create exercise topics for you.
- Wazuh still requires the documented Docker-host vm.max_map_count and disk/memory prerequisites. No automatic sudo/kernel changes. Container startup is not proof of dashboard readiness or indexed security events: follow the SIEM test-rule/sample exercise to verify ingestion.
- Grafana readiness and the application metrics endpoint are checked for UDS. Your Prometheus target and Grafana data source should still be checked after configuration changes. Loki readiness is checked for the Operations profile.

## Closing, disabling sign-in startup and upgrades

Press **Ctrl+C**, rather than closing the window abruptly. It stops the connector and monitoring processes launched by this session. Container stacks remain running until choice 6; persistent data is preserved. Existing monitoring listeners are reused and are not stopped by this launcher. If one came from an older terminal, close that terminal separately.

To disable sign-in startup, run INSTALL-DESKTOP.cmd again and decline the sign-in option, or press Win+R, enter `shell:startup`, and delete only the Tactical Platform Lab shortcut. To change your default profile or distro, rerun the installer. If you move/upgrade the extracted folder, rerun the installer from the new location so shortcuts point to it.

## If startup stops

- **Docker unavailable:** open Docker Desktop, wait until running, and enable Settings > Resources > WSL Integration for your Ubuntu distribution. Retry.
- **Connection refused at 127.0.0.1:6550:** the launcher starts the existing uds cluster and waits for its API. If it still fails, inspect Docker/k3d; do not rebuild the application repeatedly.
- **Already open / port 8765 occupied:** close the previous launcher/bridge using Ctrl+C. It is not forcibly killed.
- **Capacity or kernel check failed:** read the exact message. Stop other lab profiles using choice 6; follow the SIEM guide for the kernel prerequisite.
- **Missing command:** ensure Docker, uds and k3d are installed in the selected Ubuntu distro. The launcher includes common user/Linuxbrew binary paths.
- **Windows policy blocks PowerShell:** use your organization's approved process; this launcher does not override enforced group policy. The CMD wrapper requests a process-only execution policy, not a permanent machine policy change.
- **Stopped midway:** completed Docker startup/deployment steps may remain. Data is retained. Resolve the stated error and relaunch, or choose 6 to stop known lab stacks.

## Verification limits

Python startup decisions and process cleanup are tested with mocks; the existing app tests also pass. The ZIP is checked for CRC integrity. This release has not been executed on your Windows desktop or against your live UDS/Docker cluster. First run should be manual before enabling sign-in startup.
