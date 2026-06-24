#!/bin/bash
set -euo pipefail

ZIP_NAME="${1:-latest.zip}"
BUILD_DIR="build"
STAGING_DIR="$BUILD_DIR/standalone"
ZIP_PATH="$BUILD_DIR/$ZIP_NAME"

echo "------------------------------------------"
echo "🏗️ Building Next.js standalone bundle..."
echo "------------------------------------------"

rm -rf .next "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

npm run build

mkdir -p "$STAGING_DIR/.next"
cp -R .next/standalone/. "$STAGING_DIR/"

if [ -d public ]; then
    cp -R public "$STAGING_DIR/public"
fi

if [ -d .next/static ]; then
    cp -R .next/static "$STAGING_DIR/.next/static"
fi

(
    cd "$BUILD_DIR"
    zip -qr "$ZIP_NAME" standalone
)

APP_VERSION=$(node -p "require('./package.json').version")
BUILD_VERSION="v$(date -u +"%Y%m%d%H%M%S")"

cat > "$BUILD_DIR/version.json" <<EOF
{
  "version": "$APP_VERSION",
  "buildVersion": "$BUILD_VERSION",
  "zip": "$ZIP_NAME"
}
EOF

rm -rf "$STAGING_DIR"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git add -f "$BUILD_DIR/$ZIP_NAME" "$BUILD_DIR/version.json"
    git add -A
    git commit --allow-empty -m "Build ${BUILD_VERSION}"
    git push
fi

echo "------------------------------------------"
echo "✅ Standalone build packed at $ZIP_PATH"
echo "✅ Version manifest written to $BUILD_DIR/version.json"
echo "✅ Git changes pushed"
echo "------------------------------------------"
