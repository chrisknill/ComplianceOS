interface CaseNotificationEmailData {
  to: string
  employeeName: string
  caseRef: string
  caseTitle: string
  caseType: string
  severity: string
  dueDate: string
  problemStatement: string
  raisedBy: string
}

export async function sendCaseNotificationEmail(data: CaseNotificationEmailData) {
  // For now, we'll use a simple email service or webhook
  // In production, you might use SendGrid, AWS SES, or similar
  
  const emailData = {
    to: data.to,
    subject: `New ${data.caseType} Case Assigned: ${data.caseRef}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">New Case Assignment</h2>
        
        <p>Hello ${data.employeeName},</p>
        
        <p>A new ${data.caseType} case has been assigned to you:</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">${data.caseRef}: ${data.caseTitle}</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Case Type:</td>
              <td style="padding: 8px 0;">${data.caseType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Severity:</td>
              <td style="padding: 8px 0;">${data.severity}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Due Date:</td>
              <td style="padding: 8px 0;">${data.dueDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Raised By:</td>
              <td style="padding: 8px 0;">${data.raisedBy}</td>
            </tr>
          </table>
          
          <h4 style="color: #374151; margin-top: 20px;">Problem Statement:</h4>
          <p style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #3b82f6;">
            ${data.problemStatement}
          </p>
        </div>
        
        <p>Please log into the ComplianceOS system to review and take action on this case.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated notification from ComplianceOS. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
    text: `
New Case Assignment

Hello ${data.employeeName},

A new ${data.caseType} case has been assigned to you:

${data.caseRef}: ${data.caseTitle}

Case Type: ${data.caseType}
Severity: ${data.severity}
Due Date: ${data.dueDate}
Raised By: ${data.raisedBy}

Problem Statement:
${data.problemStatement}

Please log into the ComplianceOS system to review and take action on this case.

This is an automated notification from ComplianceOS.
    `
  }

  // For now, we'll use a webhook approach similar to the testimonial system
  // You can replace this with your preferred email service
  try {
    const webhookUrl = process.env.EMAIL_WEBHOOK_URL || 'https://chrisknill.app.n8n.cloud/webhook-test/email-notification'
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'case_notification',
        timestamp: new Date().toISOString(),
        ...emailData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Email webhook failed: ${response.status}`)
    }

    console.log('Email notification sent successfully')
    return true
  } catch (error) {
    console.error('Failed to send email notification:', error)
    throw error
  }
}
