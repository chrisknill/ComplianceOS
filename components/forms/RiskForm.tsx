'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface RiskFormProps {
  open: boolean
  onClose: () => void
  risk?: any
  onSave: () => void
}

export function RiskForm({ open, onClose, risk, onSave }: RiskFormProps) {
  const [formData, setFormData] = useState({
    title: risk?.title || '',
    category: risk?.category || 'QUALITY',
    context: risk?.context || '',
    likelihood: risk?.likelihood || 3,
    severity: risk?.severity || 3,
    owner: risk?.owner || '',
    status: risk?.status || 'OPEN',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = risk?.id ? 'PUT' : 'POST'
      const url = risk?.id ? `/api/risks/${risk.id}` : '/api/risks'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save risk:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{risk?.id ? 'Edit' : 'Add'} Risk Assessment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Risk Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Manual handling injury"
            />
          </div>

          <div>
            <Label htmlFor="category">Risk Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QUALITY">Quality (ISO 9001)</SelectItem>
                <SelectItem value="ENVIRONMENTAL">Environmental (ISO 14001)</SelectItem>
                <SelectItem value="HSE">HSE (ISO 45001)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              Categorize risk by ISO standard
            </p>
          </div>

          <div>
            <Label htmlFor="context">Context/Process</Label>
            <Input
              id="context"
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              placeholder="e.g., Warehouse operations"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="owner">Risk Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="e.g., Operations Manager"
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
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="TREATED">Treated</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mt-4">
            <p className="text-sm font-medium text-slate-900">
              Risk Score: {formData.likelihood} × {formData.severity} = {formData.likelihood * formData.severity}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {formData.likelihood * formData.severity >= 16 ? '🔴 Critical Risk' :
               formData.likelihood * formData.severity >= 11 ? '🟠 High Risk' :
               formData.likelihood * formData.severity >= 6 ? '🟡 Medium Risk' : '🟢 Low Risk'}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Risk'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

