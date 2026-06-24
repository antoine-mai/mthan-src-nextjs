#!/bin/bash
set -euo pipefail

ZIP_SOURCE="${1:-build/standalone.zip}"
INSTALL_DIR="/opt/mthan-src/nextjs"
SERVICE_DIR="/etc/systemd/system"
ENV_DIR="/etc/mthan-src/nextjs"
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
  echo "Node.js is not installed"
  exit 1
fi

mkdir -p "$INSTALL_DIR"
mkdir -p "$ENV_DIR"

if [[ "$ZIP_SOURCE" =~ ^https?:// ]]; then
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$ZIP_SOURCE" -o "$TMP_ZIP"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$TMP_ZIP" "$ZIP_SOURCE"
  else
    echo "curl or wget is required to download the bundle"
    exit 1
  fi
else
  cp "$ZIP_SOURCE" "$TMP_ZIP"
fi

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
EnvironmentFile=-$ENV_DIR/%i.env
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
echo "✅ Optional env files live in $ENV_DIR"
echo "▶ Start with: systemctl enable --now mthan-src-nextjs@<user>"
echo "------------------------------------------"
