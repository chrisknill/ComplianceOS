'use client'

interface ManagementReview {
  id: string
  outputs: any[]
}

interface OutputsTabProps {
  review: ManagementReview
  onUpdate: (review: ManagementReview) => void
}

export default function OutputsTab({ review, onUpdate }: OutputsTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Outputs & Decisions Tab</h3>
        <p className="text-gray-600">This tab will show ISO 9.3.3 outputs and decisions.</p>
        <p className="text-sm text-gray-500 mt-2">
          {review.outputs.length} output decisions configured
        </p>
      </div>
    </div>
  )
}
