# Centralized Action Assignment Service

This service provides a unified way to assign actions across your ComplianceOS application and trigger email notifications through your n8n workflow.

## Overview

The `ActionNotificationService` sends standardized action assignment data to your n8n webhook, which can then trigger email notifications, Teams messages, or other workflows.

## Webhook Payload Format

The service sends data in this exact format to your n8n webhook:

```json
{
  "event": "action.assigned",
  "tenantId": "compliance-os",
  "source": "IMS/NC", // e.g. 'HSE/RiskAssessment', 'IMS/CorrectiveAction', 'HR/Mentoring'
  "actionId": "MET-NC-2025-001",
  "title": "MET-NC-2025-001: Incorrect torque specification on assembly line",
  "description": "During final inspection, 15 units were found with incorrect torque values...",
  "priority": "High", // Low | Medium | High | Critical
  "dueDate": "2025-10-28T17:00:00Z",
  "assignee": {
    "name": "Jo Bloggs",
    "email": "jo.bloggs@company.com",
    "teamsUserId": null
  },
  "createdBy": {
    "name": "Chris Knill",
    "email": "chris@company.com"
  },
  "links": {
    "openInApp": "https://app.connectify.io/tenants/compliance-os/actions/MET-NC-2025-001",
    "sharepointFile": "https://tenant.sharepoint.com/sites/Docs/RA-12.pdf"
  },
  "idempotencyKey": "met-nc-2025-001-v1"
}
```

## Environment Variables

Set these environment variables in your `.env.local`:

```env
N8N_ACTION_WEBHOOK_URL=https://chrisknill.app.n8n.cloud/webhook-test/action-assigned
TENANT_ID=compliance-os
NEXTAUTH_URL=http://localhost:3000
```

## Usage Examples

### 1. Non-Conformance Cases

```typescript
import { ActionNotificationService } from '@/lib/action-notifications'

const service = new ActionNotificationService()

const actionData = ActionNotificationService.createNonConformanceAction(
  'MET-NC-2025-001',
  'Incorrect torque specification',
  'NC',
  'HIGH',
  new Date('2025-10-28'),
  {
    name: 'John Smith',
    email: 'john.smith@company.com',
    teamsUserId: null
  },
  {
    name: 'Chris Knill',
    email: 'chris@company.com'
  },
  'Problem statement here...',
  'https://app.com/nonconformance?id=123'
)

const result = await service.assignAction(actionData)
```

### 2. Risk Assessments

```typescript
const actionData = ActionNotificationService.createRiskAssessmentAction(
  'RA-2025-001',
  'COSHH Assessment for Bay 3',
  new Date('2025-10-28'),
  {
    name: 'Jane Doe',
    email: 'jane.doe@company.com',
    teamsUserId: null
  },
  {
    name: 'Safety Manager',
    email: 'safety@company.com'
  },
  'Complete COSHH assessment using template RA-12',
  'https://app.com/risk-assessment?id=123'
)

const result = await service.assignAction(actionData)
```

### 3. Training Assignments

```typescript
const actionData = ActionNotificationService.createTrainingAction(
  'TR-2025-001',
  'Fire Safety Training',
  new Date('2025-10-28'),
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    teamsUserId: null
  },
  {
    name: 'HR Manager',
    email: 'hr@company.com'
  },
  'Complete mandatory fire safety training module',
  'https://app.com/training?id=123'
)

const result = await service.assignAction(actionData)
```

### 4. Document Reviews

```typescript
const actionData = ActionNotificationService.createDocumentReviewAction(
  'DOC-2025-001',
  'Quality Policy Review',
  'POLICY',
  new Date('2025-10-28'),
  {
    name: 'Quality Manager',
    email: 'quality@company.com',
    teamsUserId: null
  },
  {
    name: 'Compliance Officer',
    email: 'compliance@company.com'
  },
  'Review and update quality policy document',
  'https://app.com/document?id=123'
)

const result = await service.assignAction(actionData)
```

### 5. Custom Actions

