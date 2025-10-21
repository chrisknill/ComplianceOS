# Calendar Event Auto-Add Workflow

## Overview
This n8n workflow automatically creates calendar events when triggered via webhook. It can be used to schedule meetings, reminders, or any calendar events from your ComplianceOS application.

## Workflow Configuration

### 1. Webhook Trigger
- **Node Type**: Webhook
- **HTTP Method**: POST
- **Path**: `/webhook/calendar-event`
- **Authentication**: None (or API key if needed)

### 2. Expected Payload Format
```json
{
  "event": "calendar.create",
  "title": "Management Review Meeting",
  "description": "Monthly management review meeting",
  "startDate": "2025-01-15T10:00:00Z",
  "endDate": "2025-01-15T11:00:00Z",
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
  "location": "Conference Room A",
  "reminderMinutes": [15, 60],
  "calendarId": "primary",
  "source": "ComplianceOS",
  "metadata": {
    "caseId": "MET-NC-2025-001",
    "priority": "High"
  }
}
```

### 3. Calendar Integration Options

#### Option A: Google Calendar
- **Node Type**: Google Calendar
- **Operation**: Create Event
- **Authentication**: OAuth2
- **Required Fields**:
  - Summary (title)
  - Start time
  - End time
  - Description
  - Attendees (optional)
  - Location (optional)

#### Option B: Microsoft Outlook Calendar
- **Node Type**: Microsoft Graph API
- **Operation**: Create Event
- **Authentication**: OAuth2
- **Required Fields**:
  - Subject (title)
  - Start time
  - End time
  - Body (description)
  - Attendees (optional)
  - Location (optional)

### 4. Workflow Steps

1. **Webhook Trigger** - Receives calendar event data
2. **Data Validation** - Validates required fields
3. **Calendar Creation** - Creates event in selected calendar
4. **Confirmation Email** - Sends confirmation to attendees
5. **Response** - Returns success/failure status

### 5. Error Handling
- Validate required fields (title, startDate, endDate)
- Handle calendar API errors
- Send error notifications
- Log failed attempts

### 6. Success Response
```json
{
  "success": true,
  "eventId": "calendar-event-id",
  "calendarLink": "https://calendar.google.com/event?eid=...",
  "message": "Calendar event created successfully"
}
```

### 7. Error Response
```json
{
  "success": false,
  "error": "Missing required field: title",
  "code": "VALIDATION_ERROR"
}
```

## Integration with ComplianceOS

### API Endpoint
Create a new API endpoint in your ComplianceOS app:

```typescript
// app/api/calendar/create-event/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Send to n8n webhook
    const response = await fetch('https://chrisknill.app.n8n.cloud/webhook/calendar-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    const result = await response.json()
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create calendar event' },
      { status: 500 }
    )
  }
}
```

### Usage Examples

#### 1. Management Review Meeting
```javascript
const eventData = {
  title: "Management Review Meeting",
  description: "Monthly management review meeting",
  startDate: "2025-01-15T10:00:00Z",
  endDate: "2025-01-15T11:00:00Z",
  attendees: [
    { email: "chris.knill@metinspect.com", name: "Chris Knill" }
  ],
  location: "Conference Room A",
  reminderMinutes: [15, 60]
}

await fetch('/api/calendar/create-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(eventData)
})
```

#### 2. Audit Schedule
```javascript
const auditEvent = {
  title: "ISO 9001 Audit - Department A",
  description: "Scheduled audit for ISO 9001 compliance",
  startDate: "2025-01-20T09:00:00Z",
  endDate: "2025-01-20T17:00:00Z",
  attendees: [
    { email: "auditor@company.com", name: "Lead Auditor" },
    { email: "manager@company.com", name: "Department Manager" }
  ],
  location: "Department A Office",
  reminderMinutes: [60, 1440] // 1 hour and 1 day before
}
```

## Setup Instructions

1. **Create n8n Workflow**:
   - Add Webhook trigger node
   - Configure webhook path: `/webhook/calendar-event`
   - Add calendar integration node (Google Calendar or Outlook)
   - Configure authentication
   - Add error handling

2. **Test Webhook**:
   - Use the test payload above
   - Verify calendar event creation
   - Check email notifications

3. **Integrate with ComplianceOS**:
   - Create API endpoint
   - Add calendar event creation to relevant forms
   - Test end-to-end workflow

## Security Considerations

- Validate all input data
- Use proper authentication for calendar APIs
- Limit webhook access
- Log all calendar events
- Handle sensitive information appropriately

## Monitoring

- Track successful/failed event creations
- Monitor calendar API usage
- Set up alerts for failures
- Regular testing of webhook functionality
