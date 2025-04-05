#!/bin/bash

# Go to the project directory
cd /var/www/fairy-tale-wedding-vows

# Optional: make sure correct permissions (only if needed)
# sudo chown -R jarvis:jarvis .

# Install dependencies (if necessary)
npm install

# Build project (optional if already done via GitHub Actions)
npm run build

# Restart or reload nginx with sudo (no password prompt now)
sudo /usr/bin/systemctl reload nginx
