'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building2, Users, Globe, FileText, Plus, Edit, Trash2, 
  Search, Target, Shield, TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'

interface ContextFactor {
  id: string
  type: 'internal' | 'external'
  category: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  status: 'active' | 'monitoring' | 'resolved'
  lastReview: Date
  nextReview: Date
}

interface InterestedParty {
  id: string
  name: string
  type: 'internal' | 'external'
  category: string
  requirements: string[]
  influence: 'high' | 'medium' | 'low'
  satisfaction: 'satisfied' | 'neutral' | 'dissatisfied'
  lastContact: Date
  nextReview: Date
}

export default function ContextPage() {
  const [loading, setLoading] = useState(true)
  const [contextFactors, setContextFactors] = useState<ContextFactor[]>([])
  const [interestedParties, setInterestedParties] = useState<InterestedParty[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [impactFilter, setImpactFilter] = useState<string>('ALL')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Simulate loading and fetch data
    setTimeout(() => {
      setContextFactors([
        {
          id: '1',
          type: 'internal',
          category: 'Culture',
          title: 'Organisational Culture',
          description: 'Strong focus on quality and continuous improvement',
          impact: 'high',
          status: 'active',
          lastReview: new Date('2025-01-10'),
          nextReview: new Date('2025-04-10')
        },
        {
          id: '2',
          type: 'internal',
          category: 'Resources',
          title: 'Technical Capabilities',
          description: 'Skilled workforce with advanced technical knowledge',
          impact: 'high',
          status: 'active',
          lastReview: new Date('2025-01-08'),
          nextReview: new Date('2025-04-08')
        },
        {
          id: '3',
          type: 'external',
          category: 'Regulatory',
          title: 'ISO Standards Compliance',
          description: 'Requirements for ISO 9001, 14001, and 45001 certification',
          impact: 'high',
          status: 'active',
          lastReview: new Date('2025-01-05'),
          nextReview: new Date('2025-04-05')
        },
        {
          id: '4',
          type: 'external',
          category: 'Market',
          title: 'Competitive Environment',
          description: 'Increasing competition in the manufacturing sector',
          impact: 'medium',
          status: 'monitoring',
          lastReview: new Date('2025-01-03'),
          nextReview: new Date('2025-04-03')
        },
        {
          id: '5',
          type: 'external',
          category: 'Technology',
          title: 'Digital Transformation',
          description: 'Industry 4.0 and automation trends',
          impact: 'medium',
          status: 'active',
          lastReview: new Date('2025-01-01'),
          nextReview: new Date('2025-04-01')
        }
      ])

      setInterestedParties([
        {
          id: '1',
          name: 'Customers',
          type: 'external',
          category: 'Primary',
          requirements: ['Quality products', 'On-time delivery', 'Competitive pricing'],
          influence: 'high',
          satisfaction: 'satisfied',
          lastContact: new Date('2025-01-15'),
          nextReview: new Date('2025-04-15')
        },
        {
          id: '2',
          name: 'Employees',
          type: 'internal',
          category: 'Primary',
          requirements: ['Safe working conditions', 'Fair treatment', 'Career development'],
          influence: 'high',
          satisfaction: 'satisfied',
          lastContact: new Date('2025-01-12'),
          nextReview: new Date('2025-04-12')
        },
        {
          id: '3',
          name: 'Suppliers',
          type: 'external',
          category: 'Secondary',
          requirements: ['Reliable supply', 'Quality materials', 'Fair pricing'],
          influence: 'medium',
          satisfaction: 'neutral',
          lastContact: new Date('2025-01-10'),
          nextReview: new Date('2025-04-10')
        },
        {
          id: '4',
          name: 'Regulators',
          type: 'external',
          category: 'Secondary',
          requirements: ['Compliance with standards', 'Accurate reporting', 'Safety protocols'],
          influence: 'high',
          satisfaction: 'satisfied',
          lastContact: new Date('2025-01-08'),
          nextReview: new Date('2025-04-08')
        },
        {
          id: '5',
          name: 'Local Community',
          type: 'external',
          category: 'Secondary',
          requirements: ['Environmental protection', 'Community engagement', 'Job creation'],
          influence: 'medium',
          satisfaction: 'neutral',
          lastContact: new Date('2025-01-05'),
          nextReview: new Date('2025-04-05')
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case 'high': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const filteredContextFactors = contextFactors.filter(factor => {
    const matchesSearch = factor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         factor.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'ALL' || factor.type === typeFilter
    const matchesImpact = impactFilter === 'ALL' || factor.impact === impactFilter
    return matchesSearch && matchesType && matchesImpact
  })

  const filteredInterestedParties = interestedParties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         party.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
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
            <h1 className="text-3xl font-bold text-slate-900">Organisational Context</h1>
            <p className="text-slate-600 mt-1">Understanding your organisation&apos;s context and external factors</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Context
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Factor
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Context Factors</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{contextFactors.length}</p>
                <p className="text-sm text-slate-500 mt-1">Internal & External</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">High Impact Factors</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{contextFactors.filter(f => f.impact === 'high').length}</p>
                <p className="text-sm text-slate-500 mt-1">Critical monitoring</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Interested Parties</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{interestedParties.length}</p>
                <p className="text-sm text-slate-500 mt-1">Stakeholders</p>
              </div>
              <Users className="h-10 w-10 text-green-500" />
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
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search context factors and interested parties..."
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
            <Select value={impactFilter} onValueChange={setImpactFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Impact</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Context Factors */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Context Factors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContextFactors.map(factor => (
              <Card key={factor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {factor.type === 'internal' ? (
                          <Building2 className="h-5 w-5 text-slate-600" />
                        ) : (
                          <Globe className="h-5 w-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{factor.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {factor.category}
                          </Badge>
                          <Badge className={`text-xs ${getImpactColor(factor.impact)}`}>
                            {factor.impact} impact
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
                    <p className="text-sm text-slate-600">{factor.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <StatusBadge 
                          status={factor.status === 'active' ? 'green' : factor.status === 'monitoring' ? 'amber' : 'red'} 
                          label={factor.status} 
                        />
                      </div>
                      <span className="text-slate-500">
                        Next review: {formatDate(factor.nextReview)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interested Parties */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Interested Parties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterestedParties.map(party => (
              <Card key={party.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Users className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{party.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
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
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Requirements</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {party.requirements.slice(0, 2).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                            {req}
                          </li>
                        ))}
                        {party.requirements.length > 2 && (
                          <li className="text-xs text-slate-500">
                            +{party.requirements.length - 2} more...
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Last contact: {formatDate(party.lastContact)}
                      </span>
                      <span className="text-slate-500">
                        Next review: {formatDate(party.nextReview)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Context Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Context Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Internal Context</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Organisational culture</span>
                  <Badge className="bg-green-100 text-green-800">Strong</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Technical capabilities</span>
                  <Badge className="bg-green-100 text-green-800">Advanced</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Resource availability</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Adequate</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">External Context</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Regulatory environment</span>
                  <Badge className="bg-blue-100 text-blue-800">Stable</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Market conditions</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Competitive</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Technology trends</span>
                  <Badge className="bg-blue-100 text-blue-800">Emerging</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
