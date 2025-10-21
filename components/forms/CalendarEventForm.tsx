'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Clock, MapPin, Users, Plus, Video, Building2, Settings, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

interface CalendarEventFormProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
  defaultTitle?: string
  defaultDescription?: string
  defaultAttendees?: Array<{ email: string; name: string }>
}

interface Attendee {
  email: string
  name: string
}

interface Resource {
  id: string
  name: string
  type: 'room' | 'equipment' | 'vehicle'
  capacity?: number
}

export function CalendarEventForm({ 
  trigger, 
  onSuccess, 
  defaultTitle = '', 
  defaultDescription = '',
  defaultAttendees = []
}: CalendarEventFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: defaultTitle,
    description: defaultDescription,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    reminderMinutes: '15',
    calendarId: 'primary',
    isTeamsMeeting: false,
    meetingType: 'in-person' // 'in-person', 'teams', 'hybrid'
  })
  const [attendees, setAttendees] = useState<Attendee[]>(defaultAttendees)
  const [resources, setResources] = useState<Resource[]>([])
  const [newAttendee, setNewAttendee] = useState({ email: '', name: '' })
  const [newResource, setNewResource] = useState({ name: '', type: 'room' as const })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

      const payload = {
        title: formData.title,
        description: formData.description,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        location: formData.location,
        attendees: attendees,
        resources: resources,
        reminderMinutes: [parseInt(formData.reminderMinutes)],
        calendarId: formData.calendarId,
        isTeamsMeeting: formData.isTeamsMeeting,
        meetingType: formData.meetingType
      }

      const response = await fetch('/api/calendar/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Calendar event created successfully!')
        setOpen(false)
        setFormData({
          title: '',
          description: '',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          location: '',
          reminderMinutes: '15',
          calendarId: 'primary',
          isTeamsMeeting: false,
          meetingType: 'in-person'
        })
        setAttendees([])
        setResources([])
        onSuccess?.()
      } else {
        console.error('Calendar event creation failed:', result)
        toast.error(result.error || 'Failed to create calendar event')
      }
    } catch (error) {
      console.error('Calendar event creation error:', error)
      toast.error(`Failed to create calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const addAttendee = () => {
    if (newAttendee.email && newAttendee.name) {
      setAttendees([...attendees, newAttendee])
      setNewAttendee({ email: '', name: '' })
    }
  }

  const removeAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index))
  }

  const addResource = () => {
    if (newResource.name) {
      const resource: Resource = {
        id: Date.now().toString(),
        name: newResource.name,
        type: newResource.type
      }
      setResources([...resources, resource])
      setNewResource({ name: '', type: 'room' })
    }
  }

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index))
  }

  const getMinDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        times.push({ value: timeString, label: displayTime })
      }
    }
    return times
  }

  return (
    <>
      <style jsx global>{`
        /* Make calendar icon bigger */
        input[type="date"]::-webkit-calendar-picker-indicator {
          transform: scale(2);
          margin-right: 12px;
          width: 24px;
          height: 24px;
        }
        
        /* Ensure consistent font size for all inputs */
        input[type="date"]::-webkit-datetime-edit {
          font-size: 14px;
          font-family: inherit;
        }
        
        input[type="time"]::-webkit-datetime-edit {
          font-size: 14px;
          font-family: inherit;
        }
        
        /* Try to make calendar popup bigger - this may not work in all browsers */
        input[type="date"]::-webkit-calendar-picker-indicator:active {
          transform: scale(2.5);
        }
        
        /* Alternative approach - make the input itself bigger to trigger bigger popup */
        input[type="date"] {
          font-size: 16px;
          padding: 12px;
          min-height: 48px;
        }
        
        input[type="time"] {
          font-size: 16px;
          padding: 12px;
          min-height: 48px;
        }
        
        /* Ensure all form inputs have consistent styling */
        .calendar-form input {
          font-size: 16px;
          font-family: inherit;
        }
      `}</style>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Create Calendar Event
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Calendar Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 calendar-form">
          {/* Event Title */}
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          {/* Date and Time - Outlook Style */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={getMinDateTime()}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <div className="relative">
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                  className="pr-10"
                  placeholder="Click dropdown or type time"
                />
                <Select
                  value={formData.startTime}
                  onValueChange={(value) => setFormData({ ...formData, startTime: value })}
                >
                  <SelectTrigger className="absolute inset-0 opacity-0 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Click dropdown for 30-min increments or type directly</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate || getMinDateTime()}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time *</Label>
              <div className="relative">
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                  className="pr-10"
                  placeholder="Click dropdown or type time"
                />
                <Select
                  value={formData.endTime}
                  onValueChange={(value) => setFormData({ ...formData, endTime: value })}
                >
                  <SelectTrigger className="absolute inset-0 opacity-0 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Click dropdown for 30-min increments or type directly</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
                className="pl-10"
              />
            </div>
          </div>

          {/* Meeting Type and Teams Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meetingType">Meeting Type</Label>
              <Select value={formData.meetingType} onValueChange={(value) => setFormData({ ...formData, meetingType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="teams">Teams Meeting</SelectItem>
                  <SelectItem value="hybrid">Hybrid (In-Person + Teams)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isTeamsMeeting"
                checked={formData.isTeamsMeeting}
                onChange={(e) => setFormData({ ...formData, isTeamsMeeting: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isTeamsMeeting" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Include Teams Meeting Link
              </Label>
            </div>
          </div>

          {/* Attendees */}
          <div>
            <Label>Attendees</Label>
            <div className="space-y-3">
              {attendees.map((attendee, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <div className="flex-1">
                    <span className="font-medium">{attendee.name}</span>
                    <span className="text-sm text-slate-500 ml-2">({attendee.email})</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAttendee(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Name"
                  value={newAttendee.name}
                  onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newAttendee.email}
                  onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                />
                <Button type="button" onClick={addAttendee}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <Label>Resources</Label>
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <div key={resource.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <span className="font-medium">{resource.name}</span>
                    <span className="text-sm text-slate-500 ml-2 capitalize">({resource.type})</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeResource(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Resource name (e.g., Conference Room A)"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                />
                <Select value={newResource.type} onValueChange={(value) => setNewResource({ ...newResource, type: value as 'room' | 'equipment' | 'vehicle' })}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room">Room</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addResource}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div>
            <Label htmlFor="reminderMinutes">Reminder</Label>
            <Select
              value={formData.reminderMinutes}
              onValueChange={(value) => setFormData({ ...formData, reminderMinutes: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="1440">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <div>
            <Label htmlFor="calendarId">Calendar</Label>
            <Select
              value={formData.calendarId}
              onValueChange={(value) => setFormData({ ...formData, calendarId: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary Calendar</SelectItem>
                <SelectItem value="work">Work Calendar</SelectItem>
                <SelectItem value="personal">Personal Calendar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
