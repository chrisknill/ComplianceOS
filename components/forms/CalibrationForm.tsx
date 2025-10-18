'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CalibrationFormProps {
  open: boolean
  onClose: () => void
  calibration?: any
  onSave: () => void
}

export function CalibrationForm({ open, onClose, calibration, onSave }: CalibrationFormProps) {
  const [formData, setFormData] = useState({
    equipmentId: calibration?.equipment?.id || '',
    dueDate: calibration?.dueDate ? new Date(calibration.dueDate).toISOString().split('T')[0] : '',
    performedOn: calibration?.performedOn ? new Date(calibration.performedOn).toISOString().split('T')[0] : '',
    result: calibration?.result || '',
    certificateUrl: calibration?.certificateUrl || '',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (calibration) {
      setFormData({
        equipmentId: calibration.equipment?.id || '',
        dueDate: calibration.dueDate ? new Date(calibration.dueDate).toISOString().split('T')[0] : '',
        performedOn: calibration.performedOn ? new Date(calibration.performedOn).toISOString().split('T')[0] : '',
        result: calibration.result || '',
        certificateUrl: calibration.certificateUrl || '',
      })
    } else {
      setFormData({
        equipmentId: '',
        dueDate: '',
        performedOn: '',
        result: '',
        certificateUrl: '',
      })
    }
  }, [calibration, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = calibration?.id ? 'PUT' : 'POST'
      const url = calibration?.id ? `/api/calibrations/${calibration.id}` : '/api/calibrations'

      const payload = {
        equipmentId: formData.equipmentId,
        dueDate: formData.dueDate || null,
        performedOn: formData.performedOn || null,
        result: formData.result || null,
        certificateUrl: formData.certificateUrl || null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save calibration')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving calibration:', error)
      alert('Failed to save calibration')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!calibration?.id) return
    if (!confirm('Are you sure you want to delete this calibration record?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/calibrations/${calibration.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete calibration')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error deleting calibration:', error)
      alert('Failed to delete calibration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{calibration?.id ? 'Edit' : 'Add'} Calibration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="performedOn">Performed Date</Label>
            <Input
              id="performedOn"
              type="date"
              value={formData.performedOn}
              onChange={(e) => setFormData({ ...formData, performedOn: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="result">Result</Label>
            <Select
              value={formData.result}
              onValueChange={(value) => setFormData({ ...formData, result: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_TESTED">Not tested yet</SelectItem>
                <SelectItem value="PASS">Pass</SelectItem>
                <SelectItem value="FAIL">Fail</SelectItem>
                <SelectItem value="AS FOUND">As Found</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="certificateUrl">Certificate URL</Label>
            <Input
              id="certificateUrl"
              type="url"
              value={formData.certificateUrl}
              onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
              placeholder="https://..."
            />
            <p className="text-xs text-slate-500 mt-1">
              Link to calibration certificate (SharePoint, OneDrive, etc.)
            </p>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {calibration?.id && (
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

