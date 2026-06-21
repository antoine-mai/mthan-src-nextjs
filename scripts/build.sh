#!/bin/bash

# Script to build standalone and push to Git
MSG="${1:-Build & Deploy standalone $(date '+%Y-%m-%d %H:%M')}"

echo "------------------------------------------"
echo "🏗️ Building Next.js Standalone locally..."
echo "------------------------------------------"

# 1. Clean previous Next.js build output
rm -rf .next

# 2. Run local build
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Local build failed."
    exit 1
fi

echo "------------------------------------------"
echo "📦 Staging changes and standalone bundle..."
echo "------------------------------------------"

# 3. Add standalone build files to git tracking
git add .next/standalone
git add .

# 4. Commit
echo "💬 Committing: $MSG"
git commit -m "$MSG"

# 5. Push to Git Server
echo "🚀 Pushing to remote..."
git push
if [ $? -ne 0 ]; then
    echo "❌ Git push failed."
    exit 1
fi

echo "------------------------------------------"
echo "✅ Standalone Build & Push Completed!"
echo "------------------------------------------"
