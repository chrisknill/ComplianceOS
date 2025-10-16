'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Generate,
} from 'lucide-react'

interface ManagementReview {
  id: string
  title: string
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  location?: string
  meetingType: string
  standards: string[]
  agenda?: any
  discussionNotes?: string
  status: string
  attendees: any[]
  inputs: any[]
  outputs: any[]
  actions: any[]
}

interface OverviewTabProps {
  review: ManagementReview
  onUpdate: (review: ManagementReview) => void
}

export default function OverviewTab({ review, onUpdate }: OverviewTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerateAgendaOpen, setIsGenerateAgendaOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: review.title,
    scheduledAt: review.scheduledAt,
    location: review.location || '',
    meetingType: review.meetingType,
    standards: review.standards,
  })

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/management-review/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedReview = await response.json()
        onUpdate(updatedReview)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  const handleGenerateAgenda = async () => {
    try {
      // Generate agenda based on selected standards
      const agendaItems = [
        'Welcome and introductions',
        'Review of previous meeting minutes',
        'Status of previous actions',
      ]

      // Add standard-specific items
      if (formData.standards.includes('ISO9001')) {
        agendaItems.push(
          'Quality Management System performance',
          'Customer satisfaction and feedback',
          'Process performance and conformity',
          'Nonconformities and corrective actions'
        )
      }

      if (formData.standards.includes('ISO14001')) {
        agendaItems.push(
          'Environmental Management System performance',
          'Environmental objectives progress',
          'Compliance evaluation',
          'Environmental incidents and nonconformities'
        )
      }

      if (formData.standards.includes('ISO45001')) {
        agendaItems.push(
          'OH&S Management System performance',
          'Safety incidents and near misses',
          'Risk assessment updates',
          'Training and competence'
        )
      }

      agendaItems.push(
        'Resource adequacy',
        'Risks and opportunities',
        'Improvement opportunities',
        'Decisions and actions',
        'Next review date'
      )

      // Update the agenda
      const response = await fetch(`/api/management-review/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ agenda: JSON.stringify(agendaItems) }),
      })

      if (response.ok) {
        const updatedReview = await response.json()
        onUpdate(updatedReview)
        setIsGenerateAgendaOpen(false)
      }
    } catch (error) {
      console.error('Error generating agenda:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'text-gray-600',
      SCHEDULED: 'text-blue-600',
      IN_PROGRESS: 'text-yellow-600',
      COMPLETED: 'text-green-600',
      CLOSED: 'text-gray-600',
    }
    return colors[status as keyof typeof colors] || 'text-gray-600'
  }

  const getStandardBadges = (standards: string[]) => {
    const standardColors = {
      ISO9001: 'bg-blue-100 text-blue-800',
      ISO14001: 'bg-green-100 text-green-800',
      ISO45001: 'bg-purple-100 text-purple-800',
    }

    return standards.map((standard) => (
      <Badge
        key={standard}
        className={standardColors[standard as keyof typeof standardColors] || 'bg-gray-100 text-gray-800'}
      >
        {standard}
      </Badge>
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate completion metrics
  const totalInputs = review.inputs.length
  const completedInputs = review.inputs.filter(input => input.status === 'PROVIDED').length
  const pendingInputs = review.inputs.filter(input => input.status === 'PENDING').length

  const requiredAttendees = review.attendees.filter(a => a.required)
  const presentAttendees = requiredAttendees.filter(a => a.present)
  const signedAttendees = requiredAttendees.filter(a => a.signedOffAt)

  const openActions = review.actions.filter(action => action.status === 'OPEN')
  const completedActions = review.actions.filter(action => action.status === 'DONE')

  return (
    <div className="space-y-6">
      {/* Review Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Review Details</CardTitle>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Meeting location or video link"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Type
                </label>
                <Select
                  value={formData.meetingType}
                  onValueChange={(value) => setFormData({ ...formData, meetingType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                    <SelectItem value="Extraordinary">Extraordinary</SelectItem>
                    <SelectItem value="Special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{review.title}</h3>
                  <p className="text-gray-600">{review.meetingType}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(review.scheduledAt)}</span>
                </div>
                {review.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{review.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <span className={getStatusColor(review.status)}>
                    {review.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Standards:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getStandardBadges(review.standards)}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Agenda</span>
                  <Dialog open={isGenerateAgendaOpen} onOpenChange={setIsGenerateAgendaOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Generate className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Agenda</DialogTitle>
                        <DialogDescription>
                          Generate a standard agenda based on the selected ISO standards.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          This will create a standard agenda including all required items for:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {formData.standards.map(standard => (
                            <li key={standard}>{standard} requirements</li>
                          ))}
                        </ul>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGenerateAgendaOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleGenerateAgenda}>
                          Generate Agenda
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {review.agenda ? (
                  <div className="text-sm">
                    <ol className="list-decimal list-inside space-y-1">
                      {review.agenda.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No agenda generated yet</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Input Completion</p>
                <p className="text-2xl font-bold">
                  {totalInputs > 0 ? Math.round((completedInputs / totalInputs) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">
                  {completedInputs} of {totalInputs} completed
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            {pendingInputs > 0 && (
              <div className="mt-2 flex items-center text-sm text-yellow-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {pendingInputs} pending
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendee Sign-off</p>
                <p className="text-2xl font-bold">
                  {requiredAttendees.length > 0 ? Math.round((signedAttendees.length / requiredAttendees.length) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">
                  {signedAttendees.length} of {requiredAttendees.length} signed
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            {presentAttendees.length < requiredAttendees.length && (
              <div className="mt-2 flex items-center text-sm text-yellow-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {requiredAttendees.length - presentAttendees.length} not present
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Action Progress</p>
                <p className="text-2xl font-bold">
                  {review.actions.length > 0 ? Math.round((completedActions.length / review.actions.length) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">
                  {completedActions.length} of {review.actions.length} completed
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            {openActions.length > 0 && (
              <div className="mt-2 flex items-center text-sm text-yellow-600">
                <Clock className="h-4 w-4 mr-1" />
                {openActions.length} open
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Review Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Current status: <span className={getStatusColor(review.status)}>{review.status.replace('_', ' ')}</span>
              </p>
              {review.status === 'DRAFT' && (
                <p className="text-xs text-gray-500 mt-1">
                  Ready to schedule and begin the review process
                </p>
              )}
              {review.status === 'SCHEDULED' && (
                <p className="text-xs text-gray-500 mt-1">
                  Meeting is scheduled and ready to begin
                </p>
              )}
              {review.status === 'IN_PROGRESS' && (
                <p className="text-xs text-gray-500 mt-1">
                  Review meeting is currently in progress
                </p>
              )}
              {review.status === 'COMPLETED' && (
                <p className="text-xs text-gray-500 mt-1">
                  Review completed, ready to close
                </p>
              )}
              {review.status === 'CLOSED' && (
                <p className="text-xs text-gray-500 mt-1">
                  Review is closed and archived
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              {review.status === 'DRAFT' && (
                <Button variant="outline" size="sm">
                  Schedule
                </Button>
              )}
              {review.status === 'SCHEDULED' && (
                <Button variant="outline" size="sm">
                  Start Review
                </Button>
              )}
              {review.status === 'IN_PROGRESS' && (
                <Button variant="outline" size="sm">
                  Complete Review
                </Button>
              )}
              {review.status === 'COMPLETED' && (
                <Button variant="outline" size="sm">
                  Close Review
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
