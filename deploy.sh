#!/bin/bash

cd /var/www/fairy-tale-wedding-vows

# Optional: Reset git if used
# git reset --hard

# Install dependencies
npm install --no-audit --no-fund

# Build
npm run build

# Reload nginx (make sure jarvis has sudo privileges without password)
sudo -S systemctl reload nginx < /dev/null
