'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  RefreshCw, Settings, FileText, Users, Plus, Edit, Trash2, 
  Search, AlertCircle, CheckCircle, Clock, BarChart3, ArrowRight, Zap,
  LayoutDashboard, List, Columns, Calendar, GanttChart, ChevronLeft, ChevronRight,
  Filter, MoreHorizontal, Eye, EyeOff, Target
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'

interface ChangeRequest {
  id: string
  title: string
  description: string
  type: 'process' | 'technology' | 'organisational' | 'infrastructure' | 'policy' | 'system' | 'personnel' | 'software' | 'equipment' | 'supplier' | 'customer' | 'regulatory' | 'environmental' | 'safety' | 'quality' | 'financial' | 'strategic'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'in_progress' | 'completed' | 'rejected' | 'cancelled'
  requestedBy: string
  approvedBy?: string
  assignedTo?: string
  startDate: Date
  dueDate: Date
  actualCompletionDate?: Date
  impact: 'low' | 'medium' | 'high'
  risk: 'low' | 'medium' | 'high'
  businessJustification: string
  stakeholders: string[]
  affectedSystems: string[]
  implementationPlan: string[]
  rollbackPlan?: string
  successCriteria: string[]
  lessonsLearned?: string
  notes?: string
  attachments?: string[]
  progress: number // 0-100
}

type ViewMode = 'dashboard' | 'list' | 'board' | 'calendar' | 'gantt'
type CalendarView = 'daily' | 'weekly' | 'monthly'

