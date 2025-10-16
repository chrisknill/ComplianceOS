'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface RegisterFormProps {
  open: boolean
  onClose: () => void
  entry?: any
  onSave: () => void
}

export function RegisterForm({ open, onClose, entry, onSave }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    type: entry?.type || 'RISK',
    title: entry?.title || '',
    details: entry?.details || '',
    owner: entry?.owner || '',
    status: entry?.status || 'OPEN',
    date: entry?.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (entry) {
      setFormData({
        type: entry.type || 'RISK',
        title: entry.title || '',
        details: entry.details || '',
        owner: entry.owner || '',
        status: entry.status || 'OPEN',
        date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      })
    } else {
      setFormData({
        type: 'RISK',
        title: '',
        details: '',
        owner: '',
        status: 'OPEN',
        date: new Date().toISOString().split('T')[0],
      })
    }
  }, [entry, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = entry?.id ? 'PUT' : 'POST'
      const url = entry?.id ? `/api/registers/${entry.id}` : '/api/registers'

      const payload = {
        type: formData.type,
        title: formData.title,
        details: formData.details || null,
        owner: formData.owner || null,
        status: formData.status,
        date: formData.date ? new Date(formData.date) : new Date(),
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save register entry')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving register entry:', error)
      alert('Failed to save register entry')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!entry?.id) return
    if (!confirm('Are you sure you want to delete this register entry?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/registers/${entry.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete register entry')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error deleting register entry:', error)
      alert('Failed to delete register entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{entry?.id ? 'Edit' : 'Add'} Register Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Register Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RISK">Risk</SelectItem>
                <SelectItem value="INCIDENT">Incident</SelectItem>
                <SelectItem value="NONCONFORMITY">Nonconformity</SelectItem>
                <SelectItem value="COMPLIANCE_OBLIGATION">Compliance Obligation</SelectItem>
                <SelectItem value="LEGAL">Legal Requirement</SelectItem>
                <SelectItem value="ASPECT_IMPACT">Environmental Aspect & Impact</SelectItem>
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
              placeholder="Brief description of the entry"
            />
          </div>

          <div>
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              rows={4}
              placeholder="Detailed information, actions taken, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="Responsible person"
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
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              🔴 Open = Action required • 🟡 In Progress = Being addressed • 🟢 Closed = Resolved
            </p>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {entry?.id && (
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

