#!/bin/bash

cd /var/www/fairy-tale-wedding-vows

npm install
npm run build

# Use exact path to systemctl
sudo /usr/bin/systemctl reload nginx
#!/bin/bash
echo "Running deployment..."
sudo /bin/systemctl restart nginx || sudo /bin/systemctl start nginx
