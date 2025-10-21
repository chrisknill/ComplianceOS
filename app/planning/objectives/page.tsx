'use client'

import { useState, useEffect, useMemo } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowDown,
  ArrowRight,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload
} from 'lucide-react'

interface BusinessObjective {
  id: string
  title: string
  description: string
  category: 'Strategic' | 'Financial' | 'Operational' | 'Customer' | 'Environmental' | 'Safety' | 'Quality'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Draft' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled'
  targetValue: string
  currentValue: string
  unit: string
  startDate: Date
  targetDate: Date
  actualCompletionDate?: Date
  owner: string
  assignedTo: string[]
  cascadedTo: string[]
  meetings: string[]
  progress: number
  kpis: string[]
  risks: string[]
  mitigationActions: string[]
  budget?: number
  actualCost?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface Meeting {
  id: string
  title: string
  type: 'Management Review' | 'Team Meeting' | 'Project Review' | 'Board Meeting'
  date: Date
  objectives: string[]
}

interface Personnel {
  id: string
  name: string
  role: string
  department: string
  objectives: string[]
}

export default function ObjectivesPage() {
  const [objectives, setObjectives] = useState<BusinessObjective[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showCascadeDialog, setShowCascadeDialog] = useState(false)
  const [selectedObjective, setSelectedObjective] = useState<BusinessObjective | null>(null)
  const [activeTab, setActiveTab] = useState('objectives')

  const tabs = [
    { key: 'objectives', label: 'Objectives' },
    { key: 'cascade', label: 'Cascade View' },
    { key: 'meetings', label: 'Meetings' },
    { key: 'personnel', label: 'Personnel' }
  ]

  const [newObjective, setNewObjective] = useState<Partial<BusinessObjective>>({
    title: '',
    description: '',
    category: 'Strategic',
    priority: 'Medium',
    status: 'Draft',
    targetValue: '',
    currentValue: '0',
    unit: '',
    startDate: new Date(),
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    owner: '',
    assignedTo: [],
    cascadedTo: [],
    meetings: [],
    progress: 0,
    kpis: [],
    risks: [],
    mitigationActions: [],
    budget: 0,
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API calls
      const mockObjectives: BusinessObjective[] = [
        {
          id: '1',
          title: 'Achieve 25% Revenue Growth',
          description: 'Increase annual revenue by 25% through market expansion and new product development',
          category: 'Financial',
          priority: 'Critical',
          status: 'Active',
          targetValue: '25',
          currentValue: '12',
          unit: '%',
          startDate: new Date('2025-01-01'),
          targetDate: new Date('2025-12-31'),
          owner: 'CEO',
          assignedTo: ['Sales Director', 'Marketing Manager', 'Product Manager'],
          cascadedTo: ['Sales Team', 'Marketing Team', 'R&D Team'],
          meetings: ['Q1 Board Meeting', 'Monthly Sales Review'],
          progress: 48,
          kpis: ['Monthly Revenue', 'New Customer Acquisition', 'Product Launch Success'],
          risks: ['Market Competition', 'Economic Downturn'],
          mitigationActions: ['Diversify Product Portfolio', 'Strengthen Customer Relationships'],
          budget: 500000,
          actualCost: 125000,
          notes: 'Focus on digital transformation initiatives',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Reduce Environmental Impact by 30%',
          description: 'Implement sustainable practices to reduce carbon footprint and waste generation',
          category: 'Environmental',
          priority: 'High',
          status: 'Active',
          targetValue: '30',
          currentValue: '18',
          unit: '%',
          startDate: new Date('2025-01-01'),
          targetDate: new Date('2025-12-31'),
          owner: 'Sustainability Manager',
          assignedTo: ['Operations Manager', 'Facilities Manager'],
          cascadedTo: ['Operations Team', 'Facilities Team'],
          meetings: ['Environmental Committee', 'Operations Review'],
          progress: 60,
          kpis: ['Carbon Emissions', 'Waste Reduction', 'Energy Efficiency'],
          risks: ['Implementation Costs', 'Regulatory Changes'],
          mitigationActions: ['Phased Implementation', 'Government Grants'],
          budget: 200000,
          actualCost: 75000,
          notes: 'ISO 14001 certification target',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'Achieve Zero Lost Time Incidents',
          description: 'Maintain perfect safety record with zero lost time incidents across all operations',
          category: 'Safety',
          priority: 'Critical',
          status: 'Active',
          targetValue: '0',
          currentValue: '0',
          unit: 'incidents',
          startDate: new Date('2025-01-01'),
          targetDate: new Date('2025-12-31'),
          owner: 'Safety Manager',
          assignedTo: ['Operations Manager', 'HR Manager'],
          cascadedTo: ['All Departments'],
          meetings: ['Safety Committee', 'Management Review'],
          progress: 100,
          kpis: ['LTIs', 'Near Misses', 'Safety Training Completion'],
          risks: ['Equipment Failure', 'Human Error'],
          mitigationActions: ['Enhanced Training', 'Equipment Maintenance'],
          budget: 100000,
          actualCost: 45000,
          notes: 'Continuous improvement in safety culture',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date()
        }
      ]

      const mockMeetings: Meeting[] = [
        {
          id: '1',
          title: 'Q1 Board Meeting',
          type: 'Board Meeting',
          date: new Date('2025-03-15'),
          objectives: ['1']
        },
        {
          id: '2',
          title: 'Monthly Sales Review',
          type: 'Team Meeting',
          date: new Date('2025-02-28'),
          objectives: ['1']
        },
        {
          id: '3',
          title: 'Environmental Committee',
          type: 'Project Review',
          date: new Date('2025-02-20'),
          objectives: ['2']
        }
      ]

      const mockPersonnel: Personnel[] = [
        {
          id: '1',
          name: 'John Smith',
          role: 'Sales Director',
          department: 'Sales',
          objectives: ['1']
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          role: 'Operations Manager',
          department: 'Operations',
          objectives: ['2', '3']
        },
        {
          id: '3',
          name: 'Mike Brown',
          role: 'Safety Manager',
          department: 'Safety',
          objectives: ['3']
        }
      ]

      setObjectives(mockObjectives)
      setMeetings(mockMeetings)
      setPersonnel(mockPersonnel)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredObjectives = useMemo(() => {
    let filtered = objectives.filter(objective => {
      const matchesSearch = objective.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           objective.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           objective.owner.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'ALL' || objective.status === statusFilter
      const matchesCategory = categoryFilter === 'ALL' || objective.category === categoryFilter
      const matchesPriority = priorityFilter === 'ALL' || objective.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority
    })

    filtered.sort((a, b) => {
      let aVal: any = a[sortField as keyof BusinessObjective]
      let bVal: any = b[sortField as keyof BusinessObjective]
      
      if (sortField === 'startDate' || sortField === 'targetDate') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [objectives, searchTerm, statusFilter, categoryFilter, priorityFilter, sortField, sortDirection])

  const stats = useMemo(() => {
    const total = objectives.length
    const active = objectives.filter(o => o.status === 'Active').length
    const completed = objectives.filter(o => o.status === 'Completed').length
    const onTrack = objectives.filter(o => o.progress >= 75).length
    const atRisk = objectives.filter(o => o.progress < 50 && o.status === 'Active').length
    const avgProgress = objectives.length > 0 ? objectives.reduce((sum, o) => sum + o.progress, 0) / objectives.length : 0

    return { total, active, completed, onTrack, atRisk, avgProgress }
  }, [objectives])

  const handleAddObjective = async () => {
    try {
      const objective: BusinessObjective = {
        ...newObjective as BusinessObjective,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setObjectives(prev => [...prev, objective])
      setShowAddDialog(false)
      setNewObjective({
        title: '',
        description: '',
        category: 'Strategic',
        priority: 'Medium',
        status: 'Draft',
        targetValue: '',
        currentValue: '0',
        unit: '',
        startDate: new Date(),
        targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        owner: '',
        assignedTo: [],
        cascadedTo: [],
        meetings: [],
        progress: 0,
        kpis: [],
        risks: [],
        mitigationActions: [],
        budget: 0,
        notes: ''
      })
    } catch (error) {
      console.error('Error adding objective:', error)
    }
  }

  const handleCascadeObjective = (objectiveId: string) => {
    const objective = objectives.find(o => o.id === objectiveId)
    if (objective) {
      setSelectedObjective(objective)
      setShowCascadeDialog(true)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      case 'On Hold': return 'bg-yellow-100 text-yellow-800'
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
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
            <h1 className="text-2xl font-bold text-slate-900">Business Objectives</h1>
            <p className="text-slate-600">Set, track, and cascade business objectives across the organisation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Objective
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Objectives</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <Target className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">On Track</p>
                  <p className="text-2xl font-bold text-green-600">{stats.onTrack}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">At Risk</p>
                  <p className="text-2xl font-bold text-red-600">{stats.atRisk}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-slate-900">{Math.round(stats.avgProgress)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.key
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Objectives Tab */}
        {activeTab === 'objectives' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search objectives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="Strategic">Strategic</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Environmental">Environmental</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Quality">Quality</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priorities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Objectives List */}
            <div className="space-y-4">
              {filteredObjectives.map((objective) => (
                <Card key={objective.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{objective.title}</CardTitle>
                        <CardDescription className="mt-1">{objective.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(objective.status)}>
                          {objective.status}
                        </Badge>
                        <Badge className={getPriorityColor(objective.priority)}>
                          {objective.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Progress</span>
                        <span className="text-sm text-slate-600">{objective.progress}%</span>
                      </div>
                      <Progress value={objective.progress} className="h-2" />
                    </div>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Target</p>
                        <p className="font-semibold">{objective.targetValue} {objective.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Current</p>
                        <p className="font-semibold">{objective.currentValue} {objective.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Owner</p>
                        <p className="font-semibold">{objective.owner}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Due Date</p>
                        <p className="font-semibold">{objective.targetDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {/* Assigned Personnel */}
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Assigned To</p>
                      <div className="flex flex-wrap gap-2">
                        {objective.assignedTo.map((person, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {person}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCascadeObjective(objective.id)}
                        >
                          <ArrowDown className="h-4 w-4 mr-2" />
                          Cascade
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Cascade View Tab */}
        {activeTab === 'cascade' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Objective Cascade Hierarchy</CardTitle>
                <CardDescription>View how business objectives cascade down to departments and individuals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {objectives.map((objective) => (
                    <div key={objective.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">{objective.title}</h3>
                        <Badge className={getStatusColor(objective.status)}>{objective.status}</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-2">Cascaded To Departments:</p>
                          <div className="flex flex-wrap gap-2">
                            {objective.cascadedTo.map((dept, index) => (
                              <Badge key={index} variant="outline">
                                <ArrowRight className="h-3 w-3 mr-1" />
                                {dept}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-2">Assigned Personnel:</p>
                          <div className="flex flex-wrap gap-2">
                            {objective.assignedTo.map((person, index) => (
                              <Badge key={index} variant="secondary">
                                <Users className="h-3 w-3 mr-1" />
                                {person}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-2">Related Meetings:</p>
                          <div className="flex flex-wrap gap-2">
                            {objective.meetings.map((meeting, index) => (
                              <Badge key={index} variant="outline">
                                <Calendar className="h-3 w-3 mr-1" />
                                {meeting}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {meetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        <CardDescription>{meeting.type}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        {meeting.date.toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">Related Objectives:</p>
                      <div className="flex flex-wrap gap-2">
                        {meeting.objectives.map((objId) => {
                          const obj = objectives.find(o => o.id === objId)
                          return obj ? (
                            <Badge key={objId} variant="outline">
                              <Target className="h-3 w-3 mr-1" />
                              {obj.title}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Personnel Tab */}
        {activeTab === 'personnel' && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {personnel.map((person) => (
                <Card key={person.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{person.name}</CardTitle>
                        <CardDescription>{person.role} - {person.department}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        {person.objectives.length} Objectives
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">Assigned Objectives:</p>
                      <div className="flex flex-wrap gap-2">
                        {person.objectives.map((objId) => {
                          const obj = objectives.find(o => o.id === objId)
                          return obj ? (
                            <Badge key={objId} variant="outline">
                              <Target className="h-3 w-3 mr-1" />
                              {obj.title}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Add Objective Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Business Objective</DialogTitle>
              <DialogDescription>
                Create a new business objective that can be cascaded across the organisation
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Objective Title</Label>
                  <Input
                    id="title"
                    value={newObjective.title}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter objective title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newObjective.category} onValueChange={(value) => setNewObjective(prev => ({ ...prev, category: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Strategic">Strategic</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Customer">Customer</SelectItem>
                      <SelectItem value="Environmental">Environmental</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newObjective.description}
                  onChange={(e) => setNewObjective(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the objective in detail"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newObjective.priority} onValueChange={(value) => setNewObjective(prev => ({ ...prev, priority: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="targetValue">Target Value</Label>
                  <Input
                    id="targetValue"
                    value={newObjective.targetValue}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, targetValue: e.target.value }))}
                    placeholder="e.g., 25"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newObjective.unit}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="e.g., %, £, days"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner">Owner</Label>
                  <Input
                    id="owner"
                    value={newObjective.owner}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, owner: e.target.value }))}
                    placeholder="e.g., CEO, Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget (£)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newObjective.budget}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newObjective.startDate?.toISOString().split('T')[0]}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={newObjective.targetDate?.toISOString().split('T')[0]}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, targetDate: new Date(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newObjective.notes}
                  onChange={(e) => setNewObjective(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or context"
                  rows={2}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddObjective}>
                Add Objective
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cascade Dialog */}
        <Dialog open={showCascadeDialog} onOpenChange={setShowCascadeDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cascade Objective: {selectedObjective?.title}</DialogTitle>
              <DialogDescription>
                Assign this objective to departments, personnel, and meetings
              </DialogDescription>
            </DialogHeader>
            
            {selectedObjective && (
              <div className="space-y-4">
                <div>
                  <Label>Assign to Departments</Label>
                  <div className="mt-2 space-y-2">
                    {['Sales', 'Marketing', 'Operations', 'HR', 'Finance', 'IT'].map((dept) => (
                      <div key={dept} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={dept}
                          checked={selectedObjective.cascadedTo.includes(dept)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedObjective(prev => prev ? {
                                ...prev,
                                cascadedTo: [...prev.cascadedTo, dept]
                              } : null)
                            } else {
                              setSelectedObjective(prev => prev ? {
                                ...prev,
                                cascadedTo: prev.cascadedTo.filter(d => d !== dept)
                              } : null)
                            }
                          }}
                        />
                        <Label htmlFor={dept}>{dept}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Assign to Personnel</Label>
                  <div className="mt-2 space-y-2">
                    {personnel.map((person) => (
                      <div key={person.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={person.id}
                          checked={selectedObjective.assignedTo.includes(person.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedObjective(prev => prev ? {
                                ...prev,
                                assignedTo: [...prev.assignedTo, person.name]
                              } : null)
                            } else {
                              setSelectedObjective(prev => prev ? {
                                ...prev,
                                assignedTo: prev.assignedTo.filter(p => p !== person.name)
                              } : null)
                            }
                          }}
                        />
                        <Label htmlFor={person.id}>{person.name} - {person.role}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Link to Meetings</Label>
                  <div className="mt-2 space-y-2">
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={meeting.id}
                          checked={selectedObjective.meetings.includes(meeting.title)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedObjective(prev => prev ? {
                                ...prev,
                                meetings: [...prev.meetings, meeting.title]
                              } : null)
                            } else {
                              setSelectedObjective(prev => prev ? {
                                ...prev,
                                meetings: prev.meetings.filter(m => m !== meeting.title)
                              } : null)
                            }
                          }}
                        />
                        <Label htmlFor={meeting.id}>{meeting.title} - {meeting.date.toLocaleDateString()}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCascadeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (selectedObjective) {
                  setObjectives(prev => prev.map(obj => 
                    obj.id === selectedObjective.id ? selectedObjective : obj
                  ))
                }
                setShowCascadeDialog(false)
              }}>
                Save Cascade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  )
}
