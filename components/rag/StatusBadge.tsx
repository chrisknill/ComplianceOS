import { getRAGColor, getRAGLabel, type RAGStatus } from '@/lib/rag'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: RAGStatus
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getRAGColor(status),
        className
      )}
    >
      {label || getRAGLabel(status)}
    </span>
  )
}

