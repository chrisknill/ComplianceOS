'use client'

interface ManagementReview {
  id: string
  discussionNotes?: string
}

interface DiscussionTabProps {
  review: ManagementReview
  onUpdate: (review: ManagementReview) => void
}

export default function DiscussionTab({ review, onUpdate }: DiscussionTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Discussion & Minutes Tab</h3>
        <p className="text-gray-600">This tab will show rich text editor for meeting minutes.</p>
        <p className="text-sm text-gray-500 mt-2">
          {review.discussionNotes ? 'Minutes have been added' : 'No minutes recorded yet'}
        </p>
      </div>
    </div>
  )
}
