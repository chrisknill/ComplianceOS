'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  X, Edit, Download, Calendar, DollarSign, Building2, User, Mail, Phone, 
  FileText, AlertTriangle, Clock, CheckCircle, AlertCircle, AlertOctagon,
  History, Paperclip, Eye
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ContractReviewForm } from './ContractReviewForm'
import { toast } from 'sonner'
import { ContractReview } from '@/types/contract-review'
import { getStatusBadge, getPriorityBadge, getRiskBadge, formatCurrency } from '@/lib/contract-review-utils'

interface ContractReviewDetailViewProps {
  contractId: string
  onClose: () => void
}


export function ContractReviewDetailView({ contractId, onClose }: ContractReviewDetailViewProps) {
  const [contract, setContract] = useState<ContractReview | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    fetchContract()
  }, [contractId])

  const fetchContract = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/contract-review/${contractId}`, {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setContract(data)
      } else {
        toast.error('Failed to fetch contract details')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }


  const handleEditSubmit = () => {
    setShowEditForm(false)
    fetchContract()
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading contract details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-red-600">Contract not found</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </div>
    )
  }

  if (showEditForm) {
    return (
      <ContractReviewForm
        contractId={contractId}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleEditSubmit}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-semibold">{contract.contractTitle}</CardTitle>
            <p className="text-sm text-gray-600">Contract #{contract.contractNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditForm(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contract Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Contract Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contract Number</label>
                      <p className="text-sm">{contract.contractNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contract Type</label>
                      <p className="text-sm">{contract.contractType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">{getStatusBadge(contract.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priority</label>
                      <div className="mt-1">{getPriorityBadge(contract.priority)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Risk Level</label>
                      <div className="mt-1">{getRiskBadge(contract.riskLevel)}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Supplier Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Supplier Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Supplier Name</label>
                      <p className="text-sm">{contract.supplierName}</p>
                    </div>
                    {contract.supplierContact && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Contact Person</label>
                        <p className="text-sm">{contract.supplierContact}</p>
                      </div>
                    )}
                    {contract.supplierEmail && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-sm">{contract.supplierEmail}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Financial Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Financial Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contract Value</label>
                      <p className="text-sm font-medium">
                        {contract.value ? formatCurrency(contract.value, contract.currency) : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Currency</label>
                      <p className="text-sm">{contract.currency}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Important Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Important Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Start Date</label>
                      <p className="text-sm">{contract.startDate ? formatDate(contract.startDate) : 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">End Date</label>
                      <p className="text-sm">{contract.endDate ? formatDate(contract.endDate) : 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Renewal Date</label>
                      <p className="text-sm">{contract.renewalDate ? formatDate(contract.renewalDate) : 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Next Review Date</label>
                      <p className="text-sm">{contract.nextReviewDate ? formatDate(contract.nextReviewDate) : 'Not specified'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                {/* Comments */}
                {contract.comments && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{contract.comments}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Contract Terms */}
                {contract.terms && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contract Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{contract.terms}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Compliance Notes */}
                {contract.complianceNotes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compliance Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{contract.complianceNotes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Review Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Review Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Reviewer</label>
                      <p className="text-sm">{contract.reviewerName || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Review Date</label>
                      <p className="text-sm">{contract.reviewDate ? formatDate(contract.reviewDate) : 'Not reviewed'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approver</label>
                      <p className="text-sm">{contract.approverName || 'Not approved'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approval Date</label>
                      <p className="text-sm">{contract.approvalDate ? formatDate(contract.approvalDate) : 'Not approved'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contract.attachments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No attachments uploaded</p>
                  ) : (
                    <div className="space-y-3">
                      {contract.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{attachment.fileName}</p>
                              <p className="text-xs text-gray-500">
                                {attachment.fileType} • {attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}
                              </p>
                              {attachment.description && (
                                <p className="text-xs text-gray-600 mt-1">{attachment.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(attachment.uploadedAt)}
                            </span>
                            {attachment.fileUrl && (
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Activity History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contract.reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No activity history</p>
                  ) : (
                    <div className="space-y-4">
                      {contract.reviews.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{log.action}</span>
                              <span className="text-xs text-gray-500">
                                {formatDate(log.timestamp)}
                              </span>
                            </div>
                            {log.performedBy && (
                              <p className="text-xs text-gray-600">by {log.performedBy}</p>
                            )}
                            {log.comments && (
                              <p className="text-sm text-gray-700 mt-1">{log.comments}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
