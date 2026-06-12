#!/bin/bash

# Script build standalone và đẩy lên Git
MSG="${1:-Build & Deploy standalone $(date '+%Y-%m-%d %H:%M')}"

echo "------------------------------------------"
echo "🏗️ Building Next.js Standalone locally..."
echo "------------------------------------------"

# 1. Chạy build dưới local
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Local build failed."
    exit 1
fi

echo "------------------------------------------"
echo "📦 Staging changes and standalone bundle..."
echo "------------------------------------------"

# 2. Thêm các file build standalone vào git tracking
git add .next/standalone
git add .

# 3. Commit
echo "💬 Committing: $MSG"
git commit -m "$MSG"

# 4. Push lên Git Server
echo "🚀 Pushing to remote..."
git push
if [ $? -ne 0 ]; then
    echo "❌ Git push failed."
    exit 1
fi

# 5. Restart PM2 để cập nhật code mới
echo "------------------------------------------"
echo "🔄 Restarting PM2 process (apsara-crm)..."
echo "------------------------------------------"
pm2 restart apsara-crm
if [ $? -ne 0 ]; then
    echo "⚠️ PM2 restart failed. Vui lòng tự khởi chạy: pm2 start ecosystem.config.cjs"
fi

echo "------------------------------------------"
echo "✅ Standalone Build, Push & Restart Completed!"
echo "------------------------------------------"
