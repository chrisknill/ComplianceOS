/**
 * Example usage of the ActionNotificationService
 * This file demonstrates how to use the centralized action assignment service
 * across different pages in your application
 */

import { ActionNotificationService, assignActionAndNotify } from '@/lib/action-notifications'

// Example 1: Non-Conformance Case Assignment
export async function assignNonConformanceCase(
  caseRef: string,
  caseTitle: string,
  caseType: string,
  severity: string,
  dueDate: Date,
  assigneeEmail: string,
  assigneeName: string,
  createdByName: string,
  createdByEmail: string,
  problemStatement: string,
  caseUrl?: string
) {
  const actionData = ActionNotificationService.createNonConformanceAction(
    caseRef,
    caseTitle,
    caseType,
    severity,
    dueDate,
    {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    {
      name: createdByName,
      email: createdByEmail
    },
    problemStatement,
    caseUrl
  )

  return await assignActionAndNotify(actionData)
}

// Example 2: Risk Assessment Assignment
export async function assignRiskAssessment(
  riskId: string,
  riskTitle: string,
  dueDate: Date,
  assigneeEmail: string,
  assigneeName: string,
  createdByName: string,
  createdByEmail: string,
  description: string,
  riskUrl?: string
) {
  const actionData = ActionNotificationService.createRiskAssessmentAction(
    riskId,
    riskTitle,
    dueDate,
    {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    {
      name: createdByName,
      email: createdByEmail
    },
    description,
    riskUrl
  )

  return await assignActionAndNotify(actionData)
}

// Example 3: Training Assignment
export async function assignTraining(
  trainingId: string,
  courseTitle: string,
  dueDate: Date,
  assigneeEmail: string,
  assigneeName: string,
  createdByName: string,
  createdByEmail: string,
  description: string,
  trainingUrl?: string
) {
  const actionData = ActionNotificationService.createTrainingAction(
    trainingId,
    courseTitle,
    dueDate,
    {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    {
      name: createdByName,
      email: createdByEmail
    },
    description,
    trainingUrl
  )

  return await assignActionAndNotify(actionData)
}

// Example 4: Document Review Assignment
export async function assignDocumentReview(
  docId: string,
  docTitle: string,
  docType: string,
  dueDate: Date,
  assigneeEmail: string,
  assigneeName: string,
  createdByName: string,
  createdByEmail: string,
  description: string,
  docUrl?: string
) {
  const actionData = ActionNotificationService.createDocumentReviewAction(
    docId,
    docTitle,
    docType,
    dueDate,
    {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    {
      name: createdByName,
      email: createdByEmail
    },
    description,
    docUrl
  )

  return await assignActionAndNotify(actionData)
}

// Example 5: Custom Action Assignment
export async function assignCustomAction(
  actionId: string,
  title: string,
  description: string,
  priority: 'Low' | 'Medium' | 'High' | 'Critical',
  dueDate: Date,
  assigneeEmail: string,
  assigneeName: string,
  createdByName: string,
  createdByEmail: string,
  source: string,
  links?: {
    openInApp?: string
    sharepointFile?: string
    documentUrl?: string
    caseUrl?: string
  }
) {
  const actionData = {
    source,
    actionId,
    title,
    description,
    priority,
    dueDate: dueDate.toISOString(),
    assignee: {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    createdBy: {
      name: createdByName,
      email: createdByEmail
    },
    links,
    idempotencyKey: `${actionId.toLowerCase()}-v1`
  }

  return await assignActionAndNotify(actionData)
}

// Example 6: Using in a React component
export function useActionAssignment() {
  const assignAction = async (
    actionId: string,
    title: string,
    description: string,
    priority: 'Low' | 'Medium' | 'High' | 'Critical',
    dueDate: Date,
    assigneeEmail: string,
    assigneeName: string,
    source: string,
    links?: any
  ) => {
    try {
      const result = await assignCustomAction(
        actionId,
        title,
        description,
        priority,
        dueDate,
        assigneeEmail,
        assigneeName,
        'Current User', // You can get this from session
        'user@company.com', // You can get this from session
        source,
        links
      )

      if (result.success) {
        console.log('Action assigned successfully')
        return { success: true, message: 'Action assigned successfully' }
      } else {
        console.error('Failed to assign action:', result.message)
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('Error assigning action:', error)
      return { success: false, message: 'Failed to assign action' }
    }
  }

  return { assignAction }
}
