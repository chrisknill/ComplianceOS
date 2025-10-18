export interface ContractAttachment {
  id: string
  contractId: string
  fileName: string
  fileType: string
  fileSize?: number
  fileUrl?: string
  uploadedBy?: string
  uploadedAt: Date
  description?: string
}

export interface ContractReviewLog {
  id: string
  contractId: string
  action: string
  performedBy?: string
  comments?: string
  timestamp: Date
}

export interface ContractReview {
  id: string
  contractNumber: string
  contractTitle: string
  contractType: ContractType
  supplierName: string
  supplierContact?: string
  supplierEmail?: string
  value?: number
  currency: Currency
  startDate?: Date
  endDate?: Date
  renewalDate?: Date
  status: ContractStatus
  priority: Priority
  riskLevel: RiskLevel
  reviewerId?: string
  reviewerName?: string
  reviewDate?: Date
  approvalDate?: Date
  approverId?: string
  approverName?: string
  comments?: string
  terms?: string
  complianceNotes?: string
  nextReviewDate?: Date
  createdAt: Date
  updatedAt: Date
  attachments: ContractAttachment[]
  reviews: ContractReviewLog[]
}

export type ContractType = 'SUPPLY' | 'SERVICE' | 'CONSULTING' | 'MAINTENANCE' | 'OTHER'
export type ContractStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'TERMINATED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'

export interface ContractReviewFormData {
  contractNumber: string
  contractTitle: string
  contractType: ContractType
  supplierName: string
  supplierContact: string
  supplierEmail: string
  value: string
  currency: Currency
  startDate: string
  endDate: string
  renewalDate: string
  priority: Priority
  riskLevel: RiskLevel
  reviewerName: string
  comments: string
  terms: string
  complianceNotes: string
  nextReviewDate: string
}

export interface ContractReviewFilters {
  search: string
  contractType: string
  status: string
  priority: string
  riskLevel: string
}

export interface ContractReviewSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface ContractReviewStats {
  totalContracts: number
  draftCount: number
  underReviewCount: number
  approvedCount: number
  expiredCount: number
  highPriorityCount: number
  highRiskCount: number
  totalValue: number
}
