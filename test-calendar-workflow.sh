#!/bin/bash

# Calendar Event Auto-Add Test Script
# This script tests the calendar event creation workflow

echo "🗓️  Testing Calendar Event Auto-Add Workflow"
echo "=============================================="

# Test data
TITLE="Management Review Meeting"
DESCRIPTION="Monthly management review meeting for ISO compliance"
START_DATE="2025-01-15T10:00:00Z"
END_DATE="2025-01-15T11:00:00Z"
LOCATION="Conference Room A"

# Webhook URL (update this to your actual n8n webhook URL)
WEBHOOK_URL="https://chrisknill.app.n8n.cloud/webhook/calendar-event"

echo "📋 Test Event Details:"
echo "  Title: $TITLE"
echo "  Description: $DESCRIPTION"
echo "  Start: $START_DATE"
echo "  End: $END_DATE"
echo "  Location: $LOCATION"
echo ""

# Create test payload
PAYLOAD=$(cat <<EOF
{
  "event": "calendar.create",
  "title": "$TITLE",
  "description": "$DESCRIPTION",
  "startDate": "$START_DATE",
  "endDate": "$END_DATE",
  "attendees": [
    {
      "email": "chris.knill@metinspect.com",
      "name": "Chris Knill"
    },
    {
      "email": "manager@company.com",
      "name": "Manager Name"
    }
  ],
  "location": "$LOCATION",
  "reminderMinutes": [15, 60],
  "calendarId": "primary",
  "source": "ComplianceOS",
  "metadata": {
    "test": true,
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  }
}
EOF
)

echo "🚀 Sending test request to webhook..."
echo "  URL: $WEBHOOK_URL"
echo ""

# Send request to webhook
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "$WEBHOOK_URL")

# Split response and status code
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)

echo "📊 Response:"
echo "  HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "  ✅ SUCCESS!"
    echo "  Response Body:"
    echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
else
    echo "  ❌ FAILED!"
    echo "  Response Body:"
    echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
fi

echo ""
echo "🔍 Next Steps:"
echo "  1. Check your calendar for the new event"
echo "  2. Verify attendees received invitations"
echo "  3. Test the ComplianceOS API endpoint"
echo "  4. Integrate with your application forms"

echo ""
echo "📝 To test the ComplianceOS API endpoint:"
echo "curl -X POST http://localhost:3000/api/calendar/create-event \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '$PAYLOAD'"
