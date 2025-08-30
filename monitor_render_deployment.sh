#!/bin/bash
RENDER_URL=$1
if [ -z "$RENDER_URL" ]; then
    echo "Usage: $0 <render_url>"
    echo "Example: $0 https://stargate-backend-xyz.onrender.com"
    exit 1
fi

echo "=== Monitoring Render Deployment Status ==="
echo "URL: $RENDER_URL"
echo "Started monitoring at: $(date)"

test_endpoint() {
    local url=$1
    local response=$(curl -s -w "%{http_code}" -o /tmp/render_response.txt "$url" 2>/dev/null)
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo "✅ SUCCESS: Backend is responding (HTTP $http_code)"
        echo "Response:"
        cat /tmp/render_response.txt | jq . 2>/dev/null || cat /tmp/render_response.txt
        return 0
    else
        echo "⏳ WAITING: Backend not ready (HTTP $http_code)"
        return 1
    fi
}

attempt=1
max_attempts=20
delay=10

while [ $attempt -le $max_attempts ]; do
    echo -e "\n--- Attempt $attempt/$max_attempts at $(date) ---"
    
    if test_endpoint "$RENDER_URL"; then
        echo -e "\n🎉 RENDER DEPLOYMENT SUCCESSFUL!"
        echo "Backend is ready at: $RENDER_URL"
        echo "Next steps:"
        echo "1. Run: ./update_frontend_backend_url.sh $RENDER_URL"
        echo "2. Test WebSocket: ./test_websocket_connection.sh $RENDER_URL"
        exit 0
    fi
    
    if [ $attempt -lt $max_attempts ]; then
        echo "Waiting ${delay}s before next attempt..."
        sleep $delay
        delay=$((delay < 60 ? delay * 2 : 60))
    fi
    
    attempt=$((attempt + 1))
done

echo -e "\n❌ TIMEOUT: Backend not responding after $max_attempts attempts"
echo "Please check Render deployment logs and try again"
exit 1
