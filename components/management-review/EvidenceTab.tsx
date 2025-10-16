'use client'

interface ManagementReview {
  id: string
  evidenceLinks: any[]
}

interface EvidenceTabProps {
  review: ManagementReview
  onUpdate: (review: ManagementReview) => void
}

export default function EvidenceTab({ review, onUpdate }: EvidenceTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Evidence Tab</h3>
        <p className="text-gray-600">This tab will show file management with preview and provenance.</p>
        <p className="text-sm text-gray-500 mt-2">
          {review.evidenceLinks.length} evidence items uploaded
        </p>
      </div>
    </div>
  )
}