```typescript
const actionData = {
  source: 'HSE/Audit',
  actionId: 'AUD-2025-001',
  title: 'Complete internal audit checklist',
  description: 'Audit production area using checklist AUD-001',
  priority: 'High',
  dueDate: new Date('2025-10-28').toISOString(),
  assignee: {
    name: 'Auditor Name',
    email: 'auditor@company.com',
    teamsUserId: null
  },
  createdBy: {
    name: 'Audit Manager',
    email: 'audit@company.com'
  },
  links: {
    openInApp: 'https://app.com/audit?id=123',
    sharepointFile: 'https://tenant.sharepoint.com/sites/Docs/AUD-001.pdf'
  },
  idempotencyKey: 'aud-2025-001-v1'
}

const result = await service.assignAction(actionData)
```

## Integration Points

### Non-Conformance Page
- ✅ Already integrated
- Triggers when new case is created
- Uses case reference as action ID

### Risk Assessment Page
```typescript
// In your risk assessment API
import { ActionNotificationService } from '@/lib/action-notifications'

const service = new ActionNotificationService()
const actionData = ActionNotificationService.createRiskAssessmentAction(...)
await service.assignAction(actionData)
```

### Training Page
```typescript
// In your training API
import { ActionNotificationService } from '@/lib/action-notifications'

const service = new ActionNotificationService()
const actionData = ActionNotificationService.createTrainingAction(...)
await service.assignAction(actionData)
```

### Document Management
```typescript
// In your document API
import { ActionNotificationService } from '@/lib/action-notifications'

const service = new ActionNotificationService()
const actionData = ActionNotificationService.createDocumentReviewAction(...)
await service.assignAction(actionData)
```

## n8n Workflow Setup

Your n8n webhook should:

1. **Receive** the action assignment data
2. **Parse** the JSON payload
3. **Extract** assignee email and action details
4. **Send** email notification with action details
5. **Optionally** send Teams notification if `teamsUserId` is provided
6. **Log** the assignment for tracking

### Sample n8n Email Template

```html
<h2>New Action Assigned</h2>
<p><strong>Action:</strong> {{ $json.title }}</p>
<p><strong>Priority:</strong> {{ $json.priority }}</p>
<p><strong>Due Date:</strong> {{ $json.dueDate }}</p>
<p><strong>Description:</strong> {{ $json.description }}</p>
<p><strong>Assigned by:</strong> {{ $json.createdBy.name }}</p>
<p><strong>Source:</strong> {{ $json.source }}</p>

{{#if $json.links.openInApp}}
<p><a href="{{ $json.links.openInApp }}">Open in App</a></p>
{{/if}}

{{#if $json.links.sharepointFile}}
<p><a href="{{ $json.links.sharepointFile }}">View Document</a></p>
{{/if}}
```

## Error Handling

The service includes comprehensive error handling:

- **Network errors**: Logged and returned with user-friendly messages
- **Webhook failures**: Logged but don't fail the main operation
- **Validation errors**: Returned with specific error messages
- **Missing data**: Validated before sending

## Testing

Test the service by calling it from any page:

```typescript
import { assignActionAndNotify } from '@/lib/action-notifications'

const result = await assignActionAndNotify({
  source: 'TEST/Manual',
  actionId: 'TEST-001',
  title: 'Test Action',
  description: 'This is a test action',
  priority: 'Medium',
  dueDate: new Date().toISOString(),
  assignee: {
    name: 'Test User',
    email: 'test@company.com',
    teamsUserId: null
  },
  createdBy: {
    name: 'System',
    email: 'system@company.com'
  },
  idempotencyKey: 'test-001-v1'
})

console.log('Test result:', result)
```

## Benefits

1. **Centralized**: All action assignments go through one service
2. **Consistent**: Same data format across all pages
3. **Flexible**: Easy to add new action types
4. **Reliable**: Comprehensive error handling
5. **Trackable**: Idempotency keys prevent duplicates
6. **Extensible**: Easy to add new notification channels
