'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { 
  FileText, Users, CheckSquare, MessageSquare, History, 
  AlertCircle, Calendar, DollarSign, FileSignature 
} from 'lucide-react'

interface NCDetailViewProps {
  open: boolean
  onClose: () => void
  recordId: string
  onUpdate: () => void
}

interface NonConformance {
  id: string
  refNumber: string
  caseType: string
  title: string
  raisedBy: string
  dateRaised: Date
  process: string | null
  area: string | null
  department: string | null
  category: string
  severity: string
  riskImpact: string
  evidence: string | null
  linkedItems: string | null
  problemStatement: string
  status: string
  owner: string | null
  approver: string | null
  dueDate: Date | null
  closedDate: Date | null
  
  // Investigation
  investigationNotes: string | null
  rootCauseTool: string | null
  rootCauseOutput: string | null
  escapePoint: string | null
  verificationMethod: string | null
  
  // Costs
  scrapHours: number | null
  reworkHours: number | null
  materialCost: number | null
  customerCredit: number | null
  downtimeHours: number | null
  
  // Conditional fields
  customerName: string | null
  customerContact: string | null
  complaintChannel: string | null
  externalRef: string | null
  contractualImpact: boolean
  responseDueDate: Date | null
  
  supplierName: string | null
  supplierContact: string | null
  poReference: string | null
  warrantyClause: string | null
  request8D: boolean
  
  detectionPoint: string | null
  scrapRework: boolean
  containmentNeeded: boolean
  
  expectedBenefit: string | null
  effortEstimate: string | null
  suggestedOwner: string | null
  
  // Standards
  iso9001Clause: string | null
  iso14001Clause: string | null
  iso45001Clause: string | null
  
  // Communications
  communications: string | null
  
  // Closure
  closureSignature: string | null
  closureApprovedBy: string | null
  closureApprovedAt: Date | null
  closureComments: string | null
  
  actions: NCAction[]
  auditLogs: NCAuditLog[]
}

interface NCAction {
  id: string
  actionType: string
  title: string
  description: string | null
  owner: string | null
  dueDate: Date | null
  priority: string
  status: string
  completedDate: Date | null
  evidence: string | null
  checklist: string | null
}

interface NCAuditLog {
  id: string
  eventType: string
  description: string
  userId: string
  userName: string | null
  createdAt: Date
}

