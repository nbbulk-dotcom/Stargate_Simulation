#!/bin/bash
NEW_BACKEND_URL=$1
if [ -z "$NEW_BACKEND_URL" ]; then
    echo "Usage: $0 <new_backend_url>"
    echo "Example: $0 https://stargate-backend-xyz.onrender.com"
    exit 1
fi

echo "=== Updating Frontend Backend URL ==="
echo "New backend URL: $NEW_BACKEND_URL"

echo "VITE_BACKEND_URL=$NEW_BACKEND_URL" > /home/ubuntu/stargate_backend_render/web_frontend/.env.production

echo "Updated .env.production:"
cat /home/ubuntu/stargate_backend_render/web_frontend/.env.production

echo -e "\n=== Building frontend with new backend URL ==="
cd /home/ubuntu/stargate_backend_render/web_frontend
npm run build

echo -e "\n=== Frontend update completed ==="
echo "Ready to deploy frontend with new backend URL: $NEW_BACKEND_URL"
