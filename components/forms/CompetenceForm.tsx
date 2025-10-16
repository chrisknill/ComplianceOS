'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CompetenceFormProps {
  open: boolean
  onClose: () => void
  competence?: any
  onSave: () => void
}

export function CompetenceForm({ open, onClose, competence, onSave }: CompetenceFormProps) {
  const [formData, setFormData] = useState({
    userId: '',
    role: '',
    requiredPPE: [] as string[],
    training: [] as string[],
    medicalFit: true,
    medicalDate: '',
    medicalExpiry: '',
    authorized: [] as string[],
    restrictions: '',
  })

  const [loading, setLoading] = useState(false)
  const [ppeInput, setPpeInput] = useState('')
  const [trainingInput, setTrainingInput] = useState('')
  const [authInput, setAuthInput] = useState('')

  useEffect(() => {
    if (competence) {
      const parsePPE = (str: string) => {
        try { return JSON.parse(str) } catch { return [] }
      }
      const parseTraining = (str: string) => {
        try { return JSON.parse(str) } catch { return [] }
      }
      const parseAuth = (str: string) => {
        try { return JSON.parse(str) } catch { return [] }
      }

      setFormData({
        userId: competence.userId || '',
        role: competence.role || '',
        requiredPPE: parsePPE(competence.requiredPPE),
        training: parseTraining(competence.training),
        medicalFit: competence.medicalFit !== undefined ? competence.medicalFit : true,
        medicalDate: competence.medicalDate ? new Date(competence.medicalDate).toISOString().split('T')[0] : '',
        medicalExpiry: competence.medicalExpiry ? new Date(competence.medicalExpiry).toISOString().split('T')[0] : '',
        authorized: parseAuth(competence.authorized),
        restrictions: competence.restrictions || '',
      })
    } else {
      setFormData({
        userId: '',
        role: '',
        requiredPPE: [],
        training: [],
        medicalFit: true,
        medicalDate: '',
        medicalExpiry: '',
        authorized: [],
        restrictions: '',
      })
    }
  }, [competence, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = competence?.id ? 'PUT' : 'POST'
      const url = competence?.id ? `/api/ohs/competence/${competence.id}` : '/api/ohs/competence'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save competence:', error)
      alert('Failed to save competence record. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!competence?.id) return
    if (!confirm('Are you sure you want to delete this competence record?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/ohs/competence/${competence.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      onSave()
      onClose()
    } catch (error) {
      console.error('Failed to delete competence:', error)
      alert('Failed to delete competence record. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addPPE = (ppe: string) => {
    if (ppe && !formData.requiredPPE.includes(ppe)) {
      setFormData({ ...formData, requiredPPE: [...formData.requiredPPE, ppe] })
      setPpeInput('')
    }
  }

  const removePPE = (ppe: string) => {
    setFormData({ ...formData, requiredPPE: formData.requiredPPE.filter(p => p !== ppe) })
  }

  const addTraining = () => {
    if (trainingInput && !formData.training.includes(trainingInput)) {
      setFormData({ ...formData, training: [...formData.training, trainingInput] })
      setTrainingInput('')
    }
  }

  const removeTraining = (training: string) => {
    setFormData({ ...formData, training: formData.training.filter(t => t !== training) })
  }

  const addAuthorization = () => {
    if (authInput && !formData.authorized.includes(authInput)) {
      setFormData({ ...formData, authorized: [...formData.authorized, authInput] })
      setAuthInput('')
    }
  }

  const removeAuthorization = (auth: string) => {
    setFormData({ ...formData, authorized: formData.authorized.filter(a => a !== auth) })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{competence?.id ? 'Edit' : 'Add'} OH&S Competence</DialogTitle>
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
              <Label htmlFor="role">Role/Position *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                placeholder="e.g., Forklift Operator"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Required PPE</h3>
            <div className="flex gap-2 mb-2">
              <Select value={ppeInput} onValueChange={(value) => addPPE(value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select PPE to add..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HEAD">Head Protection</SelectItem>
                  <SelectItem value="EYE">Eye Protection</SelectItem>
                  <SelectItem value="HEARING">Hearing Protection</SelectItem>
                  <SelectItem value="HAND">Hand Protection</SelectItem>
                  <SelectItem value="FOOT">Foot Protection</SelectItem>
                  <SelectItem value="HI_VIS">High Visibility</SelectItem>
                  <SelectItem value="FALL_ARREST">Fall Arrest</SelectItem>
                  <SelectItem value="RESPIRATORY">Respiratory Protection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requiredPPE.map((ppe) => (
                <span
                  key={ppe}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                >
                  {ppe.replace('_', ' ')}
                  <button
                    type="button"
                    onClick={() => removePPE(ppe)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Training Completed</h3>
            <div className="flex gap-2 mb-2">
              <Input
                value={trainingInput}
                onChange={(e) => setTrainingInput(e.target.value)}
                placeholder="Enter training course..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTraining())}
              />
              <Button type="button" onClick={addTraining}>Add</Button>
            </div>
            <div className="space-y-2">
              {formData.training.map((training, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                  <span className="text-sm text-slate-700">{training}</span>
                  <button
                    type="button"
                    onClick={() => removeTraining(training)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Authorizations</h3>
            <div className="flex gap-2 mb-2">
              <Input
                value={authInput}
                onChange={(e) => setAuthInput(e.target.value)}
                placeholder="Enter authorization..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthorization())}
              />
              <Button type="button" onClick={addAuthorization}>Add</Button>
            </div>
            <div className="space-y-2">
              {formData.authorized.map((auth, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                  <span className="text-sm text-slate-700">{auth}</span>
                  <button
                    type="button"
                    onClick={() => removeAuthorization(auth)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Medical Fitness</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="medicalFit">Medical Fitness</Label>
                <Select
                  value={formData.medicalFit ? 'true' : 'false'}
                  onValueChange={(value) => setFormData({ ...formData, medicalFit: value === 'true' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Fit</SelectItem>
                    <SelectItem value="false">Not Fit / Review Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="medicalDate">Medical Date</Label>
                <Input
                  id="medicalDate"
                  type="date"
                  value={formData.medicalDate}
                  onChange={(e) => setFormData({ ...formData, medicalDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="medicalExpiry">Medical Expiry</Label>
                <Input
                  id="medicalExpiry"
                  type="date"
                  value={formData.medicalExpiry}
                  onChange={(e) => setFormData({ ...formData, medicalExpiry: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="restrictions">Work Restrictions (if any)</Label>
            <Textarea
              id="restrictions"
              value={formData.restrictions}
              onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
              placeholder="Describe any work restrictions or limitations..."
              rows={3}
            />
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {competence?.id && (
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
                {loading ? 'Saving...' : 'Save Competence'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

