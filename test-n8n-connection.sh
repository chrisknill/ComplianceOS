#!/bin/bash

# Test n8n API Connection Script
# This script will test your n8n API connection

echo "🔧 Testing n8n API Connection..."
echo "================================"

# Check if API key is set
if [ -z "$N8N_API_KEY" ]; then
    echo "❌ N8N_API_KEY environment variable not set"
    echo "Please set your n8n API key:"
    echo "export N8N_API_KEY='your_actual_api_key_here'"
    exit 1
fi

# Test API connection
echo "🌐 Testing connection to: https://chrisknill.app.n8n.cloud"
echo "🔑 Using API Key: ${N8N_API_KEY:0:10}..."

# Test health endpoint
echo ""
echo "📊 Testing API Health..."
curl -s -H "Authorization: Bearer $N8N_API_KEY" \
     -H "Content-Type: application/json" \
     "https://chrisknill.app.n8n.cloud/api/v1/health" | jq '.'

# Test workflows endpoint
echo ""
echo "📋 Testing Workflows API..."
curl -s -H "Authorization: Bearer $N8N_API_KEY" \
     -H "Content-Type: application/json" \
     "https://chrisknill.app.n8n.cloud/api/v1/workflows" | jq '.'

echo ""
echo "✅ API connection test complete!"
echo ""
echo "Next steps:"
echo "1. If you see workflow data above, your API key is working"
echo "2. Update .cursor/mcp.json with your real API key"
echo "3. Restart Cursor to enable MCP tools"
echo "4. Use MCP tools to create workflows directly"
