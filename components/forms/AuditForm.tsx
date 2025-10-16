'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AuditFormProps {
  open: boolean
  onClose: () => void
  audit?: any
  onSave: () => void
}

export function AuditForm({ open, onClose, audit, onSave }: AuditFormProps) {
  const [formData, setFormData] = useState({
    type: audit?.type || 'INTERNAL_AUDIT',
    title: audit?.title || '',
    auditor: audit?.auditor || '',
    date: audit?.date ? new Date(audit.date).toISOString().split('T')[0] : '',
    area: audit?.area || '',
    duration: audit?.duration?.toString() || '',
    status: audit?.status || 'SCHEDULED',
    outcome: audit?.outcome || '',
    actionItems: audit?.actionItems?.toString() || '0',
    findings: audit?.findings || '',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (audit) {
      setFormData({
        type: audit.type || 'INTERNAL_AUDIT',
        title: audit.title || '',
        auditor: audit.auditor || '',
        date: audit.date ? new Date(audit.date).toISOString().split('T')[0] : '',
        area: audit.area || '',
        duration: audit.duration?.toString() || '',
        status: audit.status || 'SCHEDULED',
        outcome: audit.outcome || '',
        actionItems: audit.actionItems?.toString() || '0',
        findings: audit.findings || '',
      })
    } else {
      setFormData({
        type: 'INTERNAL_AUDIT',
        title: '',
        auditor: '',
        date: '',
        area: '',
        duration: '',
        status: 'SCHEDULED',
        outcome: '',
        actionItems: '0',
        findings: '',
      })
    }
  }, [audit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = audit?.id ? 'PUT' : 'POST'
      const url = audit?.id ? `/api/ohs/audits/${audit.id}` : '/api/ohs/audits'

      const payload = {
        type: formData.type,
        title: formData.title,
        auditor: formData.auditor || null,
        date: formData.date ? new Date(formData.date) : new Date(),
        area: formData.area || null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        status: formData.status,
        outcome: formData.outcome || null,
        actionItems: formData.actionItems ? parseInt(formData.actionItems) : 0,
        findings: formData.findings || null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save audit')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving audit:', error)
      alert('Failed to save audit/inspection')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!audit?.id) return
    if (!confirm('Are you sure you want to delete this audit/inspection?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/ohs/audits/${audit.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete audit')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error deleting audit:', error)
      alert('Failed to delete audit/inspection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{audit?.id ? 'Edit' : 'Add'} Audit/Inspection</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERNAL_AUDIT">Internal Audit</SelectItem>
                <SelectItem value="THIRD_PARTY_AUDIT">3rd Party Audit</SelectItem>
                <SelectItem value="CERTIFICATION_AUDIT">Certification Audit</SelectItem>
                <SelectItem value="INSPECTION">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Q4 Internal Safety Audit"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="auditor">Auditor/Inspector</Label>
              <Input
                id="auditor"
                value={formData.auditor}
                onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
                placeholder="Name or organization"
              />
            </div>

            <div>
              <Label htmlFor="area">Area/Department</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., Warehouse, Production"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                step="0.5"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 4"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="outcome">Outcome</Label>
              <Select
                value={formData.outcome || 'PENDING'}
                onValueChange={(value) => setFormData({ ...formData, outcome: value === 'PENDING' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Not completed yet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Not completed yet</SelectItem>
                  <SelectItem value="PASS">Pass</SelectItem>
                  <SelectItem value="CONDITIONAL">Conditional</SelectItem>
                  <SelectItem value="FAIL">Fail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="actionItems">Action Items Raised</Label>
            <Input
              id="actionItems"
              type="number"
              min="0"
              value={formData.actionItems}
              onChange={(e) => setFormData({ ...formData, actionItems: e.target.value })}
              placeholder="Number of corrective actions required"
            />
          </div>

          <div>
            <Label htmlFor="findings">Findings/Notes</Label>
            <Textarea
              id="findings"
              value={formData.findings}
              onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
              rows={4}
              placeholder="Key findings, observations, or notes..."
            />
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {audit?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

