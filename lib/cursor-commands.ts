/**
 * Cursor Command Interface for n8n Action Integration
 * Type commands in Cursor to automatically build and send actions to n8n
 */

import { ActionNotificationService } from '@/lib/action-notifications'

// Command interface for Cursor
export interface CursorCommand {
  command: string
  actionType: string
  data: any
}

// Available commands
export const CURSOR_COMMANDS = {
  // Non-conformance commands
  'nc': 'Create non-conformance case',
  'nonconformance': 'Create non-conformance case',
  'corrective': 'Create corrective action',
  
  // Risk assessment commands
  'risk': 'Create risk assessment action',
  'coshh': 'Create COSHH assessment',
  'hazard': 'Create hazard assessment',
  
  // Training commands
  'training': 'Create training assignment',
  'course': 'Create course assignment',
  'certification': 'Create certification requirement',
  
  // Document commands
  'review': 'Create document review',
  'policy': 'Create policy review',
  'procedure': 'Create procedure review',
  
  // Custom commands
  'action': 'Create custom action',
  'task': 'Create custom task',
  'reminder': 'Create reminder'
}

/**
 * Parse Cursor command and execute action
 * Usage: cursor-action nc "Title" "Description" "High" "john@company.com" "John Doe"
 */
export async function executeCursorCommand(commandString: string): Promise<{
  success: boolean
  message: string
  actionId?: string
  webhookResponse?: any
}> {
  try {
    // Parse command with proper quote handling - improved regex
    const parts = commandString.match(/(?:[^\s"]+|"[^"]*")+/g) || []
    
    if (parts.length === 0) {
      return {
        success: false,
        message: 'No command provided. Available commands: ' + Object.keys(CURSOR_COMMANDS).join(', ')
      }
    }
    
    const command = parts[0].replace(/"/g, '').trim().toLowerCase()
    
    if (!CURSOR_COMMANDS[command]) {
      return {
        success: false,
        message: `Unknown command: ${command}. Available commands: ${Object.keys(CURSOR_COMMANDS).join(', ')}`
      }
    }

    // Extract parameters (remove quotes and trim)
    const params = parts.slice(1).map(p => p.replace(/"/g, '').trim()).filter(p => p.length > 0)
    
    switch (command) {
      case 'nc':
      case 'nonconformance':
      case 'corrective':
        return await createNonConformanceAction(params)
      
      case 'risk':
      case 'coshh':
      case 'hazard':
        return await createRiskAssessmentAction(params)
      
      case 'training':
      case 'course':
      case 'certification':
        return await createTrainingAction(params)
      
      case 'review':
      case 'policy':
      case 'procedure':
        return await createDocumentReviewAction(params)
      
      case 'action':
      case 'task':
      case 'reminder':
        return await createCustomAction(params)
      
      default:
        return {
          success: false,
          message: `Command not implemented: ${command}`
        }
    }
  } catch (error) {
    return {
      success: false,
      message: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Create non-conformance action from command
 * Format: nc "Title" "Description" "Priority" "Assignee Email" "Assignee Name" "Case Type" "Severity"
 */
async function createNonConformanceAction(params: string[]): Promise<any> {
  if (params.length < 5) {
    return {
      success: false,
      message: 'Usage: nc "Title" "Description" "Priority" "Assignee Email" "Assignee Name" [Case Type] [Severity]'
    }
  }

  const [title, description, priority, assigneeEmail, assigneeName, caseType = 'NC', severity = 'MEDIUM'] = params
  
  const service = new ActionNotificationService()
  const actionData = ActionNotificationService.createNonConformanceAction(
    `MET-${caseType}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
    title,
    caseType,
    severity.toUpperCase(),
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    {
      name: 'Chris Knill',
      email: 'christopher.knill@gmail.com'
    },
    description,
    `${process.env.NEXTAUTH_URL}/nonconformance?tab=${caseType}`
  )

  const result = await service.assignAction(actionData)
  return {
    ...result,
    actionId: actionData.actionId
  }
}

/**
 * Create risk assessment action from command
 * Format: risk "Title" "Description" "Priority" "Assignee Email" "Assignee Name"
 */
async function createRiskAssessmentAction(params: string[]): Promise<any> {
  if (params.length < 5) {
    return {
      success: false,
      message: 'Usage: risk "Title" "Description" "Priority" "Assignee Email" "Assignee Name"'
    }
  }

  const [title, description, priority, assigneeEmail, assigneeName] = params
  
  const service = new ActionNotificationService()
  const actionData = ActionNotificationService.createRiskAssessmentAction(
    `RA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
    title,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    {
      name: 'Chris Knill',
      email: 'christopher.knill@gmail.com'
    },
    description,
    `${process.env.NEXTAUTH_URL}/risk`
  )

  const result = await service.assignAction(actionData)
  return {
    ...result,
    actionId: actionData.actionId
  }
}

/**
 * Create training action from command
 * Format: training "Title" "Description" "Priority" "Assignee Email" "Assignee Name"
 */
async function createTrainingAction(params: string[]): Promise<any> {
  if (params.length < 5) {
    return {
      success: false,
      message: 'Usage: training "Title" "Description" "Priority" "Assignee Email" "Assignee Name"'
    }
  }

  const [title, description, priority, assigneeEmail, assigneeName] = params
  
  const service = new ActionNotificationService()
  const actionData = ActionNotificationService.createTrainingAction(
    `TR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
    title,
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    {
      name: 'Chris Knill',
      email: 'christopher.knill@gmail.com'
    },
    description,
    `${process.env.NEXTAUTH_URL}/training`
  )

  const result = await service.assignAction(actionData)
  return {
    ...result,
    actionId: actionData.actionId
  }
}

/**
 * Create document review action from command
 * Format: review "Title" "Description" "Priority" "Assignee Email" "Assignee Name" "Document Type"
 */
async function createDocumentReviewAction(params: string[]): Promise<any> {
  if (params.length < 5) {
    return {
      success: false,
      message: 'Usage: review "Title" "Description" "Priority" "Assignee Email" "Assignee Name" [Document Type]'
    }
  }

  const [title, description, priority, assigneeEmail, assigneeName, docType = 'DOCUMENT'] = params
  
  const service = new ActionNotificationService()
  const actionData = ActionNotificationService.createDocumentReviewAction(
    `DOC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
    title,
    docType,
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    {
      name: 'Chris Knill',
      email: 'christopher.knill@gmail.com'
    },
    description,
    `${process.env.NEXTAUTH_URL}/documentation`
  )

  const result = await service.assignAction(actionData)
  return {
    ...result,
    actionId: actionData.actionId
  }
}

/**
 * Create custom action from command
 * Format: action "Title" "Description" "Priority" "Assignee Email" "Assignee Name" "Source"
 */
async function createCustomAction(params: string[]): Promise<any> {
  if (params.length < 6) {
    return {
      success: false,
      message: 'Usage: action "Title" "Description" "Priority" "Assignee Email" "Assignee Name" "Source"'
    }
  }

  const [title, description, priority, assigneeEmail, assigneeName, source] = params
  
  const service = new ActionNotificationService()
  const actionData = {
    source,
    actionId: `ACT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
    title,
    description,
    priority: priority as 'Low' | 'Medium' | 'High' | 'Critical',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    assignee: {
      name: assigneeName,
      email: assigneeEmail,
      teamsUserId: null
    },
    createdBy: {
      name: 'Cursor User',
      email: 'cursor@company.com'
    },
    links: {
      openInApp: `${process.env.NEXTAUTH_URL}/actions`
    },
    idempotencyKey: `act-${Date.now()}-v1`
  }

  const result = await service.assignAction(actionData)
  return {
    ...result,
    actionId: actionData.actionId
  }
}

/**
 * Get help for available commands
 */
export function getCursorCommandHelp(): string {
  return `
Available Cursor Commands for n8n Integration:

1. NON-CONFORMANCE ACTIONS:
   nc "Title" "Description" "Priority" "Email" "Name" [Case Type] [Severity]
   Example: nc "Safety Issue" "Fix safety guard" "High" "john@company.com" "John Doe" "NC" "HIGH"

2. RISK ASSESSMENTS:
   risk "Title" "Description" "Priority" "Email" "Name"
   Example: risk "COSHH Assessment" "Complete bay 3 assessment" "High" "jane@company.com" "Jane Smith"

3. TRAINING ASSIGNMENTS:
   training "Title" "Description" "Priority" "Email" "Name"
   Example: training "Fire Safety" "Complete fire safety course" "Medium" "mike@company.com" "Mike Johnson"

4. DOCUMENT REVIEWS:
   review "Title" "Description" "Priority" "Email" "Name" [Document Type]
   Example: review "Policy Review" "Review quality policy" "Medium" "sarah@company.com" "Sarah Wilson" "POLICY"

5. CUSTOM ACTIONS:
   action "Title" "Description" "Priority" "Email" "Name" "Source"
   Example: action "Audit Checklist" "Complete audit checklist" "High" "auditor@company.com" "Auditor Name" "HSE/Audit"

Priority Options: Low, Medium, High, Critical
Case Types: NC, CC, SNC, OFI
Severity: LOW, MEDIUM, HIGH, CRITICAL
Document Types: POLICY, PROCEDURE, WORK_INSTRUCTION, REGISTER

All commands automatically:
- Generate unique action IDs
- Set appropriate due dates
- Send to n8n webhook
- Include proper links and metadata
`
}

// Export for easy access
export { executeCursorCommand as cursorAction }
