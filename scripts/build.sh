#!/bin/bash

# Script to build standalone and push to Git
MSG="${1:-Build & Deploy standalone $(date '+%Y-%m-%d %H:%M')}"

echo "------------------------------------------"
echo "🏗️ Building Next.js Standalone locally..."
echo "------------------------------------------"

# 1. Run local build
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Local build failed."
    exit 1
fi

echo "------------------------------------------"
echo "📦 Staging changes and standalone bundle..."
echo "------------------------------------------"

# 2. Add standalone build files to git tracking
git add .next/standalone
git add .

# 3. Commit
echo "💬 Committing: $MSG"
git commit -m "$MSG"

# 4. Push to Git Server
echo "🚀 Pushing to remote..."
git push
if [ $? -ne 0 ]; then
    echo "❌ Git push failed."
    exit 1
fi

# 5. Restart PM2 to update with new code
echo "------------------------------------------"
echo "🔄 Restarting PM2 process (apsara-crm)..."
echo "------------------------------------------"
pm2 restart apsara-crm
if [ $? -ne 0 ]; then
    echo "⚠️ PM2 restart failed. Please start manually: pm2 start ecosystem.config.cjs"
fi

echo "------------------------------------------"
echo "✅ Standalone Build, Push & Restart Completed!"
echo "------------------------------------------"
