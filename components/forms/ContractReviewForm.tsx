'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Save, Calendar, DollarSign, Building2, User, Mail, Phone, FileText, AlertTriangle, AlertCircle, CheckSquare, Link, Plus, Trash2, CheckCircle, UserCheck, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { ContractReviewFormData, ContractType, Priority, RiskLevel, Currency } from '@/types/contract-review'
import { 
  getContractTypeOptions, getPriorityOptions, getRiskLevelOptions, getCurrencyOptions,
  validateContractForm
} from '@/lib/contract-review-utils'

interface ContractReviewFormProps {
  onClose: () => void
  onSubmit: () => void
  contractId?: string
}

export function ContractReviewForm({ onClose, onSubmit, contractId }: ContractReviewFormProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [contractChecklist, setContractChecklist] = useState({
    contractTermsReviewed: { completed: false, reviewer: '', date: '', notes: '', priority: 'HIGH' },
    supplierQualified: { completed: false, reviewer: '', date: '', notes: '', priority: 'HIGH' },
    riskAssessmentCompleted: { completed: false, reviewer: '', date: '', notes: '', priority: 'HIGH' },
    complianceVerified: { completed: false, reviewer: '', date: '', notes: '', priority: 'MEDIUM' },
    legalReviewCompleted: { completed: false, reviewer: '', date: '', notes: '', priority: 'HIGH' },
    financialTermsApproved: { completed: false, reviewer: '', date: '', notes: '', priority: 'HIGH' },
    performanceMetricsDefined: { completed: false, reviewer: '', date: '', notes: '', priority: 'MEDIUM' },
    terminationClausesReviewed: { completed: false, reviewer: '', date: '', notes: '', priority: 'MEDIUM' },
    confidentialityAgreed: { completed: false, reviewer: '', date: '', notes: '', priority: 'LOW' },
    insuranceRequirementsMet: { completed: false, reviewer: '', date: '', notes: '', priority: 'MEDIUM' },
    contractSigned: { completed: false, reviewer: '', date: '', notes: '', priority: 'HIGH' },
    deliverablesDefined: { completed: false, reviewer: '', date: '', notes: '', priority: 'HIGH' },
    paymentTermsAgreed: { completed: false, reviewer: '', date: '', notes: '', priority: 'HIGH' },
    warrantyPeriodSet: { completed: false, reviewer: '', date: '', notes: '', priority: 'MEDIUM' },
    disputeResolutionClause: { completed: false, reviewer: '', date: '', notes: '', priority: 'MEDIUM' },
  })
  const [documents, setDocuments] = useState<Array<{name: string, url: string, type: string}>>([])
  const [milestones, setMilestones] = useState<Array<{description: string, amount: string, dueDate: string, status: string, completedDate: string}>>([])
  const [approvals, setApprovals] = useState({
    reviewerSignOff: { signed: false, signer: '', date: '', comments: '' },
    managerApproval: { approved: false, approver: '', date: '', comments: '' },
    finalApproval: { approved: false, approver: '', date: '', comments: '' }
  })
  const [formData, setFormData] = useState<ContractReviewFormData>({
    contractNumber: '',
    contractTitle: '',
    contractType: 'SUPPLY',
    supplierName: '',
    supplierContact: '',
    supplierEmail: '',
    value: '',
    currency: 'USD',
    startDate: '',
    endDate: '',
    renewalDate: '',
    priority: 'MEDIUM',
    riskLevel: 'MEDIUM',
    reviewerName: '',
    comments: '',
    terms: '',
    complianceNotes: '',
    nextReviewDate: '',
  })

  // Load existing contract data if editing
  useEffect(() => {
    if (contractId) {
      fetchContractData()
    }
  }, [contractId])

  const fetchContractData = async () => {
    try {
      const response = await fetch(`/api/contract-review/${contractId}`, {
        credentials: 'include',
      })
      
      if (response.ok) {
        const contract = await response.json()
        setFormData({
          contractNumber: contract.contractNumber || '',
          contractTitle: contract.contractTitle || '',
          contractType: contract.contractType || 'SUPPLY',
          supplierName: contract.supplierName || '',
          supplierContact: contract.supplierContact || '',
          supplierEmail: contract.supplierEmail || '',
          value: contract.value?.toString() || '',
          currency: contract.currency || 'USD',
          startDate: contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
          endDate: contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
          renewalDate: contract.renewalDate ? new Date(contract.renewalDate).toISOString().split('T')[0] : '',
          priority: contract.priority || 'MEDIUM',
          riskLevel: contract.riskLevel || 'MEDIUM',
          reviewerName: contract.reviewerName || '',
          comments: contract.comments || '',
          terms: contract.terms || '',
          complianceNotes: contract.complianceNotes || '',
          nextReviewDate: contract.nextReviewDate ? new Date(contract.nextReviewDate).toISOString().split('T')[0] : '',
        })
      }
    } catch (error) {
      console.error('Error fetching contract data:', error)
      toast.error('Failed to load contract data')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    const validationErrors = validateContractForm(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the validation errors')
      return
    }

    setLoading(true)
    setErrors([])
    
    try {
      const url = contractId ? `/api/contract-review/${contractId}` : '/api/contract-review'
      const method = contractId ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        value: formData.value ? parseFloat(formData.value) : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        renewalDate: formData.renewalDate || undefined,
        nextReviewDate: formData.nextReviewDate || undefined,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(contractId ? 'Contract updated successfully' : 'Contract created successfully')
        onSubmit()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save contract')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ContractReviewFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const addDocument = () => {
    setDocuments(prev => [...prev, { name: '', url: '', type: 'PDF' }])
  }

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const updateDocument = (index: number, field: string, value: string) => {
    setDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, [field]: value } : doc
    ))
  }

  const addMilestone = () => {
    setMilestones(prev => [...prev, { description: '', amount: '', dueDate: '', status: 'PENDING', completedDate: '' }])
  }

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index))
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ))
  }

  const updateChecklistItem = (key: string, field: string, value: string | boolean) => {
    setContractChecklist(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], [field]: value }
    }))
  }

  const updateApproval = (key: string, field: string, value: string | boolean) => {
    setApprovals(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], [field]: value }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {contractId ? 'Edit Contract Review' : 'New Contract Review'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
                  <ul className="text-sm text-red-700 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="compliance">Review Checklist</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="approval">Approval</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractNumber">Contract Number *</Label>
                      <Input
                        id="contractNumber"
                        value={formData.contractNumber}
                        onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                        placeholder="e.g., CON-2024-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractTitle">Contract Title *</Label>
                      <Input
                        id="contractTitle"
                        value={formData.contractTitle}
                        onChange={(e) => handleInputChange('contractTitle', e.target.value)}
                        placeholder="Contract title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractType">Contract Type *</Label>
                      <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value as ContractType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getContractTypeOptions().map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reviewerName">Reviewer Name</Label>
                      <Input
                        id="reviewerName"
                        value={formData.reviewerName}
                        onChange={(e) => handleInputChange('reviewerName', e.target.value)}
                        placeholder="Reviewer name"
                      />
                    </div>
                  </div>
                </div>

                {/* Supplier Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Supplier Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplierName">Supplier Name *</Label>
                      <Input
                        id="supplierName"
                        value={formData.supplierName}
                        onChange={(e) => handleInputChange('supplierName', e.target.value)}
                        placeholder="Supplier company name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplierContact">Contact Person</Label>
                      <Input
                        id="supplierContact"
                        value={formData.supplierContact}
                        onChange={(e) => handleInputChange('supplierContact', e.target.value)}
                        placeholder="Contact person name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplierEmail">Email</Label>
                      <Input
                        id="supplierEmail"
                        type="email"
                        value={formData.supplierEmail}
                        onChange={(e) => handleInputChange('supplierEmail', e.target.value)}
                        placeholder="supplier@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="value">Contract Value</Label>
                      <Input
                        id="value"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.value}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value as Currency)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getCurrencyOptions().map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Important Dates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="renewalDate">Renewal Date</Label>
                      <Input
                        id="renewalDate"
                        type="date"
                        value={formData.renewalDate}
                        onChange={(e) => handleInputChange('renewalDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextReviewDate">Next Review Date</Label>
                      <Input
                        id="nextReviewDate"
                        type="date"
                        value={formData.nextReviewDate}
                        onChange={(e) => handleInputChange('nextReviewDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value as Priority)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getPriorityOptions().map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="riskLevel">Risk Level</Label>
                      <Select value={formData.riskLevel} onValueChange={(value) => handleInputChange('riskLevel', value as RiskLevel)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getRiskLevelOptions().map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="comments">Comments</Label>
                      <Textarea
                        id="comments"
                        value={formData.comments}
                        onChange={(e) => handleInputChange('comments', e.target.value)}
                        placeholder="Additional comments about the contract"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="terms">Contract Terms</Label>
                      <Textarea
                        id="terms"
                        value={formData.terms}
                        onChange={(e) => handleInputChange('terms', e.target.value)}
                        placeholder="Key contract terms and conditions"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complianceNotes">Compliance Notes</Label>
                      <Textarea
                        id="complianceNotes"
                        value={formData.complianceNotes}
                        onChange={(e) => handleInputChange('complianceNotes', e.target.value)}
                        placeholder="Compliance and regulatory notes"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <div className="space-y-6">
                  <div className="text-center py-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Contract Review Checklist</h3>
                    <p className="text-gray-600">Complete each item to ensure thorough contract review</p>
                  </div>

                  {/* Progress Overview */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Review Progress</h4>
                      <div className="text-sm text-gray-600">
                        {Object.values(contractChecklist).filter(item => item.completed).length} of {Object.keys(contractChecklist).length} completed
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(Object.values(contractChecklist).filter(item => item.completed).length / Object.keys(contractChecklist).length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Object.entries(contractChecklist).map(([key, item]) => {
                      const getPriorityColor = (priority: string) => {
                        switch (priority) {
                          case 'HIGH': return 'bg-red-100 text-red-800 border-red-200'
                          case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
                          default: return 'bg-gray-100 text-gray-800 border-gray-200'
                        }
                      }

                      const getPriorityIcon = (priority: string) => {
                        switch (priority) {
                          case 'HIGH': return '🔴'
                          case 'MEDIUM': return '🟡'
                          case 'LOW': return '🟢'
                          default: return '⚪'
                        }
                      }

                      return (
                        <div 
                          key={key} 
                          className={`p-5 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                            item.completed 
                              ? 'bg-green-50 border-green-300 shadow-sm' 
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <input
                                type="checkbox"
                                id={key}
                                checked={item.completed}
                                onChange={(e) => updateChecklistItem(key, 'completed', e.target.checked)}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <Label 
                                  htmlFor={key} 
                                  className={`text-sm font-medium cursor-pointer transition-colors ${
                                    item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                                  }`}
                                >
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </Label>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                                  <span className="mr-1">{getPriorityIcon(item.priority)}</span>
                                  {item.priority}
                                </span>
                              </div>
                              
                              {item.completed && (
                                <div className="mt-3 space-y-3 p-3 bg-white rounded-md border border-gray-200">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reviewer</Label>
                                      <Input
                                        placeholder="Reviewer name"
                                        value={item.reviewer}
                                        onChange={(e) => updateChecklistItem(key, 'reviewer', e.target.value)}
                                        className="text-sm"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date Completed</Label>
                                      <Input
                                        type="date"
                                        value={item.date}
                                        onChange={(e) => updateChecklistItem(key, 'date', e.target.value)}
                                        className="text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</Label>
                                    <Textarea
                                      placeholder="Additional notes or observations..."
                                      value={item.notes}
                                      onChange={(e) => updateChecklistItem(key, 'notes', e.target.value)}
                                      rows={2}
                                      className="text-sm resize-none"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">🔴</div>
                        <div>
                          <div className="text-sm font-medium text-red-800">High Priority</div>
                          <div className="text-lg font-bold text-red-900">
                            {Object.values(contractChecklist).filter(item => item.priority === 'HIGH' && item.completed).length} / {Object.values(contractChecklist).filter(item => item.priority === 'HIGH').length}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">🟡</div>
                        <div>
                          <div className="text-sm font-medium text-yellow-800">Medium Priority</div>
                          <div className="text-lg font-bold text-yellow-900">
                            {Object.values(contractChecklist).filter(item => item.priority === 'MEDIUM' && item.completed).length} / {Object.values(contractChecklist).filter(item => item.priority === 'MEDIUM').length}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">🟢</div>
                        <div>
                          <div className="text-sm font-medium text-green-800">Low Priority</div>
                          <div className="text-lg font-bold text-green-900">
                            {Object.values(contractChecklist).filter(item => item.priority === 'LOW' && item.completed).length} / {Object.values(contractChecklist).filter(item => item.priority === 'LOW').length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Milestones Tab */}
              <TabsContent value="milestones" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Milestone Payments
                    </h3>
                    <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Milestone
                    </Button>
                  </div>
                  
                  {milestones.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Completed Date</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {milestones.map((milestone, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-3 py-2">
                                <Input
                                  placeholder="Milestone description"
                                  value={milestone.description}
                                  onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                                  className="border-0 p-0 h-auto"
                                />
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="Amount"
                                  value={milestone.amount}
                                  onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                                  className="border-0 p-0 h-auto"
                                />
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <Input
                                  type="date"
                                  value={milestone.dueDate}
                                  onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                                  className="border-0 p-0 h-auto"
                                />
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <Select value={milestone.status} onValueChange={(value) => updateMilestone(index, 'status', value)}>
                                  <SelectTrigger className="border-0 p-0 h-auto">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <Input
                                  type="date"
                                  value={milestone.completedDate}
                                  onChange={(e) => updateMilestone(index, 'completedDate', e.target.value)}
                                  className="border-0 p-0 h-auto"
                                />
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMilestone(index)}
                                  className="text-red-600 hover:text-red-700 h-auto p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Calendar className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No milestones added yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      Document Links
                    </h3>
                    <Button type="button" variant="outline" size="sm" onClick={addDocument}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Document
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <Input
                            placeholder="Document name"
                            value={doc.name}
                            onChange={(e) => updateDocument(index, 'name', e.target.value)}
                          />
                          <Input
                            placeholder="URL or file path"
                            value={doc.url}
                            onChange={(e) => updateDocument(index, 'url', e.target.value)}
                          />
                          <Select value={doc.type} onValueChange={(value) => updateDocument(index, 'type', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PDF">PDF</SelectItem>
                              <SelectItem value="DOC">Word Document</SelectItem>
                              <SelectItem value="XLS">Excel</SelectItem>
                              <SelectItem value="URL">Web Link</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <FileText className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No documents added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Approval Tab */}
              <TabsContent value="approval" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Sign-off & Approval
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Reviewer Sign-off */}
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="reviewerSignOff"
                          checked={approvals.reviewerSignOff.signed}
                          onChange={(e) => updateApproval('reviewerSignOff', 'signed', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor="reviewerSignOff" className="text-sm font-medium text-gray-700">
                          Reviewer Sign-off
                        </Label>
                      </div>
                      {approvals.reviewerSignOff.signed && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-6">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Signer</Label>
                            <Input
                              placeholder="Reviewer name"
                              value={approvals.reviewerSignOff.signer}
                              onChange={(e) => updateApproval('reviewerSignOff', 'signer', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Date</Label>
                            <Input
                              type="date"
                              value={approvals.reviewerSignOff.date}
                              onChange={(e) => updateApproval('reviewerSignOff', 'date', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Comments</Label>
                            <Input
                              placeholder="Sign-off comments"
                              value={approvals.reviewerSignOff.comments}
                              onChange={(e) => updateApproval('reviewerSignOff', 'comments', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Manager Approval */}
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="managerApproval"
                          checked={approvals.managerApproval.approved}
                          onChange={(e) => updateApproval('managerApproval', 'approved', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor="managerApproval" className="text-sm font-medium text-gray-700">
                          Manager Approval
                        </Label>
                      </div>
                      {approvals.managerApproval.approved && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-6">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Approver</Label>
                            <Input
                              placeholder="Manager name"
                              value={approvals.managerApproval.approver}
                              onChange={(e) => updateApproval('managerApproval', 'approver', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Date</Label>
                            <Input
                              type="date"
                              value={approvals.managerApproval.date}
                              onChange={(e) => updateApproval('managerApproval', 'date', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Comments</Label>
                            <Input
                              placeholder="Approval comments"
                              value={approvals.managerApproval.comments}
                              onChange={(e) => updateApproval('managerApproval', 'comments', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Final Approval */}
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="finalApproval"
                          checked={approvals.finalApproval.approved}
                          onChange={(e) => updateApproval('finalApproval', 'approved', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor="finalApproval" className="text-sm font-medium text-gray-700">
                          Final Approval
                        </Label>
                      </div>
                      {approvals.finalApproval.approved && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-6">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Approver</Label>
                            <Input
                              placeholder="Final approver name"
                              value={approvals.finalApproval.approver}
                              onChange={(e) => updateApproval('finalApproval', 'approver', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Date</Label>
                            <Input
                              type="date"
                              value={approvals.finalApproval.date}
                              onChange={(e) => updateApproval('finalApproval', 'date', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Comments</Label>
                            <Input
                              placeholder="Final approval comments"
                              value={approvals.finalApproval.comments}
                              onChange={(e) => updateApproval('finalApproval', 'comments', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {contractId ? 'Update Contract' : 'Create Contract'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}