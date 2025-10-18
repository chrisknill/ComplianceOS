import { ContractReview, ContractStatus, Priority, RiskLevel, Currency } from '@/types/contract-review'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, Clock, CheckCircle, AlertCircle, AlertTriangle, AlertOctagon 
} from 'lucide-react'

export const getStatusBadge = (status: ContractStatus) => {
  const statusConfig = {
    DRAFT: { color: 'bg-gray-100 text-gray-800', icon: FileText },
    UNDER_REVIEW: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    REJECTED: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
    EXPIRED: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
    TERMINATED: { color: 'bg-gray-100 text-gray-800', icon: AlertOctagon },
  }
  const config = statusConfig[status] || statusConfig.DRAFT
  const Icon = config.icon
  return (
    <Badge className={config.color}>
      <Icon className="h-3 w-3 mr-1" />
      {status.replace('_', ' ')}
    </Badge>
  )
}

export const getPriorityBadge = (priority: Priority) => {
  const priorityConfig = {
    LOW: { color: 'bg-green-100 text-green-800' },
    MEDIUM: { color: 'bg-yellow-100 text-yellow-800' },
    HIGH: { color: 'bg-orange-100 text-orange-800' },
    CRITICAL: { color: 'bg-red-100 text-red-800' },
  }
  const config = priorityConfig[priority] || priorityConfig.MEDIUM
  return <Badge className={config.color}>{priority}</Badge>
}

export const getRiskBadge = (riskLevel: RiskLevel) => {
  const riskConfig = {
    LOW: { color: 'bg-green-100 text-green-800' },
    MEDIUM: { color: 'bg-yellow-100 text-yellow-800' },
    HIGH: { color: 'bg-orange-100 text-orange-800' },
    CRITICAL: { color: 'bg-red-100 text-red-800' },
  }
  const config = riskConfig[riskLevel] || riskConfig.MEDIUM
  return <Badge className={config.color}>{riskLevel}</Badge>
}

export const formatCurrency = (value: number, currency: Currency): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value)
}

export const getContractTypeOptions = () => [
  { value: 'SUPPLY', label: 'Supply' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'CONSULTING', label: 'Consulting' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OTHER', label: 'Other' },
]

export const getStatusOptions = () => [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'TERMINATED', label: 'Terminated' },
]

export const getPriorityOptions = () => [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
]

export const getRiskLevelOptions = () => [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
]

export const getCurrencyOptions = () => [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'CAD', label: 'CAD' },
  { value: 'AUD', label: 'AUD' },
]

export const validateContractForm = (data: Partial<ContractReview>): string[] => {
  const errors: string[] = []
  
  if (!data.contractNumber?.trim()) {
    errors.push('Contract number is required')
  }
  
  if (!data.contractTitle?.trim()) {
    errors.push('Contract title is required')
  }
  
  if (!data.supplierName?.trim()) {
    errors.push('Supplier name is required')
  }
  
  if (data.supplierEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.supplierEmail)) {
    errors.push('Invalid email format')
  }
  
  if (data.value && data.value < 0) {
    errors.push('Contract value cannot be negative')
  }
  
  return errors
}

export const getContractStatusColor = (status: ContractStatus): string => {
  const colors = {
    DRAFT: 'text-gray-600',
    UNDER_REVIEW: 'text-yellow-600',
    APPROVED: 'text-green-600',
    REJECTED: 'text-red-600',
    EXPIRED: 'text-orange-600',
    TERMINATED: 'text-gray-600',
  }
  return colors[status] || colors.DRAFT
}

export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600',
  }
  return colors[priority] || colors.MEDIUM
}

export const getRiskLevelColor = (riskLevel: RiskLevel): string => {
  const colors = {
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600',
  }
  return colors[riskLevel] || colors.MEDIUM
}
