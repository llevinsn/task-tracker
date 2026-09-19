#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../.."

echo "== Test suite =="
npm test

echo
echo "== Diff (resumen) =="
git diff --stat

echo
echo "== Diff (completo) =="
git diff
