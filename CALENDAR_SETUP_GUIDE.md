# Calendar Event Auto-Add Setup Guide

## 🚀 Quick Start

### 1. Environment Variables
Add these to your `.env.local` file:

```bash
# n8n Calendar Webhook URL
N8N_CALENDAR_WEBHOOK_URL=https://chrisknill.app.n8n.cloud/webhook/calendar-event

# Google Calendar API (if using Google Calendar integration)
GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret

# Microsoft Graph API (if using Outlook integration)
MICROSOFT_GRAPH_CLIENT_ID=your_microsoft_client_id
MICROSOFT_GRAPH_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_GRAPH_TENANT_ID=your_tenant_id
```

### 2. n8n Workflow Setup

#### Step 1: Create New Workflow
1. Open n8n
2. Click "New Workflow"
3. Name it "Calendar Event Auto-Add"

#### Step 2: Add Webhook Trigger
1. Add "Webhook" node
2. Configure:
   - **HTTP Method**: POST
   - **Path**: `/webhook/calendar-event`
   - **Authentication**: None
3. Click "Execute Workflow" to get webhook URL

#### Step 3: Add Calendar Integration

**Option A: Google Calendar**
1. Add "Google Calendar" node
2. Configure:
   - **Operation**: Create Event
   - **Calendar ID**: `{{ $json.calendarId }}`
   - **Summary**: `{{ $json.title }}`
   - **Description**: `{{ $json.description }}`
   - **Start**: `{{ $json.startDate }}`
   - **End**: `{{ $json.endDate }}`
   - **Location**: `{{ $json.location }}`
   - **Attendees**: `{{ $json.attendees }}`

**Option B: Microsoft Graph**
1. Add "Microsoft Graph" node
2. Configure:
   - **Operation**: Create Event
   - **Calendar ID**: `{{ $json.calendarId }}`
   - **Subject**: `{{ $json.title }}`
   - **Body**: `{{ $json.description }}`
   - **Start**: `{{ $json.startDate }}`
   - **End**: `{{ $json.endDate }}`
   - **Location**: `{{ $json.location }}`
   - **Attendees**: `{{ $json.attendees }}`

#### Step 4: Add Response Node
1. Add "Respond to Webhook" node
2. Configure:
   - **Response Code**: 200
   - **Response Body**:
   ```json
   {
     "success": true,
     "eventId": "{{ $json.id }}",
     "calendarLink": "{{ $json.htmlLink }}",
     "message": "Calendar event created successfully"
   }
   ```

### 3. Test the Workflow

#### Test 1: Direct Webhook Test
```bash
./test-calendar-workflow.sh
```

#### Test 2: ComplianceOS API Test
```bash
curl -X POST http://localhost:3000/api/calendar/create-event \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Test Meeting",
    "description": "Test calendar event",
    "startDate": "2025-01-15T10:00:00Z",
    "endDate": "2025-01-15T11:00:00Z",
    "location": "Test Location"
  }'
```

### 4. Integration Examples

#### Management Review Meeting
```javascript
// Add to management review form
const createReviewMeeting = async (reviewData) => {
  const eventData = {
    title: `Management Review - ${reviewData.period}`,
    description: `Management review meeting for ${reviewData.period}`,
    startDate: reviewData.scheduledDate,
    endDate: new Date(new Date(reviewData.scheduledDate).getTime() + 60 * 60 * 1000).toISOString(),
    attendees: reviewData.attendees,
    location: "Conference Room A",
    reminderMinutes: [60, 1440] // 1 hour and 1 day before
  }
  
  await fetch('/api/calendar/create-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  })
}
```

#### Audit Schedule
```javascript
// Add to audit planning
const scheduleAudit = async (auditData) => {
  const eventData = {
    title: `ISO ${auditData.standard} Audit - ${auditData.department}`,
    description: `Scheduled audit for ${auditData.standard} compliance`,
    startDate: auditData.startDate,
    endDate: auditData.endDate,
    attendees: [
      { email: auditData.auditorEmail, name: auditData.auditorName },
      { email: auditData.managerEmail, name: auditData.managerName }
    ],
    location: auditData.location,
    reminderMinutes: [1440, 10080] // 1 day and 1 week before
  }
  
  await fetch('/api/calendar/create-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  })
}
```

### 5. Error Handling

The workflow includes comprehensive error handling:

- **Validation Errors**: Missing required fields
- **Date Errors**: Invalid date formats or logic
- **Calendar API Errors**: Authentication or permission issues
- **Network Errors**: Connection failures

### 6. Monitoring

Track your calendar events:

- **Success Rate**: Monitor successful event creations
- **Error Logs**: Review failed attempts
- **Calendar Usage**: Track API quota usage
- **User Feedback**: Monitor user satisfaction

### 7. Security Best Practices

- Validate all input data
- Use proper authentication
- Limit webhook access
- Log all calendar events
- Handle sensitive information appropriately

## 🎯 Next Steps

1. **Test the workflow** with the provided test script
2. **Integrate with forms** in your ComplianceOS application
3. **Set up monitoring** for calendar event creation
4. **Train users** on the new calendar functionality
5. **Monitor usage** and gather feedback

## 📞 Support

If you encounter issues:

1. Check the n8n workflow execution logs
2. Verify webhook URL is correct
3. Test calendar API authentication
4. Review error messages in the API response
5. Check environment variables are set correctly
