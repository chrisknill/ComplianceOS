// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { Badge } from '@/components/ui/badge'

interface StatusChipProps {
  status: 'Draft' | 'Active' | 'Due' | 'Overdue' | 'Closed'
  size?: 'sm' | 'md' | 'lg'
}

export function StatusChip({ status, size = 'md' }: StatusChipProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Draft':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Draft'
        }
      case 'Active':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Active'
        }
      case 'Due':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Due'
        }
      case 'Overdue':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Overdue'
        }
      case 'Closed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Closed'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: status
        }
    }
  }

  const config = getStatusConfig(status)
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  }

  return (
    <Badge 
      className={`${config.color} ${sizeClasses[size]} border font-medium`}
    >
      {config.label}
    </Badge>
  )
}
