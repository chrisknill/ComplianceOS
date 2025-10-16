'use client'

interface ManagementReview {
  id: string
  actions: any[]
}

interface ActionsTabProps {
  review: ManagementReview
  onUpdate: (review: ManagementReview) => void
}

export default function ActionsTab({ review, onUpdate }: ActionsTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Actions Tab</h3>
        <p className="text-gray-600">This tab will show embedded actions grid with inline editing.</p>
        <p className="text-sm text-gray-500 mt-2">
          {review.actions.length} actions configured
        </p>
      </div>
    </div>
  )
}
