'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PermitFormProps {
  open: boolean
  onClose: () => void
  permit?: any
  onSave: () => void
}

export function PermitForm({ open, onClose, permit, onSave }: PermitFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'HOT_WORK',
    location: '',
    contractor: '',
    issuedBy: '',
    approvedBy: '',
    clientApprover: '',
    validFrom: '',
    validUntil: '',
    status: 'PENDING',
    hazards: '',
    controlMeasures: '',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (permit) {
      setFormData({
        title: permit.title || '',
        type: permit.type || 'HOT_WORK',
        location: permit.location || '',
        contractor: permit.contractor || '',
        issuedBy: permit.issuedBy || '',
        approvedBy: permit.approvedBy || '',
        clientApprover: permit.clientApprover || '',
        validFrom: permit.validFrom ? new Date(permit.validFrom).toISOString().split('T')[0] : '',
        validUntil: permit.validUntil ? new Date(permit.validUntil).toISOString().split('T')[0] : '',
        status: permit.status || 'PENDING',
        hazards: permit.hazards || '',
        controlMeasures: permit.controlMeasures || '',
      })
    } else {
      // Reset form for new permit
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        title: '',
        type: 'HOT_WORK',
        location: '',
        contractor: '',
        issuedBy: '',
        approvedBy: '',
        clientApprover: '',
        validFrom: today,
        validUntil: today,
        status: 'PENDING',
        hazards: '',
        controlMeasures: '',
      })
    }
  }, [permit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = permit?.id ? 'PUT' : 'POST'
      const url = permit?.id ? `/api/ohs/permits/${permit.id}` : '/api/ohs/permits'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save permit:', error)
      alert('Failed to save permit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!permit?.id) return
    if (!confirm('Are you sure you want to delete this permit?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/ohs/permits/${permit.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to delete permit:', error)
      alert('Failed to delete permit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{permit?.id ? 'Edit' : 'Issue'} Permit to Work</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Permit Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Hot work on storage tank"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Permit Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOT_WORK">Hot Work</SelectItem>
                  <SelectItem value="CONFINED_SPACE">Confined Space</SelectItem>
                  <SelectItem value="ELECTRICAL">Electrical Work</SelectItem>
                  <SelectItem value="HEIGHT_WORK">Work at Height</SelectItem>
                  <SelectItem value="EXCAVATION">Excavation</SelectItem>
                  <SelectItem value="LIFTING">Lifting Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="e.g., Tank Farm, Building A"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contractor">Contractor/Company</Label>
              <Input
                id="contractor"
                value={formData.contractor}
                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                placeholder="Leave blank for internal work"
              />
            </div>

            <div>
              <Label htmlFor="issuedBy">Issued By *</Label>
              <Input
                id="issuedBy"
                value={formData.issuedBy}
                onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                required
                placeholder="e.g., Safety Manager"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Validity Period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Approvals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="approvedBy">Internal Approver</Label>
                <Input
                  id="approvedBy"
                  value={formData.approvedBy}
                  onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                  placeholder="e.g., Operations Manager"
                />
                <p className="text-xs text-slate-500 mt-1">Level 1: Internal approval</p>
              </div>

              <div>
                <Label htmlFor="clientApprover">Client/3rd Party Approver</Label>
                <Input
                  id="clientApprover"
                  value={formData.clientApprover}
                  onChange={(e) => setFormData({ ...formData, clientApprover: e.target.value })}
                  placeholder="e.g., Client Site Manager"
                />
                <p className="text-xs text-slate-500 mt-1">Level 2: External approval (if required)</p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="hazards">Identified Hazards</Label>
            <Textarea
              id="hazards"
              value={formData.hazards}
              onChange={(e) => setFormData({ ...formData, hazards: e.target.value })}
              placeholder="List key hazards (one per line)..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="controlMeasures">Control Measures</Label>
            <Textarea
              id="controlMeasures"
              value={formData.controlMeasures}
              onChange={(e) => setFormData({ ...formData, controlMeasures: e.target.value })}
              placeholder="List control measures and precautions (one per line)..."
              rows={3}
            />
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
                <SelectItem value="PENDING">Pending Approval</SelectItem>
                <SelectItem value="APPROVED">Approved (Not Active)</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {permit?.id && (
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
                {loading ? 'Saving...' : 'Save Permit'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

