# Python v4.3 verification

- All 46 existing Python application/launcher tests pass.
- Eleven deterministic lesson scripts ran and matched their displayed expected outputs.
- DOM tests passed all 13 lesson checks, rejected a wrong answer, prevented duplicate completion counts, navigated lessons and preserved literal notes/progress in browser storage.
- New assets are registered in the connector allowlist and offline cache list.
- Live Grafana/TCP/UDS exercises depend on your running local services; they were not verified against your Windows host.
- A full graphical browser/offline runtime test was unavailable in the build environment. Offline asset registration was checked statically; this is not proof of offline browser behavior.

Expanded edition: 5 project tests pass in addition to the 46 existing tests. DOM checks validate 13 four-choice checks and all 52 explanations, eight roadmap phases and the fixed-rule simulator. Artwork visually inspected.
