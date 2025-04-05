#!/bin/bash

# Navigate to the project directory
cd /var/www/fairy-tale-wedding-vows

# Optional: Set correct ownership and permissions
sudo chown -R www-data:www-data dist
sudo chmod -R 755 dist

# Reload nginx
sudo /usr/bin/systemctl reload nginx
