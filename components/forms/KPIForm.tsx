'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, TrendingUp, DollarSign, Users, Shield, Leaf, 
  AlertTriangle, CheckCircle, Clock, BarChart3, Activity
} from 'lucide-react'

interface KPIFormProps {
  open: boolean
  onClose: () => void
  kpi?: any
  onSave: () => void
}

interface KPICategory {
  id: string
  name: string
  description: string
  icon: any
  color: string
}

const kpiCategories: KPICategory[] = [
  {
    id: 'financial',
    name: 'Financial',
    description: 'Revenue, costs, profitability metrics',
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    id: 'quality',
    name: 'Quality Management',
    description: 'ISO 9001 quality metrics',
    icon: CheckCircle,
    color: 'text-blue-600'
  },
  {
    id: 'environmental',
    name: 'Environmental',
    description: 'ISO 14001 environmental metrics',
    icon: Leaf,
    color: 'text-green-600'
  },
  {
    id: 'safety',
    name: 'Health & Safety',
    description: 'ISO 45001 safety metrics',
    icon: Shield,
    color: 'text-red-600'
  },
  {
    id: 'customer',
    name: 'Customer Satisfaction',
    description: 'Customer experience metrics',
    icon: Users,
    color: 'text-purple-600'
  },
  {
    id: 'operational',
    name: 'Operational',
    description: 'Process efficiency metrics',
    icon: Activity,
    color: 'text-orange-600'
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'Regulatory compliance metrics',
    icon: AlertTriangle,
    color: 'text-amber-600'
  },
  {
    id: 'training',
    name: 'Training & Development',
    description: 'Employee competency metrics',
    icon: TrendingUp,
    color: 'text-indigo-600'
  }
]

const measurementUnits = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'count', label: 'Count/Number' },
  { value: 'currency', label: 'Currency ($)' },
  { value: 'days', label: 'Days' },
  { value: 'hours', label: 'Hours' },
  { value: 'rating', label: 'Rating (1-5)' },
  { value: 'ratio', label: 'Ratio' },
  { value: 'score', label: 'Score' },
  { value: 'other', label: 'Other' }
]

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
]

const priorityOptions = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

export function KPIForm({ open, onClose, kpi, onSave }: KPIFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    measurementUnit: '',
    frequency: 'monthly',
    priority: 'medium',
    targetValue: '',
    currentValue: '',
    baselineValue: '',
    responsiblePerson: '',
    department: '',
    calculationMethod: '',
    dataSource: '',
    reportingPeriod: '',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (kpi) {
      setFormData({
        name: kpi.name || '',
        description: kpi.description || '',
        category: kpi.category || '',
        measurementUnit: kpi.measurementUnit || '',
        frequency: kpi.frequency || 'monthly',
        priority: kpi.priority || 'medium',
        targetValue: kpi.targetValue || '',
        currentValue: kpi.currentValue || '',
        baselineValue: kpi.baselineValue || '',
        responsiblePerson: kpi.responsiblePerson || '',
        department: kpi.department || '',
        calculationMethod: kpi.calculationMethod || '',
        dataSource: kpi.dataSource || '',
        reportingPeriod: kpi.reportingPeriod || '',
        notes: kpi.notes || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        measurementUnit: '',
        frequency: 'monthly',
        priority: 'medium',
        targetValue: '',
        currentValue: '',
        baselineValue: '',
        responsiblePerson: '',
        department: '',
        calculationMethod: '',
        dataSource: '',
        reportingPeriod: '',
        notes: ''
      })
    }
  }, [kpi])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const method = kpi?.id ? 'PUT' : 'POST'
      const url = kpi?.id ? `/api/kpis/${kpi.id}` : '/api/kpis'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to save KPI')
      }

      onSave()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = kpiCategories.find(cat => cat.id === formData.category)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{kpi?.id ? 'Edit KPI' : 'Create New KPI'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">KPI Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Customer Satisfaction Score"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {kpiCategories.map((category) => {
                        const IconComponent = category.icon
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <IconComponent className={`h-4 w-4 ${category.color}`} />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe what this KPI measures and why it's important"
                />
              </div>

              {selectedCategory && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <selectedCategory.icon className={`h-4 w-4 ${selectedCategory.color}`} />
                    <span className="font-medium">{selectedCategory.name}</span>
                  </div>
                  <p className="text-sm text-slate-600">{selectedCategory.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Measurement Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Measurement Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="measurementUnit">Measurement Unit *</Label>
                  <Select
                    value={formData.measurementUnit}
                    onValueChange={(value) => setFormData({ ...formData, measurementUnit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {measurementUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frequency">Reporting Frequency *</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <Badge variant={priority.value === 'critical' ? 'destructive' : priority.value === 'high' ? 'default' : 'secondary'}>
                              {priority.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="baselineValue">Baseline Value</Label>
                  <Input
                    id="baselineValue"
                    value={formData.baselineValue}
                    onChange={(e) => setFormData({ ...formData, baselineValue: e.target.value })}
                    placeholder="Starting value"
                  />
                </div>
                <div>
                  <Label htmlFor="currentValue">Current Value</Label>
                  <Input
                    id="currentValue"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    placeholder="Latest value"
                  />
                </div>
                <div>
                  <Label htmlFor="targetValue">Target Value *</Label>
                  <Input
                    id="targetValue"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    required
                    placeholder="Goal to achieve"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Management Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Management Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsiblePerson">Responsible Person</Label>
                  <Input
                    id="responsiblePerson"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    placeholder="Name of person responsible"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Department/Team"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataSource">Data Source</Label>
                  <Input
                    id="dataSource"
                    value={formData.dataSource}
                    onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                    placeholder="Where data comes from"
                  />
                </div>
                <div>
                  <Label htmlFor="reportingPeriod">Reporting Period</Label>
                  <Input
                    id="reportingPeriod"
                    value={formData.reportingPeriod}
                    onChange={(e) => setFormData({ ...formData, reportingPeriod: e.target.value })}
                    placeholder="e.g., Q1 2025"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="calculationMethod">Calculation Method</Label>
                <Textarea
                  id="calculationMethod"
                  value={formData.calculationMethod}
                  onChange={(e) => setFormData({ ...formData, calculationMethod: e.target.value })}
                  rows={2}
                  placeholder="How is this KPI calculated?"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Any additional information or context"
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (kpi?.id ? 'Update KPI' : 'Create KPI')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
