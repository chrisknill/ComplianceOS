'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

