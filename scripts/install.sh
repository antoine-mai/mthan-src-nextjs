#!/bin/bash
set -euo pipefail

REMOTE_ZIP_URL="https://raw.githubusercontent.com/antoine-mai/mthan-src-nextjs/main/build/latest.zip"
INSTALL_DIR="/opt/mthan-src/nextjs"
SERVICE_DIR="/etc/systemd/system"
SERVICE_FILE="$SERVICE_DIR/mthan-src-nextjs@.service"
START_SCRIPT="$INSTALL_DIR/start.sh"
TMP_ZIP="${TMPDIR:-/tmp}/mthan-install.zip"
TARGET_USER=""

while [ $# -gt 0 ]; do
  case "$1" in
    --user)
      if [ $# -lt 2 ] || [ -z "${2:-}" ]; then
        echo "--user requires a username"
        exit 1
      fi
      TARGET_USER="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

if [ -n "$TARGET_USER" ] && ! id "$TARGET_USER" >/dev/null 2>&1; then
  echo "User not found: $TARGET_USER"
  exit 1
fi

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

if [ ! -f "$INSTALL_DIR/standalone/server.js" ]; then
  mkdir -p "$INSTALL_DIR"

  echo "Downloading bundle from GitHub..."
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$REMOTE_ZIP_URL" -o "$TMP_ZIP"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$TMP_ZIP" "$REMOTE_ZIP_URL"
  else
    echo "curl or wget is required to download the bundle"
    exit 1
  fi

  unzip -oq "$TMP_ZIP" -d "$INSTALL_DIR"
  rm -f "$TMP_ZIP"
fi

cat > "$START_SCRIPT" <<'EOF'
#!/bin/bash
set -euo pipefail

APP_DIR="/opt/mthan-src/nextjs"
USER_NAME="$(id -un)"
USER_HOME="${HOME:-$(getent passwd "$USER_NAME" | cut -d: -f6)}"
ENV_DIR="$USER_HOME/.mthan-src/nextjs"
ENV_FILE="$ENV_DIR/.env"
SERVER_JS="$APP_DIR/standalone/server.js"

find_free_port() {
  local port=3000
  while :; do
    if node -e "const net=require('net'); const s=net.createServer(); s.once('error',()=>process.exit(1)); s.listen({port:$port, host:'127.0.0.1'},()=>s.close(()=>process.exit(0)))" >/dev/null 2>&1; then
      echo "$port"
      return 0
    fi
    port=$((port + 1))
  done
}

mkdir -p "$ENV_DIR"

if [ ! -f "$ENV_FILE" ]; then
  PORT="$(find_free_port)"
  cat > "$ENV_FILE" <<EOF_ENV
PORT=$PORT
EOF_ENV
fi

if [ -f "$ENV_FILE" ]; then
  set -a
  . "$ENV_FILE"
  set +a
fi

PORT="${PORT:-3000}"
export PORT
export HOSTNAME="0.0.0.0"

echo "mthan-src-nextjs started for user $USER_NAME on http://0.0.0.0:$PORT"

exec /usr/bin/env node "$SERVER_JS"
EOF

chmod +x "$START_SCRIPT"

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=MThan Src Next.js instance for user %i
After=network.target

[Service]
Type=simple
User=%i
WorkingDirectory=$INSTALL_DIR/standalone
Environment=NODE_ENV=production
ExecStart=$START_SCRIPT
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload

echo "------------------------------------------"
if [ -n "$TARGET_USER" ]; then
  UNIT_NAME="mthan-src-nextjs@${TARGET_USER}"
  systemctl enable --now "$UNIT_NAME"
  sleep 1
  if ! systemctl is-active --quiet "$UNIT_NAME"; then
    echo "Failed to start $UNIT_NAME"
    systemctl status "$UNIT_NAME" --no-pager || true
    journalctl -u "$UNIT_NAME" -n 50 --no-pager || true
    exit 1
  fi
  echo "✅ Installed to $INSTALL_DIR"
  echo "✅ Systemd template written to $SERVICE_FILE"
  echo "✅ User service started: $UNIT_NAME"
  journalctl -u "$UNIT_NAME" -n 20 --no-pager || true
else
  echo "✅ Installed to $INSTALL_DIR"
  echo "✅ Systemd template written to $SERVICE_FILE"
  echo "✅ Optional env file lives in ~/.mthan-src/nextjs/.env for each user"
  echo "▶ Start with: systemctl enable --now mthan-src-nextjs@<user>"
fi
echo "------------------------------------------"
