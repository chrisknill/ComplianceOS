'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generateDocumentNumber } from '@/lib/company'
import { FileSignature } from 'lucide-react'

interface DocumentFormProps {
  open: boolean
  onClose: () => void
  document?: any
  onSave: () => void
  nextSequence?: number
}

export function DocumentForm({ open, onClose, document: doc, onSave, nextSequence = 1 }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    type: doc?.type || 'POLICY',
    title: doc?.title || '',
    code: doc?.code || '',
    version: doc?.version || '1.0',
    status: doc?.status || 'DRAFT',
    owner: doc?.owner || '',
    url: doc?.url || '',
  })

  const [loading, setLoading] = useState(false)
  const [showApprovalInfo, setShowApprovalInfo] = useState(false)

  // Auto-generate document code if empty
  const handleTypeChange = (type: string) => {
    setFormData({ ...formData, type })
    if (!formData.code || formData.code.startsWith('COS-')) {
      const category = type === 'POLICY' ? 'QUALITY' as const : 
                      type.includes('ENVIRONMENTAL') ? 'ENVIRONMENTAL' as const : 'QUALITY' as const
      const newCode = generateDocumentNumber(type as any, nextSequence, category)
      setFormData(prev => ({ ...prev, type, code: newCode }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = doc?.id ? 'PUT' : 'POST'
      const url = doc?.id ? `/api/documents/${doc.id}` : '/api/documents'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save document:', error)
      alert('Failed to save document. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{doc?.id ? 'Edit' : 'Add'} Document</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Document Type *</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POLICY">Policy</SelectItem>
                  <SelectItem value="PROCEDURE">Procedure</SelectItem>
                  <SelectItem value="WORK_INSTRUCTION">Work Instruction</SelectItem>
                  <SelectItem value="REGISTER">Register</SelectItem>
                </SelectContent>
              </Select>
            </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              Set to &quot;Pending Approval&quot; to initiate approval workflow
            </p>
          </div>

          {/* Approval Workflow Info */}
          {(formData.status === 'PENDING_APPROVAL' || formData.status === 'APPROVED') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileSignature className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Multi-Level Approval Required</p>
                  <p className="text-xs text-blue-700 mt-1">
                    This document requires approval from:
                  </p>
                  <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                    <li>Level 1: Quality Manager</li>
                    <li>Level 2: Operations Director</li>
                    <li>Level 3: CEO (optional for high-level policies)</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-3">
                    💡 After saving, use the &quot;Approvals&quot; button on the document to sign at each level
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>

          <div>
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Quality Management System Policy"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Document Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                placeholder="Auto-generated (e.g., COS-Q-POL-001)"
              />
              <p className="text-xs text-slate-500 mt-1">Format: Company-Category-Type-Number</p>
            </div>

            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="e.g., 1.0, 2.1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="owner">Document Owner</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="e.g., Quality Manager"
            />
          </div>

          <div>
            <Label htmlFor="url">Document URL (optional)</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="e.g., /docs/policy.pdf or https://..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

