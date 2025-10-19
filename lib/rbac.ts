// CREATED: 2025-01-18 by Cursor – non-destructive scaffold

export type UserRole = 'admin' | 'manager' | 'auditor' | 'worker'

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
}

export interface Resource {
  id: string
  type: string
  ownerId?: string
}

// RBAC Helper Functions
export function canRead(user: User, resource: Resource): boolean {
  // Everyone can read
  return true
}

export function canEdit(user: User, resource: Resource): boolean {
  switch (user.role) {
    case 'admin':
    case 'manager':
      return true
    case 'auditor':
      return false // Read-only access
    case 'worker':
      // Workers can edit if they own the resource or it's a submission type
      return resource.ownerId === user.id || isSubmissionType(resource.type)
    default:
      return false
  }
}

export function canDelete(user: User, resource: Resource): boolean {
  switch (user.role) {
    case 'admin':
      return true
    case 'manager':
      return resource.ownerId === user.id || isManagerResource(resource.type)
    case 'auditor':
    case 'worker':
      return false
    default:
      return false
  }
}

export function canCreate(user: User, resourceType: string): boolean {
  switch (user.role) {
    case 'admin':
    case 'manager':
      return true
    case 'auditor':
      return false
    case 'worker':
      return isSubmissionType(resourceType)
    default:
      return false
  }
}

// Helper functions
function isSubmissionType(resourceType: string): boolean {
  const submissionTypes = [
    'incident',
    'nonconformity',
    'hazard',
    'near-miss',
    'improvement-opportunity'
  ]
  return submissionTypes.includes(resourceType.toLowerCase())
}

function isManagerResource(resourceType: string): boolean {
  const managerResources = [
    'audit',
    'management-review',
    'objective',
    'policy',
    'procedure'
  ]
  return managerResources.includes(resourceType.toLowerCase())
}

// Permission checking hooks (for use in components)
export function usePermissions(user: User) {
  return {
    canRead: (resource: Resource) => canRead(user, resource),
    canEdit: (resource: Resource) => canEdit(user, resource),
    canDelete: (resource: Resource) => canDelete(user, resource),
    canCreate: (resourceType: string) => canCreate(user, resourceType),
    isAdmin: user.role === 'admin',
    isManager: user.role === 'manager',
    isAuditor: user.role === 'auditor',
    isWorker: user.role === 'worker'
  }
}
