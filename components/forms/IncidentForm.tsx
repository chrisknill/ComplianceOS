'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface IncidentFormProps {
  open: boolean
  onClose: () => void
  incident?: any
  onSave: () => void
}

export function IncidentForm({ open, onClose, incident, onSave }: IncidentFormProps) {
  const [formData, setFormData] = useState({
    ref: incident?.ref || '',
    type: incident?.type || 'NEAR_MISS',
    date: incident?.date ? new Date(incident.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    location: incident?.location || '',
    description: incident?.description || '',
    severityType: incident?.severityType || 'FIRST_AID',
    lostTimeDays: incident?.lostTimeDays || 0,
    immediateActions: incident?.immediateActions || '',
    status: incident?.status || 'OPEN',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Auto-generate ref if empty
      if (!formData.ref) {
        const year = new Date().getFullYear()
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        formData.ref = `INC-${year}-${random}`
      }

      const method = incident?.id ? 'PUT' : 'POST'
      const url = incident?.id ? `/api/ohs/incidents/${incident.id}` : '/api/ohs/incidents'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          people: JSON.stringify([]), // Can be enhanced with multi-select
          isoRefs: JSON.stringify(['45001:10.2']),
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save incident:', error)
      alert('Failed to save incident. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{incident?.id ? 'Edit' : 'Report'} Incident</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Incident Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEAR_MISS">Near Miss</SelectItem>
                  <SelectItem value="UNSAFE_ACT">Unsafe Act</SelectItem>
                  <SelectItem value="UNSAFE_CONDITION">Unsafe Condition</SelectItem>
                  <SelectItem value="INJURY">Injury</SelectItem>
                  <SelectItem value="ILL_HEALTH">Ill Health</SelectItem>
                  <SelectItem value="PROPERTY_DAMAGE">Property Damage</SelectItem>
                  <SelectItem value="ENVIRONMENTAL">Environmental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="severityType">Severity Classification *</Label>
              <Select
                value={formData.severityType}
                onValueChange={(value) => setFormData({ ...formData, severityType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIRST_AID">First Aid</SelectItem>
                  <SelectItem value="MEDICAL_TREATMENT">Medical Treatment</SelectItem>
                  <SelectItem value="RESTRICTED_WORK">Restricted Work</SelectItem>
                  <SelectItem value="LOST_TIME">Lost Time</SelectItem>
                  <SelectItem value="FATALITY">Fatality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Warehouse Area B"
              />
            </div>

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
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Describe what happened, where, when, and who was involved..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="immediateActions">Immediate Actions Taken</Label>
            <Textarea
              id="immediateActions"
              value={formData.immediateActions}
              onChange={(e) => setFormData({ ...formData, immediateActions: e.target.value })}
              placeholder="What was done immediately to address the situation..."
              rows={3}
            />
          </div>

          {(formData.severityType === 'LOST_TIME' || formData.severityType === 'RESTRICTED_WORK') && (
            <div>
              <Label htmlFor="lostTimeDays">Lost/Restricted Time (days)</Label>
              <Input
                id="lostTimeDays"
                type="number"
                value={formData.lostTimeDays}
                onChange={(e) => setFormData({ ...formData, lostTimeDays: Number(e.target.value) })}
                min="0"
              />
            </div>
          )}

          <div>
            <Label htmlFor="status">Investigation Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="UNDER_INVESTIGATION">Under Investigation</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Incident'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

