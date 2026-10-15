#!/usr/bin/env bash
set -euo pipefail
# Windows starts a non-interactive shell: include common per-user tool locations.
export PATH="$HOME/.local/bin:$HOME/bin:/home/linuxbrew/.linuxbrew/bin:/usr/local/bin:$PATH"
exec python3 -u local/desktop.py "$@"
