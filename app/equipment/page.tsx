'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { 
  Wrench, Plus, Download, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutDashboard, CheckCircle, AlertCircle, Clock, Settings
} from 'lucide-react'
import { EquipmentForm } from '@/components/forms/EquipmentForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'

interface Equipment {
  id: string
  name: string
  assetTag: string | null
  location: string | null
  maintDue: Date | null
  status: string
  calibrations: Array<{
    id: string
    dueDate: Date
    performedOn: Date | null
  }>
}

type ViewMode = 'dashboard' | 'list' | 'grid'

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | undefined>()

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE')
  const [locationFilter, setLocationFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const loadEquipment = () => {
    setLoading(true)
    fetch('/api/equipment')
      .then((res) => res.json())
      .then((data) => {
        setEquipment(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load equipment:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadEquipment()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Get unique locations
  const locations = ['ALL', ...new Set(equipment.map(e => e.location).filter(Boolean) as string[])]

  // Filter and sort
  const filteredAndSortedEquipment = equipment
    .filter(e => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          e.name.toLowerCase().includes(search) ||
          (e.assetTag?.toLowerCase() || '').includes(search) ||
          (e.location?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(e => statusFilter === 'ALL' || e.status === statusFilter)
    .filter(e => locationFilter === 'ALL' || e.location === locationFilter)
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'assetTag':
          aVal = (a.assetTag || '').toLowerCase()
          bVal = (b.assetTag || '').toLowerCase()
          break
        case 'location':
          aVal = (a.location || '').toLowerCase()
          bVal = (b.location || '').toLowerCase()
          break
        case 'maintDue':
          aVal = a.maintDue ? new Date(a.maintDue).getTime() : 9999999999999
          bVal = b.maintDue ? new Date(b.maintDue).getTime() : 9999999999999
          break
        default:
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  // Filter and sort first
  const filteredData = filteredAndSortedEquipment

  // Calculate statistics
  const stats = {
    total: equipment.length,
    active: equipment.filter(e => e.status === 'ACTIVE').length,
    outOfService: equipment.filter(e => e.status === 'OUT_OF_SERVICE').length,
    maintenanceDue: equipment.filter(e => {
      if (!e.maintDue) return false
      const due = new Date(e.maintDue)
      const now = new Date()
      return due <= now || (due.getTime() - now.getTime()) <= 30 * 24 * 60 * 60 * 1000
    }).length,
    calibrationDue: equipment.filter(e => {
      const nextCal = e.calibrations?.[0]
      if (!nextCal) return false
      const due = new Date(nextCal.dueDate)
      const now = new Date()
      return due <= now || (due.getTime() - now.getTime()) <= 30 * 24 * 60 * 60 * 1000
    }).length,
    locations: new Set(equipment.map(e => e.location).filter(Boolean)).size,
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredData.map(e => ({
      'Name': e.name,
      'Asset Tag': e.assetTag || '-',
      'Location': e.location || '-',
      'Status': e.status,
      'Maint. Due': e.maintDue ? formatDate(e.maintDue) : '-',
    })))
    downloadFile(csv, `equipment-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Name', 'Asset Tag', 'Location', 'Status', 'Maint. Due']
    const rows = filteredData.map(e => [
      e.name,
      e.assetTag || '-',
      e.location || '-',
      e.status,
      e.maintDue ? formatDate(e.maintDue) : '-',
    ])
    
    exportTableToPDF('Equipment Register', headers, rows, `equipment-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading equipment...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Equipment</h1>
            <p className="text-slate-600 mt-1">Equipment register and maintenance tracking</p>
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
            <Button onClick={() => { setEditingEquipment(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
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
                    <p className="text-sm font-medium text-slate-600">Total Equipment</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <Wrench className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.active}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">In service</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Maint. Due</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.maintenanceDue}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Next 30 days</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Out of Service</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.outOfService}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Requires attention</p>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Maintenance Due</h3>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-2">{stats.maintenanceDue}</p>
                <p className="text-sm text-amber-700 mb-4">Equipment requiring maintenance</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-700 hover:bg-amber-100"
                  onClick={() => setViewMode('list')}
                >
                  View All →
                </Button>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                  <h3 className="text-lg font-semibold text-rose-900">Out of Service</h3>
                </div>
                <p className="text-3xl font-bold text-rose-600 mb-2">{stats.outOfService}</p>
                <p className="text-sm text-rose-700 mb-4">Equipment not operational</p>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('OUT_OF_SERVICE')
                    setViewMode('list')
                  }}
                >
                  View Issues →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters (List View Only) */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by name, asset tag, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc === 'ALL' ? 'All Locations' : loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(searchTerm || statusFilter !== 'ALL' || locationFilter !== 'ALL') && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {statusFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter.replace('_', ' ')}
                    <button onClick={() => setStatusFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {locationFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Location: {locationFilter}
                    <button onClick={() => setLocationFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setLocationFilter('ALL')
                  }}
                  className="ml-auto text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredData.length} of {equipment.length} items
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => { setEditingEquipment(item); setShowForm(true); }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Wrench className="h-8 w-8 text-slate-400" />
                  <Badge variant={item.status === 'ACTIVE' ? 'default' : 'destructive'}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>

                <h3 className="font-semibold text-slate-900 mb-2">{item.name}</h3>

                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium">Asset Tag:</span> {item.assetTag || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {item.location || 'Unassigned'}
                  </p>
                  <p>
                    <span className="font-medium">Maint. Due:</span> {formatDate(item.maintDue)}
                  </p>
                </div>
              </div>
            ))}
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
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('assetTag')}
                  >
                    <div className="flex items-center gap-2">
                      Asset Tag
                      <SortIcon field="assetTag" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center gap-2">
                      Location
                      <SortIcon field="location" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('maintDue')}
                  >
                    <div className="flex items-center gap-2">
                      Maint. Due
                      <SortIcon field="maintDue" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Next Cal.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((item) => {
                  const nextCal = item.calibrations?.[0]
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setEditingEquipment(item); setShowForm(true); }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Wrench className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-900">{item.assetTag || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.location || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={item.status === 'ACTIVE' ? 'default' : 'destructive'}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(item.maintDue)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {nextCal ? formatDate(nextCal.dueDate) : 'N/A'}
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
            <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No equipment found</p>
          </div>
        )}

        <EquipmentForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingEquipment(undefined); }}
          equipment={editingEquipment}
          onSave={loadEquipment}
        />
      </div>
    </Shell>
  )
}
