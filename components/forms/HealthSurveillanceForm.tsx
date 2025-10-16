'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface HealthSurveillanceFormProps {
  open: boolean
  onClose: () => void
  surveillance?: any
  onSave: () => void
}

export function HealthSurveillanceForm({ open, onClose, surveillance, onSave }: HealthSurveillanceFormProps) {
  const [formData, setFormData] = useState({
    userId: '',
    exposureType: 'NOISE',
    exposureLevel: '',
    monitoringFreq: '',
    lastTest: '',
    nextTest: '',
    results: '',
    restrictions: '',
    status: 'COMPLIANT',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (surveillance) {
      setFormData({
        userId: surveillance.userId || '',
        exposureType: surveillance.exposureType || 'NOISE',
        exposureLevel: surveillance.exposureLevel || '',
        monitoringFreq: surveillance.monitoringFreq || '',
        lastTest: surveillance.lastTest ? new Date(surveillance.lastTest).toISOString().split('T')[0] : '',
        nextTest: surveillance.nextTest ? new Date(surveillance.nextTest).toISOString().split('T')[0] : '',
        results: surveillance.results || '',
        restrictions: surveillance.restrictions || '',
        status: surveillance.status || 'COMPLIANT',
      })
    } else {
      setFormData({
        userId: '',
        exposureType: 'NOISE',
        exposureLevel: '',
        monitoringFreq: '',
        lastTest: '',
        nextTest: '',
        results: '',
        restrictions: '',
        status: 'COMPLIANT',
      })
    }
  }, [surveillance, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = surveillance?.id ? 'PUT' : 'POST'
      const url = surveillance?.id ? `/api/ohs/health-surveillance/${surveillance.id}` : '/api/ohs/health-surveillance'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save surveillance:', error)
      alert('Failed to save surveillance record. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!surveillance?.id) return
    if (!confirm('Are you sure you want to delete this surveillance record?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/ohs/health-surveillance/${surveillance.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to delete surveillance:', error)
      alert('Failed to delete surveillance record. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{surveillance?.id ? 'Edit' : 'Add'} Health Surveillance</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userId">Worker ID *</Label>
              <Input
                id="userId"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                required
                placeholder="e.g., EMP001"
              />
            </div>

            <div>
              <Label htmlFor="exposureType">Exposure Type *</Label>
              <Select
                value={formData.exposureType}
                onValueChange={(value) => setFormData({ ...formData, exposureType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOISE">Noise</SelectItem>
                  <SelectItem value="DUST">Dust</SelectItem>
                  <SelectItem value="FUMES">Fumes</SelectItem>
                  <SelectItem value="VIBRATION">Vibration</SelectItem>
                  <SelectItem value="CHEMICAL">Chemical</SelectItem>
                  <SelectItem value="BIOLOGICAL">Biological</SelectItem>
                  <SelectItem value="ERGONOMIC">Ergonomic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exposureLevel">Exposure Level/Measurement</Label>
              <Input
                id="exposureLevel"
                value={formData.exposureLevel}
                onChange={(e) => setFormData({ ...formData, exposureLevel: e.target.value })}
                placeholder="e.g., 85 dB(A) TWA"
              />
            </div>

            <div>
              <Label htmlFor="monitoringFreq">Monitoring Frequency</Label>
              <Input
                id="monitoringFreq"
                value={formData.monitoringFreq}
                onChange={(e) => setFormData({ ...formData, monitoringFreq: e.target.value })}
                placeholder="e.g., Annual, Bi-annual"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lastTest">Last Test Date</Label>
              <Input
                id="lastTest"
                type="date"
                value={formData.lastTest}
                onChange={(e) => setFormData({ ...formData, lastTest: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="nextTest">Next Test Date</Label>
              <Input
                id="nextTest"
                type="date"
                value={formData.nextTest}
                onChange={(e) => setFormData({ ...formData, nextTest: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="results">Test Results/Findings</Label>
            <Textarea
              id="results"
              value={formData.results}
              onChange={(e) => setFormData({ ...formData, results: e.target.value })}
              placeholder="Summary of test results and findings..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="restrictions">Work Restrictions (if any)</Label>
            <Textarea
              id="restrictions"
              value={formData.restrictions}
              onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
              placeholder="Any work restrictions based on surveillance results..."
              rows={2}
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
                <SelectItem value="COMPLIANT">Compliant</SelectItem>
                <SelectItem value="DUE_SOON">Due Soon</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="ACTION_REQUIRED">Action Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {surveillance?.id && (
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
                {loading ? 'Saving...' : 'Save Record'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

