#!/bin/bash

cd /var/www/fairy-tale-wedding-vows || exit

echo "✅ Pulling latest code..."
git reset --hard HEAD         # optional: resets local changes
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🛠️ Building project..."
npm run build

echo "🚀 Restarting Nginx..."
sudo /bin/systemctl restart nginx || sudo /bin/systemctl start nginx

echo "✅ Deployment complete"
