'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, Shield, Globe, Target, Plus, Edit, Trash2, 
  Search, CheckCircle, AlertCircle, Clock, Users, Settings
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'

interface Policy {
  id: string
  title: string
  type: 'QMS' | 'EMS' | 'OHS' | 'Integrated' | 'General'
  description: string
  version: string
  status: 'active' | 'under_review' | 'draft' | 'archived'
  owner: string
  lastReview: Date
  nextReview: Date
  approvedBy: string
  approvedDate: Date
  applicableTo: string[]
  complianceLevel: 'mandatory' | 'recommended' | 'optional'
  relatedStandards: string[]
}

export default function PoliciesPage() {
  const [loading, setLoading] = useState(true)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [complianceFilter, setComplianceFilter] = useState<string>('ALL')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Simulate loading and fetch data
    setTimeout(() => {
      setPolicies([
        {
          id: '1',
          title: 'Quality Policy',
          type: 'QMS',
          description: 'Our commitment to quality excellence and customer satisfaction',
          version: '3.2',
          status: 'active',
          owner: 'Quality Manager',
          lastReview: new Date('2025-01-10'),
          nextReview: new Date('2025-07-10'),
          approvedBy: 'CEO',
          approvedDate: new Date('2025-01-10'),
          applicableTo: ['All employees', 'Management', 'Contractors'],
          complianceLevel: 'mandatory',
          relatedStandards: ['ISO 9001:2015', 'Customer requirements']
        },
        {
          id: '2',
          title: 'Environmental Policy',
          type: 'EMS',
          description: 'Environmental protection and sustainable practices commitment',
          version: '2.1',
          status: 'active',
          owner: 'Environmental Manager',
          lastReview: new Date('2025-01-08'),
          nextReview: new Date('2025-07-08'),
          approvedBy: 'CEO',
          approvedDate: new Date('2025-01-08'),
          applicableTo: ['All employees', 'Management', 'Contractors', 'Suppliers'],
          complianceLevel: 'mandatory',
          relatedStandards: ['ISO 14001:2015', 'Environmental regulations']
        },
        {
          id: '3',
          title: 'Health & Safety Policy',
          type: 'OHS',
          description: 'Occupational health and safety commitment and responsibilities',
          version: '4.0',
          status: 'under_review',
          owner: 'Health & Safety Manager',
          lastReview: new Date('2024-12-15'),
          nextReview: new Date('2025-03-15'),
          approvedBy: 'CEO',
          approvedDate: new Date('2024-12-15'),
          applicableTo: ['All employees', 'Management', 'Contractors', 'Visitors'],
          complianceLevel: 'mandatory',
          relatedStandards: ['ISO 45001:2018', 'Health & Safety regulations']
        },
        {
          id: '4',
          title: 'Information Security Policy',
          type: 'General',
          description: 'Protection of information assets and data security',
          version: '1.5',
          status: 'active',
          owner: 'IT Manager',
          lastReview: new Date('2025-01-05'),
          nextReview: new Date('2025-07-05'),
          approvedBy: 'IT Director',
          approvedDate: new Date('2025-01-05'),
          applicableTo: ['All employees', 'IT staff', 'Contractors'],
          complianceLevel: 'mandatory',
          relatedStandards: ['ISO 27001', 'Data Protection Act']
        },
        {
          id: '5',
          title: 'Equal Opportunities Policy',
          type: 'General',
          description: 'Commitment to equality and diversity in the workplace',
          version: '2.0',
          status: 'active',
          owner: 'HR Manager',
          lastReview: new Date('2024-11-20'),
          nextReview: new Date('2025-05-20'),
          approvedBy: 'HR Director',
          approvedDate: new Date('2024-11-20'),
          applicableTo: ['All employees', 'Management', 'Recruitment'],
          complianceLevel: 'mandatory',
          relatedStandards: ['Equality Act 2010', 'Employment law']
        },
        {
          id: '6',
          title: 'Procurement Policy',
          type: 'QMS',
          description: 'Supplier selection and procurement procedures',
          version: '1.8',
          status: 'active',
          owner: 'Procurement Manager',
          lastReview: new Date('2024-12-01'),
          nextReview: new Date('2025-06-01'),
          approvedBy: 'Operations Director',
          approvedDate: new Date('2024-12-01'),
          applicableTo: ['Procurement team', 'Management', 'Budget holders'],
          complianceLevel: 'mandatory',
          relatedStandards: ['ISO 9001:2015', 'Procurement regulations']
        },
        {
          id: '7',
          title: 'Training and Development Policy',
          type: 'Integrated',
          description: 'Employee training and competency development',
          version: '3.1',
          status: 'active',
          owner: 'Training Manager',
          lastReview: new Date('2025-01-03'),
          nextReview: new Date('2025-07-03'),
          approvedBy: 'HR Director',
          approvedDate: new Date('2025-01-03'),
          applicableTo: ['All employees', 'Management', 'HR'],
          complianceLevel: 'recommended',
          relatedStandards: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018']
        },
        {
          id: '8',
          title: 'Risk Management Policy',
          type: 'Integrated',
          description: 'Risk identification, assessment and management procedures',
          version: '2.3',
          status: 'draft',
          owner: 'Risk Manager',
          lastReview: new Date('2024-10-15'),
          nextReview: new Date('2025-02-15'),
          approvedBy: 'TBD',
          approvedDate: new Date('2024-10-15'),
          applicableTo: ['All employees', 'Management', 'Risk team'],
          complianceLevel: 'mandatory',
          relatedStandards: ['ISO 31000', 'ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018']
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'QMS': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'EMS': return 'bg-green-100 text-green-800 border-green-200'
      case 'OHS': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Integrated': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'General': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'QMS': return <Target className="h-5 w-5 text-blue-600" />
      case 'EMS': return <Globe className="h-5 w-5 text-green-600" />
      case 'OHS': return <Shield className="h-5 w-5 text-orange-600" />
      case 'Integrated': return <Settings className="h-5 w-5 text-purple-600" />
      case 'General': return <FileText className="h-5 w-5 text-gray-600" />
      default: return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getComplianceColor = (level: string) => {
    switch (level) {
      case 'mandatory': return 'bg-red-100 text-red-800 border-red-200'
      case 'recommended': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'optional': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.applicableTo.some(app => app.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'ALL' || policy.type === typeFilter
    const matchesStatus = statusFilter === 'ALL' || policy.status === statusFilter
    const matchesCompliance = complianceFilter === 'ALL' || policy.complianceLevel === complianceFilter
    return matchesSearch && matchesType && matchesStatus && matchesCompliance
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
            <h1 className="text-3xl font-bold text-slate-900">Policies</h1>
            <p className="text-slate-600 mt-1">Manage organisational policies and commitments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Policies
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Policy
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Policies</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{policies.length}</p>
                <p className="text-sm text-slate-500 mt-1">All types</p>
              </div>
              <FileText className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Policies</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{policies.filter(p => p.status === 'active').length}</p>
                <p className="text-sm text-slate-500 mt-1">Currently effective</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Under Review</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{policies.filter(p => p.status === 'under_review').length}</p>
                <p className="text-sm text-slate-500 mt-1">Pending updates</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Mandatory Policies</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{policies.filter(p => p.complianceLevel === 'mandatory').length}</p>
                <p className="text-sm text-slate-500 mt-1">Required compliance</p>
              </div>
              <Shield className="h-10 w-10 text-red-500" />
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
                  placeholder="Search policies..."
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
                <SelectItem value="QMS">QMS</SelectItem>
                <SelectItem value="EMS">EMS</SelectItem>
                <SelectItem value="OHS">OHS</SelectItem>
                <SelectItem value="Integrated">Integrated</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={complianceFilter} onValueChange={setComplianceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="mandatory">Mandatory</SelectItem>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map(policy => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {getTypeIcon(policy.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{policy.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getTypeColor(policy.type)}`}>
                          {policy.type}
                        </Badge>
                        <Badge className={`text-xs ${getComplianceColor(policy.complianceLevel)}`}>
                          {policy.complianceLevel}
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
                  <p className="text-sm text-slate-600">{policy.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Version {policy.version}</span>
                    <span className="text-slate-500">Owner: {policy.owner}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Applicable To</p>
                    <div className="flex flex-wrap gap-1">
                      {policy.applicableTo.slice(0, 2).map((app, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                      {policy.applicableTo.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{policy.applicableTo.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Related Standards</p>
                    <div className="flex flex-wrap gap-1">
                      {policy.relatedStandards.slice(0, 2).map((standard, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                      {policy.relatedStandards.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{policy.relatedStandards.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge 
                        status={policy.status === 'active' ? 'green' : policy.status === 'under_review' ? 'amber' : policy.status === 'draft' ? 'amber' : 'red'} 
                        label={policy.status.replace('_', ' ')} 
                      />
                    </div>
                    <span className="text-slate-500">
                      Next review: {formatDate(policy.nextReview)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Policy Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Policy Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Policy Types</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Quality Management (QMS)</span>
                  <Badge className="bg-blue-100 text-blue-800">{policies.filter(p => p.type === 'QMS').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Environmental Management (EMS)</span>
                  <Badge className="bg-green-100 text-green-800">{policies.filter(p => p.type === 'EMS').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Health & Safety (OHS)</span>
                  <Badge className="bg-orange-100 text-orange-800">{policies.filter(p => p.type === 'OHS').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Integrated Policies</span>
                  <Badge className="bg-purple-100 text-purple-800">{policies.filter(p => p.type === 'Integrated').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">General Policies</span>
                  <Badge className="bg-gray-100 text-gray-800">{policies.filter(p => p.type === 'General').length}</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Compliance Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Mandatory</span>
                  <Badge className="bg-red-100 text-red-800">{policies.filter(p => p.complianceLevel === 'mandatory').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Recommended</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{policies.filter(p => p.complianceLevel === 'recommended').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Optional</span>
                  <Badge className="bg-green-100 text-green-800">{policies.filter(p => p.complianceLevel === 'optional').length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
