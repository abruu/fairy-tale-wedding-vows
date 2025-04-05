#!/bin/bash

cd /var/www/fairy-tale-wedding-vows

# Ensure permissions
sudo /bin/chown -R www-data:www-data dist
sudo /bin/chmod -R 755 dist

# Reload nginx
sudo /usr/bin/systemctl reload nginx
