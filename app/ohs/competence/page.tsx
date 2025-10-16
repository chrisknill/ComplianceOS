'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { 
  GraduationCap, Plus, Download, Search, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutDashboard, CheckCircle, AlertCircle, Shield, Award
} from 'lucide-react'
import { CompetenceForm } from '@/components/forms/CompetenceForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'
import { formatDate } from '@/lib/utils'

interface Competence {
  id: string
  userId: string
  role: string
  requiredPPE: string
  training: string
  medicalFit: boolean
  medicalDate: Date | null
  medicalExpiry: Date | null
  authorized: string
  restrictions: string | null
}

type ViewMode = 'dashboard' | 'list' | 'grid'

export default function CompetencePage() {
  const [competences, setCompetences] = useState<Competence[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingCompetence, setEditingCompetence] = useState<Competence | undefined>()

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [medicalFilter, setMedicalFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('userId')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const loadCompetences = () => {
    setLoading(true)
    fetch('/api/ohs/competence')
      .then((res) => res.json())
      .then((data) => {
        setCompetences(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setCompetences([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadCompetences()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort
  const filteredAndSortedCompetences = competences
    .filter(c => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          c.userId.toLowerCase().includes(search) ||
          c.role.toLowerCase().includes(search)
        )
      }
      return true
    })
    .filter(c => {
      if (medicalFilter === 'FIT') return c.medicalFit
      if (medicalFilter === 'NOT_FIT') return !c.medicalFit
      if (medicalFilter === 'EXPIRING') {
        if (!c.medicalExpiry) return false
        const expiry = new Date(c.medicalExpiry)
        const now = new Date()
        const diff = expiry.getTime() - now.getTime()
        return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
      }
      return true
    })
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'userId':
          aVal = a.userId.toLowerCase()
          bVal = b.userId.toLowerCase()
          break
        case 'role':
          aVal = a.role.toLowerCase()
          bVal = b.role.toLowerCase()
          break
        case 'medicalExpiry':
          aVal = a.medicalExpiry ? new Date(a.medicalExpiry).getTime() : 0
          bVal = b.medicalExpiry ? new Date(b.medicalExpiry).getTime() : 0
          break
        default:
          aVal = a.userId.toLowerCase()
          bVal = b.userId.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredData = filteredAndSortedCompetences

  // Calculate statistics
  const stats = {
    total: competences.length,
    medicallyFit: competences.filter(c => c.medicalFit).length,
    notFit: competences.filter(c => !c.medicalFit).length,
    expiringMedical: competences.filter(c => {
      if (!c.medicalExpiry) return false
      const expiry = new Date(c.medicalExpiry)
      const now = new Date()
      const diff = expiry.getTime() - now.getTime()
      return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
    }).length,
    withRestrictions: competences.filter(c => c.restrictions).length,
    totalAuthorizations: competences.reduce((sum, c) => {
      try {
        return sum + JSON.parse(c.authorized).length
      } catch {
        return sum
      }
    }, 0),
  }

  const getCompetenceRAG = (competence: Competence): 'green' | 'amber' | 'red' => {
    if (!competence.medicalFit) return 'red'
    
    if (competence.medicalExpiry) {
      const expiry = new Date(competence.medicalExpiry)
      const now = new Date()
      const diff = expiry.getTime() - now.getTime()
      
      if (diff < 0) return 'red' // Expired
      if (diff <= 30 * 24 * 60 * 60 * 1000) return 'amber' // Expires within 30 days
    }
    
    if (competence.restrictions) return 'amber'
    
    return 'green'
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredData.map(c => ({
      'Worker ID': c.userId,
      'Role': c.role,
      'Medical Fit': c.medicalFit ? 'Yes' : 'No',
      'Medical Expiry': c.medicalExpiry ? formatDate(c.medicalExpiry) : '-',
      'Restrictions': c.restrictions || 'None',
      'Required PPE': c.requiredPPE,
      'Authorizations': c.authorized,
    })))
    downloadFile(csv, `competence-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Worker ID', 'Role', 'Medical Fit', 'Medical Expiry', 'Restrictions']
    const rows = filteredData.map(c => [
      c.userId,
      c.role,
      c.medicalFit ? 'Yes' : 'No',
      c.medicalExpiry ? formatDate(c.medicalExpiry) : '-',
      c.restrictions || 'None',
    ])
    
    exportTableToPDF('OH&S Competence', headers, rows, `competence-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  const parsePPE = (ppeString: string): string[] => {
    try {
      return JSON.parse(ppeString)
    } catch {
      return []
    }
  }

  const parseAuthorizations = (authString: string): string[] => {
    try {
      return JSON.parse(authString)
    } catch {
      return []
    }
  }

  const ppeColors: Record<string, string> = {
    HEAD: 'bg-blue-100 text-blue-700',
    EYE: 'bg-purple-100 text-purple-700',
    HEARING: 'bg-amber-100 text-amber-700',
    HAND: 'bg-green-100 text-green-700',
    FOOT: 'bg-slate-100 text-slate-700',
    HI_VIS: 'bg-yellow-100 text-yellow-700',
    FALL_ARREST: 'bg-rose-100 text-rose-700',
    RESPIRATORY: 'bg-indigo-100 text-indigo-700',
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading competence records...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">OH&S Competence & PPE</h1>
            <p className="text-slate-600 mt-1">Worker competence, training, and PPE requirements</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'dashboard'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
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
            <Button onClick={() => { setEditingCompetence(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Competence
            </Button>
          </div>
        </div>

        {/* Dashboard View */}
        {viewMode === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Workers</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <GraduationCap className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Medically Fit</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.medicallyFit}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {stats.total > 0 ? Math.round((stats.medicallyFit / stats.total) * 100) : 0}% of workforce
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Authorizations</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalAuthorizations}</p>
                  </div>
                  <Award className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Across all workers</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">With Restrictions</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.withRestrictions}</p>
                  </div>
                  <Shield className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Require special consideration</p>
              </div>
            </div>

            {/* Medical Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Medical Fitness Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-700">Medically Fit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{stats.medicallyFit}</span>
                    <span className="text-sm text-slate-500">
                      ({stats.total > 0 ? Math.round((stats.medicallyFit / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="text-slate-700">Not Fit / Review Required</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{stats.notFit}</span>
                    <span className="text-sm text-slate-500">
                      ({stats.total > 0 ? Math.round((stats.notFit / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-700">Medical Expiring Soon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{stats.expiringMedical}</span>
                    <span className="text-sm text-slate-500">Next 30 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Medical Expiring Soon</h3>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-2">{stats.expiringMedical}</p>
                <p className="text-sm text-amber-700 mb-4">Workers with medical expiring in 30 days</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-700 hover:bg-amber-100"
                  onClick={() => {
                    setMedicalFilter('EXPIRING')
                    setViewMode('list')
                  }}
                >
                  Schedule Medicals →
                </Button>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                  <h3 className="text-lg font-semibold text-rose-900">Not Medically Fit</h3>
                </div>
                <p className="text-3xl font-bold text-rose-600 mb-2">{stats.notFit}</p>
                <p className="text-sm text-rose-700 mb-4">Workers requiring medical review</p>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setMedicalFilter('NOT_FIT')
                    setViewMode('list')
                  }}
                >
                  Review Cases →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters (List View Only) */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by worker ID or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <Select value={medicalFilter} onValueChange={setMedicalFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Medical Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Medical Status</SelectItem>
                    <SelectItem value="FIT">Medically Fit</SelectItem>
                    <SelectItem value="NOT_FIT">Not Fit</SelectItem>
                    <SelectItem value="EXPIRING">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {(searchTerm || medicalFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setMedicalFilter('ALL')
                    }}
                    className="text-xs text-slate-600 hover:text-slate-900 underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredData.length} of {competences.length} workers
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((competence) => {
              const rag = getCompetenceRAG(competence)
              const ppe = parsePPE(competence.requiredPPE)
              const authorizations = parseAuthorizations(competence.authorized)
              
              return (
                <div
                  key={competence.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setEditingCompetence(competence); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <GraduationCap className={`h-8 w-8 ${
                      rag === 'green' ? 'text-emerald-500' :
                      rag === 'amber' ? 'text-amber-500' : 'text-rose-500'
                    }`} />
                    <StatusBadge status={rag} label={competence.medicalFit ? 'Fit' : 'Not Fit'} />
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{competence.userId}</h3>
                  <p className="text-sm text-slate-600 mb-4">{competence.role}</p>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-2">Required PPE</p>
                      <div className="flex flex-wrap gap-1">
                        {ppe.map((item, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-medium ${ppeColors[item] || 'bg-slate-100 text-slate-700'}`}
                          >
                            {item.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-2">Authorizations</p>
                      <div className="space-y-1">
                        {authorizations.slice(0, 3).map((auth, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                            <Award className="h-3 w-3 text-blue-500" />
                            {auth}
                          </div>
                        ))}
                        {authorizations.length > 3 && (
                          <p className="text-xs text-slate-500">+{authorizations.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {competence.medicalExpiry && (
                    <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                      Medical expires: {formatDate(competence.medicalExpiry)}
                    </div>
                  )}

                  {competence.restrictions && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Has Restrictions
                      </Badge>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('userId')}
                  >
                    <div className="flex items-center gap-2">
                      Worker
                      <SortIcon field="userId" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      <SortIcon field="role" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Required PPE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Authorizations
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Medical Fit
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('medicalExpiry')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Medical Expiry
                      <SortIcon field="medicalExpiry" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((competence) => {
                  const rag = getCompetenceRAG(competence)
                  const ppe = parsePPE(competence.requiredPPE)
                  const authorizations = parseAuthorizations(competence.authorized)
                  
                  return (
                    <tr 
                      key={competence.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setEditingCompetence(competence); setShowForm(true); }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{competence.userId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{competence.role}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {ppe.slice(0, 3).map((item, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${ppeColors[item] || 'bg-slate-100 text-slate-700'}`}
                            >
                              {item.replace('_', ' ')}
                            </span>
                          ))}
                          {ppe.length > 3 && (
                            <span className="text-xs text-slate-500">+{ppe.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {authorizations.length} authorization{authorizations.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {competence.medicalFit ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-rose-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">
                        {competence.medicalExpiry ? formatDate(competence.medicalExpiry) : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={rag} label={competence.medicalFit ? 'Fit' : 'Not Fit'} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredData.length === 0 && viewMode !== 'dashboard' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No competence records found</p>
          </div>
        )}

        <CompetenceForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingCompetence(undefined); }}
          competence={editingCompetence}
          onSave={loadCompetences}
        />
      </div>
    </Shell>
  )
}
