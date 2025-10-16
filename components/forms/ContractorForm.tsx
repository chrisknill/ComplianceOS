'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ContractorFormProps {
  open: boolean
  onClose: () => void
  contractor?: any
  onSave: () => void
}

export function ContractorForm({ open, onClose, contractor, onSave }: ContractorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    services: '',
    preQualified: false,
    preQualDate: '',
    preQualExpiry: '',
    inductionStatus: 'PENDING',
    inductionDate: '',
    safetyRating: 3,
    lastEvaluation: '',
    status: 'ACTIVE',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (contractor) {
      setFormData({
        name: contractor.name || '',
        contact: contractor.contact || '',
        email: contractor.email || '',
        phone: contractor.phone || '',
        services: contractor.services || '',
        preQualified: contractor.preQualified || false,
        preQualDate: contractor.preQualDate ? new Date(contractor.preQualDate).toISOString().split('T')[0] : '',
        preQualExpiry: contractor.preQualExpiry ? new Date(contractor.preQualExpiry).toISOString().split('T')[0] : '',
        inductionStatus: contractor.inductionStatus || 'PENDING',
        inductionDate: contractor.inductionDate ? new Date(contractor.inductionDate).toISOString().split('T')[0] : '',
        safetyRating: contractor.safetyRating || 3,
        lastEvaluation: contractor.lastEvaluation ? new Date(contractor.lastEvaluation).toISOString().split('T')[0] : '',
        status: contractor.status || 'ACTIVE',
      })
    } else {
      // Reset form for new contractor
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: '',
        services: '',
        preQualified: false,
        preQualDate: '',
        preQualExpiry: '',
        inductionStatus: 'PENDING',
        inductionDate: '',
        safetyRating: 3,
        lastEvaluation: '',
        status: 'ACTIVE',
      })
    }
  }, [contractor, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = contractor?.id ? 'PUT' : 'POST'
      const url = contractor?.id ? `/api/ohs/contractors/${contractor.id}` : '/api/ohs/contractors'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save contractor:', error)
      alert('Failed to save contractor. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!contractor?.id) return
    if (!confirm('Are you sure you want to delete this contractor?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/ohs/contractors/${contractor.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to delete contractor:', error)
      alert('Failed to delete contractor. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{contractor?.id ? 'Edit' : 'Add'} Contractor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Contractor Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., ABC Welding Services"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contact">Contact Person</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="e.g., John Wilson"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@contractor.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="services">Services Provided</Label>
            <Textarea
              id="services"
              value={formData.services}
              onChange={(e) => setFormData({ ...formData, services: e.target.value })}
              placeholder="e.g., Welding, Fabrication, Hot Work"
              rows={2}
            />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Pre-Qualification</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="preQualified">Pre-Qualified</Label>
                <Select
                  value={formData.preQualified ? 'true' : 'false'}
                  onValueChange={(value) => setFormData({ ...formData, preQualified: value === 'true' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.preQualified && (
                <>
                  <div>
                    <Label htmlFor="preQualDate">Pre-Qual Date</Label>
                    <Input
                      id="preQualDate"
                      type="date"
                      value={formData.preQualDate}
                      onChange={(e) => setFormData({ ...formData, preQualDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="preQualExpiry">Expiry Date</Label>
                    <Input
                      id="preQualExpiry"
                      type="date"
                      value={formData.preQualExpiry}
                      onChange={(e) => setFormData({ ...formData, preQualExpiry: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Site Induction</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inductionStatus">Induction Status</Label>
                <Select
                  value={formData.inductionStatus}
                  onValueChange={(value) => setFormData({ ...formData, inductionStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.inductionStatus === 'COMPLETED' && (
                <div>
                  <Label htmlFor="inductionDate">Induction Date</Label>
                  <Input
                    id="inductionDate"
                    type="date"
                    value={formData.inductionDate}
                    onChange={(e) => setFormData({ ...formData, inductionDate: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Safety Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="safetyRating">Safety Rating (1-5)</Label>
                <Select
                  value={String(formData.safetyRating)}
                  onValueChange={(value) => setFormData({ ...formData, safetyRating: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Poor</SelectItem>
                    <SelectItem value="2">2 - Below Average</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lastEvaluation">Last Evaluation</Label>
                <Input
                  id="lastEvaluation"
                  type="date"
                  value={formData.lastEvaluation}
                  onChange={(e) => setFormData({ ...formData, lastEvaluation: e.target.value })}
                />
              </div>
            </div>
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {contractor?.id && (
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
                {loading ? 'Saving...' : 'Save Contractor'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

