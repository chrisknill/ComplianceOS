'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Audit {
  id: string
  auditNumber: string
  auditTypeId: string
  title: string
  description?: string
  scope: string
  objectives?: string
  auditStandard: string
  auditCriteria?: string
  plannedStartDate: string
  plannedEndDate: string
  actualStartDate?: string
  actualEndDate?: string
  status: string
  ragStatus: string
  leadAuditor?: string
  leadAuditorName?: string
  auditTeam?: string
  auditee?: string
  auditeeName?: string
  location?: string
  auditMethod?: string
  effectiveness?: number
  notes?: string
  attachments?: string
}

interface AuditType {
  id: string
  name: string
  category: string
  frequency: string
  standard?: string
}

interface AuditFormProps {
  audit?: Audit | null
  auditTypes: AuditType[]
  onSubmit: () => void
  onCancel: () => void
}

export function AuditForm({ audit, auditTypes, onSubmit, onCancel }: AuditFormProps) {
  const [formData, setFormData] = useState({
    auditTypeId: '',
    title: '',
    description: '',
    scope: '',
    objectives: '',
    auditStandard: 'ISO 9001',
    auditCriteria: '',
    plannedStartDate: new Date().toISOString().split('T')[0],
    plannedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    actualStartDate: '',
    actualEndDate: '',
    status: 'PLANNED',
    ragStatus: 'GREEN',
    leadAuditor: '',
    leadAuditorName: '',
    auditTeam: '',
    auditee: '',
    auditeeName: '',
    location: '',
    auditMethod: 'ON_SITE',
    effectiveness: '',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (audit) {
      setFormData({
        auditTypeId: audit.auditTypeId,
        title: audit.title,
        description: audit.description || '',
        scope: audit.scope,
        objectives: audit.objectives || '',
        auditStandard: audit.auditStandard,
        auditCriteria: audit.auditCriteria || '',
        plannedStartDate: audit.plannedStartDate.split('T')[0],
        plannedEndDate: audit.plannedEndDate.split('T')[0],
        actualStartDate: audit.actualStartDate ? audit.actualStartDate.split('T')[0] : '',
        actualEndDate: audit.actualEndDate ? audit.actualEndDate.split('T')[0] : '',
        status: audit.status,
        ragStatus: audit.ragStatus,
        leadAuditor: audit.leadAuditor || '',
        leadAuditorName: audit.leadAuditorName || '',
        auditTeam: audit.auditTeam || '',
        auditee: audit.auditee || '',
        auditeeName: audit.auditeeName || '',
        location: audit.location || '',
        auditMethod: audit.auditMethod || 'ON_SITE',
        effectiveness: audit.effectiveness ? audit.effectiveness.toString() : '',
        notes: audit.notes || '',
      })
    }
  }, [audit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        effectiveness: formData.effectiveness ? parseInt(formData.effectiveness) : undefined,
        plannedStartDate: new Date(formData.plannedStartDate).toISOString(),
        plannedEndDate: new Date(formData.plannedEndDate).toISOString(),
        actualStartDate: formData.actualStartDate ? new Date(formData.actualStartDate).toISOString() : undefined,
        actualEndDate: formData.actualEndDate ? new Date(formData.actualEndDate).toISOString() : undefined,
      }

      const url = audit 
        ? `/api/audits/${audit.id}`
        : '/api/audits'
      
      const method = audit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save audit')
      }

      onSubmit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Audit details and scope</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="auditTypeId">Audit Type *</Label>
              <Select value={formData.auditTypeId} onValueChange={(value) => setFormData({ ...formData, auditTypeId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audit type" />
                </SelectTrigger>
                <SelectContent>
                  {auditTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.category})
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Audit title"
                required
              />
            </div>

            <div>
              <Label htmlFor="scope">Scope *</Label>
              <Textarea
                id="scope"
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                placeholder="Audit scope and areas to be covered"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="objectives">Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Audit objectives"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="auditStandard">Audit Standard *</Label>
              <Select value={formData.auditStandard} onValueChange={(value) => setFormData({ ...formData, auditStandard: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISO 9001">ISO 9001:2015</SelectItem>
                  <SelectItem value="ISO 14001">ISO 14001:2015</SelectItem>
                  <SelectItem value="ISO 45001">ISO 45001:2018</SelectItem>
                  <SelectItem value="CUSTOM">Custom Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="auditCriteria">Audit Criteria</Label>
              <Input
                id="auditCriteria"
                value={formData.auditCriteria}
                onChange={(e) => setFormData({ ...formData, auditCriteria: e.target.value })}
                placeholder="Specific clauses or requirements"
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule & Status</CardTitle>
            <CardDescription>Timing and current status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plannedStartDate">Planned Start *</Label>
                <Input
                  id="plannedStartDate"
                  type="date"
                  value={formData.plannedStartDate}
                  onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="plannedEndDate">Planned End *</Label>
                <Input
                  id="plannedEndDate"
                  type="date"
                  value={formData.plannedEndDate}
                  onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="actualStartDate">Actual Start</Label>
                <Input
                  id="actualStartDate"
                  type="date"
                  value={formData.actualStartDate}
                  onChange={(e) => setFormData({ ...formData, actualStartDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="actualEndDate">Actual End</Label>
                <Input
                  id="actualEndDate"
                  type="date"
                  value={formData.actualEndDate}
                  onChange={(e) => setFormData({ ...formData, actualEndDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNED">Planned</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="DEFERRED">Deferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ragStatus">RAG Status</Label>
                <Select value={formData.ragStatus} onValueChange={(value) => setFormData({ ...formData, ragStatus: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GREEN">Green</SelectItem>
                    <SelectItem value="AMBER">Amber</SelectItem>
                    <SelectItem value="RED">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="auditMethod">Audit Method</Label>
              <Select value={formData.auditMethod} onValueChange={(value) => setFormData({ ...formData, auditMethod: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ON_SITE">On-Site</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="effectiveness">Effectiveness Rating</Label>
              <Select value={formData.effectiveness} onValueChange={(value) => setFormData({ ...formData, effectiveness: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
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
          </CardContent>
        </Card>
      </div>

      {/* Team & Location */}
      <Card>
        <CardHeader>
          <CardTitle>Team & Location</CardTitle>
          <CardDescription>Audit team and location details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leadAuditor">Lead Auditor ID</Label>
              <Input
                id="leadAuditor"
                value={formData.leadAuditor}
                onChange={(e) => setFormData({ ...formData, leadAuditor: e.target.value })}
                placeholder="Auditor ID"
              />
            </div>
            <div>
              <Label htmlFor="leadAuditorName">Lead Auditor Name</Label>
              <Input
                id="leadAuditorName"
                value={formData.leadAuditorName}
                onChange={(e) => setFormData({ ...formData, leadAuditorName: e.target.value })}
                placeholder="Full name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="auditTeam">Audit Team</Label>
            <Textarea
              id="auditTeam"
              value={formData.auditTeam}
              onChange={(e) => setFormData({ ...formData, auditTeam: e.target.value })}
              placeholder="List of audit team members (one per line)"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="auditee">Auditee Department</Label>
              <Input
                id="auditee"
                value={formData.auditee}
                onChange={(e) => setFormData({ ...formData, auditee: e.target.value })}
                placeholder="Department or area"
              />
            </div>
            <div>
              <Label htmlFor="auditeeName">Auditee Contact</Label>
              <Input
                id="auditeeName"
                value={formData.auditeeName}
                onChange={(e) => setFormData({ ...formData, auditeeName: e.target.value })}
                placeholder="Contact person name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Audit location"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Notes and additional details</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed audit description..."
              rows={3}
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : audit ? 'Update Audit' : 'Create Audit'}
        </Button>
      </div>
    </form>
  )
}