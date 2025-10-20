'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Shield, FileText, Globe, Target, Plus, Edit, Trash2, 
  Search, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'

interface ComplianceRequirement {
  id: string
  title: string
  description: string
  source: 'ISO' | 'Regulatory' | 'Customer' | 'Internal' | 'Industry'
  standard?: string
  status: 'compliant' | 'non_compliant' | 'under_review' | 'pending'
  priority: 'high' | 'medium' | 'low'
  lastReview: Date
  nextReview: Date
  responsiblePerson: string
  evidence?: string
  notes?: string
  applicableTo: string[]
}

export default function ComplianceRegisterPage() {
  const [loading, setLoading] = useState(true)
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Simulate loading and fetch data
    setTimeout(() => {
      setRequirements([
        {
          id: '1',
          title: 'ISO 9001:2015 Quality Management',
          description: 'Quality management system certification and maintenance',
          source: 'ISO',
          standard: 'ISO 9001:2015',
          status: 'compliant',
          priority: 'high',
          lastReview: new Date('2025-01-10'),
          nextReview: new Date('2025-07-10'),
          responsiblePerson: 'Quality Manager',
          evidence: 'Certification certificate, audit reports',
          notes: 'Annual surveillance audit completed successfully',
          applicableTo: ['All operations', 'Management', 'Quality team']
        },
        {
          id: '2',
          title: 'ISO 14001:2015 Environmental Management',
          description: 'Environmental management system certification',
          source: 'ISO',
          standard: 'ISO 14001:2015',
          status: 'compliant',
          priority: 'high',
          lastReview: new Date('2025-01-08'),
          nextReview: new Date('2025-07-08'),
          responsiblePerson: 'Environmental Manager',
          evidence: 'Certification certificate, environmental reports',
          notes: 'Environmental performance targets met',
          applicableTo: ['All facilities', 'Environmental team']
        },
        {
          id: '3',
          title: 'ISO 45001:2018 Occupational Health & Safety',
          description: 'Occupational health and safety management system',
          source: 'ISO',
          standard: 'ISO 45001:2018',
          status: 'under_review',
          priority: 'high',
          lastReview: new Date('2024-12-15'),
          nextReview: new Date('2025-03-15'),
          responsiblePerson: 'Health & Safety Manager',
          evidence: 'Certification certificate, safety reports',
          notes: 'Preparing for recertification audit',
          applicableTo: ['All employees', 'Health & Safety team']
        },
        {
          id: '4',
          title: 'Environmental Permits and Licences',
          description: 'Environmental permits for air emissions, water discharge, and waste management',
          source: 'Regulatory',
          standard: 'Environmental Protection Act',
          status: 'compliant',
          priority: 'high',
          lastReview: new Date('2025-01-05'),
          nextReview: new Date('2025-04-05'),
          responsiblePerson: 'Environmental Manager',
          evidence: 'Permit documents, monitoring reports',
          notes: 'All permits current and valid',
          applicableTo: ['Manufacturing', 'Environmental team']
        },
        {
          id: '5',
          title: 'Health & Safety Regulations',
          description: 'Workplace health and safety compliance requirements',
          source: 'Regulatory',
          standard: 'Health & Safety at Work Act',
          status: 'compliant',
          priority: 'high',
          lastReview: new Date('2025-01-03'),
          nextReview: new Date('2025-04-03'),
          responsiblePerson: 'Health & Safety Manager',
          evidence: 'Risk assessments, training records',
          notes: 'Regular safety inspections conducted',
          applicableTo: ['All employees', 'Contractors']
        },
        {
          id: '6',
          title: 'Data Protection Compliance',
          description: 'General Data Protection Regulation (GDPR) compliance',
          source: 'Regulatory',
          standard: 'GDPR',
          status: 'compliant',
          priority: 'medium',
          lastReview: new Date('2024-12-20'),
          nextReview: new Date('2025-06-20'),
          responsiblePerson: 'Data Protection Officer',
          evidence: 'Privacy policies, consent records',
          notes: 'Data protection impact assessments completed',
          applicableTo: ['All employees', 'IT team', 'HR']
        },
        {
          id: '7',
          title: 'Customer Quality Requirements',
          description: 'Specific quality requirements from key customers',
          source: 'Customer',
          status: 'compliant',
          priority: 'medium',
          lastReview: new Date('2025-01-12'),
          nextReview: new Date('2025-07-12'),
          responsiblePerson: 'Quality Manager',
          evidence: 'Customer agreements, quality certificates',
          notes: 'Customer audits passed successfully',
          applicableTo: ['Production', 'Quality team']
        },
        {
          id: '8',
          title: 'Industry Standards Compliance',
          description: 'Industry-specific standards and best practices',
          source: 'Industry',
          standard: 'Industry Code of Practice',
          status: 'pending',
          priority: 'low',
          lastReview: new Date('2024-11-15'),
          nextReview: new Date('2025-05-15'),
          responsiblePerson: 'Operations Manager',
          evidence: 'Industry assessments, benchmarking reports',
          notes: 'Reviewing updated industry standards',
          applicableTo: ['Operations', 'Management']
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'ISO': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Regulatory': return 'bg-red-100 text-red-800 border-red-200'
      case 'Customer': return 'bg-green-100 text-green-800 border-green-200'
      case 'Internal': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Industry': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ISO': return <Target className="h-5 w-5 text-blue-600" />
      case 'Regulatory': return <Shield className="h-5 w-5 text-red-600" />
      case 'Customer': return <Globe className="h-5 w-5 text-green-600" />
      case 'Internal': return <FileText className="h-5 w-5 text-purple-600" />
      case 'Industry': return <Target className="h-5 w-5 text-orange-600" />
      default: return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.applicableTo.some(app => app.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSource = sourceFilter === 'ALL' || req.source === sourceFilter
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter
    const matchesPriority = priorityFilter === 'ALL' || req.priority === priorityFilter
    return matchesSearch && matchesSource && matchesStatus && matchesPriority
  })

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
            <h1 className="text-3xl font-bold text-slate-900">Compliance Register</h1>
            <p className="text-slate-600 mt-1">Track legal and regulatory compliance requirements</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Register
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Requirements</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{requirements.length}</p>
                <p className="text-sm text-slate-500 mt-1">All sources</p>
              </div>
              <Shield className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Compliant</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{requirements.filter(r => r.status === 'compliant').length}</p>
                <p className="text-sm text-slate-500 mt-1">Fully compliant</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Under Review</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{requirements.filter(r => r.status === 'under_review').length}</p>
                <p className="text-sm text-slate-500 mt-1">Pending assessment</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">High Priority</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{requirements.filter(r => r.priority === 'high').length}</p>
                <p className="text-sm text-slate-500 mt-1">Critical requirements</p>
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
                  placeholder="Search compliance requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sources</SelectItem>
                <SelectItem value="ISO">ISO</SelectItem>
                <SelectItem value="Regulatory">Regulatory</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
                <SelectItem value="Industry">Industry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Compliance Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequirements.map(req => (
            <Card key={req.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {getSourceIcon(req.source)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{req.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getSourceColor(req.source)}`}>
                          {req.source}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(req.priority)}`}>
                          {req.priority} priority
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
                  <p className="text-sm text-slate-600">{req.description}</p>
                  
                  {req.standard && (
                    <div className="text-sm text-slate-500">
                      <span className="font-medium">Standard:</span> {req.standard}
                    </div>
                  )}
                  
                  <div className="text-sm text-slate-500">
                    <span className="font-medium">Responsible:</span> {req.responsiblePerson}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Applicable To</p>
                    <div className="flex flex-wrap gap-1">
                      {req.applicableTo.slice(0, 2).map((app, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                      {req.applicableTo.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{req.applicableTo.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {req.evidence && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Evidence:</span> {req.evidence}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge 
                        status={req.status === 'compliant' ? 'green' : req.status === 'under_review' ? 'amber' : req.status === 'non_compliant' ? 'red' : 'amber'} 
                        label={req.status.replace('_', ' ')} 
                      />
                    </div>
                    <span className="text-slate-500">
                      Next review: {formatDate(req.nextReview)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compliance Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Compliance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">By Source</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">ISO Standards</span>
                  <Badge className="bg-blue-100 text-blue-800">{requirements.filter(r => r.source === 'ISO').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Regulatory</span>
                  <Badge className="bg-red-100 text-red-800">{requirements.filter(r => r.source === 'Regulatory').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Customer</span>
                  <Badge className="bg-green-100 text-green-800">{requirements.filter(r => r.source === 'Customer').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Industry</span>
                  <Badge className="bg-orange-100 text-orange-800">{requirements.filter(r => r.source === 'Industry').length}</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">By Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Compliant</span>
                  <Badge className="bg-green-100 text-green-800">{requirements.filter(r => r.status === 'compliant').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Under Review</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{requirements.filter(r => r.status === 'under_review').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Pending</span>
                  <Badge className="bg-blue-100 text-blue-800">{requirements.filter(r => r.status === 'pending').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Non-Compliant</span>
                  <Badge className="bg-red-100 text-red-800">{requirements.filter(r => r.status === 'non_compliant').length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
