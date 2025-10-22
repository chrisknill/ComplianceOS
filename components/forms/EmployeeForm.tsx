'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface EmployeeFormProps {
  open: boolean
  onClose: () => void
  employee?: any
  employees: any[]
  onSave: () => void
}

export function EmployeeForm({ open, onClose, employee, employees, onSave }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    password: '',
    jobTitle: employee?.jobTitle || '',
    department: employee?.department || '',
    managerId: employee?.managerId || '',
    phone: employee?.phone || '',
    startDate: employee?.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : '',
    location: employee?.location || '',
    status: employee?.status || 'ACTIVE',
    role: employee?.role || 'USER',
    groups: employee?.groups ? JSON.parse(employee.groups) : [],
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        password: '',
        jobTitle: employee.jobTitle || '',
        department: employee.department || '',
        managerId: employee.managerId || '',
        phone: employee.phone || '',
        startDate: employee.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : '',
        location: employee.location || '',
        status: employee.status || 'ACTIVE',
        role: employee.role || 'USER',
        groups: employee.groups ? JSON.parse(employee.groups) : [],
      })
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        jobTitle: '',
        department: '',
        managerId: '',
        phone: '',
        startDate: '',
        location: '',
        status: 'ACTIVE',
        role: 'USER',
        groups: [],
      })
    }
  }, [employee, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = employee?.id ? 'PUT' : 'POST'
      const url = employee?.id ? `/api/employees/${employee.id}` : '/api/employees'

      const payload = {
        ...formData,
        startDate: formData.startDate || null,
        managerId: formData.managerId || null,
      }

      // Don't send password if empty on update
      if (employee?.id && !formData.password) {
        delete payload.password
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save employee')

      const savedEmployee = await response.json()

      // Sync groups with Microsoft Graph if employee was updated/created
      if (formData.groups.length > 0) {
        try {
          await fetch('/api/microsoft-graph/sync-employee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              employeeId: savedEmployee.id || employee?.id,
              groups: formData.groups
            }),
          })
        } catch (error) {
          console.error('Failed to sync groups with Outlook:', error)
          // Don't fail the entire operation if sync fails
        }
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving employee:', error)
      alert('Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!employee?.id) return
    if (!confirm('Are you sure you want to delete this employee? This will also remove their training records.')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete employee')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Failed to delete employee')
    } finally {
      setLoading(false)
    }
  }

  // Get potential managers (exclude self and subordinates)
  const potentialManagers = employees.filter(e => e.id !== employee?.id)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee?.id ? 'Edit' : 'Add'} Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="john.doe@company.com"
              />
            </div>
          </div>

          {!employee?.id && (
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!employee?.id}
                placeholder="••••••••"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="Quality Manager"
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Quality"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="managerId">Reports To (Manager)</Label>
              <Select
                value={formData.managerId || 'NONE'}
                onValueChange={(value) => setFormData({ ...formData, managerId: value === 'NONE' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No manager (top level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">No manager (top level)</SelectItem>
                  {potentialManagers.map((mgr) => (
                    <SelectItem key={mgr.id} value={mgr.id}>
                      {mgr.name || mgr.email} - {mgr.jobTitle || 'No title'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Head Office"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 7700 900000"
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role">System Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Email Groups</Label>
            <p className="text-sm text-gray-600 mb-3">
              Select which email groups this employee should be part of. Changes will sync with Outlook.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Management',
                'Admin', 
                'Directors',
                'Accounts',
                'HSE',
                'Quality',
                'Compliance',
                'Operations',
                'HR',
                'IT'
              ].map((group) => (
                <div key={group} className="flex items-center space-x-2">
                  <Checkbox
                    id={group}
                    checked={formData.groups.includes(group)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          groups: [...formData.groups, group]
                        })
                      } else {
                        setFormData({
                          ...formData,
                          groups: formData.groups.filter(g => g !== group)
                        })
                      }
                    }}
                  />
                  <Label htmlFor={group} className="text-sm font-normal">
                    {group}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Organizational Relationships */}
          {employee?.id && (
            <div className="border-t pt-4">
              <Label className="text-base font-semibold">Organizational Structure</Label>
              <div className="mt-3 space-y-4">
                {/* Manager Information */}
                <div className="bg-slate-50 p-3 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Reports To:</h4>
                  {(() => {
                    const manager = employees.find(e => e.id === employee.managerId)
                    return manager ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {manager.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{manager.name || 'Unknown'}</p>
                          <p className="text-sm text-slate-600">{manager.jobTitle || 'No title'} - {manager.department || 'No department'}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">No manager assigned (Top level)</p>
                    )
                  })()}
                </div>

                {/* Direct Reports */}
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900">Direct Reports:</h4>
                    {(() => {
                      const directReports = employees.filter(e => e.managerId === employee.id)
                      return directReports.length > 6 && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold animate-pulse">
                          ⚠ Warning: {directReports.length} reports (recommended max: 6)
                        </span>
                      )
                    })()}
                  </div>
                  {(() => {
                    const directReports = employees.filter(e => e.managerId === employee.id)
                    return directReports.length > 0 ? (
                      <div className="space-y-2">
                        {directReports.map((report) => (
                          <div key={report.id} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-green-700">
                                {report.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">{report.name || 'Unknown'}</p>
                              <p className="text-xs text-slate-600">{report.jobTitle || 'No title'}</p>
                            </div>
                            <span className="text-xs text-slate-500">{report.department || 'No dept'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">No direct reports</p>
                    )
                  })()}
                </div>

                {/* Organizational Level */}
                <div className="bg-slate-50 p-3 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Organizational Level:</h4>
                  {(() => {
                    const getOrgLevel = (empId: string, visited = new Set()): number => {
                      if (visited.has(empId)) return 0 // Prevent infinite loops
                      visited.add(empId)
                      
                      const emp = employees.find(e => e.id === empId)
                      if (!emp || !emp.managerId) return 0
                      
                      return 1 + getOrgLevel(emp.managerId, visited)
                    }
                    
                    const level = getOrgLevel(employee.id)
                    const levelNames = ['Top Level (CEO/Directors)', 'Level 1 (Managers)', 'Level 2 (Team Leads)', 'Level 3+ (Team Members)']
                    const levelName = levelNames[Math.min(level, levelNames.length - 1)]
                    
                    return (
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${
                          level === 0 ? 'bg-blue-50 border-2 border-blue-300' :
                          level === 1 ? 'bg-purple-50 border-2 border-purple-200' :
                          'bg-slate-50 border-2 border-slate-200'
                        }`}></div>
                        <span className="text-sm text-slate-700">{levelName}</span>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div>
              {employee?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

