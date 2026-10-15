# Version 4: existing users start with UPGRADE.md

The Deployment map and optional operations stack are new. The older installation steps below are for initial workload setup, not required for a UI upgrade.

# Version 3 note

Existing lab owners: use UPGRADE.md first; no workload rebuild is needed. The sections below remain the original workload setup. For native monitoring, Wazuh and Redpanda use the v3 app tabs and integrations/*/README.md. Grafana at grafana.admin.uds.dev applies only to a separately installed full UDS monitoring stack; your verified native Grafana uses localhost:3000.

# Tactical Platform Operations Lab v2.1 — Windows + Ubuntu WSL2

Independent personal learning project. Not affiliated with or endorsed by Defense Unicorns. The training code is original; UDS, Zarf, Kubernetes and podinfo are upstream projects with their own licenses.

## What you now have

- The existing pocket simulator and lessons still work as a static PWA.
- A Python connector in Ubuntu serves a live dashboard at http://localhost:8765 on your Windows PC.
- A real sample application packaged with Zarf for deployment into UDS Core.
- Three reversible incidents limited to this app: zero replicas, mismatched Service selector, invalid container executable.
- Pod readiness, Service endpoints, Package status, deployment details, events and logs.
- A path to metrics, optional SSO and offline package delivery practice.

This is a local learning environment, not an enterprise production environment. The included archive does NOT contain the UDS platform or container images. Initial platform installation and package creation require internet access and disk space. Live operation has not been verified against your PC or its UDS version. No AI API key is required by this connector.

Already running v2? Follow **UPGRADE.md** instead; no platform or package rebuild is needed for this UI update.

## 1. Extract the ZIP

In Windows File Explorer, right-click the ZIP → Extract All. Open the extracted `tactical-platform-ops-lab` folder. You should see `index.html`, `START-HERE.md`, `local` and `package`.

Open Ubuntu from the Start menu. Type `cd ` (including the space), then drag the extracted folder into the Ubuntu terminal if your terminal supports pasting its path. Alternatively use the WSL path below, replacing YOUR_WINDOWS_USER and the remaining folder path:

```sh
cd "/mnt/c/Users/YOUR_WINDOWS_USER/Downloads/tactical-platform-operations-lab-v2/tactical-platform-ops-lab"
ls
```

Do not paste the example path unchanged. The exact directory depends on where you extracted the ZIP. `ls` should list `local` and `package`. All remaining commands run from this folder unless explicitly labeled PowerShell.

## 2. Check what is already installed

Start your existing Docker runtime. If using Docker Desktop, enable its WSL2 engine and integration with your Ubuntu distribution. Avoid running competing Docker engines; use your existing working setup.

In Ubuntu:

```sh
python3 local/labctl.py check
```

The output reports kernel, UDS, Docker capacity, k3d, Kubernetes contexts and free disk. A CHECK FAILED line identifies a missing or unavailable component. If Python is missing: `sudo apt update` followed by `sudo apt install python3`.

The official full UDS demo calls for 4 CPU cores, 10 GiB RAM and 40 GiB storage available to the runtime. Give Windows enough memory too. These are demo minimums, not guarantees of smooth performance. The check reports values; compare them yourself. WSL's memory allocation is separate from total PC memory.

In **Windows PowerShell**, if unsure whether Ubuntu uses WSL2:

```powershell
wsl -l -v
```

Ubuntu should show VERSION 2. For Istio, the current UDS guide calls for a WSL Linux kernel at least 6.6. Check the reported `uname -r`. If older, use `wsl --update` in PowerShell, save your Ubuntu work, then `wsl --shutdown` and reopen Ubuntu. Consult the linked official WSL setup guide if the stable update does not provide a suitable kernel.

If Homebrew and UDS already work, do not reinstall them. If only k3d is missing, install it in Ubuntu with `brew install k3d`. Use the official setup link at the bottom for other missing prerequisites.

## 3. Verify or deploy UDS Core

The UDS CLI is a tool; UDS Core is the platform running inside the cluster. Installing `uds` alone does not install Core.

```sh
uds zarf tools kubectl config get-contexts
```

If your existing local UDS demo is `k3d-uds`, check it:

```sh
uds zarf tools kubectl --context k3d-uds get nodes
uds zarf tools kubectl --context k3d-uds get crd packages.uds.dev
uds zarf tools kubectl --context k3d-uds get pods -A
```

If these work and this is the local demo you want to use, skip installation. Inspect readiness counts and events for unhealthy pods; Running alone does not prove every container is Ready.

**Only if you do not yet have a local UDS demo:** inspect the current context first. Do not run the demo installer against a work or production environment. Follow the official local-demo instructions to run:

```sh
uds deploy k3d-core-demo:latest
```

This downloads and creates the real local platform. Review its prompt and let it finish; first deployment can take a while. `latest` is the official quick-start alias and changes over time. Record the resolved version from your terminal for repeatable labs; use a specific release tag for later rebuilds. If a local `uds` cluster already exists but is unhealthy, diagnose it rather than blindly redeploying or deleting it.

Run `uds zarf tools kubectl config get-contexts` again and note the exact local context name. The examples below use `k3d-uds`; replace it if yours differs. The connector deliberately accepts only a `k3d-` context with a loopback API address and a UDS Package CRD.

## 4. Build and deploy the sample app

From the extracted folder, while online:

```sh
python3 local/labctl.py build
python3 local/labctl.py deploy --context k3d-uds
```

Build gathers the pinned podinfo image plus the supplied manifests into `package/zarf-package-tpol-training-<architecture>-2.0.0.tar.zst`. It may also produce SBOM files. Deploy uses an isolated temporary kubeconfig containing only your explicit context and removes that temporary file afterward. It refuses to adopt an existing unrelated `tpol-training` namespace.

The app is deliberately small and stateless. It requests UDS tenant-gateway exposure and a PodMonitor. It does not request SSO by default, which keeps the first routing exercise straightforward. The optional SSO exercise below adds it explicitly.

## 5. Start the connector

```sh
python3 local/bridge.py --context k3d-uds
```

Keep the terminal open. It prints a session token and an address.

1. Open **http://localhost:8765** in Edge or Chrome on the same Windows PC.
2. Select **Live UDS Lab**.
3. Open **Connection settings**, copy the session token from Ubuntu and paste it into the token box.
4. Select **Authorize**. The badge should say **Authorized**. Use **Refresh** for subsequent readings.
5. Confirm the displayed context and namespace. Inspect the live readings.

The token stays in page memory only. Reloading needs another paste; restarting the connector generates a new token. Ctrl+C stops the connector without deleting the lab. Do not use `sudo` to start it. No ports need to be exposed to your network.

If Windows localhost forwarding does not work, first confirm the server is still running and try `curl http://localhost:8765` in Ubuntu. Then inspect your WSL localhost-forwarding configuration using Microsoft's guide. Do not change the connector to listen on 0.0.0.0 as a workaround. If port 8765 is already used, start with `--port 8766` and open that port instead.

## 6. Your first incident drill

Baseline: one desired replica, one ready replica, at least one ready Service endpoint, and a reconciled UDS Package. Visit https://tpol-training.uds.dev from Windows and verify a response. Your local UDS certificate/domain configuration must work for this link.

### Drill A — application outage

Choose **Stop app replicas**. Refresh: desired replicas drop to zero and pods terminate. Inspect the deployment. Restore the training app, refresh until it is Ready, then open the app again.

Lesson: Kubernetes follows the desired state. If desired replicas are zero, it will not automatically create another pod.

### Drill B — network-path outage

Choose **Break Service routing**. The app pods can remain Ready while ready endpoints disappear, because the Service selector no longer matches the pod labels. Inspect UDS networking and raw Service evidence. Restore and test the app again.

Lesson: a healthy process does not guarantee a working service path. This fault is a Service-selector mismatch, not a failure of your PC's network or UDS Core networking.

### Drill C — failed startup

Choose **Break container startup**. The new pod tries to start a nonexistent executable. Inspect events and deployment details. Logs may be empty because the application never started. A rolling Deployment can temporarily retain an old healthy pod, so the app may remain reachable while rollout is unhealthy. Restore and refresh until the rollout settles.

Lesson: distinguish a rollout failure from a total outage; use evidence rather than the button's name.

The restore button repairs all three known exercise settings (replicas=1, matching selector, original image entrypoint). It does not undo arbitrary edits or restore application data. No cluster deletion is available in the dashboard.

## 7. Observability and identity

Open https://grafana.admin.uds.dev and sign in with your local demo account. In Explore/Prometheus try:

```promql
up{namespace="tpol-training"}
```

A returned 1 means that scrape target is up. No results can mean the monitor has not reconciled, a scrape has not occurred yet, or your installed platform's configuration differs. Inspect the Package and PodMonitor before assuming success.

For optional SSO, merge the contents of `package/sso-fragment.yaml` under the existing `spec` in `package/uds-package.yaml`; keep `network` and `monitor`. Then rebuild and redeploy while online. That changes the same package version's contents for this local exercise—record the new archive checksum. The fragment registers an Authservice-protected client for the training host. Configure a test user in your local Keycloak with the allowed group, following the official tutorial. Test unauthenticated, authorized and unauthorized access. Never put a Keycloak admin password into this dashboard. Remove the `sso` block, rebuild and redeploy to undo the exercise.

## 8. Offline delivery rehearsal

Do this after the platform and app work online:

1. Retain the generated Zarf archive locally, together with these scripts and manifests. Record `sha256sum package/zarf-package-tpol-training-*.tar.zst`.
2. Keep Docker, WSL and UDS Core running. Disconnect external internet temporarily without shutting them down.
3. Run `python3 local/labctl.py deploy --context k3d-uds` again. Do NOT run build: build needs upstream sources.
4. Check the dashboard locally. The local image registry and platform services must still be available.
5. Restore internet after testing. Record any missing dependencies and investigate them.

This is a package-delivery rehearsal on an initialized platform. It is not a from-scratch airgap installation, backup, or disaster recovery test. Cached app images alone do not provide all platform recovery assets. Browser DNS for uds.dev or external identity services can also fail without internet even when a local deployment succeeds. Compare cluster evidence separately from browser access.

## Troubleshooting

| Symptom | Next check |
| --- | --- |
| `uds` not found | Open the Ubuntu shell where Homebrew/UDS was installed; verify PATH. |
| Docker connection failed | Start your chosen runtime; check WSL integration. |
| Context not found | Run `uds zarf tools kubectl config get-contexts`; use the exact local name. |
| Package CRD missing | The target may be plain Kubernetes or an incomplete UDS install. |
| ImagePullBackOff | Inspect events and the Zarf deployment output; check local registry availability. |
| Package stuck pending | Inspect the Package status, operator events, and installed UDS version. |
| TLS or domain error | Check official UDS local ingress/certificate setup; don't disable TLS verification globally. |
| No app logs | Check events first; a failed executable has no application log to read. |
| Unauthorized | Re-paste the current token; a connector restart invalidates the previous one. |
| Stale dashboard | Click Refresh; readings are snapshots, not continuous monitoring. |
| Hosted Vercel page cannot connect | Open the local URL for live control. Vercel is for the static simulator. |

## Phone and Vercel

Your phone can continue to use the offline simulator hosted over HTTPS. `localhost` on your phone refers to the phone, not your PC. This version does not expose the live connector remotely. Deploy only the static files: index.html, styles.css, app.js, live.js, learning.js, learning-data.js, sw.js, icon.svg, manifest.webmanifest and the assets folder. The ZIP's Python scripts run in Ubuntu, not on a static hosting service. Progress at the local address and hosted address is stored separately.

## Official references used

- UDS prerequisites: https://docs.defenseunicorns.com/core/getting-started/local-demo/basic-requirements/
- Full demo deployment: https://docs.defenseunicorns.com/core/v1-14/getting-started/local-demo/install-and-deploy-uds/
- Package integration concepts: https://docs.defenseunicorns.com/core/v1-14/getting-started/local-demo/integrate-your-package/
- Microsoft WSL networking: https://learn.microsoft.com/en-us/windows/wsl/networking

This lab's workload and connector are independently authored and are not an official UDS support tool. Official docs were reviewed during this build; validate compatibility with your installed releases.
