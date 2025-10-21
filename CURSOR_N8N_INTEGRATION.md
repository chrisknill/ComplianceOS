# 🚀 Cursor n8n Action Integration

This system allows you to create n8n actions directly from Cursor without copy-pasting between applications.

## Quick Start

### Method 1: Terminal Commands (Recommended)

Open Cursor's terminal and run:

```bash
# Create a non-conformance case
./cursor-action.sh nc "Safety Issue" "Fix safety guard" "High" "john@company.com" "John Doe"

# Create a risk assessment
./cursor-action.sh risk "COSHH Assessment" "Complete bay 3 assessment" "High" "jane@company.com" "Jane Smith"

# Create a training assignment
./cursor-action.sh training "Fire Safety" "Complete fire safety course" "Medium" "mike@company.com" "Mike Johnson"

# Create a document review
./cursor-action.sh review "Policy Review" "Review quality policy" "Medium" "sarah@company.com" "Sarah Wilson"

# Create a custom action
./cursor-action.sh action "Audit Checklist" "Complete audit checklist" "High" "auditor@company.com" "Auditor Name" "HSE/Audit"
```

### Method 2: API Calls

You can also call the API directly:

```bash
curl -X POST http://localhost:3000/api/cursor-action \
  -H "Content-Type: application/json" \
  -d '{"command": "nc \"Safety Issue\" \"Fix safety guard\" \"High\" \"john@company.com\" \"John Doe\""}'
```

### Method 3: Node.js Script

```bash
node cursor-action.js nc "Safety Issue" "Fix safety guard" "High" "john@company.com" "John Doe"
```

## Available Commands

| Command | Description | Parameters |
|---------|-------------|------------|
| `nc` | Non-conformance case | Title, Description, Priority, Email, Name, [Case Type], [Severity] |
| `risk` | Risk assessment | Title, Description, Priority, Email, Name |
| `training` | Training assignment | Title, Description, Priority, Email, Name |
| `review` | Document review | Title, Description, Priority, Email, Name, [Document Type] |
| `action` | Custom action | Title, Description, Priority, Email, Name, Source |

## Parameters

- **Priority**: Low, Medium, High, Critical
- **Case Types**: NC, CC, SNC, OFI
- **Severity**: LOW, MEDIUM, HIGH, CRITICAL
- **Document Types**: POLICY, PROCEDURE, WORK_INSTRUCTION, REGISTER

## Examples

### Non-Conformance Cases
```bash
# Basic non-conformance
./cursor-action.sh nc "Safety Issue" "Fix safety guard" "High" "john@company.com" "John Doe"

# With case type and severity
./cursor-action.sh nc "Customer Complaint" "Late delivery issue" "Medium" "jane@company.com" "Jane Smith" "CC" "MEDIUM"
```

### Risk Assessments
```bash
# COSHH assessment
./cursor-action.sh risk "COSHH Assessment" "Complete bay 3 assessment" "High" "safety@company.com" "Safety Manager"

# Hazard assessment
./cursor-action.sh hazard "Chemical Spill Risk" "Assess chemical storage area" "Critical" "hse@company.com" "HSE Manager"
```

### Training Assignments
```bash
# Fire safety training
./cursor-action.sh training "Fire Safety" "Complete fire safety course" "Medium" "mike@company.com" "Mike Johnson"

# Certification requirement
./cursor-action.sh certification "ISO 9001 Training" "Complete ISO 9001 awareness training" "High" "quality@company.com" "Quality Manager"
```

### Document Reviews
```bash
# Policy review
./cursor-action.sh policy "Quality Policy" "Review and update quality policy" "Medium" "compliance@company.com" "Compliance Officer"

# Procedure review
./cursor-action.sh procedure "Work Instruction" "Update assembly procedure" "Low" "production@company.com" "Production Manager"
```

### Custom Actions
```bash
# Audit action
./cursor-action.sh action "Internal Audit" "Complete internal audit checklist" "High" "auditor@company.com" "Internal Auditor" "HSE/Audit"

# Maintenance task
./cursor-action.sh task "Equipment Maintenance" "Schedule equipment maintenance" "Medium" "maintenance@company.com" "Maintenance Team" "Operations/Maintenance"
```

## What Happens When You Run a Command

1. **Command Parsing**: The system parses your command and extracts parameters
2. **Action Creation**: Creates a properly formatted action with unique ID
3. **n8n Webhook**: Sends the action to your n8n webhook URL
4. **Email Notification**: n8n triggers email notification to the assignee
5. **Confirmation**: You get confirmation with action ID and status

## Generated Action Format

The system automatically generates actions in this format:

```json
{
  "event": "action.assigned",
  "tenantId": "compliance-os",
  "source": "IMS/NC",
  "actionId": "MET-NC-2025-001",
  "title": "MET-NC-2025-001: Safety Issue",
  "description": "Fix safety guard",
  "priority": "High",
  "dueDate": "2025-10-28T17:00:00Z",
  "assignee": {
    "name": "John Doe",
    "email": "john@company.com",
    "teamsUserId": null
  },
  "createdBy": {
    "name": "Cursor User",
    "email": "cursor@company.com"
  },
  "links": {
    "openInApp": "http://localhost:3000/nonconformance?tab=NC"
  },
  "idempotencyKey": "met-nc-2025-001-v1"
}
```

## Environment Setup

Make sure these environment variables are set in your `.env.local`:

```env
N8N_ACTION_WEBHOOK_URL=https://chrisknill.app.n8n.cloud/webhook-test/action-assigned
TENANT_ID=compliance-os
NEXTAUTH_URL=http://localhost:3000
```

## Troubleshooting

### Command Not Found
```bash
# Make sure the script is executable
chmod +x cursor-action.sh

# Check if the script exists
ls -la cursor-action.sh
```

### API Connection Error
```bash
# Check if your server is running
curl http://localhost:3000/api/cursor-action

# Check environment variables
echo $N8N_ACTION_WEBHOOK_URL
```

### Webhook Error
- Check your n8n webhook URL
- Verify the webhook is active in n8n
- Check n8n logs for errors

## Benefits

✅ **No Copy-Paste**: Direct command execution from Cursor  
✅ **Consistent Format**: All actions follow the same structure  
✅ **Automatic IDs**: Unique action IDs generated automatically  
✅ **n8n Integration**: Direct webhook integration  
✅ **Email Notifications**: Automatic email notifications  
✅ **Error Handling**: Comprehensive error messages  
✅ **Multiple Methods**: Terminal, API, or Node.js scripts  

## Next Steps

1. **Test the Integration**: Try creating a test action
2. **Set Up n8n**: Configure your n8n webhook to receive actions
3. **Customize**: Modify the commands for your specific needs
4. **Automate**: Create shortcuts or aliases for common actions

Happy coding! 🚀
