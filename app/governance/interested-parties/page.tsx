'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, Building2, Globe, FileText, Plus, Edit, Trash2, 
  Search, Target, Shield, TrendingUp, AlertCircle, CheckCircle, Star
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'

interface InterestedParty {
  id: string
  name: string
  type: 'internal' | 'external'
  category: 'primary' | 'secondary' | 'regulatory'
  description: string
  requirements: string[]
  influence: 'high' | 'medium' | 'low'
  satisfaction: 'satisfied' | 'neutral' | 'dissatisfied'
  lastContact: Date
  nextReview: Date
  contactPerson?: string
  contactEmail?: string
  status: 'active' | 'monitoring' | 'inactive'
}

export default function InterestedPartiesPage() {
  const [loading, setLoading] = useState(true)
  const [interestedParties, setInterestedParties] = useState<InterestedParty[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [influenceFilter, setInfluenceFilter] = useState<string>('ALL')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Simulate loading and fetch data
    setTimeout(() => {
      setInterestedParties([
        {
          id: '1',
          name: 'Customers',
          type: 'external',
          category: 'primary',
          description: 'End users and clients who purchase our products and services',
          requirements: ['Quality products', 'On-time delivery', 'Competitive pricing', 'Customer support'],
          influence: 'high',
          satisfaction: 'satisfied',
          lastContact: new Date('2025-01-15'),
          nextReview: new Date('2025-04-15'),
          contactPerson: 'Sarah Johnson',
          contactEmail: 'customers@company.com',
          status: 'active'
        },
        {
          id: '2',
          name: 'Employees',
          type: 'internal',
          category: 'primary',
          description: 'All staff members across all departments and levels',
          requirements: ['Safe working conditions', 'Fair treatment', 'Career development', 'Competitive benefits'],
          influence: 'high',
          satisfaction: 'satisfied',
          lastContact: new Date('2025-01-12'),
          nextReview: new Date('2025-04-12'),
          contactPerson: 'HR Department',
          contactEmail: 'hr@company.com',
          status: 'active'
        },
        {
          id: '3',
          name: 'Suppliers',
          type: 'external',
          category: 'secondary',
          description: 'Vendors and suppliers providing materials and services',
          requirements: ['Reliable supply', 'Quality materials', 'Fair pricing', 'Environmental compliance'],
          influence: 'medium',
          satisfaction: 'neutral',
          lastContact: new Date('2025-01-10'),
          nextReview: new Date('2025-04-10'),
          contactPerson: 'Procurement Team',
          contactEmail: 'procurement@company.com',
          status: 'active'
        },
        {
          id: '4',
          name: 'Regulators',
          type: 'external',
          category: 'regulatory',
          description: 'Government agencies and certification bodies',
          requirements: ['Compliance with standards', 'Accurate reporting', 'Safety protocols', 'Environmental standards'],
          influence: 'high',
          satisfaction: 'satisfied',
          lastContact: new Date('2025-01-08'),
          nextReview: new Date('2025-04-08'),
          contactPerson: 'Compliance Officer',
          contactEmail: 'compliance@company.com',
          status: 'active'
        },
        {
          id: '5',
          name: 'Local Community',
          type: 'external',
          category: 'secondary',
          description: 'Residents and businesses in the local area',
          requirements: ['Environmental protection', 'Community engagement', 'Job creation', 'Noise reduction'],
          influence: 'medium',
          satisfaction: 'neutral',
          lastContact: new Date('2025-01-05'),
          nextReview: new Date('2025-04-05'),
          contactPerson: 'Community Relations',
          contactEmail: 'community@company.com',
          status: 'active'
        },
        {
          id: '6',
          name: 'Investors',
          type: 'external',
          category: 'primary',
          description: 'Shareholders and financial stakeholders',
          requirements: ['Financial performance', 'Transparency', 'Growth strategy', 'Risk management'],
          influence: 'high',
          satisfaction: 'satisfied',
          lastContact: new Date('2025-01-03'),
          nextReview: new Date('2025-04-03'),
          contactPerson: 'Finance Director',
          contactEmail: 'investors@company.com',
          status: 'active'
        },
        {
          id: '7',
          name: 'Management Team',
          type: 'internal',
          category: 'primary',
          description: 'Senior leadership and management personnel',
          requirements: ['Strategic direction', 'Resource allocation', 'Performance targets', 'Decision making'],
          influence: 'high',
          satisfaction: 'satisfied',
          lastContact: new Date('2025-01-01'),
          nextReview: new Date('2025-04-01'),
          contactPerson: 'CEO Office',
          contactEmail: 'management@company.com',
          status: 'active'
        },
        {
          id: '8',
          name: 'Trade Unions',
          type: 'external',
          category: 'secondary',
          description: 'Employee representative organisations',
          requirements: ['Fair wages', 'Working conditions', 'Job security', 'Collective bargaining'],
          influence: 'medium',
          satisfaction: 'neutral',
          lastContact: new Date('2024-12-28'),
          nextReview: new Date('2025-03-28'),
          contactPerson: 'HR Relations',
          contactEmail: 'unions@company.com',
          status: 'monitoring'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case 'high': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'primary': return 'bg-green-100 text-green-800 border-green-200'
      case 'secondary': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'regulatory': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSatisfactionIcon = (satisfaction: string) => {
    switch (satisfaction) {
      case 'satisfied': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'neutral': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'dissatisfied': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internal': return <Building2 className="h-5 w-5 text-slate-600" />
      case 'external': return <Globe className="h-5 w-5 text-slate-600" />
      default: return <Users className="h-5 w-5 text-slate-600" />
    }
  }

  const filteredParties = interestedParties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         party.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         party.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'ALL' || party.type === typeFilter
    const matchesCategory = categoryFilter === 'ALL' || party.category === categoryFilter
    const matchesInfluence = influenceFilter === 'ALL' || party.influence === influenceFilter
    return matchesSearch && matchesType && matchesCategory && matchesInfluence
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
            <h1 className="text-3xl font-bold text-slate-900">Interested Parties</h1>
            <p className="text-slate-600 mt-1">Manage stakeholder requirements and expectations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Parties
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Party
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Parties</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{interestedParties.length}</p>
                <p className="text-sm text-slate-500 mt-1">Internal & External</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Primary Parties</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{interestedParties.filter(p => p.category === 'primary').length}</p>
                <p className="text-sm text-slate-500 mt-1">High priority</p>
              </div>
              <Star className="h-10 w-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Satisfied Parties</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{interestedParties.filter(p => p.satisfaction === 'satisfied').length}</p>
                <p className="text-sm text-slate-500 mt-1">Positive relationships</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">High Influence</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{interestedParties.filter(p => p.influence === 'high').length}</p>
                <p className="text-sm text-slate-500 mt-1">Critical stakeholders</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-500" />
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
                  placeholder="Search interested parties..."
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
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
              </SelectContent>
            </Select>
            <Select value={influenceFilter} onValueChange={setInfluenceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Influence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Influence</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Interested Parties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParties.map(party => (
            <Card key={party.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {getTypeIcon(party.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{party.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getCategoryColor(party.category)}`}>
                          {party.category}
                        </Badge>
                        <Badge className={`text-xs ${getInfluenceColor(party.influence)}`}>
                          {party.influence} influence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getSatisfactionIcon(party.satisfaction)}
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">{party.description}</p>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Key Requirements</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {party.requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                          {req}
                        </li>
                      ))}
                      {party.requirements.length > 3 && (
                        <li className="text-xs text-slate-500">
                          +{party.requirements.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  {party.contactPerson && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Contact:</span> {party.contactPerson}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge 
                        status={party.status === 'active' ? 'green' : party.status === 'monitoring' ? 'amber' : 'red'} 
                        label={party.status} 
                      />
                    </div>
                    <span className="text-slate-500">
                      Next review: {formatDate(party.nextReview)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stakeholder Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Stakeholder Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Primary Stakeholders</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Customers</span>
                  <Badge className="bg-green-100 text-green-800">Satisfied</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Employees</span>
                  <Badge className="bg-green-100 text-green-800">Satisfied</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Investors</span>
                  <Badge className="bg-green-100 text-green-800">Satisfied</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Management</span>
                  <Badge className="bg-green-100 text-green-800">Satisfied</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Secondary Stakeholders</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Suppliers</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Local Community</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Trade Unions</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Regulators</span>
                  <Badge className="bg-green-100 text-green-800">Satisfied</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