export function NCDetailView({ open, onClose, recordId, onUpdate }: NCDetailViewProps) {
  const [record, setRecord] = useState<NonConformance | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    if (open && recordId) {
      loadRecord()
    }
  }, [open, recordId])

  const loadRecord = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/nonconformance/${recordId}`)
      if (!response.ok) throw new Error('Failed to load')
      const data = await response.json()
      setRecord(data)
    } catch (error) {
      console.error('Error loading record:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCaseTypeColor = (type: string): string => {
    switch (type) {
      case 'OFI': return 'bg-emerald-100 text-emerald-700 border-emerald-300'
      case 'NC': return 'bg-rose-100 text-rose-700 border-rose-300'
      case 'CC': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'SNC': return 'bg-purple-100 text-purple-700 border-purple-300'
      default: return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-600 text-white'
      case 'HIGH': return 'bg-orange-500 text-white'
      case 'MEDIUM': return 'bg-amber-500 text-white'
      case 'LOW': return 'bg-blue-500 text-white'
      default: return 'bg-slate-500 text-white'
    }
  }

  const getActionStatusColor = (status: string): string => {
    switch (status) {
      case 'DONE': return 'bg-emerald-100 text-emerald-700'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700'
      case 'BLOCKED': return 'bg-rose-100 text-rose-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading || !record) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500">Loading record details...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const riskImpacts = record.riskImpact ? JSON.parse(record.riskImpact) : []
  const totalCost = (record.scrapHours || 0) * 50 + 
                    (record.reworkHours || 0) * 50 + 
                    (record.materialCost || 0) + 
                    (record.customerCredit || 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{record.refNumber}</DialogTitle>
              <p className="text-slate-600 mt-1">{record.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getCaseTypeColor(record.caseType)}`}>
                {record.caseType}
              </span>
              <span className={`px-3 py-1 rounded-md text-sm font-medium ${getSeverityColor(record.severity)}`}>
                {record.severity}
              </span>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">
              <FileText className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="investigation">
              <AlertCircle className="h-4 w-4 mr-2" />
              Investigation
            </TabsTrigger>
            <TabsTrigger value="actions">
              <CheckSquare className="h-4 w-4 mr-2" />
              Actions ({record.actions.length})
            </TabsTrigger>
            <TabsTrigger value="communications">
              <MessageSquare className="h-4 w-4 mr-2" />
              Communications
            </TabsTrigger>
            <TabsTrigger value="audit">
              <History className="h-4 w-4 mr-2" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Raised By</h3>
                  <p className="text-slate-900 mt-1">{record.raisedBy}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Date Raised</h3>
                  <p className="text-slate-900 mt-1">{formatDate(record.dateRaised)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Owner</h3>
                  <p className="text-slate-900 mt-1">{record.owner || 'Unassigned'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Due Date</h3>
                  <p className="text-slate-900 mt-1">
                    {record.dueDate ? formatDate(record.dueDate) : 'Not set'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Status</h3>
                  <Badge className="mt-1">{record.status.replace(/_/g, ' ')}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Process / Area</h3>
                  <p className="text-slate-900 mt-1">
                    {record.process || 'N/A'} / {record.area || 'N/A'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Department</h3>
                  <p className="text-slate-900 mt-1">{record.department || 'N/A'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Category</h3>
                  <p className="text-slate-900 mt-1">{record.category}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Risk Impact</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {riskImpacts.map((impact: string) => (
                      <Badge key={impact} variant="outline">{impact}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500">Problem Statement</h3>
              <p className="text-slate-900 mt-2 whitespace-pre-wrap">{record.problemStatement}</p>
            </div>

            {/* Conditional Fields Based on Case Type */}
            {record.caseType === 'CC' && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Complaint Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">Customer</h4>
                    <p className="text-slate-900 mt-1">{record.customerName}</p>
                    <p className="text-sm text-slate-600">{record.customerContact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">Channel / Ref</h4>
                    <p className="text-slate-900 mt-1">{record.complaintChannel}</p>
                    <p className="text-sm text-slate-600">{record.externalRef}</p>
                  </div>
                  {record.responseDueDate && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Response Due</h4>
                      <p className="text-slate-900 mt-1">{formatDate(record.responseDueDate)}</p>
                    </div>
                  )}
                  {record.contractualImpact && (
                    <div className="col-span-2">
                      <Badge variant="destructive">Contractual Impact</Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {record.caseType === 'SNC' && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Supplier Non-Conformance Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">Supplier</h4>
                    <p className="text-slate-900 mt-1">{record.supplierName}</p>
                    <p className="text-sm text-slate-600">{record.supplierContact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">PO Reference</h4>
                    <p className="text-slate-900 mt-1">{record.poReference || 'N/A'}</p>
                  </div>
                  {record.warrantyClause && (
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-slate-500">Warranty Clause</h4>
                      <p className="text-slate-900 mt-1">{record.warrantyClause}</p>
                    </div>
                  )}
                  {record.request8D && (
                    <div className="col-span-2">
                      <Badge variant="outline">8D Report Requested</Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {record.caseType === 'NC' && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Internal NC Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  {record.detectionPoint && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Detection Point</h4>
                      <p className="text-slate-900 mt-1">{record.detectionPoint}</p>
                    </div>
                  )}
                  {record.scrapRework && (
                    <div>
                      <Badge variant="destructive">Scrap / Rework Required</Badge>
                    </div>
                  )}
                  {record.containmentNeeded && (
                    <div>
                      <Badge variant="destructive">Containment Needed</Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {record.caseType === 'OFI' && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Improvement Opportunity Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  {record.expectedBenefit && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Expected Benefit</h4>
                      <p className="text-slate-900 mt-1">{record.expectedBenefit}</p>
                    </div>
                  )}
                  {record.effortEstimate && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Effort Estimate</h4>
                      <Badge>{record.effortEstimate}</Badge>
                    </div>
                  )}
                  {record.suggestedOwner && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Suggested Owner</h4>
                      <p className="text-slate-900 mt-1">{record.suggestedOwner}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cost Impact */}
            {totalCost > 0 && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Impact
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {record.scrapHours && record.scrapHours > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Scrap Hours</h4>
                      <p className="text-slate-900 mt-1">{record.scrapHours} hrs (${record.scrapHours * 50})</p>
                    </div>
                  )}
                  {record.reworkHours && record.reworkHours > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Rework Hours</h4>
                      <p className="text-slate-900 mt-1">{record.reworkHours} hrs (${record.reworkHours * 50})</p>
                    </div>
                  )}
                  {record.materialCost && record.materialCost > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Material Cost</h4>
                      <p className="text-slate-900 mt-1">${record.materialCost}</p>
                    </div>
                  )}
                  {record.customerCredit && record.customerCredit > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Customer Credit</h4>
                      <p className="text-slate-900 mt-1">${record.customerCredit}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <p className="text-lg font-semibold text-slate-900">
                    Total Cost Impact: <span className="text-rose-600">${totalCost.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            )}

            {/* ISO References */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-medium text-slate-500 mb-2">ISO Standard References</h3>
              <div className="flex flex-wrap gap-2">
                {record.iso9001Clause && JSON.parse(record.iso9001Clause).map((clause: string) => (
                  <Badge key={clause} variant="outline">ISO 9001:{clause}</Badge>
                ))}
                {record.iso14001Clause && JSON.parse(record.iso14001Clause).map((clause: string) => (
                  <Badge key={clause} variant="outline">ISO 14001:{clause}</Badge>
                ))}
                {record.iso45001Clause && JSON.parse(record.iso45001Clause).map((clause: string) => (
                  <Badge key={clause} variant="outline">ISO 45001:{clause}</Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Investigation Tab */}
          <TabsContent value="investigation" className="space-y-6">
            {record.investigationNotes && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Investigation Notes</h3>
                <p className="text-slate-900 mt-2 whitespace-pre-wrap">{record.investigationNotes}</p>
              </div>
            )}

            {record.rootCauseTool && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Root Cause Analysis Tool</h3>
                <Badge className="mt-1">{record.rootCauseTool.replace('_', ' ')}</Badge>
              </div>
            )}

            {record.rootCauseOutput && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Root Cause Analysis</h3>
                <div className="mt-2 p-4 bg-slate-50 rounded-lg">
                  <pre className="text-sm text-slate-900 whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(record.rootCauseOutput), null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {!record.investigationNotes && !record.rootCauseTool && (
              <div className="text-center py-12 text-slate-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No investigation data yet</p>
              </div>
            )}
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-4">
            {record.actions.length > 0 ? (
              record.actions.map((action) => (
                <div key={action.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{action.actionType}</Badge>
                        <Badge className={getActionStatusColor(action.status)}>
                          {action.status.replace('_', ' ')}
                        </Badge>
                        {action.priority && (
                          <Badge variant={action.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                            {action.priority}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-900">{action.title}</h4>
                      {action.description && (
                        <p className="text-sm text-slate-600 mt-1">{action.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Owner:</span>
                      <span className="ml-2 text-slate-900">{action.owner || 'Unassigned'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Due:</span>
                      <span className="ml-2 text-slate-900">
                        {action.dueDate ? formatDate(action.dueDate) : 'Not set'}
                      </span>
                    </div>
                    {action.completedDate && (
                      <div>
                        <span className="text-slate-500">Completed:</span>
                        <span className="ml-2 text-slate-900">{formatDate(action.completedDate)}</span>
                      </div>
                    )}
                  </div>

                  {action.checklist && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <h5 className="text-sm font-medium text-slate-700 mb-2">Checklist:</h5>
                      <div className="space-y-1">
                        {JSON.parse(action.checklist).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <input 
                              type="checkbox" 
                              checked={item.done} 
                              readOnly 
                              className="h-4 w-4"
                            />
                            <span className={item.done ? 'line-through text-slate-500' : 'text-slate-700'}>
                              {item.item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No actions created yet</p>
              </div>
            )}
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-4">
            <div className="text-center py-12 text-slate-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>Communications feature coming soon</p>
            </div>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-4">
            {record.auditLogs.length > 0 ? (
              <div className="space-y-3">
                {record.auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <History className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{log.description}</p>
                        <span className="text-xs text-slate-500">{formatDate(log.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        by {log.userName || log.userId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <History className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No audit trail yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-2 mt-6 pt-6 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => {
            // TODO: Open edit form
            alert('Edit functionality coming soon')
          }}>
            Edit Record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