export default function ChangeManagementPage() {
  const [loading, setLoading] = useState(true)
  const [changes, setChanges] = useState<ChangeRequest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [calendarView, setCalendarView] = useState<CalendarView>('monthly')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  const [newChange, setNewChange] = useState({
    title: '',
    description: '',
    type: 'process' as ChangeRequest['type'],
    priority: 'medium' as ChangeRequest['priority'],
    requestedBy: '',
    assignedTo: '',
    startDate: '',
    dueDate: '',
    impact: 'medium' as ChangeRequest['impact'],
    risk: 'medium' as ChangeRequest['risk'],
    businessJustification: '',
    stakeholders: '',
    affectedSystems: '',
    implementationPlan: '',
    rollbackPlan: '',
    successCriteria: '',
    notes: ''
  })

  useEffect(() => {
    // Simulate loading and fetch data
    setTimeout(() => {
      setChanges([
    {
      id: '1',
          title: 'New Quality Management Process Implementation',
          description: 'Implementation of enhanced quality control processes to improve product consistency',
          type: 'process',
          priority: 'high',
          status: 'in_progress',
          requestedBy: 'Quality Manager',
          approvedBy: 'Operations Director',
          assignedTo: 'Process Improvement Team',
          startDate: new Date('2025-01-15'),
          dueDate: new Date('2025-02-15'),
          impact: 'high',
          risk: 'medium',
          businessJustification: 'Improve product quality and reduce defects by 25%',
          stakeholders: ['Quality Team', 'Production Team', 'Management'],
          affectedSystems: ['Quality Management System', 'Production Processes'],
          implementationPlan: ['Process design', 'Staff training', 'System updates', 'Pilot testing'],
          rollbackPlan: 'Revert to previous quality processes if issues arise',
          successCriteria: ['25% reduction in defects', 'Improved customer satisfaction', 'Reduced rework'],
          notes: 'Progress on track, training completed for 80% of staff',
          progress: 65
    },
    {
      id: '2',
          title: 'Manufacturing Equipment Upgrade',
          description: 'Upgrade of production line equipment to improve efficiency and reduce maintenance',
          type: 'infrastructure',
          priority: 'critical',
          status: 'approved',
      requestedBy: 'Maintenance Manager',
          approvedBy: 'Operations Director',
          assignedTo: 'Maintenance Team',
          startDate: new Date('2025-02-01'),
          dueDate: new Date('2025-03-01'),
          impact: 'high',
          risk: 'high',
          businessJustification: 'Increase production capacity by 30% and reduce downtime',
          stakeholders: ['Maintenance Team', 'Production Team', 'Finance'],
          affectedSystems: ['Production Line A', 'Maintenance Systems'],
          implementationPlan: ['Equipment procurement', 'Installation planning', 'System integration', 'Testing'],
          rollbackPlan: 'Temporary shutdown and equipment replacement if needed',
          successCriteria: ['30% increase in production', 'Reduced maintenance costs', 'Improved reliability'],
          notes: 'Equipment ordered, installation scheduled for February',
          progress: 20
    },
    {
      id: '3',
          title: 'Environmental Policy Update',
          description: 'Update environmental policies to align with new regulatory requirements',
          type: 'policy',
          priority: 'medium',
          status: 'under_review',
          requestedBy: 'Environmental Manager',
          approvedBy: 'Compliance Director',
          assignedTo: 'Environmental Team',
          startDate: new Date('2025-01-01'),
          dueDate: new Date('2025-01-30'),
          impact: 'medium',
          risk: 'low',
          businessJustification: 'Ensure compliance with updated environmental regulations',
          stakeholders: ['Environmental Team', 'Legal Team', 'Management'],
          affectedSystems: ['Environmental Management System', 'Compliance Tracking'],
          implementationPlan: ['Policy review', 'Legal consultation', 'Staff communication', 'System updates'],
          successCriteria: ['Full regulatory compliance', 'Updated procedures', 'Staff awareness'],
          notes: 'Legal review completed, awaiting final approval',
          progress: 75
        },
        {
          id: '4',
          title: 'Digital Transformation Initiative',
          description: 'Implementation of digital tools to streamline operations and improve data management',
          type: 'technology',
          priority: 'high',
          status: 'completed',
          requestedBy: 'IT Director',
          approvedBy: 'CEO',
          assignedTo: 'IT Implementation Team',
          startDate: new Date('2024-10-01'),
          dueDate: new Date('2024-12-15'),
          actualCompletionDate: new Date('2024-12-10'),
          impact: 'high',
          risk: 'medium',
          businessJustification: 'Improve operational efficiency and data accuracy',
          stakeholders: ['IT Team', 'All Departments', 'Management'],
          affectedSystems: ['ERP System', 'Data Management', 'Reporting Systems'],
          implementationPlan: ['System selection', 'Data migration', 'User training', 'Go-live'],
          successCriteria: ['Improved data accuracy', 'Reduced manual processes', 'Better reporting'],
          lessonsLearned: 'User training was crucial for successful adoption',
          notes: 'Successfully completed ahead of schedule',
          progress: 100
        },
        {
          id: '5',
          title: 'Organisational Restructure',
          description: 'Restructuring of departments to improve efficiency and communication',
          type: 'organisational',
          priority: 'high',
          status: 'in_progress',
          requestedBy: 'HR Director',
          approvedBy: 'CEO',
          assignedTo: 'HR Team',
          startDate: new Date('2025-01-01'),
          dueDate: new Date('2025-03-31'),
          impact: 'high',
          risk: 'high',
          businessJustification: 'Improve organisational efficiency and reduce silos',
          stakeholders: ['All Employees', 'Management', 'HR Team'],
          affectedSystems: ['Organisational Structure', 'Reporting Lines', 'Communication Systems'],
          implementationPlan: ['Structure design', 'Communication plan', 'Role transitions', 'Training'],
          rollbackPlan: 'Maintain previous structure if issues arise',
          successCriteria: ['Improved communication', 'Reduced duplication', 'Better efficiency'],
          notes: 'Communication phase completed, role transitions in progress',
          progress: 40
        },
        {
          id: '6',
          title: 'Safety Management System Enhancement',
          description: 'Enhancement of safety management system with new procedures and training',
          type: 'system',
          priority: 'critical',
          status: 'approved',
          requestedBy: 'Health & Safety Manager',
          approvedBy: 'Operations Director',
          assignedTo: 'Safety Team',
          startDate: new Date('2025-02-15'),
          dueDate: new Date('2025-02-28'),
          impact: 'high',
          risk: 'low',
          businessJustification: 'Improve workplace safety and reduce incidents',
          stakeholders: ['Safety Team', 'All Employees', 'Management'],
          affectedSystems: ['Safety Management System', 'Training Systems', 'Incident Reporting'],
          implementationPlan: ['System updates', 'Procedure development', 'Training delivery', 'Implementation'],
          successCriteria: ['Reduced incidents', 'Improved safety culture', 'Better compliance'],
          notes: 'System updates completed, training materials prepared',
          progress: 10
        },
        {
          id: '7',
          title: 'Customer Service Process Improvement',
          description: 'Implementation of new customer service processes to improve satisfaction',
          type: 'process',
          priority: 'medium',
          status: 'draft',
          requestedBy: 'Customer Service Manager',
          assignedTo: 'Customer Service Team',
          startDate: new Date('2025-03-01'),
          dueDate: new Date('2025-04-15'),
          impact: 'medium',
          risk: 'low',
          businessJustification: 'Improve customer satisfaction and retention',
          stakeholders: ['Customer Service Team', 'Sales Team', 'Management'],
          affectedSystems: ['Customer Service System', 'CRM System'],
          implementationPlan: ['Process design', 'System updates', 'Staff training', 'Pilot testing'],
          successCriteria: ['Improved customer satisfaction', 'Reduced response times', 'Better issue resolution'],
          notes: 'Process design in progress, awaiting stakeholder review',
          progress: 5
        },
        {
          id: '8',
          title: 'Energy Efficiency Programme',
          description: 'Implementation of energy efficiency measures to reduce costs and environmental impact',
          type: 'infrastructure',
          priority: 'medium',
          status: 'completed',
          requestedBy: 'Environmental Manager',
          approvedBy: 'Operations Director',
          assignedTo: 'Facilities Team',
          startDate: new Date('2024-09-01'),
          dueDate: new Date('2024-11-30'),
          actualCompletionDate: new Date('2024-11-25'),
          impact: 'medium',
          risk: 'low',
          businessJustification: 'Reduce energy costs by 20% and improve environmental performance',
          stakeholders: ['Facilities Team', 'Environmental Team', 'Finance'],
          affectedSystems: ['Lighting Systems', 'HVAC Systems', 'Energy Monitoring'],
          implementationPlan: ['Energy audit', 'Equipment upgrades', 'System installation', 'Monitoring setup'],
          successCriteria: ['20% energy reduction', 'Cost savings', 'Environmental improvement'],
          lessonsLearned: 'Regular monitoring is essential for maintaining efficiency gains',
          notes: 'Successfully completed, monitoring ongoing',
          progress: 100
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleAddChange = () => {
    const change: ChangeRequest = {
      id: Date.now().toString(),
      title: newChange.title,
      description: newChange.description,
      type: newChange.type,
      priority: newChange.priority,
      status: 'draft',
      requestedBy: newChange.requestedBy,
      assignedTo: newChange.assignedTo,
      startDate: new Date(newChange.startDate),
      dueDate: new Date(newChange.dueDate),
      impact: newChange.impact,
      risk: newChange.risk,
      businessJustification: newChange.businessJustification,
      stakeholders: newChange.stakeholders.split(',').map(s => s.trim()).filter(s => s),
      affectedSystems: newChange.affectedSystems.split(',').map(s => s.trim()).filter(s => s),
      implementationPlan: newChange.implementationPlan.split('\n').filter(s => s.trim()),
      rollbackPlan: newChange.rollbackPlan || undefined,
      successCriteria: newChange.successCriteria.split('\n').filter(s => s.trim()),
      notes: newChange.notes || undefined,
      progress: 0
    }
    
    setChanges(prev => [...prev, change])
    setShowAddForm(false)
    setNewChange({
      title: '',
      description: '',
      type: 'process',
      priority: 'medium',
      requestedBy: '',
      assignedTo: '',
      startDate: '',
      dueDate: '',
      impact: 'medium',
      risk: 'medium',
      businessJustification: '',
      stakeholders: '',
      affectedSystems: '',
      implementationPlan: '',
      rollbackPlan: '',
      successCriteria: '',
      notes: ''
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'process': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'technology': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'organisational': return 'bg-green-100 text-green-800 border-green-200'
      case 'infrastructure': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'policy': return 'bg-red-100 text-red-800 border-red-200'
      case 'system': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'personnel': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'software': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'equipment': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'supplier': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'customer': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'regulatory': return 'bg-rose-100 text-rose-800 border-rose-200'
      case 'environmental': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'safety': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'quality': return 'bg-violet-100 text-violet-800 border-violet-200'
      case 'financial': return 'bg-lime-100 text-lime-800 border-lime-200'
      case 'strategic': return 'bg-slate-100 text-slate-800 border-slate-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'process': return <RefreshCw className="h-5 w-5 text-blue-600" />
      case 'technology': return <Zap className="h-5 w-5 text-purple-600" />
      case 'organisational': return <Users className="h-5 w-5 text-green-600" />
      case 'infrastructure': return <Settings className="h-5 w-5 text-orange-600" />
      case 'policy': return <FileText className="h-5 w-5 text-red-600" />
      case 'system': return <BarChart3 className="h-5 w-5 text-gray-600" />
      case 'personnel': return <Users className="h-5 w-5 text-pink-600" />
      case 'software': return <Zap className="h-5 w-5 text-indigo-600" />
      case 'equipment': return <Settings className="h-5 w-5 text-yellow-600" />
      case 'supplier': return <Users className="h-5 w-5 text-teal-600" />
      case 'customer': return <Users className="h-5 w-5 text-cyan-600" />
      case 'regulatory': return <FileText className="h-5 w-5 text-rose-600" />
      case 'environmental': return <RefreshCw className="h-5 w-5 text-emerald-600" />
      case 'safety': return <AlertCircle className="h-5 w-5 text-amber-600" />
      case 'quality': return <CheckCircle className="h-5 w-5 text-violet-600" />
      case 'financial': return <BarChart3 className="h-5 w-5 text-lime-600" />
      case 'strategic': return <Target className="h-5 w-5 text-slate-600" />
      default: return <RefreshCw className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredChanges = changes.filter(change => {
    const matchesSearch = change.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         change.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         change.businessJustification.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'ALL' || change.type === typeFilter
    const matchesStatus = statusFilter === 'ALL' || change.status === statusFilter
    const matchesPriority = priorityFilter === 'ALL' || change.priority === priorityFilter
    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getWeekDates = (date: Date) => {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay())
    const dates = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      dates.push(day)
    }
    return dates
  }

  const getChangesForDate = (date: Date) => {
    return changes.filter(change => {
      const start = new Date(change.startDate)
      const end = new Date(change.dueDate)
      return date >= start && date <= end
    })
  }

  const renderCalendarView = () => {
    if (calendarView === 'monthly') {
      const daysInMonth = getDaysInMonth(currentDate)
      const firstDay = getFirstDayOfMonth(currentDate)
      const days = []
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(null)
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
      }

  return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-slate-500">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <div key={index} className={`min-h-24 p-2 border rounded-lg ${date ? 'bg-white hover:bg-slate-50' : 'bg-slate-50'}`}>
                  {date && (
                    <>
                      <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                      <div className="space-y-1">
                        {getChangesForDate(date).slice(0, 2).map(change => (
                          <div key={change.id} className={`text-xs p-1 rounded ${getTypeColor(change.type)} truncate`}>
                            {change.title}
                          </div>
                        ))}
                        {getChangesForDate(date).length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{getChangesForDate(date).length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    
    if (calendarView === 'weekly') {
      const weekDates = getWeekDates(currentDate)
      
      return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Week of {weekDates[0].toLocaleDateString('en-GB')} - {weekDates[6].toLocaleDateString('en-GB')}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-7 gap-4">
              {weekDates.map((date, index) => (
                <div key={index} className="min-h-32 p-3 border rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    {date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}
                  </div>
                  <div className="space-y-1">
                    {getChangesForDate(date).map(change => (
                      <div key={change.id} className={`text-xs p-2 rounded ${getTypeColor(change.type)}`}>
                        <div className="font-medium truncate">{change.title}</div>
                        <div className="text-slate-600">{change.assignedTo}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}

    if (calendarView === 'daily') {
      return (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {getChangesForDate(currentDate).map(change => (
                <div key={change.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(change.type)}
                      <div>
                        <h4 className="font-medium">{change.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getTypeColor(change.type)}`}>
                            {change.type}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(change.priority)}`}>
                            {change.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <StatusBadge 
                      status={change.status === 'completed' ? 'green' : change.status === 'in_progress' ? 'amber' : change.status === 'approved' ? 'blue' : change.status === 'under_review' ? 'yellow' : 'red'} 
                      label={change.status.replace('_', ' ')} 
                    />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{change.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Assigned to: {change.assignedTo}</span>
                    <span>Progress: {change.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    
    return null
  }

  const renderGanttView = () => {
    const sortedChanges = [...filteredChanges].sort((a, b) => {
      const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
      const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
      return aDate - bDate
    })
    const minDate = new Date(Math.min(...sortedChanges.map(c => c.startDate ? new Date(c.startDate).getTime() : 0)))
    const maxDate = new Date(Math.max(...sortedChanges.map(c => c.dueDate ? new Date(c.dueDate).getTime() : 0)))
    
    const getDaysBetween = (start: Date, end: Date) => {
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }
    
    const getPosition = (startDate: Date) => {
      const daysFromStart = getDaysBetween(minDate, startDate)
      return (daysFromStart / getDaysBetween(minDate, maxDate)) * 100
    }
    
    const getWidth = (startDate: Date, endDate: Date) => {
      const days = getDaysBetween(startDate, endDate)
      const totalDays = getDaysBetween(minDate, maxDate)
      return (days / totalDays) * 100
    }
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Gantt Chart View</h3>
          <p className="text-sm text-slate-600 mt-1">
            Timeline: {minDate.toLocaleDateString('en-GB')} - {maxDate.toLocaleDateString('en-GB')}
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {sortedChanges.map(change => (
              <div key={change.id} className="flex items-center gap-4">
                <div className="w-64 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(change.type)}
                    <div>
                      <div className="font-medium text-sm truncate">{change.title}</div>
                      <div className="text-xs text-slate-500">{change.assignedTo}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 relative h-8 bg-slate-100 rounded">
                  <div
                    className={`absolute top-1 h-6 rounded ${getTypeColor(change.type)} flex items-center justify-center text-xs font-medium`}
                    style={{
                      left: `${getPosition(new Date(change.startDate))}%`,
                      width: `${getWidth(new Date(change.startDate), new Date(change.dueDate))}%`,
                    }}
                  >
                    {change.progress}%
                  </div>
                </div>
                
                <div className="w-24 text-xs text-slate-500 text-right">
                  {change.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderBoardView = () => {
    const statusColumns = ['draft', 'submitted', 'under_review', 'approved', 'in_progress', 'completed']
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Board View</h3>
        </div>
        
        <div className="p-6">
          <div className="flex gap-6 overflow-x-auto">
            {statusColumns.map(status => (
              <div key={status} className="flex-shrink-0 w-80">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium mb-4 capitalize">{status.replace('_', ' ')}</h4>
                  <div className="space-y-3">
                    {filteredChanges.filter(change => change.status === status).map(change => (
                      <div key={change.id} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(change.type)}
                          <Badge className={`text-xs ${getPriorityColor(change.priority)}`}>
                            {change.priority}
                          </Badge>
                        </div>
                        <h5 className="font-medium text-sm mb-1">{change.title}</h5>
                        <p className="text-xs text-slate-600 mb-2">{change.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{change.assignedTo}</span>
                          <span>{change.progress}%</span>
                        </div>
                        <div className="mt-2 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${change.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Change Management</h1>
            <p className="text-slate-600 mt-1">Plan and manage organisational changes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Change Report
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Change
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Changes</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{changes.length}</p>
                <p className="text-sm text-slate-500 mt-1">All types</p>
              </div>
              <RefreshCw className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">In Progress</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{changes.filter(c => c.status === 'in_progress').length}</p>
                <p className="text-sm text-slate-500 mt-1">Active changes</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{changes.filter(c => c.status === 'completed').length}</p>
                <p className="text-sm text-slate-500 mt-1">Successful changes</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">High Priority</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{changes.filter(c => c.priority === 'high' || c.priority === 'critical').length}</p>
                <p className="text-sm text-slate-500 mt-1">Critical changes</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search changes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="process">Process</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="organisational">Organisational</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="personnel">Personnel</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="strategic">Strategic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="board" className="flex items-center gap-2">
              <Columns className="h-4 w-4" />
              Board
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="gantt" className="flex items-center gap-2">
              <GanttChart className="h-4 w-4" />
              Gantt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Change Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChanges.map(change => (
                <Card key={change.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          {getTypeIcon(change.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{change.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getTypeColor(change.type)}`}>
                              {change.type}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(change.priority)}`}>
                              {change.priority} priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600">{change.description}</p>
                      
                      <div className="text-sm text-slate-500">
                        <span className="font-medium">Requested by:</span> {change.requestedBy}
                      </div>
                      
                      {change.assignedTo && (
                        <div className="text-sm text-slate-500">
                          <span className="font-medium">Assigned to:</span> {change.assignedTo}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">Impact:</span>
                        <Badge className={`text-xs ${getImpactColor(change.impact)}`}>
                          {change.impact}
                        </Badge>
                        <span className="text-slate-500">Risk:</span>
                        <Badge className={`text-xs ${getImpactColor(change.risk)}`}>
                          {change.risk}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Implementation Plan</p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {change.implementationPlan.slice(0, 2).map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                              {step}
                            </li>
                          ))}
                          {change.implementationPlan.length > 2 && (
                            <li className="text-xs text-slate-500">
                              +{change.implementationPlan.length - 2} more steps...
                            </li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Success Criteria</p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {change.successCriteria.slice(0, 1).map((criteria, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                              {criteria}
                            </li>
                          ))}
                          {change.successCriteria.length > 1 && (
                            <li className="text-xs text-slate-500">
                              +{change.successCriteria.length - 1} more criteria...
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <StatusBadge 
                            status={change.status === 'completed' ? 'green' : change.status === 'in_progress' ? 'amber' : change.status === 'approved' ? 'blue' : change.status === 'under_review' ? 'yellow' : 'red'} 
                            label={change.status.replace('_', ' ')} 
                          />
                        </div>
                        <span className="text-slate-500">
                          Due: {formatDate(change.dueDate)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-slate-500">{change.progress}%</span>
                        </div>
                        <div className="bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${change.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {change.actualCompletionDate && (
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Completed:</span> {formatDate(change.actualCompletionDate)}
                        </div>
                      )}

                      {change.notes && (
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Notes:</span> {change.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="space-y-4">
                  {filteredChanges.map(change => (
                    <div key={change.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0">
                        {getTypeIcon(change.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{change.title}</h4>
                          <Badge className={`text-xs ${getTypeColor(change.type)}`}>
                            {change.type}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(change.priority)}`}>
                            {change.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{change.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Assigned to: {change.assignedTo}</span>
                          <span>Start: {formatDate(change.startDate)}</span>
                          <span>Due: {formatDate(change.dueDate)}</span>
                          <span>Progress: {change.progress}%</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge 
                          status={change.status === 'completed' ? 'green' : change.status === 'in_progress' ? 'amber' : change.status === 'approved' ? 'blue' : change.status === 'under_review' ? 'yellow' : 'red'} 
                          label={change.status.replace('_', ' ')} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="board">
            {renderBoardView()}
          </TabsContent>

          <TabsContent value="calendar">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Select value={calendarView} onValueChange={(value) => setCalendarView(value as CalendarView)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderCalendarView()}
            </div>
          </TabsContent>

          <TabsContent value="gantt">
            {renderGanttView()}
          </TabsContent>
        </Tabs>

        {/* Change Management Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Management Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">By Type</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Process</span>
                  <Badge className="bg-blue-100 text-blue-800">{changes.filter(c => c.type === 'process').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Technology</span>
                  <Badge className="bg-purple-100 text-purple-800">{changes.filter(c => c.type === 'technology').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Organisational</span>
                  <Badge className="bg-green-100 text-green-800">{changes.filter(c => c.type === 'organisational').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Infrastructure</span>
                  <Badge className="bg-orange-100 text-orange-800">{changes.filter(c => c.type === 'infrastructure').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Policy</span>
                  <Badge className="bg-red-100 text-red-800">{changes.filter(c => c.type === 'policy').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">System</span>
                  <Badge className="bg-gray-100 text-gray-800">{changes.filter(c => c.type === 'system').length}</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">By Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Completed</span>
                  <Badge className="bg-green-100 text-green-800">{changes.filter(c => c.status === 'completed').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">In Progress</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{changes.filter(c => c.status === 'in_progress').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Approved</span>
                  <Badge className="bg-blue-100 text-blue-800">{changes.filter(c => c.status === 'approved').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Under Review</span>
                  <Badge className="bg-orange-100 text-orange-800">{changes.filter(c => c.status === 'under_review').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Draft</span>
                  <Badge className="bg-gray-100 text-gray-800">{changes.filter(c => c.status === 'draft').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Rejected</span>
                  <Badge className="bg-red-100 text-red-800">{changes.filter(c => c.status === 'rejected').length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Change Modal */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Change Request</DialogTitle>
              <DialogDescription>
                Create a new change request with comprehensive details for ISO compliance tracking.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Change Title *</Label>
                  <Input
                    id="title"
                    value={newChange.title}
                    onChange={(e) => setNewChange(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter change title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newChange.description}
                    onChange={(e) => setNewChange(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the change in detail"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Change Type *</Label>
                  <Select value={newChange.type} onValueChange={(value) => setNewChange(prev => ({ ...prev, type: value as ChangeRequest['type'] }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select change type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="process">Process Change</SelectItem>
                      <SelectItem value="technology">Technology Change</SelectItem>
                      <SelectItem value="organisational">Organisational Change</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure Change</SelectItem>
                      <SelectItem value="policy">Policy Change</SelectItem>
                      <SelectItem value="system">System Change</SelectItem>
                      <SelectItem value="personnel">Personnel Change (Loss of Key Person)</SelectItem>
                      <SelectItem value="software">Software Change</SelectItem>
                      <SelectItem value="equipment">Equipment Change</SelectItem>
                      <SelectItem value="supplier">Supplier Change</SelectItem>
                      <SelectItem value="customer">Customer Change</SelectItem>
                      <SelectItem value="regulatory">Regulatory Change</SelectItem>
                      <SelectItem value="environmental">Environmental Change</SelectItem>
                      <SelectItem value="safety">Safety Change</SelectItem>
                      <SelectItem value="quality">Quality Change</SelectItem>
                      <SelectItem value="financial">Financial Change</SelectItem>
                      <SelectItem value="strategic">Strategic Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={newChange.priority} onValueChange={(value) => setNewChange(prev => ({ ...prev, priority: value as ChangeRequest['priority'] }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="requestedBy">Requested By *</Label>
                  <Input
                    id="requestedBy"
                    value={newChange.requestedBy}
                    onChange={(e) => setNewChange(prev => ({ ...prev, requestedBy: e.target.value }))}
                    placeholder="Name of person requesting change"
                  />
                </div>

                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={newChange.assignedTo}
                    onChange={(e) => setNewChange(prev => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="Person or team responsible"
                  />
                </div>
              </div>

              {/* Timeline and Impact */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newChange.startDate}
                    onChange={(e) => setNewChange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newChange.dueDate}
                    onChange={(e) => setNewChange(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="impact">Impact Level *</Label>
                  <Select value={newChange.impact} onValueChange={(value) => setNewChange(prev => ({ ...prev, impact: value as ChangeRequest['impact'] }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Impact</SelectItem>
                      <SelectItem value="medium">Medium Impact</SelectItem>
                      <SelectItem value="high">High Impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="risk">Risk Level *</Label>
                  <Select value={newChange.risk} onValueChange={(value) => setNewChange(prev => ({ ...prev, risk: value as ChangeRequest['risk'] }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="businessJustification">Business Justification *</Label>
                  <Textarea
                    id="businessJustification"
                    value={newChange.businessJustification}
                    onChange={(e) => setNewChange(prev => ({ ...prev, businessJustification: e.target.value }))}
                    placeholder="Why is this change necessary?"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="stakeholders">Stakeholders</Label>
                <Input
                  id="stakeholders"
                  value={newChange.stakeholders}
                  onChange={(e) => setNewChange(prev => ({ ...prev, stakeholders: e.target.value }))}
                  placeholder="Comma-separated list of stakeholders"
                />
              </div>

              <div>
                <Label htmlFor="affectedSystems">Affected Systems</Label>
                <Input
                  id="affectedSystems"
                  value={newChange.affectedSystems}
                  onChange={(e) => setNewChange(prev => ({ ...prev, affectedSystems: e.target.value }))}
                  placeholder="Comma-separated list of affected systems"
                />
              </div>

              <div>
                <Label htmlFor="implementationPlan">Implementation Plan</Label>
                <Textarea
                  id="implementationPlan"
                  value={newChange.implementationPlan}
                  onChange={(e) => setNewChange(prev => ({ ...prev, implementationPlan: e.target.value }))}
                  placeholder="Step-by-step implementation plan (one per line)"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="rollbackPlan">Rollback Plan</Label>
                <Textarea
                  id="rollbackPlan"
                  value={newChange.rollbackPlan}
                  onChange={(e) => setNewChange(prev => ({ ...prev, rollbackPlan: e.target.value }))}
                  placeholder="Plan to revert changes if needed"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="successCriteria">Success Criteria</Label>
                <Textarea
                  id="successCriteria"
                  value={newChange.successCriteria}
                  onChange={(e) => setNewChange(prev => ({ ...prev, successCriteria: e.target.value }))}
                  placeholder="How will success be measured? (one per line)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={newChange.notes}
                  onChange={(e) => setNewChange(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional information"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddChange} disabled={!newChange.title || !newChange.description || !newChange.requestedBy || !newChange.startDate || !newChange.dueDate}>
                Add Change Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  )
}