'use client'

import { useState, useEffect } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageSquare, 
  Send, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Video,
  FileText
} from 'lucide-react'

interface Communication {
  id: string
  title: string
  message: string
  type: 'safety' | 'environmental' | 'quality' | 'general' | 'urgent'
  audience: 'all' | 'management' | 'department' | 'team'
  status: 'draft' | 'scheduled' | 'sent' | 'delivered'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  channel: 'email' | 'sms' | 'meeting' | 'noticeboard' | 'video'
  scheduledDate?: string
  sentDate?: string
  createdBy: string
  createdAt: string
  readBy?: number
  totalRecipients?: number
}

export default function CommunicationPage() {
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editingCommunication, setEditingCommunication] = useState<Communication | null>(null)
  const [sortField, setSortField] = useState<keyof Communication>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [activeTab, setActiveTab] = useState('DASHBOARD')

  useEffect(() => {
    loadCommunications()
  }, [])

  const loadCommunications = () => {
    setLoading(true)
    // Mock data - replace with actual API call
    const mockCommunications: Communication[] = [
    {
      id: '1',
        title: 'Safety Alert - New Procedure',
        message: 'Please review the updated safety procedures for the manufacturing floor. All employees must complete training by end of month.',
        type: 'safety',
        audience: 'all',
        status: 'sent',
        priority: 'high',
        channel: 'email',
        sentDate: '2025-01-15T09:00:00Z',
        createdBy: 'Safety Manager',
        createdAt: '2025-01-15T08:30:00Z',
        readBy: 45,
        totalRecipients: 50
    },
    {
      id: '2',
        title: 'Environmental Policy Update',
        message: 'Updated environmental policies are now available. Please review and ensure compliance with new regulations.',
        type: 'environmental',
        audience: 'management',
        status: 'draft',
        priority: 'medium',
        channel: 'meeting',
        scheduledDate: '2025-01-20T14:00:00Z',
        createdBy: 'Environmental Manager',
        createdAt: '2025-01-18T10:15:00Z',
        totalRecipients: 12
    },
    {
      id: '3',
        title: 'Quality Objectives Review',
        message: 'Quarterly quality objectives review meeting scheduled. Please prepare your department reports.',
        type: 'quality',
        audience: 'department',
        status: 'scheduled',
        priority: 'medium',
        channel: 'video',
        scheduledDate: '2025-01-25T10:00:00Z',
        createdBy: 'Quality Manager',
        createdAt: '2025-01-18T16:45:00Z',
        totalRecipients: 8
      },
      {
        id: '4',
        title: 'Emergency Contact Update',
        message: 'Please update your emergency contact information in the HR system. This is mandatory for all employees.',
        type: 'urgent',
        audience: 'all',
        status: 'sent',
        priority: 'urgent',
        channel: 'sms',
        sentDate: '2025-01-19T11:30:00Z',
        createdBy: 'HR Manager',
        createdAt: '2025-01-19T11:00:00Z',
        readBy: 48,
        totalRecipients: 50
      },
      {
        id: '5',
        title: 'Monthly Newsletter',
        message: 'January newsletter with company updates, achievements, and upcoming events.',
        type: 'general',
        audience: 'all',
        status: 'sent',
        priority: 'low',
        channel: 'email',
        sentDate: '2025-01-01T09:00:00Z',
        createdBy: 'Communications Team',
        createdAt: '2025-01-01T08:00:00Z',
        readBy: 35,
        totalRecipients: 50
      },
      {
        id: '6',
        title: 'Management Review Meeting',
        message: 'Monthly management review meeting to discuss performance metrics and strategic objectives.',
        type: 'general',
        audience: 'management',
        status: 'scheduled',
        priority: 'high',
        channel: 'meeting',
        scheduledDate: '2025-01-30T09:00:00Z',
        createdBy: 'CEO',
        createdAt: '2025-01-20T14:00:00Z',
        totalRecipients: 8
      },
      {
        id: '7',
        title: 'Team Standup',
        message: 'Daily standup meeting for the development team to discuss progress and blockers.',
        type: 'general',
        audience: 'team',
        status: 'scheduled',
        priority: 'medium',
        channel: 'video',
        scheduledDate: '2025-01-21T09:30:00Z',
        createdBy: 'Team Lead',
        createdAt: '2025-01-20T16:00:00Z',
        totalRecipients: 5
      },
      {
        id: '8',
        title: 'Safety Briefing',
        message: 'Weekly safety briefing for all manufacturing staff.',
        type: 'safety',
        audience: 'department',
        status: 'scheduled',
        priority: 'high',
        channel: 'meeting',
        scheduledDate: '2025-01-22T08:00:00Z',
        createdBy: 'Safety Manager',
        createdAt: '2025-01-20T17:30:00Z',
        totalRecipients: 25
      }
    ]
    
    setTimeout(() => {
      setCommunications(mockCommunications)
      setLoading(false)
    }, 500)
  }

  const handleSort = (field: keyof Communication) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedCommunications = communications
    .filter(comm => {
      const matchesSearch = comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           comm.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           comm.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === 'ALL' || comm.type === typeFilter
      const matchesStatus = statusFilter === 'ALL' || comm.status === statusFilter
      const matchesPriority = priorityFilter === 'ALL' || comm.priority === priorityFilter
      
      // Tab filtering
      let matchesTab = true
      if (activeTab === 'MEETINGS') {
        matchesTab = comm.channel === 'meeting' || comm.channel === 'video'
      } else if (activeTab === 'EMAILS') {
        matchesTab = comm.channel === 'email'
      } else if (activeTab === 'SMS') {
        matchesTab = comm.channel === 'sms'
      } else if (activeTab === 'NOTICES') {
        matchesTab = comm.channel === 'noticeboard'
      } else if (activeTab === 'SAFETY') {
        matchesTab = comm.type === 'safety'
      } else if (activeTab === 'ENVIRONMENTAL') {
        matchesTab = comm.type === 'environmental'
      } else if (activeTab === 'QUALITY') {
        matchesTab = comm.type === 'quality'
      } else if (activeTab === 'URGENT') {
        matchesTab = comm.priority === 'urgent' || comm.type === 'urgent'
      }
      
      return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesTab
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }
      
      return 0
    })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'safety': return 'bg-red-100 text-red-800 border-red-200'
      case 'environmental': return 'bg-green-100 text-green-800 border-green-200'
      case 'quality': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 border-green-200'
      case 'delivered': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'sms': return <MessageSquare className="h-4 w-4" />
      case 'meeting': return <Users className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'noticeboard': return <FileText className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const stats = {
    total: communications.length,
    sent: communications.filter(c => c.status === 'sent').length,
    scheduled: communications.filter(c => c.status === 'scheduled').length,
    drafts: communications.filter(c => c.status === 'draft').length,
    urgent: communications.filter(c => c.priority === 'urgent').length,
    meetings: communications.filter(c => c.channel === 'meeting' || c.channel === 'video').length,
    emails: communications.filter(c => c.channel === 'email').length,
    sms: communications.filter(c => c.channel === 'sms').length,
    notices: communications.filter(c => c.channel === 'noticeboard').length,
    safety: communications.filter(c => c.type === 'safety').length,
    environmental: communications.filter(c => c.type === 'environmental').length,
    quality: communications.filter(c => c.type === 'quality').length,
    readRate: communications.reduce((acc, c) => {
      if (c.readBy && c.totalRecipients) {
        return acc + (c.readBy / c.totalRecipients)
      }
      return acc
    }, 0) / communications.filter(c => c.readBy && c.totalRecipients).length * 100 || 0
  }

  const tabs = [
    { key: 'DASHBOARD', label: 'Dashboard' },
    { key: 'MEETINGS', label: 'Meetings' },
    { key: 'EMAILS', label: 'Emails' },
    { key: 'SMS', label: 'SMS' },
    { key: 'NOTICES', label: 'Notices' },
    { key: 'SAFETY', label: 'Safety' },
    { key: 'ENVIRONMENTAL', label: 'Environmental' },
    { key: 'QUALITY', label: 'Quality' },
    { key: 'URGENT', label: 'Urgent' }
  ]

  const handleExport = () => {
    const csvContent = [
      ['Title', 'Type', 'Audience', 'Status', 'Priority', 'Channel', 'Created By', 'Created At'],
      ...filteredAndSortedCommunications.map(comm => [
        comm.title,
        comm.type,
        comm.audience,
        comm.status,
        comm.priority,
        comm.channel,
        comm.createdBy,
        new Date(comm.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'communications.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading communications...</p>
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Communication Management</h1>
            <p className="text-slate-600">Manage internal and external communications across all channels</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Communication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCommunication ? 'Edit Communication' : 'Create New Communication'}
                  </DialogTitle>
                </DialogHeader>
                <CommunicationForm 
                  communication={editingCommunication}
                  onSave={() => {
                    setShowForm(false)
                    setEditingCommunication(null)
                    loadCommunications()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Cards - Dynamic based on active tab */}
        {activeTab === 'DASHBOARD' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Send className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Sent</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.sent}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Scheduled</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.scheduled}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Drafts</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.drafts}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Urgent</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.urgent}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Read Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{Math.round(stats.readRate)}%</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab-specific stats */}
        {activeTab !== 'DASHBOARD' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{tabs.find(t => t.key === activeTab)?.label} Communications</p>
                  <p className="text-2xl font-bold text-slate-900">{filteredAndSortedCommunications.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {filteredAndSortedCommunications.filter(c => c.status === 'sent' || c.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {filteredAndSortedCommunications.filter(c => c.status === 'scheduled' || c.status === 'draft').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search communications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Communications Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 w-1/3"
                    onClick={() => handleSort('title')}
                  >
                    Communication {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 w-20"
                    onClick={() => handleSort('type')}
                  >
                    Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 w-24"
                    onClick={() => handleSort('audience')}
                  >
                    Audience {sortField === 'audience' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 w-20"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 w-20"
                    onClick={() => handleSort('priority')}
                  >
                    Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 w-24"
                    onClick={() => handleSort('channel')}
                  >
                    Channel {sortField === 'channel' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 w-32"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredAndSortedCommunications.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 w-1/3">
                      <div>
                        <p className="text-sm font-medium text-slate-900 truncate">{comm.title}</p>
                        <p className="text-xs text-slate-500 truncate">{comm.message}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 w-20">
                      <Badge className={`${getTypeColor(comm.type)} text-xs`}>
                        {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 w-24">
                      <span className="text-xs text-slate-900 capitalize">{comm.audience}</span>
                    </td>
                    <td className="px-4 py-3 w-20">
                      <Badge className={`${getStatusColor(comm.status)} text-xs`}>
                        {comm.status.charAt(0).toUpperCase() + comm.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 w-20">
                      <Badge className={`${getPriorityColor(comm.priority)} text-xs`}>
                        {comm.priority.charAt(0).toUpperCase() + comm.priority.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 w-24">
                      <div className="flex items-center gap-1">
                        {getChannelIcon(comm.channel)}
                        <span className="text-xs text-slate-900 capitalize">{comm.channel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 w-32">
                      <div>
                        <p className="text-xs text-slate-900">{formatDate(comm.createdAt)}</p>
                        <p className="text-xs text-slate-500 truncate">by {comm.createdBy}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 w-24">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setEditingCommunication(comm)
                            setShowForm(true)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredAndSortedCommunications.length === 0 && (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No communications found</h3>
            <p className="text-slate-500 mb-4">
              {searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first communication'
              }
            </p>
            {(!searchTerm && typeFilter === 'ALL' && statusFilter === 'ALL' && priorityFilter === 'ALL') && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Communication
              </Button>
            )}
          </Card>
        )}
      </div>
    </Shell>
  )
}

// Communication Form Component
function CommunicationForm({ communication, onSave }: { communication?: Communication | null, onSave: () => void }) {
  const [formData, setFormData] = useState({
    title: communication?.title || '',
    message: communication?.message || '',
    type: communication?.type || 'general',
    audience: communication?.audience || 'all',
    priority: communication?.priority || 'medium',
    channel: communication?.channel || 'email',
    scheduledDate: communication?.scheduledDate || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="audience">Audience</Label>
          <Select value={formData.audience} onValueChange={(value) => setFormData({ ...formData, audience: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="management">Management</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="channel">Channel</Label>
          <Select value={formData.channel} onValueChange={(value) => setFormData({ ...formData, channel: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="video">Video Call</SelectItem>
              <SelectItem value="noticeboard">Notice Board</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="scheduledDate">Scheduled Date (Optional)</Label>
        <Input
          id="scheduledDate"
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSave}>
          Cancel
        </Button>
        <Button type="submit">
          {communication ? 'Update' : 'Create'} Communication
        </Button>
    </div>
    </form>
  )
}
