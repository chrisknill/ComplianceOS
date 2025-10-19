// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, AlertCircle } from 'lucide-react'

interface ActionsPanelProps {
  owner?: string
  status?: 'Draft' | 'Active' | 'Due' | 'Overdue' | 'Closed'
  nextReviewAt?: Date
  onAssignOwner?: () => void
  onUpdateStatus?: () => void
  onScheduleReview?: () => void
}

export function ActionsPanel({ 
  owner, 
  status = 'Draft', 
  nextReviewAt,
  onAssignOwner,
  onUpdateStatus,
  onScheduleReview 
}: ActionsPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Due': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      case 'Closed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
      <h3 className="font-semibold text-slate-900">Actions</h3>
      
      {/* Owner */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Owner</label>
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-600">
            {owner || 'Unassigned'}
          </span>
          <Button variant="outline" size="sm" onClick={onAssignOwner}>
            Assign
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Status</label>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
          <Button variant="outline" size="sm" onClick={onUpdateStatus}>
            Update
          </Button>
        </div>
      </div>

      {/* Next Review */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Next Review</label>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-600">
            {nextReviewAt ? nextReviewAt.toLocaleDateString() : 'Not scheduled'}
          </span>
          <Button variant="outline" size="sm" onClick={onScheduleReview}>
            Schedule
          </Button>
        </div>
      </div>

      {/* SharePoint Integration Placeholder */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <AlertCircle className="h-4 w-4" />
          <span>Connect SharePoint for file management</span>
        </div>
      </div>
    </div>
  )
}
