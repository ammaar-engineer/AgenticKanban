#!/bin/bash

set -e

FRONTEND_DIR="client"
BACKEND_DIR="server"
PIDS=()

cleanup() {
  echo -e "\n🛑 Stopping servers..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM

cd "$FRONTEND_DIR" && npm run dev &
PIDS+=("$!")

cd "$BACKEND_DIR" && npm run dev &
PIDS+=("$!")

wait
