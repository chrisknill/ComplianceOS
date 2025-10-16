'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { 
  Siren, Plus, Download, Search, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutDashboard, CheckCircle, AlertCircle, Clock, Users
} from 'lucide-react'
import { EmergencyDrillForm } from '@/components/forms/EmergencyDrillForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'
import { formatDate } from '@/lib/utils'

interface EmergencyDrill {
  id: string
  type: string
  date: Date
  location: string | null
  participants: number | null
  duration: number | null
  scenarioDesc: string | null
  observations: string | null
  effectiveness: string | null
  improvements: string
  nextDrill: Date | null
}

type ViewMode = 'dashboard' | 'list' | 'grid'

export default function EmergencyPage() {
  const [drills, setDrills] = useState<EmergencyDrill[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingDrill, setEditingDrill] = useState<EmergencyDrill | undefined>()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadDrills = () => {
    setLoading(true)
    fetch('/api/ohs/emergency')
      .then((res) => res.json())
      .then((data) => {
        setDrills(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setDrills([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadDrills()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedDrills = drills
    .filter(d => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          d.type.toLowerCase().includes(search) ||
          (d.location?.toLowerCase() || '').includes(search) ||
          (d.scenarioDesc?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(d => typeFilter === 'ALL' || d.type === typeFilter)
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'type':
          aVal = a.type
          bVal = b.type
          break
        case 'date':
          aVal = new Date(a.date).getTime()
          bVal = new Date(b.date).getTime()
          break
        case 'participants':
          aVal = a.participants || 0
          bVal = b.participants || 0
          break
        case 'effectiveness':
          aVal = a.effectiveness || ''
          bVal = b.effectiveness || ''
          break
        default:
          aVal = new Date(a.date).getTime()
          bVal = new Date(b.date).getTime()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredData = filteredAndSortedDrills

  const stats = {
    total: drills.length,
    thisYear: drills.filter(d => new Date(d.date).getFullYear() === new Date().getFullYear()).length,
    totalParticipants: drills.reduce((sum, d) => sum + (d.participants || 0), 0),
    avgParticipants: drills.length > 0 
      ? Math.round(drills.reduce((sum, d) => sum + (d.participants || 0), 0) / drills.length)
      : 0,
    excellent: drills.filter(d => d.effectiveness === 'EXCELLENT').length,
    needsImprovement: drills.filter(d => d.effectiveness === 'NEEDS_IMPROVEMENT' || d.effectiveness === 'POOR').length,
    upcoming: drills.filter(d => {
      if (!d.nextDrill) return false
      return new Date(d.nextDrill) > new Date()
    }).length,
  }

  const getDrillRAG = (drill: EmergencyDrill): 'green' | 'amber' | 'red' => {
    if (drill.effectiveness === 'POOR') return 'red'
    if (drill.effectiveness === 'NEEDS_IMPROVEMENT') return 'amber'
    if (drill.effectiveness === 'SATISFACTORY') return 'amber'
    return 'green'
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredData.map(d => ({
      'Type': d.type.replace('_', ' '),
      'Date': formatDate(d.date),
      'Location': d.location || '-',
      'Participants': d.participants || '-',
      'Duration (min)': d.duration || '-',
      'Effectiveness': d.effectiveness || '-',
      'Next Drill': d.nextDrill ? formatDate(d.nextDrill) : '-',
    })))
    downloadFile(csv, `emergency-drills-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Type', 'Date', 'Location', 'Participants', 'Effectiveness']
    const rows = filteredData.map(d => [
      d.type.replace('_', ' '),
      formatDate(d.date),
      d.location || '-',
      d.participants?.toString() || '-',
      d.effectiveness || '-',
    ])
    
    exportTableToPDF('Emergency Drills', headers, rows, `emergency-drills-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  const effectivenessColors: Record<string, string> = {
    EXCELLENT: 'bg-emerald-100 text-emerald-700',
    GOOD: 'bg-blue-100 text-blue-700',
    SATISFACTORY: 'bg-amber-100 text-amber-700',
    NEEDS_IMPROVEMENT: 'bg-orange-100 text-orange-700',
    POOR: 'bg-rose-100 text-rose-700',
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading emergency drills...</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Emergency Preparedness</h1>
            <p className="text-slate-600 mt-1">Drills, exercises, and readiness assessment</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'dashboard' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grid
              </button>
            </div>
            {viewMode !== 'dashboard' && (
              <>
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" onClick={handleExportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </>
            )}
            <Button onClick={() => { setEditingDrill(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Drill
            </Button>
          </div>
        </div>

        {viewMode === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Drills</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <Siren className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">{stats.thisYear} this year</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Participants</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalParticipants}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Avg {stats.avgParticipants} per drill</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Excellent Rating</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.excellent}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">High performance drills</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Upcoming Drills</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.upcoming}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Scheduled ahead</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Drill Effectiveness</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-700">Excellent</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{stats.excellent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-700">Good</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">
                    {drills.filter(d => d.effectiveness === 'GOOD').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-700">Satisfactory</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">
                    {drills.filter(d => d.effectiveness === 'SATISFACTORY').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-700">Needs Improvement / Poor</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{stats.needsImprovement}</span>
                </div>
              </div>
            </div>

            {stats.needsImprovement > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Action Required</h3>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-2">{stats.needsImprovement}</p>
                <p className="text-sm text-amber-700 mb-4">Drills requiring improvement actions</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-700 hover:bg-amber-100"
                  onClick={() => setViewMode('list')}
                >
                  Review Drills →
                </Button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'list' && (
          <>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search drills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="FIRE">Fire</SelectItem>
                      <SelectItem value="EVACUATION">Evacuation</SelectItem>
                      <SelectItem value="SPILL">Spill</SelectItem>
                      <SelectItem value="MEDICAL">Medical</SelectItem>
                      <SelectItem value="LOCKDOWN">Lockdown</SelectItem>
                      <SelectItem value="NATURAL_DISASTER">Natural Disaster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  {(searchTerm || typeFilter !== 'ALL') && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setTypeFilter('ALL')
                      }}
                      className="text-xs text-slate-600 hover:text-slate-900 underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-3">
                Showing {filteredData.length} of {drills.length} drills
              </p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center gap-2">
                        Type
                        <SortIcon field="type" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        <SortIcon field="date" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                      Location
                    </th>
                    <th 
                      className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('participants')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Participants
                        <SortIcon field="participants" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                      Duration
                    </th>
                    <th 
                      className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('effectiveness')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Effectiveness
                        <SortIcon field="effectiveness" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                      Next Drill
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredData.map((drill) => {
                    const rag = getDrillRAG(drill)
                    return (
                      <tr 
                        key={drill.id} 
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => { setEditingDrill(drill); setShowForm(true); }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Siren className="h-5 w-5 text-slate-400" />
                            <Badge variant="outline">{drill.type.replace('_', ' ')}</Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{formatDate(drill.date)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{drill.location || '-'}</td>
                        <td className="px-6 py-4 text-center text-sm text-slate-600">{drill.participants || '-'}</td>
                        <td className="px-6 py-4 text-center text-sm text-slate-600">
                          {drill.duration ? `${drill.duration} min` : '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {drill.effectiveness ? (
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                effectivenessColors[drill.effectiveness] || 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {drill.effectiveness.replace('_', ' ')}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-slate-600">
                          {drill.nextDrill ? formatDate(drill.nextDrill) : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((drill) => {
              const rag = getDrillRAG(drill)
              const improvements = drill.improvements ? JSON.parse(drill.improvements) : []
              
              return (
                <div
                  key={drill.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setEditingDrill(drill); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Siren className={`h-8 w-8 ${
                      rag === 'green' ? 'text-emerald-500' :
                      rag === 'amber' ? 'text-amber-500' : 'text-rose-500'
                    }`} />
                    {drill.effectiveness && (
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          effectivenessColors[drill.effectiveness] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {drill.effectiveness.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  <Badge variant="outline" className="mb-3">{drill.type.replace('_', ' ')}</Badge>
                  <p className="text-sm text-slate-600 mb-4">{formatDate(drill.date)}</p>

                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <p>
                      <span className="font-medium">Location:</span> {drill.location || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Participants:</span> {drill.participants || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span> {drill.duration ? `${drill.duration} min` : 'N/A'}
                    </p>
                    {drill.nextDrill && (
                      <p>
                        <span className="font-medium">Next Drill:</span> {formatDate(drill.nextDrill)}
                      </p>
                    )}
                  </div>

                  {improvements.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-xs font-medium text-slate-500 uppercase mb-2">Improvements</p>
                      <ul className="space-y-1">
                        {improvements.slice(0, 2).map((imp: string, idx: number) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            {imp}
                          </li>
                        ))}
                        {improvements.length > 2 && (
                          <li className="text-xs text-slate-500">+{improvements.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {filteredData.length === 0 && viewMode !== 'dashboard' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Siren className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No emergency drills found</p>
          </div>
        )}

        <EmergencyDrillForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingDrill(undefined); }}
          drill={editingDrill}
          onSave={loadDrills}
        />
      </div>
    </Shell>
  )
}
