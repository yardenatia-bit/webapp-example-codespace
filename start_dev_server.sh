#!/usr/bin/env bash
# Start the Vite dev server (installs dependencies first if needed).
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  npm install
fi

# --host exposes the server on all interfaces so Codespaces/containers can forward the port.
exec npm run dev -- --host "$@"
