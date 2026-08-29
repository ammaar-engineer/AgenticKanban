#!/usr/bin/env bash
set -euo pipefail

# Validasi apakah pesan commit diberikan sebagai argumen
if [ -z "${1:-}" ]; then
  echo "Error: Pesan commit tidak boleh kosong."
  echo "Penggunaan: $0 \"pesan commit Anda\""
  exit 1
fi

COMMIT_MSG="$1"

# Jalankan alur git
git add .
git commit -m "$COMMIT_MSG"
git push origin main
