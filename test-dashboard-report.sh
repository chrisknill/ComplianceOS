#!/bin/bash

# ComplianceOS Dashboard Report Test Script
# This script helps test the n8n workflow

echo "🚀 ComplianceOS Dashboard Report Test"
echo "====================================="
echo ""

# Check if ComplianceOS is running
echo "📊 Checking ComplianceOS server..."
if curl -s http://localhost:3000/api/employees > /dev/null; then
    echo "✅ ComplianceOS is running on localhost:3000"
else
    echo "❌ ComplianceOS is not running. Please start it with: npm run dev"
    exit 1
fi

echo ""
echo "🔧 n8n Workflow Status:"
echo "Workflow ID: fNekUoSHQEtyfNNQ"
echo "Name: ComplianceOS Dashboard Report Generator"
echo "Status: ACTIVE ✅"
echo ""

echo "📋 To test the workflow:"
echo "1. Go to https://chrisknill.app.n8n.cloud"
echo "2. Find the workflow 'ComplianceOS Dashboard Report Generator'"
echo "3. Click 'Execute Workflow' button"
echo "4. Check your email: christopher.knill@gmail.com"
echo ""

echo "🌐 Webhook URLs (after manual execution):"
echo "Production: https://chrisknill.app.n8n.cloud/webhook/dashboard-report"
echo "Test: https://chrisknill.app.n8n.cloud/webhook-test/dashboard-report"
echo ""

echo "🧪 Test the webhook after manual execution:"
echo "curl -X POST 'https://chrisknill.app.n8n.cloud/webhook/dashboard-report' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"triggerType\": \"manual\", \"reportType\": \"dashboard\"}'"
echo ""

echo "📧 The workflow will:"
echo "✅ Fetch data from ComplianceOS APIs"
echo "✅ Generate HTML dashboard report"
echo "✅ Send email to christopher.knill@gmail.com"
echo "✅ Return success response"
echo ""

echo "🎯 Ready to test! Execute the workflow manually in n8n first."
