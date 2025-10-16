'use client'

interface ManagementReview {
  id: string
  inputs: any[]
}

interface InputsTabProps {
  review: ManagementReview
  onUpdate: (review: ManagementReview) => void
}

export default function InputsTab({ review, onUpdate }: InputsTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Inputs Tab</h3>
        <p className="text-gray-600">This tab will show ISO 9.3.2 inputs with evidence linking.</p>
        <p className="text-sm text-gray-500 mt-2">
          {review.inputs.length} input items configured
        </p>
      </div>
    </div>
  )
}
