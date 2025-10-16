'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Download, Plus, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  Users, UserPlus, LayoutDashboard, Building2, Phone, Mail,
  Calendar, MapPin, Network
} from 'lucide-react'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'
import { EmployeeForm } from '@/components/forms/EmployeeForm'
import { OrgChart } from '@/components/employees/OrgChart'

interface Employee {
  id: string
  name: string | null
  email: string
  jobTitle: string | null
  department: string | null
  managerId: string | null
  phone: string | null
  startDate: Date | null
  status: string
  location: string | null
  role: string
}

type ViewMode = 'dashboard' | 'list' | 'orgchart'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>()

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE')
  const [sortField, setSortField] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const loadEmployees = () => {
    setLoading(true)
    fetch('/api/employees')
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load employees:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Get unique departments
  const departments = ['ALL', ...new Set(employees.map(e => e.department).filter(Boolean) as string[])]

  // Filter and sort
  const filteredAndSortedEmployees = employees
    .filter(e => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          (e.name?.toLowerCase() || '').includes(search) ||
          e.email.toLowerCase().includes(search) ||
          (e.jobTitle?.toLowerCase() || '').includes(search) ||
          (e.department?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(e => departmentFilter === 'ALL' || e.department === departmentFilter)
    .filter(e => statusFilter === 'ALL' || e.status === statusFilter)
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'name':
          aVal = (a.name || '').toLowerCase()
          bVal = (b.name || '').toLowerCase()
          break
        case 'department':
          aVal = (a.department || '').toLowerCase()
          bVal = (b.department || '').toLowerCase()
          break
        case 'jobTitle':
          aVal = (a.jobTitle || '').toLowerCase()
          bVal = (b.jobTitle || '').toLowerCase()
          break
        case 'startDate':
          aVal = a.startDate ? new Date(a.startDate).getTime() : 0
          bVal = b.startDate ? new Date(b.startDate).getTime() : 0
          break
        default:
          aVal = (a.name || '').toLowerCase()
          bVal = (b.name || '').toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  // Calculate statistics
  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'ACTIVE').length,
    onLeave: employees.filter(e => e.status === 'ON_LEAVE').length,
    terminated: employees.filter(e => e.status === 'TERMINATED').length,
    departments: new Set(employees.map(e => e.department).filter(Boolean)).size,
    managers: employees.filter(e => employees.some(emp => emp.managerId === e.id)).length,
  }

  const departmentCounts = departments
    .filter(d => d !== 'ALL')
    .map(dept => ({
      name: dept,
      count: employees.filter(e => e.department === dept).length,
    }))

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredAndSortedEmployees.map(e => ({
      'Name': e.name || '-',
      'Email': e.email,
      'Job Title': e.jobTitle || '-',
      'Department': e.department || '-',
      'Phone': e.phone || '-',
      'Location': e.location || '-',
      'Start Date': e.startDate ? new Date(e.startDate).toLocaleDateString() : '-',
      'Status': e.status,
      'Role': e.role,
    })))
    downloadFile(csv, `employees-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Name', 'Job Title', 'Department', 'Email', 'Phone', 'Status']
    const rows = filteredAndSortedEmployees.map(e => [
      e.name || '-',
      e.jobTitle || '-',
      e.department || '-',
      e.email,
      e.phone || '-',
      e.status,
    ])
    
    exportTableToPDF('Employee Directory', headers, rows, `employees-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading employees...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
            <p className="text-slate-600 mt-1">Team directory and organizational chart</p>
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
                onClick={() => setViewMode('orgchart')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'orgchart'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Org Chart
              </button>
            </div>
            {viewMode !== 'dashboard' && viewMode !== 'orgchart' && (
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
            <Button onClick={() => { setEditingEmployee(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
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
                    <p className="text-sm font-medium text-slate-600">Total Employees</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.active}</p>
                  </div>
                  <UserPlus className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Currently working</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Departments</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats.departments}</p>
                  </div>
                  <Building2 className="h-10 w-10 text-purple-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Active departments</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Managers</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.managers}</p>
                  </div>
                  <Network className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Team leaders</p>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentCounts.map((dept, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDepartmentFilter(dept.name)
                      setViewMode('list')
                    }}
                    className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{dept.name}</p>
                        <p className="text-xs text-slate-600 mt-1">Click to view →</p>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{dept.count}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <button
                onClick={() => setViewMode('orgchart')}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <Network className="h-8 w-8 text-blue-600 mb-3" />
                <p className="text-lg font-semibold text-blue-900">View Org Chart</p>
                <p className="text-sm text-blue-700 mt-2">Interactive organizational hierarchy</p>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <Users className="h-8 w-8 text-purple-600 mb-3" />
                <p className="text-lg font-semibold text-purple-900">View Directory</p>
                <p className="text-sm text-purple-700 mt-2">Full employee list with details</p>
              </button>
            </div>
          </div>
        )}

        {/* Org Chart View */}
        {viewMode === 'orgchart' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Organizational Chart</h2>
            <OrgChart employees={employees} onEmployeeClick={(emp) => { setEditingEmployee(emp); setShowForm(true); }} />
          </div>
        )}

        {/* Filters (List View Only) */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by name, email, title, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Department Filter */}
              <div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept === 'ALL' ? 'All Departments' : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || departmentFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {departmentFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Department: {departmentFilter}
                    <button onClick={() => setDepartmentFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {statusFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter.replace('_', ' ')}
                    <button onClick={() => setStatusFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setDepartmentFilter('ALL')
                    setStatusFilter('ALL')
                  }}
                  className="ml-auto text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredAndSortedEmployees.length} of {employees.length} employees
            </p>
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
                      Employee
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('jobTitle')}
                  >
                    <div className="flex items-center gap-2">
                      Job Title
                      <SortIcon field="jobTitle" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center gap-2">
                      Department
                      <SortIcon field="department" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Location
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('startDate')}
                  >
                    <div className="flex items-center gap-2">
                      Start Date
                      <SortIcon field="startDate" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAndSortedEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => { setEditingEmployee(employee); setShowForm(true); }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-700">
                            {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{employee.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{employee.jobTitle || '-'}</td>
                    <td className="px-6 py-4">
                      {employee.department && (
                        <Badge variant="outline">{employee.department}</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {employee.phone && (
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Phone className="h-3 w-3" />
                            {employee.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Mail className="h-3 w-3" />
                          {employee.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {employee.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {employee.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {employee.startDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(employee.startDate).toLocaleDateString()}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge 
                        variant={
                          employee.status === 'ACTIVE' ? 'default' : 
                          employee.status === 'ON_LEAVE' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {employee.status.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredAndSortedEmployees.length === 0 && viewMode === 'list' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No employees found</p>
          </div>
        )}

        <EmployeeForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingEmployee(undefined); }}
          employee={editingEmployee}
          employees={employees}
          onSave={loadEmployees}
        />
      </div>
    </Shell>
  )
}

