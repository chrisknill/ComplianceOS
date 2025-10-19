'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  AlertTriangle, TrendingUp, TrendingDown, Target, Plus, Edit, Trash2, 
  Search, Shield, AlertCircle, CheckCircle, Clock, BarChart3, Users
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'

interface BusinessRisk {
  id: string
  title: string
  description: string
  category: 'operational' | 'financial' | 'strategic' | 'compliance' | 'reputational' | 'technical'
  likelihood: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  impact: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  status: 'identified' | 'assessed' | 'mitigated' | 'monitored' | 'closed'
  owner: string
  mitigationMeasures: string[]
  opportunities: string[]
  lastReview: Date
  nextReview: Date
  residualRisk: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  costOfMitigation?: number
  notes?: string
}

export default function BusinessRiskPage() {
  const [loading, setLoading] = useState(true)
  const [risks, setRisks] = useState<BusinessRisk[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Simulate loading and fetch data
    setTimeout(() => {
      setRisks([
    {
      id: '1',
          title: 'Supply Chain Disruption',
          description: 'Risk of disruption to critical suppliers affecting production capacity',
          category: 'operational',
          likelihood: 'medium',
          impact: 'high',
          riskLevel: 'high',
          status: 'mitigated',
          owner: 'Operations Manager',
          mitigationMeasures: ['Diversified supplier base', 'Safety stock maintained', 'Alternative suppliers identified'],
          opportunities: ['Improved supplier relationships', 'Cost reduction through better negotiations'],
          lastReview: new Date('2025-01-10'),
          nextReview: new Date('2025-04-10'),
          residualRisk: 'medium',
          costOfMitigation: 50000,
          notes: 'Regular supplier performance reviews conducted'
    },
    {
      id: '2',
          title: 'Economic Downturn Impact',
          description: 'Risk of reduced demand due to economic recession affecting revenue',
          category: 'financial',
          likelihood: 'low',
          impact: 'very_high',
          riskLevel: 'high',
          status: 'monitored',
          owner: 'Finance Director',
          mitigationMeasures: ['Diversified customer base', 'Flexible cost structure', 'Cash reserves maintained'],
          opportunities: ['Market share expansion', 'Acquisition opportunities'],
          lastReview: new Date('2025-01-08'),
          nextReview: new Date('2025-04-08'),
          residualRisk: 'medium',
          costOfMitigation: 100000,
          notes: 'Economic indicators monitored monthly'
    },
    {
      id: '3',
          title: 'Technology System Failure',
          description: 'Risk of critical IT systems failure affecting business operations',
          category: 'technical',
          likelihood: 'medium',
          impact: 'high',
          riskLevel: 'high',
          status: 'mitigated',
          owner: 'IT Manager',
          mitigationMeasures: ['Backup systems in place', 'Regular system maintenance', 'Disaster recovery plan'],
          opportunities: ['Technology upgrade', 'Process automation'],
          lastReview: new Date('2025-01-05'),
          nextReview: new Date('2025-04-05'),
          residualRisk: 'low',
          costOfMitigation: 75000,
          notes: 'System redundancy implemented successfully'
        },
        {
          id: '4',
          title: 'Regulatory Compliance Changes',
          description: 'Risk of new regulations requiring significant operational changes',
          category: 'compliance',
          likelihood: 'high',
          impact: 'medium',
          riskLevel: 'high',
          status: 'assessed',
          owner: 'Compliance Manager',
          mitigationMeasures: ['Regular regulatory monitoring', 'Early implementation planning', 'Legal consultation'],
          opportunities: ['Competitive advantage', 'Improved processes'],
          lastReview: new Date('2025-01-03'),
          nextReview: new Date('2025-04-03'),
          residualRisk: 'medium',
          costOfMitigation: 25000,
          notes: 'Regulatory change tracking system implemented'
        },
        {
          id: '5',
          title: 'Key Personnel Loss',
          description: 'Risk of losing critical employees affecting business continuity',
          category: 'operational',
          likelihood: 'medium',
          impact: 'medium',
          riskLevel: 'medium',
          status: 'mitigated',
          owner: 'HR Manager',
          mitigationMeasures: ['Succession planning', 'Knowledge documentation', 'Competitive retention packages'],
          opportunities: ['Talent development', 'Improved culture'],
          lastReview: new Date('2025-01-01'),
          nextReview: new Date('2025-04-01'),
          residualRisk: 'low',
          costOfMitigation: 30000,
          notes: 'Employee satisfaction surveys show improvement'
        },
        {
          id: '6',
          title: 'Reputation Damage',
          description: 'Risk of negative publicity affecting brand reputation and customer trust',
          category: 'reputational',
          likelihood: 'low',
          impact: 'very_high',
          riskLevel: 'high',
          status: 'monitored',
          owner: 'Marketing Director',
          mitigationMeasures: ['Crisis communication plan', 'Social media monitoring', 'Stakeholder engagement'],
          opportunities: ['Brand strengthening', 'Customer loyalty programmes'],
          lastReview: new Date('2024-12-20'),
          nextReview: new Date('2025-03-20'),
          residualRisk: 'medium',
          costOfMitigation: 40000,
          notes: 'Brand monitoring tools implemented'
        },
        {
          id: '7',
          title: 'Market Competition Intensification',
          description: 'Risk of increased competition affecting market share and pricing',
          category: 'strategic',
          likelihood: 'high',
          impact: 'medium',
          riskLevel: 'high',
          status: 'assessed',
          owner: 'Strategy Director',
          mitigationMeasures: ['Innovation investment', 'Customer relationship strengthening', 'Cost optimisation'],
          opportunities: ['Market expansion', 'Product differentiation'],
          lastReview: new Date('2024-12-15'),
          nextReview: new Date('2025-03-15'),
          residualRisk: 'medium',
          costOfMitigation: 200000,
          notes: 'Competitive analysis conducted quarterly'
        },
        {
          id: '8',
          title: 'Data Security Breach',
          description: 'Risk of cyber security breach affecting customer data and operations',
          category: 'technical',
          likelihood: 'low',
          impact: 'very_high',
          riskLevel: 'high',
          status: 'mitigated',
          owner: 'IT Security Manager',
          mitigationMeasures: ['Enhanced security protocols', 'Employee training', 'Regular security audits'],
          opportunities: ['Security leadership', 'Customer trust'],
          lastReview: new Date('2024-12-10'),
          nextReview: new Date('2025-03-10'),
          residualRisk: 'low',
          costOfMitigation: 150000,
          notes: 'Security framework upgraded to latest standards'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operational': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'financial': return 'bg-green-100 text-green-800 border-green-200'
      case 'strategic': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'compliance': return 'bg-red-100 text-red-800 border-red-200'
      case 'reputational': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'technical': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'operational': return <Target className="h-5 w-5 text-blue-600" />
      case 'financial': return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'strategic': return <BarChart3 className="h-5 w-5 text-purple-600" />
      case 'compliance': return <Shield className="h-5 w-5 text-red-600" />
      case 'reputational': return <Users className="h-5 w-5 text-orange-600" />
      case 'technical': return <AlertTriangle className="h-5 w-5 text-gray-600" />
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'very_high': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'very_low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLikelihoodIcon = (likelihood: string) => {
    switch (likelihood) {
      case 'very_high': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'low': return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'very_low': return <TrendingDown className="h-4 w-4 text-blue-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.mitigationMeasures.some(measure => measure.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'ALL' || risk.category === categoryFilter
    const matchesRiskLevel = riskLevelFilter === 'ALL' || risk.riskLevel === riskLevelFilter
    const matchesStatus = statusFilter === 'ALL' || risk.status === statusFilter
    return matchesSearch && matchesCategory && matchesRiskLevel && matchesStatus
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
            <h1 className="text-3xl font-bold text-slate-900">Business Risk Assessment</h1>
            <p className="text-slate-600 mt-1">Identify and manage business risks and opportunities</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Risk Report
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Risk
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Risks</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{risks.length}</p>
                <p className="text-sm text-slate-500 mt-1">All categories</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">High/Very High Risk</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'very_high').length}</p>
                <p className="text-sm text-slate-500 mt-1">Critical risks</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Mitigated</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{risks.filter(r => r.status === 'mitigated').length}</p>
                <p className="text-sm text-slate-500 mt-1">Under control</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Mitigation Cost</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">£{risks.reduce((sum, r) => sum + (r.costOfMitigation || 0), 0).toLocaleString()}</p>
                <p className="text-sm text-slate-500 mt-1">Investment in controls</p>
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
                  placeholder="Search business risks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="strategic">Strategic</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="reputational">Reputational</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="very_high">Very High</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="very_low">Very Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="identified">Identified</SelectItem>
                <SelectItem value="assessed">Assessed</SelectItem>
                <SelectItem value="mitigated">Mitigated</SelectItem>
                <SelectItem value="monitored">Monitored</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Risk Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRisks.map(risk => (
            <Card key={risk.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {getCategoryIcon(risk.category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{risk.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getCategoryColor(risk.category)}`}>
                          {risk.category}
                        </Badge>
                        <Badge className={`text-xs ${getRiskLevelColor(risk.riskLevel)}`}>
                          {risk.riskLevel.replace('_', ' ')} risk
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
                  <p className="text-sm text-slate-600">{risk.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Likelihood:</span>
                      <div className="flex items-center gap-1">
                        {getLikelihoodIcon(risk.likelihood)}
                        <span className="capitalize">{risk.likelihood.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Impact:</span>
                      <span className="capitalize">{risk.impact.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    <span className="font-medium">Owner:</span> {risk.owner}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Mitigation Measures</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {risk.mitigationMeasures.slice(0, 2).map((measure, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                          {measure}
                        </li>
                      ))}
                      {risk.mitigationMeasures.length > 2 && (
                        <li className="text-xs text-slate-500">
                          +{risk.mitigationMeasures.length - 2} more measures...
                        </li>
                      )}
                    </ul>
                  </div>

                  {risk.opportunities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Opportunities</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {risk.opportunities.slice(0, 1).map((opp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            {opp}
                          </li>
                        ))}
                        {risk.opportunities.length > 1 && (
                          <li className="text-xs text-slate-500">
                            +{risk.opportunities.length - 1} more opportunities...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge 
                        status={risk.status === 'mitigated' ? 'green' : risk.status === 'monitored' ? 'amber' : risk.status === 'assessed' ? 'blue' : 'red'} 
                        label={risk.status} 
                      />
                    </div>
                    <span className="text-slate-500">
                      Next review: {formatDate(risk.nextReview)}
                    </span>
                  </div>

                  {risk.costOfMitigation && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Mitigation Cost:</span> £{risk.costOfMitigation.toLocaleString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Assessment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">By Category</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Operational</span>
                  <Badge className="bg-blue-100 text-blue-800">{risks.filter(r => r.category === 'operational').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Financial</span>
                  <Badge className="bg-green-100 text-green-800">{risks.filter(r => r.category === 'financial').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Strategic</span>
                  <Badge className="bg-purple-100 text-purple-800">{risks.filter(r => r.category === 'strategic').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Compliance</span>
                  <Badge className="bg-red-100 text-red-800">{risks.filter(r => r.category === 'compliance').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Technical</span>
                  <Badge className="bg-gray-100 text-gray-800">{risks.filter(r => r.category === 'technical').length}</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">By Risk Level</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Very High</span>
                  <Badge className="bg-red-100 text-red-800">{risks.filter(r => r.riskLevel === 'very_high').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">High</span>
                  <Badge className="bg-orange-100 text-orange-800">{risks.filter(r => r.riskLevel === 'high').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Medium</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{risks.filter(r => r.riskLevel === 'medium').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Low</span>
                  <Badge className="bg-green-100 text-green-800">{risks.filter(r => r.riskLevel === 'low').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Very Low</span>
                  <Badge className="bg-blue-100 text-blue-800">{risks.filter(r => r.riskLevel === 'very_low').length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
