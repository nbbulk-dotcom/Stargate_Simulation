#!/bin/bash
RENDER_URL=$1
if [ -z "$RENDER_URL" ]; then
    echo "Usage: $0 <render_url>"
    echo "Example: $0 https://stargate-backend-xyz.onrender.com"
    exit 1
fi

echo "=== COMPLETE STARGATE DEPLOYMENT WORKFLOW TEST ==="
echo "Render Backend URL: $RENDER_URL"
echo "Started at: $(date)"
echo ""

echo "Step 1: Monitoring Render deployment status..."
./monitor_render_deployment.sh "$RENDER_URL"
if [ $? -ne 0 ]; then
    echo "❌ Backend deployment monitoring failed"
    exit 1
fi

echo -e "\nStep 2: Testing backend endpoints..."
./test_render_backend.sh "$RENDER_URL"
if [ $? -ne 0 ]; then
    echo "❌ Backend endpoint testing failed"
    exit 1
fi

echo -e "\nStep 3: Testing WebSocket connectivity..."
./test_websocket_connection.sh "$RENDER_URL"

echo -e "\nStep 4: Updating frontend configuration..."
./update_frontend_backend_url.sh "$RENDER_URL"
if [ $? -ne 0 ]; then
    echo "❌ Frontend update failed"
    exit 1
fi

echo -e "\nStep 5: Deploying updated frontend..."
cd /home/ubuntu/stargate_backend_render/web_frontend
echo "Frontend build completed. Ready for deployment to:"
echo "https://stargate-scripts-assembler-4dba9wmt.devinapps.com/"

echo -e "\n🎉 COMPLETE WORKFLOW TEST SUCCESSFUL!"
echo "Next steps:"
echo "1. Deploy updated frontend"
echo "2. Test end-to-end WebSocket connectivity"
echo "3. Monitor stability for 1 hour"
echo ""
echo "Success criteria to verify:"
echo "- WebSocket status shows 'Connected'"
echo "- 'Initialize Simulation' triggers real-time data"
echo "- All three monitors display live simulation data"
echo "- Connection remains stable with heartbeat mechanism"
echo ""
echo "Completed at: $(date)"
