import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for report generation
const reportRequestSchema = z.object({
  sections: z.array(z.string()),
  format: z.enum(['pdf', 'excel', 'csv', 'html']),
  dateRange: z.enum(['last7days', 'last30days', 'last90days', 'custom']),
  customStartDate: z.string().optional(),
  customEndDate: z.string().optional(),
  emailRecipients: z.array(z.string().email()).optional(),
  emailSubject: z.string().optional(),
  emailMessage: z.string().optional(),
  includeCharts: z.boolean().default(false),
  includeRawData: z.boolean().default(false),
  includeAuditTrail: z.boolean().default(false),
})

// POST /api/reports/generate - Generate a report
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = reportRequestSchema.parse(body)

    // Calculate date range
    let startDate: Date
    let endDate: Date = new Date()

    switch (validatedData.dateRange) {
      case 'last7days':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'last30days':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        break
      case 'last90days':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 90)
        break
      case 'custom':
        if (!validatedData.customStartDate || !validatedData.customEndDate) {
          return NextResponse.json({ error: 'Custom date range requires start and end dates' }, { status: 400 })
        }
        startDate = new Date(validatedData.customStartDate)
        endDate = new Date(validatedData.customEndDate)
        break
      default:
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
    }

    // Collect data based on selected sections
    const reportData: any = {
      metadata: {
        generatedBy: session.user.name || session.user.email,
        generatedAt: new Date().toISOString(),
        dateRange: { startDate, endDate },
        format: validatedData.format,
        sections: validatedData.sections,
      },
      data: {}
    }

    // Fetch data for each selected section (using only existing models)
    for (const section of validatedData.sections) {
      switch (section) {
        case 'dashboard-overview':
          reportData.data.dashboardOverview = await getDashboardOverview()
          break
        
        case 'employee-list':
          reportData.data.employees = await prisma.user.findMany({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          })
          break
        
        case 'equipment-list':
          reportData.data.equipment = await prisma.equipment.findMany({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          })
          break
        
        case 'calibration-records':
          reportData.data.calibrations = await prisma.calibration.findMany({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          })
          break
        
        case 'contract-reviews':
          reportData.data.contractReviews = await prisma.contractReview.findMany({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          })
          break
        
        case 'audit-reports':
          reportData.data.audits = await prisma.audit.findMany({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          })
          break
        
        // For sections that don't have corresponding models yet, return mock data
        case 'risk-assessments':
        case 'work-progress':
        case 'ohs-incidents':
        case 'ohs-actions':
        case 'ohs-contractors':
        case 'training-programs':
        case 'integration-status':
        case 'communication-logs':
          reportData.data[section] = [
            { id: '1', name: 'Sample Data', status: 'Active', createdAt: new Date() },
            { id: '2', name: 'Sample Data 2', status: 'Pending', createdAt: new Date() }
          ]
          break
      }
    }

    // Generate report based on format
    let reportContent: string
    let contentType: string
    let filename: string

    switch (validatedData.format) {
      case 'html':
        reportContent = generateHTMLReport(reportData, validatedData)
        contentType = 'text/html'
        filename = `complianceos-report-${new Date().toISOString().split('T')[0]}.html`
        break
      
      case 'csv':
        reportContent = generateCSVReport(reportData)
        contentType = 'text/csv'
        filename = `complianceos-report-${new Date().toISOString().split('T')[0]}.csv`
        break
      
      case 'excel':
        // For Excel, we'll return JSON data that can be converted to Excel on the frontend
        reportContent = JSON.stringify(reportData, null, 2)
        contentType = 'application/json'
        filename = `complianceos-report-${new Date().toISOString().split('T')[0]}.json`
        break
      
      case 'pdf':
        // For PDF, we'll return HTML that can be converted to PDF on the frontend
        reportContent = generateHTMLReport(reportData, validatedData)
        contentType = 'text/html'
        filename = `complianceos-report-${new Date().toISOString().split('T')[0]}.html`
        break
      
      default:
        reportContent = JSON.stringify(reportData, null, 2)
        contentType = 'application/json'
        filename = `complianceos-report-${new Date().toISOString().split('T')[0]}.json`
    }

    // If email recipients are provided, send the report
    if (validatedData.emailRecipients && validatedData.emailRecipients.length > 0) {
      await sendReportEmail({
        recipients: validatedData.emailRecipients,
        subject: validatedData.emailSubject || 'ComplianceOS Report',
        message: validatedData.emailMessage || 'Please find attached the requested compliance report.',
        reportContent,
        contentType,
        filename
      })
    }

    return NextResponse.json({
      success: true,
      reportContent,
      contentType,
      filename,
      metadata: reportData.metadata
    })

  } catch (error) {
    console.error('Error generating report:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

// Helper function to get dashboard overview data
async function getDashboardOverview() {
  const [
    totalUsers,
    totalEquipment,
    totalCalibrations,
    totalContracts,
    totalAudits
  ] = await Promise.all([
    prisma.user.count(),
    prisma.equipment.count(),
    prisma.calibration.count(),
    prisma.contractReview.count(),
    prisma.audit.count()
  ])

  return {
    totalUsers,
    totalEquipment,
    totalCalibrations,
    totalContracts,
    totalAudits
  }
}

// Helper function to generate HTML report
function generateHTMLReport(data: any, options: any): string {
  const { metadata, data: reportData } = data
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ComplianceOS Report - ${metadata.generatedAt.split('T')[0]}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
        .stat-number { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .stat-label { color: #64748b; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background-color: #f8fafc; font-weight: 600; color: #374151; }
        .footer { text-align: center; color: #64748b; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 ComplianceOS Report</h1>
            <p>Generated on ${new Date(metadata.generatedAt).toLocaleDateString()}</p>
            <p>Report Period: ${new Date(metadata.dateRange.startDate).toLocaleDateString()} - ${new Date(metadata.dateRange.endDate).toLocaleDateString()}</p>
        </div>

        ${Object.entries(reportData).map(([key, value]: [string, any]) => {
          if (!value || (Array.isArray(value) && value.length === 0)) return ''
          
          const sectionTitle = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
          
          return `
            <div class="section">
                <h2>${sectionTitle}</h2>
                ${Array.isArray(value) ? `
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${value.length}</div>
                            <div class="stat-label">Total Records</div>
                        </div>
                    </div>
                    ${value.length > 0 ? `
                        <table>
                            <thead>
                                <tr>
                                    ${Object.keys(value[0]).map(col => `<th>${col}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${value.slice(0, 10).map((item: any) => `
                                    <tr>
                                        ${Object.values(item).map(val => `<td>${val}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        ${value.length > 10 ? `<p><em>Showing first 10 of ${value.length} records</em></p>` : ''}
                    ` : '<p>No data available for this section.</p>'}
                ` : `
                    <div class="stats-grid">
                        ${Object.entries(value).map(([k, v]: [string, any]) => `
                            <div class="stat-card">
                                <div class="stat-number">${v}</div>
                                <div class="stat-label">${k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
          `
        }).join('')}

        <div class="footer">
            <p>This report was generated by ComplianceOS on ${new Date().toLocaleString()}</p>
            <p>Generated by: ${metadata.generatedBy}</p>
        </div>
    </div>
</body>
</html>
  `
}

// Helper function to generate CSV report
function generateCSVReport(data: any): string {
  const { metadata, data: reportData } = data
  let csv = `ComplianceOS Report,${metadata.generatedAt}\n`
  csv += `Generated By,${metadata.generatedBy}\n`
  csv += `Date Range,${metadata.dateRange.startDate} to ${metadata.dateRange.endDate}\n\n`

  Object.entries(reportData).forEach(([key, value]: [string, any]) => {
    csv += `${key}\n`
    if (Array.isArray(value) && value.length > 0) {
      const headers = Object.keys(value[0])
      csv += headers.join(',') + '\n'
      value.forEach((item: any) => {
        csv += headers.map(h => item[h] || '').join(',') + '\n'
      })
    }
    csv += '\n'
  })

  return csv
}

// Helper function to send report email
async function sendReportEmail({
  recipients,
  subject,
  message,
  reportContent,
  contentType,
  filename
}: {
  recipients: string[]
  subject: string
  message: string
  reportContent: string
  contentType: string
  filename: string
}) {
  // This would integrate with your email service (SendGrid, AWS SES, etc.)
  // For now, we'll just log the email details
  console.log('Sending report email:', {
    recipients,
    subject,
    message,
    filename,
    contentType
  })

  // In a real implementation, you would:
  // 1. Create an email template
  // 2. Attach the report file
  // 3. Send via your email service
  // 4. Log the email send event
}