#!/bin/bash
RENDER_URL=$1
if [ -z "$RENDER_URL" ]; then
    echo "Usage: $0 <render_backend_url>"
    exit 1
fi

echo "=== Testing Render Backend: $RENDER_URL ==="
echo "1. Testing root endpoint..."
curl -s "$RENDER_URL/" | jq . || curl -s "$RENDER_URL/"

echo -e "\n2. Testing API status endpoint..."
curl -s "$RENDER_URL/api/status" | jq . || curl -s "$RENDER_URL/api/status"

echo -e "\n3. Testing WebSocket endpoint (if wscat available)..."
if command -v wscat &> /dev/null; then
    timeout 10s wscat -c "${RENDER_URL/https:/wss:}/ws" || echo "WebSocket test completed"
else
    echo "wscat not available, will test WebSocket via frontend"
fi

echo -e "\n=== Backend verification complete ==="
