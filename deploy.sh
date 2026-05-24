#!/usr/bin/env bash
set -e

echo "→ Installing dependencies..."
npm ci

echo "→ Building web app..."
npm run build

echo "✓ Build complete — output in apps/web/dist"
