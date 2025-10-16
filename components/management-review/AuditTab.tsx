'use client'

interface ManagementReview {
  id: string
  auditLog: any[]
}

interface AuditTabProps {
  review: ManagementReview
}

export default function AuditTab({ review }: AuditTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Trail Tab</h3>
        <p className="text-gray-600">This tab will show append-only audit log with exportable history.</p>
        <p className="text-sm text-gray-500 mt-2">
          {review.auditLog.length} audit entries recorded
        </p>
      </div>
    </div>
  )
}
