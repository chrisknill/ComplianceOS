'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface NCIntakeFormProps {
  open: boolean
  onClose: () => void
  onSave: () => void
}

export function NCIntakeForm({ open, onClose, onSave }: NCIntakeFormProps) {
  const [caseType, setCaseType] = useState<string>('NC')
  const [formData, setFormData] = useState({
    title: '',
    raisedBy: 'Current User',
    process: '',
    area: '',
    department: '',
    category: 'Product',
    severity: 'MEDIUM',
    riskImpact: [] as string[],
    problemStatement: '',
    
    // CC fields
    customerName: '',
    customerContact: '',
    complaintChannel: '',
    externalRef: '',
    contractualImpact: false,
    responseDueDate: '',
    
    // SNC fields
    supplierName: '',
    supplierContact: '',
    poReference: '',
    warrantyClause: '',
    request8D: false,
    
    // NC fields
    detectionPoint: '',
    scrapRework: false,
    containmentNeeded: false,
    
    // OFI fields
    expectedBenefit: '',
    effortEstimate: 'M',
    suggestedOwner: '',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/nonconformance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseType,
          ...formData,
          riskImpact: JSON.stringify(formData.riskImpact),
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      onSave()
      onClose()
      
      // Reset form
      setCaseType('NC')
      setFormData({
        title: '',
        raisedBy: 'Current User',
        process: '',
        area: '',
        department: '',
        category: 'Product',
        severity: 'MEDIUM',
        riskImpact: [],
        problemStatement: '',
        customerName: '',
        customerContact: '',
        complaintChannel: '',
        externalRef: '',
        contractualImpact: false,
        responseDueDate: '',
        supplierName: '',
        supplierContact: '',
        poReference: '',
        warrantyClause: '',
        request8D: false,
        detectionPoint: '',
        scrapRework: false,
        containmentNeeded: false,
        expectedBenefit: '',
        effortEstimate: 'M',
        suggestedOwner: '',
      })
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to create case. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleRiskImpact = (impact: string) => {
    if (formData.riskImpact.includes(impact)) {
      setFormData({ ...formData, riskImpact: formData.riskImpact.filter(i => i !== impact) })
    } else {
      setFormData({ ...formData, riskImpact: [...formData.riskImpact, impact] })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Case - Quick Intake</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Case Type Selection */}
          <div>
            <Label>Case Type *</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[
                { value: 'OFI', label: 'OFI - Improvement', color: 'border-emerald-500 bg-emerald-50' },
                { value: 'NC', label: 'NC - Internal', color: 'border-rose-500 bg-rose-50' },
                { value: 'CC', label: 'CC - Customer', color: 'border-orange-500 bg-orange-50' },
                { value: 'SNC', label: 'SNC - Supplier', color: 'border-purple-500 bg-purple-50' },
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setCaseType(type.value)}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    caseType === type.value
                      ? `${type.color} border-2`
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Common Fields */}
          <div>
            <Label htmlFor="title">Title / Short Description *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Brief description of the issue or improvement"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="process">Process</Label>
              <Input
                id="process"
                value={formData.process}
                onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                placeholder="e.g., Production"
              />
            </div>

            <div>
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., Assembly Line 1"
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Manufacturing"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Process">Process</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Documentation">Documentation</SelectItem>
                  <SelectItem value="H&S">Health & Safety</SelectItem>
                  <SelectItem value="Environmental">Environmental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="severity">Severity / Priority *</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Risk Impact (select all that apply)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Quality', 'Safety', 'Environmental', 'Customer', 'Cost'].map(impact => (
                <button
                  key={impact}
                  type="button"
                  onClick={() => toggleRiskImpact(impact)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.riskImpact.includes(impact)
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {impact}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="problemStatement">Problem Statement *</Label>
            <Textarea
              id="problemStatement"
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              required
              placeholder="Describe the issue, non-conformance, or improvement opportunity in detail..."
              rows={4}
            />
          </div>

          {/* Conditional Fields - Customer Complaint */}
          {caseType === 'CC' && (
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h3 className="font-semibold text-slate-900">Customer Complaint Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required={caseType === 'CC'}
                    placeholder="Customer company name"
                  />
                </div>

                <div>
                  <Label htmlFor="customerContact">Customer Contact</Label>
                  <Input
                    id="customerContact"
                    value={formData.customerContact}
                    onChange={(e) => setFormData({ ...formData, customerContact: e.target.value })}
                    placeholder="Contact person"
                  />
                </div>

                <div>
                  <Label htmlFor="complaintChannel">Complaint Channel</Label>
                  <Select
                    value={formData.complaintChannel}
                    onValueChange={(value) => setFormData({ ...formData, complaintChannel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="Portal">Customer Portal</SelectItem>
                      <SelectItem value="Meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="externalRef">External Reference</Label>
                  <Input
                    id="externalRef"
                    value={formData.externalRef}
                    onChange={(e) => setFormData({ ...formData, externalRef: e.target.value })}
                    placeholder="Customer's ref number"
                  />
                </div>

                <div>
                  <Label htmlFor="responseDueDate">Response Due Date</Label>
                  <Input
                    id="responseDueDate"
                    type="date"
                    value={formData.responseDueDate}
                    onChange={(e) => setFormData({ ...formData, responseDueDate: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="contractualImpact"
                    checked={formData.contractualImpact}
                    onChange={(e) => setFormData({ ...formData, contractualImpact: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="contractualImpact" className="cursor-pointer">Contractual Impact</Label>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Fields - Supplier Non-Conformance */}
          {caseType === 'SNC' && (
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h3 className="font-semibold text-slate-900">Supplier Non-Conformance Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplierName">Supplier Name *</Label>
                  <Input
                    id="supplierName"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    required={caseType === 'SNC'}
                    placeholder="Supplier company name"
                  />
                </div>

                <div>
                  <Label htmlFor="supplierContact">Supplier Contact</Label>
                  <Input
                    id="supplierContact"
                    value={formData.supplierContact}
                    onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                    placeholder="Contact person"
                  />
                </div>

                <div>
                  <Label htmlFor="poReference">PO / Delivery Reference</Label>
                  <Input
                    id="poReference"
                    value={formData.poReference}
                    onChange={(e) => setFormData({ ...formData, poReference: e.target.value })}
                    placeholder="Purchase order number"
                  />
                </div>

                <div>
                  <Label htmlFor="warrantyClause">Warranty / Contract Clause</Label>
                  <Input
                    id="warrantyClause"
                    value={formData.warrantyClause}
                    onChange={(e) => setFormData({ ...formData, warrantyClause: e.target.value })}
                    placeholder="Relevant clause"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="request8D"
                    checked={formData.request8D}
                    onChange={(e) => setFormData({ ...formData, request8D: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="request8D" className="cursor-pointer">Request 8D Report from Supplier</Label>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Fields - Internal NC */}
          {caseType === 'NC' && (
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h3 className="font-semibold text-slate-900">Internal Non-Conformance Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="detectionPoint">Detection Point</Label>
                  <Select
                    value={formData.detectionPoint}
                    onValueChange={(value) => setFormData({ ...formData, detectionPoint: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In-process">In-process</SelectItem>
                      <SelectItem value="Final">Final Inspection</SelectItem>
                      <SelectItem value="Audit">Audit</SelectItem>
                      <SelectItem value="Incoming">Incoming Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="scrapRework"
                    checked={formData.scrapRework}
                    onChange={(e) => setFormData({ ...formData, scrapRework: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="scrapRework" className="cursor-pointer">Scrap / Rework Required</Label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="containmentNeeded"
                    checked={formData.containmentNeeded}
                    onChange={(e) => setFormData({ ...formData, containmentNeeded: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="containmentNeeded" className="cursor-pointer">Immediate Containment Needed</Label>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Fields - OFI */}
          {caseType === 'OFI' && (
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h3 className="font-semibold text-slate-900">Improvement Opportunity Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expectedBenefit">Expected Benefit</Label>
                  <Select
                    value={formData.expectedBenefit}
                    onValueChange={(value) => setFormData({ ...formData, expectedBenefit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quality">Quality</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Cost">Cost</SelectItem>
                      <SelectItem value="Delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="effortEstimate">Effort Estimate</Label>
                  <Select
                    value={formData.effortEstimate}
                    onValueChange={(value) => setFormData({ ...formData, effortEstimate: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">Small (S)</SelectItem>
                      <SelectItem value="M">Medium (M)</SelectItem>
                      <SelectItem value="L">Large (L)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="suggestedOwner">Suggested Owner</Label>
                  <Input
                    id="suggestedOwner"
                    value={formData.suggestedOwner}
                    onChange={(e) => setFormData({ ...formData, suggestedOwner: e.target.value })}
                    placeholder="Person or team"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

