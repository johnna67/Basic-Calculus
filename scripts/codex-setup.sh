#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node.js 22.12 or later." >&2
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
NODE_MINOR="$(node -p "process.versions.node.split('.')[1]")"

if [ "$NODE_MAJOR" -lt 22 ] || { [ "$NODE_MAJOR" -eq 22 ] && [ "$NODE_MINOR" -lt 12 ]; }; then
  echo "Node.js 22.12 or later is required. Current version: $(node --version)" >&2
  exit 1
fi

echo "Using Node $(node --version) and npm $(npm --version)"
echo "Installing locked dependencies..."
npm ci

echo "Running type checks and automated tests..."
npm run check

echo "Building the production game..."
npm run build

echo
echo "Setup complete."
echo "Start development: ./scripts/run-dev.sh"
echo "Preview production: npm run preview -- --host 0.0.0.0"
echo "Standalone file: dist/index.html"
