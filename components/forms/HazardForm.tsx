'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface HazardFormProps {
  open: boolean
  onClose: () => void
  hazard?: any
  onSave: () => void
}

export function HazardForm({ open, onClose, hazard, onSave }: HazardFormProps) {
  const [formData, setFormData] = useState({
    title: hazard?.title || '',
    area: hazard?.area || '',
    description: hazard?.description || '',
    likelihood: hazard?.likelihood || 3,
    severity: hazard?.severity || 3,
    residualL: hazard?.residualL || null,
    residualS: hazard?.residualS || null,
    owner: hazard?.owner || '',
    status: hazard?.status || 'OPEN',
  })

  const [loading, setLoading] = useState(false)

  const preScore = formData.likelihood * formData.severity
  const postScore = (formData.residualL || 0) * (formData.residualS || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = hazard?.id ? 'PUT' : 'POST'
      const url = hazard?.id ? `/api/ohs/hazards/${hazard.id}` : '/api/ohs/hazards'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save hazard:', error)
      alert('Failed to save hazard. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hazard?.id ? 'Edit' : 'Add'} OH&S Hazard</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Hazard Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Forklift traffic near pedestrians"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">Area/Location</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., Warehouse, Production Floor"
              />
            </div>

            <div>
              <Label htmlFor="owner">Hazard Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="e.g., Warehouse Supervisor"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the hazard in detail..."
              rows={3}
            />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Pre-Control Risk Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="likelihood">Likelihood (1-5) *</Label>
                <Select
                  value={String(formData.likelihood)}
                  onValueChange={(value) => setFormData({ ...formData, likelihood: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Rare</SelectItem>
                    <SelectItem value="2">2 - Unlikely</SelectItem>
                    <SelectItem value="3">3 - Possible</SelectItem>
                    <SelectItem value="4">4 - Likely</SelectItem>
                    <SelectItem value="5">5 - Almost Certain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="severity">Severity (1-5) *</Label>
                <Select
                  value={String(formData.severity)}
                  onValueChange={(value) => setFormData({ ...formData, severity: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Insignificant</SelectItem>
                    <SelectItem value="2">2 - Minor</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="4">4 - Major</SelectItem>
                    <SelectItem value="5">5 - Catastrophic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mt-3">
              <p className="text-sm font-medium text-slate-900">
                Pre-Control Risk Score: {formData.likelihood} × {formData.severity} = {preScore}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Residual Risk (Post-Control)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="residualL">Residual Likelihood (1-5)</Label>
                <Select
                  value={formData.residualL ? String(formData.residualL) : ''}
                  onValueChange={(value) => setFormData({ ...formData, residualL: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Rare</SelectItem>
                    <SelectItem value="2">2 - Unlikely</SelectItem>
                    <SelectItem value="3">3 - Possible</SelectItem>
                    <SelectItem value="4">4 - Likely</SelectItem>
                    <SelectItem value="5">5 - Almost Certain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="residualS">Residual Severity (1-5)</Label>
                <Select
                  value={formData.residualS ? String(formData.residualS) : ''}
                  onValueChange={(value) => setFormData({ ...formData, residualS: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Insignificant</SelectItem>
                    <SelectItem value="2">2 - Minor</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="4">4 - Major</SelectItem>
                    <SelectItem value="5">5 - Catastrophic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.residualL && formData.residualS && (
              <div className="bg-emerald-50 rounded-lg p-3 mt-3">
                <p className="text-sm font-medium text-emerald-900">
                  Residual Risk Score: {formData.residualL} × {formData.residualS} = {postScore}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Risk Reduction: {preScore} → {postScore} ({Math.round((1 - postScore/preScore) * 100)}% reduction)
                </p>
              </div>
            )}
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
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="TREATED">Treated</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Hazard'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

