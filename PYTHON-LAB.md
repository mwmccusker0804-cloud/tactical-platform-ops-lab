# Python Operations Lab - v4.3

Original companion exercises for studying alongside TCM Programming 100. This is not a copy of the TCM course or its assignments; “100” refers to your foundation course, not a promise of 100 lessons. There are 13 sequential lessons here, with full examples, explained statements, expected outputs and checks.

## Start with the existing desktop icon

Extract this update to a permanent folder, export progress from your previous app, close the old connector with Ctrl+C, and run INSTALL-DESKTOP.cmd from the new folder to update the shortcut. Choose menu 5 (Learning only) for the first ten lessons. The new Python 100 tab also works with the other profiles. Use the same browser and localhost:8765 address to retain existing progress; Python progress is separate and has its own export/import buttons. Keep the old app folder and Zarf archive. No workload rebuild is needed for the learning update.

## First actual Python run

1. Open Ubuntu from Windows Start. Open the extracted project folder in Windows File Explorer; type `wsl` in its address bar to open your default WSL distribution there. If your default distribution is not your selected Ubuntu, use your normal Ubuntu terminal and change into the project folder instead.
2. Run `pwd` and `ls python-lab/lessons` to confirm the location.
3. Run `python3 --version`. If missing, use your Ubuntu package installation process before continuing. The exercises need Python 3 and standard-library modules only; no pip dependencies or paid APIs.
4. Run `python3 python-lab/lessons/01_status.py`.
5. Expect two lines: `Operations lab` and `Status: simulated`.
6. Open that file in VS Code. Change the message, save, and run the command again. Predictions and notes in the web app do not execute Python; your Ubuntu terminal executes the actual file.

Windows alternative: from the project folder, `py -3 python-lab/lessons/01_status.py` works if a Windows Python installation is already present. It is separate from the Ubuntu Python environment. Keep the UDS collector in Ubuntu.

## Learning route

1-3: print, variables and if/else. 4-6: lists, loops and functions. 7: inventory filtering. 8-10: log files, exceptions and a JSON security report. 11: one localhost TCP check. 12: native Grafana HTTP health. 13: saved pod readiness/restart analysis.

The first ten lessons use fictional data. Lesson 10 replaces only python-lab/reports/security-summary.json. Lesson 11 contacts localhost:8765. Lesson 12 contacts localhost:3000 (use UDS monitoring profile). A connection error is evidence to investigate; it is not a reason to install unrelated packages. Neither lesson modifies a service.

For lesson 13, run the saved sample first. Then, with the UDS profile running:

```bash
python3 python-lab/collect_pods.py --context k3d-uds
```

This performs read-only kubectl config/get operations and writes a filtered local snapshot to python-lab/reports/live-pods.json. To analyze it, copy lesson 13 to a new file in the same lessons folder, change its source path from `"data" / "pods.json"` to `"reports" / "live-pods.json"`, and rerun the copy. Keep the original sample. Running, Ready and restart count are different signals; inspect logs/events before proposing disruptive action.

## Troubleshooting

- File not found: check pwd, then ls; run from the extracted project root, not your home directory.
- SyntaxError: check quotes, colon, brackets and the line above the reported position.
- IndentationError: use four spaces consistently; do not mix tabs and spaces.
- NameError: check spelling and whether the assignment/function definition ran first.
- Function produces nothing: defining it does not call it; call the function and print its return value.
- JSON decode error: inspect the file/response; JSON requires quoted keys and valid JSON syntax.
- TCP/HTTP failure: start the required local service and check the address; TCP success does not prove login works.
- Browser progress missing: use the same browser/origin, or import your Python progress export.

No scripts disable users, delete pods, or change firewall rules. Live collection is optional. The new section uses a plain operations training design, without additional unicorn artwork.

## Expanded guided projects

Open the eight-phase roadmap in the Python 100 tab. Expand a phase for its build goal, command, change to try and expected evidence. All 13 lessons now include four-choice checks with explanations for every option; existing typed-answer completion progress and notes remain intact. The browser rule simulator evaluates a fixed condition, not arbitrary Python code. Edit and execute the supplied .py files in VS Code/Ubuntu for actual coding practice.

Project A: `python3 python-lab/tools/inventory.py` reads sample_servers.json. Project B: `python3 python-lab/tools/log_analyzer.py` counts failures and malformed records and writes reports/auth-report.json. Project C: `python3 python-lab/tools/network_checker.py` checks only three named localhost services. Run all project tests with `python3 -m unittest discover -s python-lab/tests`. No pip dependencies are required.

The new illustration combines Monster Hunter and FFXIV-inspired operations learning. Existing artwork in other lab sections remains unchanged. These are original companion exercises, not a reproduction of TCM lessons or official game content.
