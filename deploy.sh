#!/bin/bash
cd /var/www/fairy-tale-wedding-vows
git pull origin main
npm install
npm run build
sudo /bin/systemctl reload nginx
