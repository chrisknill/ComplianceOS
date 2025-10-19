'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, Crown, UserCheck, HardHat, Plus, Edit, Trash2, 
  ArrowUp, ArrowDown, ArrowRight, ArrowLeft, Save, X,
  Network, Eye, EyeOff, Maximize2, Minimize2
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/rag/StatusBadge'

interface Role {
  id: string
  title: string
  level: number
  parentId?: string
  responsibilities: string[]
  requirements: string[]
  reportsTo?: string
  reportsFrom: string[]
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
  updatedAt: Date
}

const roleTemplates = [
  { value: 'director', label: 'Director', level: 1, icon: Crown },
  { value: 'manager', label: 'Manager', level: 2, icon: UserCheck },
  { value: 'supervisor', label: 'Supervisor', level: 3, icon: HardHat },
  { value: 'worker', label: 'Worker', level: 4, icon: Users },
  { value: 'specialist', label: 'Specialist', level: 3, icon: UserCheck },
  { value: 'coordinator', label: 'Coordinator', level: 3, icon: UserCheck },
  { value: 'analyst', label: 'Analyst', level: 4, icon: Users },
  { value: 'technician', label: 'Technician', level: 4, icon: Users }
]

export default function RolesPage() {
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState<Role[]>([])
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'hierarchy'>('cards')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2', '3']))
  const [newRole, setNewRole] = useState({
    title: '',
    level: 1,
    parentId: '',
    responsibilities: [''],
    requirements: ['']
  })

  useEffect(() => {
    // Simulate loading and fetch roles
    setTimeout(() => {
      setRoles([
        {
          id: '1',
          title: 'CEO',
          level: 1,
          responsibilities: ['Strategic planning', 'Board reporting', 'Stakeholder management'],
          requirements: ['MBA or equivalent', '10+ years leadership experience'],
          reportsFrom: ['2', '3'],
          status: 'active',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          title: 'Operations Manager',
          level: 2,
          parentId: '1',
          responsibilities: ['Daily operations', 'Team management', 'Process improvement'],
          requirements: ['Bachelor degree', '5+ years management experience'],
          reportsTo: '1',
          reportsFrom: ['4', '5'],
          status: 'active',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '3',
          title: 'Quality Manager',
          level: 2,
          parentId: '1',
          responsibilities: ['Quality systems', 'Compliance monitoring', 'Audit management'],
          requirements: ['Quality certification', 'ISO experience'],
          reportsTo: '1',
          reportsFrom: ['6'],
          status: 'active',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '4',
          title: 'Production Supervisor',
          level: 3,
          parentId: '2',
          responsibilities: ['Production scheduling', 'Team coordination', 'Safety compliance'],
          requirements: ['Technical qualification', 'Supervisory experience'],
          reportsTo: '2',
          reportsFrom: ['7', '8'],
          status: 'active',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '5',
          title: 'Maintenance Supervisor',
          level: 3,
          parentId: '2',
          responsibilities: ['Equipment maintenance', 'Preventive maintenance', 'Team management'],
          requirements: ['Engineering qualification', 'Maintenance experience'],
          reportsTo: '2',
          reportsFrom: ['9'],
          status: 'active',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '6',
          title: 'Quality Specialist',
          level: 3,
          parentId: '3',
          responsibilities: ['Quality inspections', 'Documentation', 'Training delivery'],
          requirements: ['Quality qualification', 'Inspection experience'],
          reportsTo: '3',
          reportsFrom: [],
          status: 'active',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '7',
          title: 'Production Worker',
          level: 4,
          parentId: '4',
          responsibilities: ['Production tasks', 'Quality checks', 'Safety compliance'],
          requirements: ['High school diploma', 'Manufacturing experience'],
          reportsTo: '4',
          reportsFrom: [],
          status: 'active',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '8',
          title: 'Machine Operator',
          level: 4,
          parentId: '4',
          responsibilities: ['Machine operation', 'Setup procedures', 'Maintenance reporting'],
          requirements: ['Technical training', 'Machine operation experience'],
          reportsTo: '4',
          reportsFrom: [],
          status: 'active',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '9',
          title: 'Maintenance Technician',
          level: 4,
          parentId: '5',
          responsibilities: ['Equipment repair', 'Preventive maintenance', 'Parts management'],
          requirements: ['Technical qualification', 'Maintenance experience'],
          reportsTo: '5',
          reportsFrom: [],
          status: 'active',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getRoleTemplate = (templateValue: string) => {
    return roleTemplates.find(t => t.value === templateValue)
  }

  const updateRoleTemplate = (roleId: string, templateValue: string) => {
    const template = getRoleTemplate(templateValue)
    if (!template) return

    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { 
            ...role, 
            title: template.label,
            level: template.level,
            updatedAt: new Date()
          }
        : role
    ))
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-purple-100 text-purple-800 border-purple-200'
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200'
      case 3: return 'bg-green-100 text-green-800 border-green-200'
      case 4: return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1: return 'Executive'
      case 2: return 'Management'
      case 3: return 'Supervisory'
      case 4: return 'Operational'
      default: return 'Other'
    }
  }

  const toggleNodeExpansion = (roleId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId)
    } else {
      newExpanded.add(roleId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderOrgChartNode = (role: Role) => {
    const template = roleTemplates.find(t => t.label === role.title)
    const IconComponent = template?.icon || Users
    const hasChildren = role.reportsFrom.length > 0
    
    return (
      <div key={role.id} className="flex flex-col items-center">
        {/* Node */}
        <div className={`relative p-4 bg-white border-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer min-w-[200px] ${
          role.level === 1 ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-white' :
          role.level === 2 ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white' :
          role.level === 3 ? 'border-green-300 bg-gradient-to-br from-green-50 to-white' :
          'border-orange-300 bg-gradient-to-br from-orange-50 to-white'
        }`}>
          {/* Role Icon */}
          <div className="flex justify-center mb-2">
            <div className={`p-2 rounded-full ${getLevelColor(role.level)}`}>
              <IconComponent className="h-6 w-6" />
            </div>
          </div>
          
          {/* Role Title */}
          <h4 className="font-bold text-slate-900 text-center text-sm mb-1">{role.title}</h4>
          
          {/* Status Badge */}
          <div className="flex justify-center mb-2">
            <StatusBadge 
              status={role.status === 'active' ? 'green' : role.status === 'pending' ? 'amber' : 'red'} 
              label={role.status} 
            />
          </div>
          
          {/* Level Label */}
          <p className="text-xs text-slate-500 text-center mb-1">{getLevelLabel(role.level)}</p>
          
          {/* Reports Count */}
          <p className="text-xs text-slate-400 text-center">
            {role.reportsFrom.length} direct reports
          </p>
          
          {/* Edit Button */}
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setEditingRole(editingRole === role.id ? null : role.id)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Children Container */}
        {hasChildren && (
          <div className="mt-4 relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-slate-300 transform -translate-x-1/2"></div>
            
            {/* Horizontal Line Container */}
            <div className="relative">
              {/* Horizontal Line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-300"></div>
              
              {/* Children */}
              <div className="flex justify-center gap-8 pt-4">
                {role.reportsFrom.map((childId, index) => {
                  const childRole = roles.find(r => r.id === childId)
                  if (!childRole) return null
                  
                  return (
                    <div key={childId} className="relative">
                      {/* Vertical Line to Child */}
                      <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-slate-300 transform -translate-x-1/2"></div>
                      {renderOrgChartNode(childRole)}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderHierarchyView = () => {
    const topLevelRoles = roles.filter(role => !role.reportsTo)
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Organizational Chart</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedNodes(new Set(roles.map(r => r.id)))}
            >
              <Eye className="h-4 w-4 mr-1" />
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedNodes(new Set())}
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Collapse All
            </Button>
          </div>
        </div>
        
        {/* Org Chart Container */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 overflow-x-auto">
          <div className="flex justify-center min-w-max">
            <div className="space-y-8">
              {topLevelRoles.map(role => renderOrgChartNode(role))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-white rounded-lg border p-4">
          <h4 className="font-semibold text-slate-900 mb-3">Chart Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-slate-600">Executive Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-600">Management Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-600">Supervisory Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-slate-600">Operational Level</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderHierarchyLevel = (level: number) => {
    const levelRoles = roles.filter(role => role.level === level)
    if (levelRoles.length === 0) return null

    return (
      <div key={level} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(level)}`}>
            {getLevelLabel(level)} Level
          </div>
          <span className="text-sm text-slate-500">({levelRoles.length} roles)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levelRoles.map(role => {
            const template = roleTemplates.find(t => t.label === role.title)
            const IconComponent = template?.icon || Users
            
            return (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge 
                            status={role.status === 'active' ? 'green' : role.status === 'pending' ? 'amber' : 'red'} 
                            label={role.status} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingRole(editingRole === role.id ? null : role.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {editingRole === role.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Role Template</label>
                        <Select 
                          value={roleTemplates.find(t => t.label === role.title)?.value || ''}
                          onValueChange={(value) => updateRoleTemplate(role.id, value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select role template" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleTemplates.map(template => (
                              <SelectItem key={template.value} value={template.value}>
                                <div className="flex items-center gap-2">
                                  <template.icon className="h-4 w-4" />
                                  {template.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setEditingRole(null)}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingRole(null)}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Responsibilities</p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {role.responsibilities.slice(0, 2).map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                              {resp}
                            </li>
                          ))}
                          {role.responsibilities.length > 2 && (
                            <li className="text-xs text-slate-500">
                              +{role.responsibilities.length - 2} more...
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {role.reportsTo && (
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowUp className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            Reports to: {roles.find(r => r.id === role.reportsTo)?.title}
                          </span>
                        </div>
                      )}
                      
                      {role.reportsFrom.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowDown className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            Manages: {role.reportsFrom.length} direct reports
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading roles...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Organizational Roles</h1>
            <p className="text-slate-600 mt-1">Manage organizational hierarchy and role responsibilities</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('hierarchy')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'hierarchy'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Org Chart
              </button>
            </div>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Export Structure
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </div>

        {/* Role Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Roles</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{roles.length}</p>
                <p className="text-sm text-slate-500 mt-1">Across {new Set(roles.map(r => r.level)).size} levels</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Roles</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{roles.filter(r => r.status === 'active').length}</p>
                <p className="text-sm text-slate-500 mt-1">Currently filled</p>
              </div>
              <UserCheck className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Management Roles</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{roles.filter(r => r.level <= 2).length}</p>
                <p className="text-sm text-slate-500 mt-1">Executive & Management</p>
              </div>
              <Crown className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Operational Roles</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{roles.filter(r => r.level >= 3).length}</p>
                <p className="text-sm text-slate-500 mt-1">Supervisory & Operational</p>
              </div>
              <HardHat className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Role Views */}
        {viewMode === 'cards' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Organizational Hierarchy</h2>
            {[1, 2, 3, 4].map(level => renderHierarchyLevel(level))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            {renderHierarchyView()}
          </div>
        )}

        {/* Role Templates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Role Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleTemplates.map(template => {
              const IconComponent = template.icon
              return (
                <div key={template.value} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="h-5 w-5 text-slate-600" />
                    <span className="font-medium">{template.label}</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${getLevelColor(template.level)}`}>
                    Level {template.level}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Shell>
  )
}