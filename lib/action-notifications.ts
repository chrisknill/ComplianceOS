interface Assignee {
  name: string
  email: string
  teamsUserId?: string | null
}

interface CreatedBy {
  name: string
  email: string
}

interface ActionLinks {
  openInApp?: string
  sharepointFile?: string
  documentUrl?: string
  caseUrl?: string
}

interface ActionAssignmentData {
  event: 'action.assigned'
  tenantId: string
  source: string // e.g. 'HSE/RiskAssessment', 'IMS/CorrectiveAction', 'HR/Mentoring', etc.
  actionId: string
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  dueDate: string // ISO 8601 format
  assignee: Assignee
  createdBy: CreatedBy
  links?: ActionLinks
  idempotencyKey: string // unique per assignment
}

interface NotificationResponse {
  success: boolean
  message: string
  webhookResponse?: any
}

/**
 * Centralized action assignment service
 * Sends action assignments to n8n webhook for email notifications
 */
export class ActionNotificationService {
  private webhookUrl: string
  private tenantId: string

  constructor(webhookUrl?: string, tenantId?: string) {
    this.webhookUrl = webhookUrl || process.env.N8N_ACTION_WEBHOOK_URL || 'https://chrisknill.app.n8n.cloud/webhook/action-assigned'
    this.tenantId = tenantId || process.env.TENANT_ID || 'compliance-os'
  }

  /**
   * Assign an action and notify the assignee
   */
  async assignAction(data: Omit<ActionAssignmentData, 'event' | 'tenantId'>): Promise<NotificationResponse> {
    try {
      const payload: ActionAssignmentData = {
        event: 'action.assigned',
        tenantId: this.tenantId,
        ...data
      }

      console.log('Sending action assignment to webhook:', this.webhookUrl)
      console.log('Payload:', payload)

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Action assignment webhook failed:', response.status, response.statusText, errorText)
        return {
          success: false,
          message: `Failed to send action assignment: ${response.status} ${response.statusText}`,
          webhookResponse: errorText
        }
      }

      const webhookResponse = await response.json()
      console.log('Action assignment sent successfully:', webhookResponse)

      return {
        success: true,
        message: 'Action assignment sent successfully',
        webhookResponse
      }

    } catch (error) {
      console.error('Error sending action assignment:', error)
      return {
        success: false,
        message: `Error sending action assignment: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Helper method to create action assignment data for non-conformance cases
   */
  static createNonConformanceAction(
    caseRef: string,
    caseTitle: string,
    caseType: string,
    severity: string,
    dueDate: Date,
    assignee: Assignee,
    createdBy: CreatedBy,
    problemStatement: string,
    caseUrl?: string
  ): Omit<ActionAssignmentData, 'event' | 'tenantId'> {
    const priorityMap: Record<string, 'Low' | 'Medium' | 'High' | 'Critical'> = {
      'LOW': 'Low',
      'MEDIUM': 'Medium', 
      'HIGH': 'High',
      'CRITICAL': 'Critical'
    }

    return {
      source: `IMS/${caseType}`,
      actionId: caseRef,
      title: `${caseRef}: ${caseTitle}`,
      description: problemStatement,
      priority: priorityMap[severity] || 'Medium',
      dueDate: dueDate.toISOString(),
      assignee,
      createdBy,
      links: {
        openInApp: caseUrl,
        caseUrl
      },
      idempotencyKey: `${caseRef.toLowerCase()}-v1`
    }
  }

  /**
   * Helper method to create action assignment data for risk assessments
   */
  static createRiskAssessmentAction(
    riskId: string,
    riskTitle: string,
    dueDate: Date,
    assignee: Assignee,
    createdBy: CreatedBy,
    description: string,
    riskUrl?: string
  ): Omit<ActionAssignmentData, 'event' | 'tenantId'> {
    return {
      source: 'HSE/RiskAssessment',
      actionId: riskId,
      title: `Complete risk assessment: ${riskTitle}`,
      description,
      priority: 'High',
      dueDate: dueDate.toISOString(),
      assignee,
      createdBy,
      links: {
        openInApp: riskUrl,
        documentUrl: riskUrl
      },
      idempotencyKey: `${riskId.toLowerCase()}-v1`
    }
  }

  /**
   * Helper method to create action assignment data for training
   */
  static createTrainingAction(
    trainingId: string,
    courseTitle: string,
    dueDate: Date,
    assignee: Assignee,
    createdBy: CreatedBy,
    description: string,
    trainingUrl?: string
  ): Omit<ActionAssignmentData, 'event' | 'tenantId'> {
    return {
      source: 'HR/Training',
      actionId: trainingId,
      title: `Complete training: ${courseTitle}`,
      description,
      priority: 'Medium',
      dueDate: dueDate.toISOString(),
      assignee,
      createdBy,
      links: {
        openInApp: trainingUrl,
        documentUrl: trainingUrl
      },
      idempotencyKey: `${trainingId.toLowerCase()}-v1`
    }
  }

  /**
   * Helper method to create action assignment data for document reviews
   */
  static createDocumentReviewAction(
    docId: string,
    docTitle: string,
    docType: string,
    dueDate: Date,
    assignee: Assignee,
    createdBy: CreatedBy,
    description: string,
    docUrl?: string
  ): Omit<ActionAssignmentData, 'event' | 'tenantId'> {
    return {
      source: `IMS/${docType}`,
      actionId: docId,
      title: `Review document: ${docTitle}`,
      description,
      priority: 'Medium',
      dueDate: dueDate.toISOString(),
      assignee,
      createdBy,
      links: {
        openInApp: docUrl,
        documentUrl: docUrl
      },
      idempotencyKey: `${docId.toLowerCase()}-v1`
    }
  }
}

// Export convenience function for easy usage
export async function assignActionAndNotify(
  data: Omit<ActionAssignmentData, 'event' | 'tenantId'>,
  webhookUrl?: string,
  tenantId?: string
): Promise<NotificationResponse> {
  const service = new ActionNotificationService(webhookUrl, tenantId)
  return service.assignAction(data)
}

// Export types for use in other files
export type { ActionAssignmentData, Assignee, CreatedBy, ActionLinks, NotificationResponse }
