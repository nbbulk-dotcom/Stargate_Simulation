#!/bin/bash
BACKEND_URL=$1
if [ -z "$BACKEND_URL" ]; then
    echo "Usage: $0 <backend_url>"
    echo "Example: $0 https://stargate-backend-xyz.onrender.com"
    exit 1
fi

echo "=== Comprehensive WebSocket Connection Test ==="
echo "Backend URL: $BACKEND_URL"
echo "Testing at: $(date)"

# Convert HTTP to WebSocket URL
WS_URL="${BACKEND_URL/https:/wss:}/ws"
WS_URL="${WS_URL/http:/ws:}/ws"

echo -e "\n1. Testing HTTP endpoints..."
echo "Root endpoint:"
curl -s "$BACKEND_URL/" | jq . 2>/dev/null || curl -s "$BACKEND_URL/"

echo -e "\nAPI status endpoint:"
curl -s "$BACKEND_URL/api/status" | jq . 2>/dev/null || curl -s "$BACKEND_URL/api/status"

echo -e "\n2. Testing WebSocket connection..."
echo "WebSocket URL: $WS_URL"

if command -v wscat &> /dev/null; then
    echo "Testing WebSocket with 30-second timeout..."
    timeout 30s wscat -c "$WS_URL" --execute 'console.log("WebSocket connected successfully")' || echo "WebSocket test completed"
else
    echo "wscat not available - WebSocket will be tested via frontend"
fi

echo -e "\n3. Testing initialization endpoint..."
curl -s -X POST "$BACKEND_URL/api/initialize?payload_volume=0.1&payload_mass=75.0" | jq . 2>/dev/null || curl -s -X POST "$BACKEND_URL/api/initialize?payload_volume=0.1&payload_mass=75.0"

echo -e "\n=== Test completed at $(date) ==="
