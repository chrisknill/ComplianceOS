import { z } from 'zod'

// Base schemas
export const reviewStatusSchema = z.enum(['DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'])

export const standardSchema = z.enum(['ISO9001', 'ISO14001', 'ISO45001'])

export const meetingTypeSchema = z.enum(['Quarterly', 'Annual', 'Extraordinary', 'Special'])

// Management Review schemas
export const createManagementReviewSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  scheduledAt: z.string().datetime('Invalid date format'),
  location: z.string().optional(),
  meetingType: meetingTypeSchema,
  standards: z.array(standardSchema).min(1, 'At least one standard must be selected'),
  agenda: z.string().optional(), // JSON string
})

export const updateManagementReviewSchema = createManagementReviewSchema.partial().extend({
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
  discussionNotes: z.string().optional(),
  status: reviewStatusSchema,
})

// Attendee schemas
export const createAttendeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional(),
  required: z.boolean().default(false),
  present: z.boolean().default(false),
  userId: z.string().optional(),
})

export const updateAttendeeSchema = createAttendeeSchema.partial().extend({
  signedOffAt: z.string().datetime().optional(),
  signature: z.string().optional(),
})

// Input schemas
export const createInputSchema = z.object({
  standard: standardSchema,
  clauseRef: z.string().min(1, 'Clause reference is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dataSource: z.string().optional(),
  evidence: z.string().optional(), // JSON string
  status: z.enum(['PENDING', 'PROVIDED', 'N/A']).default('PENDING'),
  remarks: z.string().optional(),
})

export const updateInputSchema = createInputSchema.partial()

// Output schemas
export const createOutputSchema = z.object({
  standard: standardSchema,
  clauseRef: z.string().min(1, 'Clause reference is required'),
  decision: z.string().min(1, 'Decision text is required'),
  type: z.enum(['Improvement Opportunity', 'Change Needed', 'Resource Need', 'Corrective Action', 'Strategy Impact', 'System Assessment']),
})

export const updateOutputSchema = createOutputSchema.partial()

// Action schemas
export const createActionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  ownerId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CLOSED']).default('OPEN'),
  linkage: z.string().optional(),
  actionId: z.string().optional(),
})

export const updateActionSchema = createActionSchema.partial()

// Evidence schemas
export const createEvidenceSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  url: z.string().url('Invalid URL format'),
  uploadedBy: z.string().optional(),
})

export const updateEvidenceSchema = createEvidenceSchema.partial()

// Template loading schema
export const loadTemplateSchema = z.object({
  standards: z.array(standardSchema).min(1, 'At least one standard must be selected'),
  includeExisting: z.boolean().default(false),
})

// Export schema
export const exportReviewSchema = z.object({
  format: z.enum(['PDF', 'DOCX', 'CSV']),
  includeCharts: z.boolean().default(true),
  includeAuditTrail: z.boolean().default(true),
})

// Status transition validation
export const statusTransitionSchema = z.object({
  fromStatus: reviewStatusSchema,
  toStatus: reviewStatusSchema,
}).refine((data) => {
  // Define valid transitions
  const validTransitions: Record<string, string[]> = {
    'DRAFT': ['SCHEDULED', 'DRAFT'],
    'SCHEDULED': ['IN_PROGRESS', 'DRAFT', 'SCHEDULED'],
    'IN_PROGRESS': ['COMPLETED', 'IN_PROGRESS'],
    'COMPLETED': ['CLOSED', 'IN_PROGRESS'],
    'CLOSED': ['CLOSED'], // No transitions from CLOSED
  }
  
  return validTransitions[data.fromStatus]?.includes(data.toStatus) ?? false
}, {
  message: 'Invalid status transition',
})

// Business rule validation schemas
export const completionValidationSchema = z.object({
  reviewId: z.string(),
}).refine(async (data) => {
  // This would be used in the API to validate completion requirements
  // For now, just return true - actual validation will be done in the API
  return true
}, {
  message: 'Review cannot be completed - requirements not met',
})

// Query schemas for filtering and searching
export const reviewQuerySchema = z.object({
  status: reviewStatusSchema.optional(),
  standards: z.array(standardSchema).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

// Type exports
export type ReviewStatus = z.infer<typeof reviewStatusSchema>
export type Standard = z.infer<typeof standardSchema>
export type MeetingType = z.infer<typeof meetingTypeSchema>
export type CreateManagementReview = z.infer<typeof createManagementReviewSchema>
export type UpdateManagementReview = z.infer<typeof updateManagementReviewSchema>
export type CreateAttendee = z.infer<typeof createAttendeeSchema>
export type UpdateAttendee = z.infer<typeof updateAttendeeSchema>
export type CreateInput = z.infer<typeof createInputSchema>
export type UpdateInput = z.infer<typeof updateInputSchema>
export type CreateOutput = z.infer<typeof createOutputSchema>
export type UpdateOutput = z.infer<typeof updateOutputSchema>
export type CreateAction = z.infer<typeof createActionSchema>
export type UpdateAction = z.infer<typeof updateActionSchema>
export type CreateEvidence = z.infer<typeof createEvidenceSchema>
export type UpdateEvidence = z.infer<typeof updateEvidenceSchema>
export type LoadTemplate = z.infer<typeof loadTemplateSchema>
export type ExportReview = z.infer<typeof exportReviewSchema>
export type StatusTransition = z.infer<typeof statusTransitionSchema>
export type ReviewQuery = z.infer<typeof reviewQuerySchema>
