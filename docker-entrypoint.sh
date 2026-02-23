#!/bin/sh
set -e
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
  npm install
fi
exec "$@"
