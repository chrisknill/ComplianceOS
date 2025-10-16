'use client'

interface ManagementReview {
  id: string
  attendees: any[]
}

interface AttendeesTabProps {
  review: ManagementReview
  onUpdate: (review: ManagementReview) => void
}

export default function AttendeesTab({ review, onUpdate }: AttendeesTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Attendees Tab</h3>
        <p className="text-gray-600">This tab will show attendee management and digital signatures.</p>
        <p className="text-sm text-gray-500 mt-2">
          {review.attendees.length} attendees configured
        </p>
      </div>
    </div>
  )
}
