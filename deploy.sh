#!/bin/bash

cd /var/www/fairy-tale-wedding-vows

npm install
npm run build

# Use exact path to systemctl
sudo /usr/bin/systemctl reload nginx
