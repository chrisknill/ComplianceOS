'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EmergencyDrillFormProps {
  open: boolean
  onClose: () => void
  drill?: any
  onSave: () => void
}

export function EmergencyDrillForm({ open, onClose, drill, onSave }: EmergencyDrillFormProps) {
  const [formData, setFormData] = useState({
    type: 'FIRE',
    date: '',
    location: '',
    participants: '',
    duration: '',
    scenarioDesc: '',
    observations: '',
    effectiveness: 'GOOD',
    improvements: [] as string[],
    nextDrill: '',
  })

  const [improvementInput, setImprovementInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (drill) {
      const parseImprovements = (str: string) => {
        try { return JSON.parse(str) } catch { return [] }
      }

      setFormData({
        type: drill.type || 'FIRE',
        date: drill.date ? new Date(drill.date).toISOString().split('T')[0] : '',
        location: drill.location || '',
        participants: drill.participants?.toString() || '',
        duration: drill.duration?.toString() || '',
        scenarioDesc: drill.scenarioDesc || '',
        observations: drill.observations || '',
        effectiveness: drill.effectiveness || 'GOOD',
        improvements: parseImprovements(drill.improvements),
        nextDrill: drill.nextDrill ? new Date(drill.nextDrill).toISOString().split('T')[0] : '',
      })
    } else {
      setFormData({
        type: 'FIRE',
        date: new Date().toISOString().split('T')[0],
        location: '',
        participants: '',
        duration: '',
        scenarioDesc: '',
        observations: '',
        effectiveness: 'GOOD',
        improvements: [],
        nextDrill: '',
      })
    }
  }, [drill, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = drill?.id ? 'PUT' : 'POST'
      const url = drill?.id ? `/api/ohs/emergency/${drill.id}` : '/api/ohs/emergency'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          participants: formData.participants ? parseInt(formData.participants) : null,
          duration: formData.duration ? parseInt(formData.duration) : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save drill:', error)
      alert('Failed to save emergency drill. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!drill?.id) return
    if (!confirm('Are you sure you want to delete this drill record?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/ohs/emergency/${drill.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to delete drill:', error)
      alert('Failed to delete drill. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addImprovement = () => {
    if (improvementInput && !formData.improvements.includes(improvementInput)) {
      setFormData({ ...formData, improvements: [...formData.improvements, improvementInput] })
      setImprovementInput('')
    }
  }

  const removeImprovement = (improvement: string) => {
    setFormData({ ...formData, improvements: formData.improvements.filter(i => i !== improvement) })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{drill?.id ? 'Edit' : 'Add'} Emergency Drill</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Drill Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIRE">Fire</SelectItem>
                  <SelectItem value="EVACUATION">Evacuation</SelectItem>
                  <SelectItem value="SPILL">Spill</SelectItem>
                  <SelectItem value="MEDICAL">Medical Emergency</SelectItem>
                  <SelectItem value="LOCKDOWN">Lockdown</SelectItem>
                  <SelectItem value="NATURAL_DISASTER">Natural Disaster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Drill Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Main Building"
              />
            </div>

            <div>
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                type="number"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                placeholder="Number of people"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 15"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="scenarioDesc">Scenario Description</Label>
            <Textarea
              id="scenarioDesc"
              value={formData.scenarioDesc}
              onChange={(e) => setFormData({ ...formData, scenarioDesc: e.target.value })}
              placeholder="Describe the drill scenario..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Key observations during the drill..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="effectiveness">Effectiveness Rating</Label>
            <Select
              value={formData.effectiveness}
              onValueChange={(value) => setFormData({ ...formData, effectiveness: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCELLENT">Excellent</SelectItem>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="SATISFACTORY">Satisfactory</SelectItem>
                <SelectItem value="NEEDS_IMPROVEMENT">Needs Improvement</SelectItem>
                <SelectItem value="POOR">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Improvement Actions</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={improvementInput}
                onChange={(e) => setImprovementInput(e.target.value)}
                placeholder="Add improvement action..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImprovement())}
              />
              <Button type="button" onClick={addImprovement}>Add</Button>
            </div>
            <div className="space-y-2">
              {formData.improvements.map((improvement, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                  <span className="text-sm text-slate-700">{improvement}</span>
                  <button
                    type="button"
                    onClick={() => removeImprovement(improvement)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="nextDrill">Next Drill Scheduled</Label>
            <Input
              id="nextDrill"
              type="date"
              value={formData.nextDrill}
              onChange={(e) => setFormData({ ...formData, nextDrill: e.target.value })}
            />
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {drill?.id && (
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
                {loading ? 'Saving...' : 'Save Drill'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

