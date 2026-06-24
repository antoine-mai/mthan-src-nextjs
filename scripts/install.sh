#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ZIP_SOURCE="$ROOT_DIR/build/latest.zip"
INSTALL_DIR="/opt/mthan-src/nextjs"
SERVICE_DIR="/etc/systemd/system"
SERVICE_FILE="$SERVICE_DIR/mthan-src-nextjs@.service"
TMP_ZIP="${TMPDIR:-/tmp}/mthan-install.zip"

echo "------------------------------------------"
echo "📦 Installing application bundle..."
echo "------------------------------------------"

if [ "${EUID:-$(id -u)}" -ne 0 ]; then
  echo "This script must be run as root"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed, attempting to install..."
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y nodejs npm unzip
    if ! command -v node >/dev/null 2>&1 && command -v nodejs >/dev/null 2>&1; then
      ln -sf "$(command -v nodejs)" /usr/local/bin/node
    fi
  else
    echo "Automatic Node.js install is only supported on apt-based systems"
    exit 1
  fi
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js installation failed"
  exit 1
fi

if [ ! -f "$ZIP_SOURCE" ]; then
  echo "Bundle not found at $ZIP_SOURCE"
  exit 1
fi

mkdir -p "$INSTALL_DIR"

cp "$ZIP_SOURCE" "$TMP_ZIP"

unzip -oq "$TMP_ZIP" -d "$INSTALL_DIR"
rm -f "$TMP_ZIP"

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=MThan Src Next.js instance for user %i
After=network.target

[Service]
Type=simple
User=%i
WorkingDirectory=$INSTALL_DIR/standalone
Environment=NODE_ENV=production
EnvironmentFile=-%h/.mthan-src/nextjs/env
ExecStart=/usr/bin/env node $INSTALL_DIR/standalone/server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload

echo "------------------------------------------"
echo "✅ Installed to $INSTALL_DIR"
echo "✅ Systemd template written to $SERVICE_FILE"
echo "✅ Optional env file lives in ~/.mthan-src/nextjs/env for each user"
echo "▶ Start with: systemctl enable --now mthan-src-nextjs@<user>"
echo "------------------------------------------"
