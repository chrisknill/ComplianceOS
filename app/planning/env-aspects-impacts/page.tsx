'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Leaf, Droplets, Zap, Recycle, Factory, Plus, Edit, Trash2, 
  Search, AlertCircle, CheckCircle, Clock, BarChart3, Globe, TreePine
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'

interface EnvironmentalAspect {
  id: string
  title: string
  description: string
  category: 'energy' | 'water' | 'waste' | 'emissions' | 'materials' | 'biodiversity'
  aspect: string
  impact: string
  significance: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  status: 'identified' | 'assessed' | 'controlled' | 'monitored' | 'improved'
  owner: string
  controlMeasures: string[]
  opportunities: string[]
  lastReview: Date
  nextReview: Date
  legalRequirement: boolean
  operationalControl: boolean
  emergencyPotential: boolean
  notes?: string
  improvementActions?: string[]
}

export default function EnvAspectsImpactsPage() {
  const [loading, setLoading] = useState(true)
  const [aspects, setAspects] = useState<EnvironmentalAspect[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [significanceFilter, setSignificanceFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Simulate loading and fetch data
    setTimeout(() => {
      setAspects([
    {
      id: '1',
          title: 'Energy Consumption',
          description: 'Electricity and gas consumption from manufacturing operations',
          category: 'energy',
          aspect: 'Energy consumption from production processes',
          impact: 'Climate change through greenhouse gas emissions',
          significance: 'high',
          status: 'controlled',
          owner: 'Energy Manager',
          controlMeasures: ['Energy efficiency audits', 'LED lighting installation', 'Equipment optimisation'],
          opportunities: ['Renewable energy installation', 'Energy cost reduction'],
          lastReview: new Date('2025-01-10'),
          nextReview: new Date('2025-04-10'),
          legalRequirement: true,
          operationalControl: true,
          emergencyPotential: false,
          notes: 'Energy consumption reduced by 15% over last year',
          improvementActions: ['Solar panel installation', 'Smart metering system']
    },
    {
      id: '2',
          title: 'Waste Generation',
          description: 'Production waste including packaging materials and process waste',
          category: 'waste',
          aspect: 'Generation of solid waste from manufacturing',
          impact: 'Landfill use and resource depletion',
          significance: 'medium',
          status: 'controlled',
          owner: 'Waste Management Coordinator',
          controlMeasures: ['Waste segregation', 'Recycling programmes', 'Supplier packaging reduction'],
          opportunities: ['Circular economy initiatives', 'Waste-to-energy projects'],
          lastReview: new Date('2025-01-08'),
          nextReview: new Date('2025-04-08'),
          legalRequirement: true,
          operationalControl: true,
          emergencyPotential: false,
          notes: 'Waste diversion rate increased to 85%',
          improvementActions: ['Composting programme', 'Zero waste to landfill target']
    },
    {
      id: '3',
          title: 'Water Usage',
          description: 'Water consumption for production processes and facility operations',
          category: 'water',
          aspect: 'Water consumption from manufacturing and cleaning processes',
          impact: 'Water scarcity and ecosystem stress',
          significance: 'medium',
          status: 'monitored',
          owner: 'Environmental Manager',
          controlMeasures: ['Water recycling systems', 'Efficient cleaning processes', 'Leak detection'],
          opportunities: ['Rainwater harvesting', 'Process water reuse'],
          lastReview: new Date('2025-01-05'),
          nextReview: new Date('2025-04-05'),
          legalRequirement: true,
          operationalControl: true,
          emergencyPotential: false,
          notes: 'Water usage per unit reduced by 20%',
          improvementActions: ['Grey water systems', 'Water-efficient equipment']
        },
        {
          id: '4',
          title: 'Air Emissions',
          description: 'Atmospheric emissions from manufacturing processes and equipment',
          category: 'emissions',
          aspect: 'Release of pollutants to air from production',
          impact: 'Air quality degradation and health impacts',
          significance: 'high',
          status: 'controlled',
          owner: 'Environmental Manager',
          controlMeasures: ['Emission control systems', 'Regular monitoring', 'Process optimisation'],
          opportunities: ['Clean technology adoption', 'Emission trading'],
          lastReview: new Date('2025-01-03'),
          nextReview: new Date('2025-04-03'),
          legalRequirement: true,
          operationalControl: true,
          emergencyPotential: true,
          notes: 'All emissions within permitted limits',
          improvementActions: ['Catalytic converters', 'Low-emission processes']
        },
        {
          id: '5',
          title: 'Raw Material Usage',
          description: 'Consumption of raw materials and natural resources',
          category: 'materials',
          aspect: 'Extraction and use of natural resources',
          impact: 'Resource depletion and ecosystem disruption',
          significance: 'medium',
          status: 'assessed',
          owner: 'Procurement Manager',
          controlMeasures: ['Sustainable sourcing', 'Material efficiency', 'Supplier audits'],
          opportunities: ['Recycled materials', 'Biodegradable alternatives'],
          lastReview: new Date('2025-01-01'),
          nextReview: new Date('2025-04-01'),
          legalRequirement: false,
          operationalControl: true,
          emergencyPotential: false,
          notes: 'Sustainable sourcing policy implemented',
          improvementActions: ['Life cycle assessment', 'Material substitution']
        },
        {
          id: '6',
          title: 'Noise Generation',
          description: 'Industrial noise from manufacturing equipment and operations',
          category: 'emissions',
          aspect: 'Noise emissions from production equipment',
          impact: 'Community disturbance and health effects',
          significance: 'low',
          status: 'controlled',
          owner: 'Health & Safety Manager',
          controlMeasures: ['Noise barriers', 'Equipment maintenance', 'Operational controls'],
          opportunities: ['Quiet technology', 'Community engagement'],
          lastReview: new Date('2024-12-20'),
          nextReview: new Date('2025-03-20'),
          legalRequirement: true,
          operationalControl: true,
          emergencyPotential: false,
          notes: 'Noise levels within regulatory limits',
          improvementActions: ['Acoustic enclosures', 'Equipment upgrades']
        },
        {
          id: '7',
          title: 'Chemical Usage',
          description: 'Use of chemicals in production processes and cleaning',
          category: 'materials',
          aspect: 'Chemical consumption and handling',
          impact: 'Potential contamination and health risks',
          significance: 'high',
          status: 'controlled',
          owner: 'Chemical Safety Officer',
          controlMeasures: ['Chemical substitution', 'Safe handling procedures', 'Spill prevention'],
          opportunities: ['Green chemistry', 'Biodegradable chemicals'],
          lastReview: new Date('2024-12-15'),
          nextReview: new Date('2025-03-15'),
          legalRequirement: true,
          operationalControl: true,
          emergencyPotential: true,
          notes: 'Chemical inventory reduced by 30%',
          improvementActions: ['Chemical-free processes', 'Safer alternatives']
        },
        {
          id: '8',
          title: 'Biodiversity Impact',
          description: 'Impact on local ecosystems and wildlife from facility operations',
          category: 'biodiversity',
          aspect: 'Disturbance to local ecosystems',
          impact: 'Habitat loss and species displacement',
          significance: 'low',
          status: 'monitored',
          owner: 'Environmental Manager',
          controlMeasures: ['Habitat preservation', 'Wildlife corridors', 'Ecosystem monitoring'],
          opportunities: ['Biodiversity enhancement', 'Conservation partnerships'],
          lastReview: new Date('2024-12-10'),
          nextReview: new Date('2025-03-10'),
          legalRequirement: false,
          operationalControl: false,
          emergencyPotential: false,
          notes: 'No significant biodiversity impacts identified',
          improvementActions: ['Native species planting', 'Ecosystem restoration']
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'energy': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'water': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'waste': return 'bg-green-100 text-green-800 border-green-200'
      case 'emissions': return 'bg-red-100 text-red-800 border-red-200'
      case 'materials': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'biodiversity': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energy': return <Zap className="h-5 w-5 text-yellow-600" />
      case 'water': return <Droplets className="h-5 w-5 text-blue-600" />
      case 'waste': return <Recycle className="h-5 w-5 text-green-600" />
      case 'emissions': return <Factory className="h-5 w-5 text-red-600" />
      case 'materials': return <Leaf className="h-5 w-5 text-purple-600" />
      case 'biodiversity': return <TreePine className="h-5 w-5 text-emerald-600" />
      default: return <Globe className="h-5 w-5 text-gray-600" />
    }
  }

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'very_high': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'very_low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredAspects = aspects.filter(aspect => {
    const matchesSearch = aspect.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aspect.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aspect.aspect.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aspect.impact.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || aspect.category === categoryFilter
    const matchesSignificance = significanceFilter === 'ALL' || aspect.significance === significanceFilter
    const matchesStatus = statusFilter === 'ALL' || aspect.status === statusFilter
    return matchesSearch && matchesCategory && matchesSignificance && matchesStatus
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
            <h1 className="text-3xl font-bold text-slate-900">Environmental Aspects & Impacts</h1>
            <p className="text-slate-600 mt-1">Identify and evaluate environmental aspects and their impacts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Environmental Report
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Aspect
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Aspects</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{aspects.length}</p>
                <p className="text-sm text-slate-500 mt-1">All categories</p>
              </div>
              <Globe className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">High/Very High Significance</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{aspects.filter(a => a.significance === 'high' || a.significance === 'very_high').length}</p>
                <p className="text-sm text-slate-500 mt-1">Critical aspects</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Controlled</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{aspects.filter(a => a.status === 'controlled').length}</p>
                <p className="text-sm text-slate-500 mt-1">Under control</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Legal Requirements</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{aspects.filter(a => a.legalRequirement).length}</p>
                <p className="text-sm text-slate-500 mt-1">Regulated aspects</p>
              </div>
              <AlertCircle className="h-10 w-10 text-purple-500" />
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
                  placeholder="Search environmental aspects..."
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
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="waste">Waste</SelectItem>
                <SelectItem value="emissions">Emissions</SelectItem>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="biodiversity">Biodiversity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={significanceFilter} onValueChange={setSignificanceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Significance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Significance</SelectItem>
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
                <SelectItem value="controlled">Controlled</SelectItem>
                <SelectItem value="monitored">Monitored</SelectItem>
                <SelectItem value="improved">Improved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Environmental Aspects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAspects.map(aspect => (
            <Card key={aspect.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {getCategoryIcon(aspect.category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{aspect.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getCategoryColor(aspect.category)}`}>
                          {aspect.category}
                        </Badge>
                        <Badge className={`text-xs ${getSignificanceColor(aspect.significance)}`}>
                          {aspect.significance.replace('_', ' ')} significance
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
                  <p className="text-sm text-slate-600">{aspect.description}</p>
                  
                  <div className="text-sm text-slate-500">
                    <span className="font-medium">Aspect:</span> {aspect.aspect}
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    <span className="font-medium">Impact:</span> {aspect.impact}
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    <span className="font-medium">Owner:</span> {aspect.owner}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Control Measures</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {aspect.controlMeasures.slice(0, 2).map((measure, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                          {measure}
                        </li>
                      ))}
                      {aspect.controlMeasures.length > 2 && (
                        <li className="text-xs text-slate-500">
                          +{aspect.controlMeasures.length - 2} more measures...
                        </li>
                      )}
                    </ul>
                  </div>

                  {aspect.opportunities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Opportunities</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {aspect.opportunities.slice(0, 1).map((opp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            {opp}
                          </li>
                        ))}
                        {aspect.opportunities.length > 1 && (
                          <li className="text-xs text-slate-500">
                            +{aspect.opportunities.length - 1} more opportunities...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    {aspect.legalRequirement && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        Legal Requirement
                      </Badge>
                    )}
                    {aspect.operationalControl && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Operational Control
                      </Badge>
                    )}
                    {aspect.emergencyPotential && (
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        Emergency Potential
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge 
                        status={aspect.status === 'controlled' ? 'green' : aspect.status === 'monitored' ? 'amber' : aspect.status === 'assessed' ? 'blue' : 'red'} 
                        label={aspect.status} 
                      />
                    </div>
                    <span className="text-slate-500">
                      Next review: {formatDate(aspect.nextReview)}
                    </span>
                  </div>

                  {aspect.notes && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Notes:</span> {aspect.notes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Environmental Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Environmental Aspects Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">By Category</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Energy</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{aspects.filter(a => a.category === 'energy').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Water</span>
                  <Badge className="bg-blue-100 text-blue-800">{aspects.filter(a => a.category === 'water').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Waste</span>
                  <Badge className="bg-green-100 text-green-800">{aspects.filter(a => a.category === 'waste').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Emissions</span>
                  <Badge className="bg-red-100 text-red-800">{aspects.filter(a => a.category === 'emissions').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Materials</span>
                  <Badge className="bg-purple-100 text-purple-800">{aspects.filter(a => a.category === 'materials').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Biodiversity</span>
                  <Badge className="bg-emerald-100 text-emerald-800">{aspects.filter(a => a.category === 'biodiversity').length}</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">By Significance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Very High</span>
                  <Badge className="bg-red-100 text-red-800">{aspects.filter(a => a.significance === 'very_high').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">High</span>
                  <Badge className="bg-orange-100 text-orange-800">{aspects.filter(a => a.significance === 'high').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Medium</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{aspects.filter(a => a.significance === 'medium').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Low</span>
                  <Badge className="bg-green-100 text-green-800">{aspects.filter(a => a.significance === 'low').length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Very Low</span>
                  <Badge className="bg-blue-100 text-blue-800">{aspects.filter(a => a.significance === 'very_low').length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
