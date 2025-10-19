# n8n Integration Configuration

## Environment Variables

Add these to your `.env.local` file:

```bash
# Database
DATABASE_URL="file:./prisma/app.db"

# n8n Webhook URL - Replace with your actual n8n webhook URL
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/testimonial"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## n8n Flow Setup

### Step 1: Create Webhook Trigger
1. Add a **Webhook** node to your n8n flow
2. Configure:
   - **HTTP Method**: POST
   - **Path**: `/testimonial` (or your preferred path)
   - **Response Mode**: "Respond to Webhook"

### Step 2: Test the Connection
Use the test form at: http://localhost:3000/test-webhook.html

### Step 3: Process the Data
Add processing nodes after the webhook to:
- Send emails
- Update CRM systems
- Create notifications
- Store in other databases

## Testing URLs

- **Test Form**: http://localhost:3000/test-webhook.html
- **API Endpoint**: http://localhost:3000/api/customer-satisfaction/testimonials/webhook
- **Customer Satisfaction Page**: http://localhost:3000/customer-satisfaction
