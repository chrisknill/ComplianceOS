'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Target, MapPin, Building2, Globe, FileText, Plus, Edit, Trash2, 
  Search, Shield, CheckCircle, AlertCircle, Users, Settings
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'

interface ScopeElement {
  id: string
  system: 'QMS' | 'EMS' | 'OHS' | 'Integrated'
  title: string
  description: string
  included: boolean
  location: string
  activities: string[]
  exclusions?: string[]
  lastReview: Date
  nextReview: Date
  status: 'active' | 'under_review' | 'excluded'
}

interface ScopeBoundary {
  id: string
  type: 'physical' | 'organisational' | 'temporal'
  name: string
  description: string
  included: boolean
  justification?: string
}

export default function ScopePage() {
  const [loading, setLoading] = useState(true)
  const [scopeElements, setScopeElements] = useState<ScopeElement[]>([])
  const [scopeBoundaries, setScopeBoundaries] = useState<ScopeBoundary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [systemFilter, setSystemFilter] = useState<string>('ALL')
  const [inclusionFilter, setInclusionFilter] = useState<string>('ALL')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Simulate loading and fetch data
    setTimeout(() => {
      setScopeElements([
        {
          id: '1',
          system: 'QMS',
          title: 'Product Design and Development',
          description: 'Design, development, and engineering of products and services',
          included: true,
          location: 'Head Office, Design Centre',
          activities: ['Concept development', 'Design reviews', 'Prototype testing', 'Design validation'],
          lastReview: new Date('2025-01-10'),
          nextReview: new Date('2025-04-10'),
          status: 'active'
        },
        {
          id: '2',
          system: 'QMS',
          title: 'Manufacturing Operations',
          description: 'Production and manufacturing of products',
          included: true,
          location: 'Manufacturing Facility A & B',
          activities: ['Production planning', 'Quality control', 'Assembly operations', 'Final inspection'],
          lastReview: new Date('2025-01-08'),
          nextReview: new Date('2025-04-08'),
          status: 'active'
        },
        {
          id: '3',
          system: 'EMS',
          title: 'Environmental Management',
          description: 'Environmental aspects of all operations and facilities',
          included: true,
          location: 'All Facilities',
          activities: ['Waste management', 'Energy consumption', 'Emissions monitoring', 'Environmental compliance'],
          lastReview: new Date('2025-01-05'),
          nextReview: new Date('2025-04-05'),
          status: 'active'
        },
        {
          id: '4',
          system: 'OHS',
          title: 'Occupational Health & Safety',
          description: 'Health and safety management for all employees and contractors',
          included: true,
          location: 'All Facilities',
          activities: ['Risk assessments', 'Safety training', 'Incident management', 'Health surveillance'],
          lastReview: new Date('2025-01-03'),
          nextReview: new Date('2025-04-03'),
          status: 'active'
        },
        {
          id: '5',
          system: 'QMS',
          title: 'Customer Service',
          description: 'Customer support and service delivery',
          included: true,
          location: 'Customer Service Centre',
          activities: ['Customer enquiries', 'Complaint handling', 'Service delivery', 'Customer feedback'],
          lastReview: new Date('2025-01-01'),
          nextReview: new Date('2025-04-01'),
          status: 'active'
        },
        {
          id: '6',
          system: 'QMS',
          title: 'Third-party Logistics',
          description: 'Outsourced logistics and distribution services',
          included: false,
          location: 'External Logistics Providers',
          activities: ['Warehousing', 'Transportation', 'Distribution'],
          exclusions: ['Not directly controlled by organisation', 'Managed through supplier agreements'],
          lastReview: new Date('2024-12-28'),
          nextReview: new Date('2025-03-28'),
          status: 'excluded'
        },
        {
          id: '7',
          system: 'QMS',
          title: 'IT Services',
          description: 'Information technology infrastructure and support',
          included: false,
          location: 'External IT Provider',
          activities: ['System maintenance', 'Data management', 'Technical support'],
          exclusions: ['Outsourced service', 'Not core business activity'],
          lastReview: new Date('2024-12-25'),
          nextReview: new Date('2025-03-25'),
          status: 'excluded'
        }
      ])

      setScopeBoundaries([
        {
          id: '1',
          type: 'physical',
          name: 'Manufacturing Facilities',
          description: 'Physical locations where manufacturing occurs',
          included: true
        },
        {
          id: '2',
          type: 'physical',
          name: 'Office Locations',
          description: 'Administrative and support offices',
          included: true
        },
        {
          id: '3',
          type: 'physical',
          name: 'Warehouse Operations',
          description: 'Storage and distribution facilities',
          included: true
        },
        {
          id: '4',
          type: 'organisational',
          name: 'Core Business Functions',
          description: 'Primary business activities and processes',
          included: true
        },
        {
          id: '5',
          type: 'organisational',
          name: 'Support Functions',
          description: 'Administrative and support activities',
          included: true
        },
        {
          id: '6',
          type: 'organisational',
          name: 'Third-party Services',
          description: 'Outsourced services and contractors',
          included: false,
          justification: 'Not directly controlled by organisation'
        },
        {
          id: '7',
          type: 'temporal',
          name: 'Business Hours Operations',
          description: 'Activities during normal business hours',
          included: true
        },
        {
          id: '8',
          type: 'temporal',
          name: 'Emergency Response',
          description: '24/7 emergency response activities',
          included: true
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getSystemColor = (system: string) => {
    switch (system) {
      case 'QMS': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'EMS': return 'bg-green-100 text-green-800 border-green-200'
      case 'OHS': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Integrated': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSystemIcon = (system: string) => {
    switch (system) {
      case 'QMS': return <Target className="h-5 w-5 text-blue-600" />
      case 'EMS': return <Globe className="h-5 w-5 text-green-600" />
      case 'OHS': return <Shield className="h-5 w-5 text-orange-600" />
      case 'Integrated': return <Settings className="h-5 w-5 text-purple-600" />
      default: return <Target className="h-5 w-5 text-gray-600" />
    }
  }

  const getBoundaryIcon = (type: string) => {
    switch (type) {
      case 'physical': return <MapPin className="h-5 w-5 text-slate-600" />
      case 'organisational': return <Building2 className="h-5 w-5 text-slate-600" />
      case 'temporal': return <Users className="h-5 w-5 text-slate-600" />
      default: return <Target className="h-5 w-5 text-slate-600" />
    }
  }

  const filteredElements = scopeElements.filter(element => {
    const matchesSearch = element.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.activities.some(activity => activity.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSystem = systemFilter === 'ALL' || element.system === systemFilter
    const matchesInclusion = inclusionFilter === 'ALL' || 
                             (inclusionFilter === 'included' && element.included) ||
                             (inclusionFilter === 'excluded' && !element.included)
    return matchesSearch && matchesSystem && matchesInclusion
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
            <h1 className="text-3xl font-bold text-slate-900">Management System Scope</h1>
            <p className="text-slate-600 mt-1">Define the boundaries and applicability of your management system</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Scope
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Element
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Elements</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{scopeElements.length}</p>
                <p className="text-sm text-slate-500 mt-1">In scope</p>
              </div>
              <Target className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Included Elements</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{scopeElements.filter(e => e.included).length}</p>
                <p className="text-sm text-slate-500 mt-1">Active scope</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Excluded Elements</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{scopeElements.filter(e => !e.included).length}</p>
                <p className="text-sm text-slate-500 mt-1">Out of scope</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Management Systems</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{new Set(scopeElements.map(e => e.system)).size}</p>
                <p className="text-sm text-slate-500 mt-1">QMS, EMS, OHS</p>
              </div>
              <Settings className="h-10 w-10 text-purple-500" />
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
                  placeholder="Search scope elements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={systemFilter} onValueChange={setSystemFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Systems</SelectItem>
                <SelectItem value="QMS">QMS</SelectItem>
                <SelectItem value="EMS">EMS</SelectItem>
                <SelectItem value="OHS">OHS</SelectItem>
                <SelectItem value="Integrated">Integrated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={inclusionFilter} onValueChange={setInclusionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Inclusion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Elements</SelectItem>
                <SelectItem value="included">Included</SelectItem>
                <SelectItem value="excluded">Excluded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scope Elements */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Scope Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElements.map(element => (
              <Card key={element.id} className={`hover:shadow-lg transition-shadow ${!element.included ? 'opacity-75' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {getSystemIcon(element.system)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{element.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getSystemColor(element.system)}`}>
                            {element.system}
                          </Badge>
                          <Badge className={`text-xs ${element.included ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {element.included ? 'Included' : 'Excluded'}
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
                    <p className="text-sm text-slate-600">{element.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      <span>{element.location}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Key Activities</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {element.activities.slice(0, 3).map((activity, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                            {activity}
                          </li>
                        ))}
                        {element.activities.length > 3 && (
                          <li className="text-xs text-slate-500">
                            +{element.activities.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>

                    {element.exclusions && element.exclusions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Exclusions</p>
                        <ul className="text-sm text-red-600 space-y-1">
                          {element.exclusions.map((exclusion, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                              {exclusion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <StatusBadge 
                          status={element.status === 'active' ? 'green' : element.status === 'under_review' ? 'amber' : 'red'} 
                          label={element.status.replace('_', ' ')} 
                        />
                      </div>
                      <span className="text-slate-500">
                        Next review: {formatDate(element.nextReview)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Scope Boundaries */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Scope Boundaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scopeBoundaries.map(boundary => (
              <Card key={boundary.id} className={`hover:shadow-lg transition-shadow ${!boundary.included ? 'opacity-75' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {getBoundaryIcon(boundary.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{boundary.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {boundary.type}
                          </Badge>
                          <Badge className={`text-xs ${boundary.included ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {boundary.included ? 'Included' : 'Excluded'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">{boundary.description}</p>
                    
                    {boundary.justification && (
                      <div className="text-sm text-red-600">
                        <span className="font-medium">Justification:</span> {boundary.justification}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Scope Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Scope Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Quality Management System (ISO 9001)</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Product design and development</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Manufacturing operations</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Customer service</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Third-party logistics</span>
                  <Badge className="bg-red-100 text-red-800">Excluded</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Environmental Management System (ISO 14001)</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Environmental aspects</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Waste management</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Energy consumption</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Emissions monitoring</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Occupational Health & Safety (ISO 45001)</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Risk assessments</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Safety training</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Incident management</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Health surveillance</span>
                  <Badge className="bg-green-100 text-green-800">Included</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
