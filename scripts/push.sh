#!/bin/bash

# Define commit message (fallback to default if not provided)
MSG="${1:-System update $(date '+%Y-%m-%d %H:%M')}"

# Run git commands
echo "Staging all changes..."
git add .

echo "Creating commit: $MSG"
git commit -m "$MSG"

echo "Pushing code to remote..."
git push

echo "Code pushed successfully!"
