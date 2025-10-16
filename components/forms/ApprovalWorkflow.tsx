'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, FileSignature } from 'lucide-react'

interface ApprovalWorkflowProps {
  open: boolean
  onClose: () => void
  documentId: string
  documentTitle: string
  currentApprovals?: any[]
}

export function ApprovalWorkflow({ open, onClose, documentId, documentTitle, currentApprovals = [] }: ApprovalWorkflowProps) {
  const [approvalLevels, setApprovalLevels] = useState([
    { level: 1, role: 'Quality Manager', required: true },
    { level: 2, role: 'Operations Director', required: true },
    { level: 3, role: 'CEO/Managing Director', required: false },
  ])

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [signatureData, setSignatureData] = useState({
    approverName: '',
    comments: '',
    action: 'APPROVE' as 'APPROVE' | 'REJECT',
  })

  const getApprovalStatus = (level: number) => {
    const approval = currentApprovals.find(a => a.level === level)
    if (!approval) return 'PENDING'
    return approval.status
  }

  const getApproverName = (level: number) => {
    const approval = currentApprovals.find(a => a.level === level)
    return approval?.approverName || '-'
  }

  const handleSign = async () => {
    try {
      const levelData = approvalLevels.find(l => l.level === selectedLevel)
      
      const response = await fetch(`/api/documents/${documentId}/approvals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: selectedLevel,
          approverRole: levelData?.role,
          approverName: signatureData.approverName,
          status: signatureData.action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          comments: signatureData.comments,
        }),
      })

      if (!response.ok) throw new Error('Failed to sign document')

      alert(`Document ${signatureData.action === 'APPROVE' ? 'approved' : 'rejected'} at Level ${selectedLevel}!`)
      onClose()
      window.location.reload() // Refresh to show updated status
    } catch (error) {
      console.error('Error signing document:', error)
      alert('Failed to sign document. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Document Approval Workflow
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm font-medium text-slate-900">Document: {documentTitle}</p>
            <p className="text-xs text-slate-600 mt-1">ID: {documentId}</p>
          </div>

          {/* Approval Levels */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Approval Chain</h3>
            
            {approvalLevels.map((level) => {
              const status = getApprovalStatus(level.level)
              const approver = getApproverName(level.level)
              
              return (
                <div
                  key={level.level}
                  className={`border rounded-lg p-4 ${
                    selectedLevel === level.level ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold">
                        {level.level}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{level.role}</p>
                        <p className="text-xs text-slate-600">
                          {level.required ? 'Required' : 'Optional'} • Approver: {approver}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {status === 'APPROVED' && (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Approved</span>
                        </div>
                      )}
                      {status === 'REJECTED' && (
                        <div className="flex items-center gap-2 text-rose-600">
                          <XCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Rejected</span>
                        </div>
                      )}
                      {status === 'PENDING' && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Clock className="h-5 w-5" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                      )}

                      {status === 'PENDING' && (
                        <Button
                          size="sm"
                          variant={selectedLevel === level.level ? 'default' : 'outline'}
                          onClick={() => setSelectedLevel(level.level)}
                        >
                          Sign
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Show approval details if signed */}
                  {status !== 'PENDING' && currentApprovals.find(a => a.level === level.level) && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                      <p>Signed: {new Date(currentApprovals.find(a => a.level === level.level)?.signedAt).toLocaleString()}</p>
                      {currentApprovals.find(a => a.level === level.level)?.comments && (
                        <p className="mt-1">Comments: {currentApprovals.find(a => a.level === level.level)?.comments}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Signature Form */}
          {selectedLevel !== null && (
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Sign Document - Level {selectedLevel}</h3>
              
              <div>
                <Label htmlFor="approverName">Your Name *</Label>
                <Input
                  id="approverName"
                  value={signatureData.approverName}
                  onChange={(e) => setSignatureData({ ...signatureData, approverName: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="comments">Comments (optional)</Label>
                <Textarea
                  id="comments"
                  value={signatureData.comments}
                  onChange={(e) => setSignatureData({ ...signatureData, comments: e.target.value })}
                  placeholder="Any comments or conditions..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setSignatureData({ ...signatureData, action: 'APPROVE' })
                    handleSign()
                  }}
                  disabled={!signatureData.approverName}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Sign
                </Button>

                <Button
                  className="flex-1 bg-rose-600 hover:bg-rose-700"
                  onClick={() => {
                    setSignatureData({ ...signatureData, action: 'REJECT' })
                    handleSign()
                  }}
                  disabled={!signatureData.approverName}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                By signing, you confirm you have reviewed this document and {signatureData.action === 'APPROVE' ? 'approve' : 'reject'} it.
              </p>
            </div>
          )}

          {/* Approval Progress */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Approval Progress</span>
              <span className="font-semibold">
                {currentApprovals.filter(a => a.status === 'APPROVED').length} / {approvalLevels.filter(l => l.required).length} Required
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(currentApprovals.filter(a => a.status === 'APPROVED').length / approvalLevels.filter(l => l.required).length) * 100}%`
                }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ISO 9001:7.5.3 - Control of documented information requires approval
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

