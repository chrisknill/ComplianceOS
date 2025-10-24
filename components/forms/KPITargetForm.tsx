'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface KPITargetFormProps {
  open: boolean
  onClose: () => void
  onSave: () => void
}

interface KPITarget {
  kpiId: string
  kpiName: string
  category: string
  currentValue: number
  targetValue: number
  period: string
  startDate: Date
  endDate: Date
  priority: string
  responsiblePerson: string
}

export function KPITargetForm({ open, onClose, onSave }: KPITargetFormProps) {
  const [targets, setTargets] = useState<KPITarget[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock KPIs - in real app, these would come from API
  const availableKPIs = [
    { id: 'quality-score', name: 'Quality Score', category: 'Quality', currentValue: 94, unit: '%' },
    { id: 'customer-satisfaction', name: 'Customer Satisfaction', category: 'Customer', currentValue: 4.2, unit: '/5' },
    { id: 'safety-incidents', name: 'Safety Incidents', category: 'Safety', currentValue: 0, unit: 'count' },
    { id: 'waste-reduction', name: 'Waste Reduction', category: 'Environmental', currentValue: 15, unit: '%' },
    { id: 'training-completion', name: 'Training Completion', category: 'Training', currentValue: 98, unit: '%' },
    { id: 'revenue-growth', name: 'Revenue Growth', category: 'Financial', currentValue: 12, unit: '%' },
    { id: 'audit-compliance', name: 'Audit Compliance', category: 'Compliance', currentValue: 96, unit: '%' },
    { id: 'employee-turnover', name: 'Employee Turnover', category: 'HR', currentValue: 8, unit: '%' }
  ]

  const periods = [
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'monthly', label: 'Monthly' }
  ]

  const priorities = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ]

  const addTarget = () => {
    const newTarget: KPITarget = {
      kpiId: '',
      kpiName: '',
      category: '',
      currentValue: 0,
      targetValue: 0,
      period: 'quarterly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      priority: 'medium',
      responsiblePerson: ''
    }
    setTargets([...targets, newTarget])
  }

  const updateTarget = (index: number, field: keyof KPITarget, value: any) => {
    const updatedTargets = [...targets]
    updatedTargets[index] = { ...updatedTargets[index], [field]: value }
    
    // If KPI is selected, update related fields
    if (field === 'kpiId') {
      const selectedKPI = availableKPIs.find(kpi => kpi.id === value)
      if (selectedKPI) {
        updatedTargets[index].kpiName = selectedKPI.name
        updatedTargets[index].category = selectedKPI.category
        updatedTargets[index].currentValue = selectedKPI.currentValue
      }
    }
    
    setTargets(updatedTargets)
  }

  const removeTarget = (index: number) => {
    setTargets(targets.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/kpis/targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets })
      })

      if (!response.ok) {
        throw new Error('Failed to save KPI targets')
      }

      onSave()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Set KPI Targets
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">KPI Targets</h3>
              <p className="text-sm text-slate-600">Set targets for key performance indicators</p>
            </div>
            <Button type="button" onClick={addTarget} variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Add Target
            </Button>
          </div>

          {targets.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No targets set</h3>
                <p className="text-slate-600 text-center mb-4">
                  Add KPI targets to track performance against goals
                </p>
                <Button type="button" onClick={addTarget}>
                  Add First Target
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {targets.map((target, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Target #{index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTarget(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>KPI *</Label>
                        <Select
                          value={target.kpiId}
                          onValueChange={(value) => updateTarget(index, 'kpiId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select KPI" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableKPIs.map((kpi) => (
                              <SelectItem key={kpi.id} value={kpi.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{kpi.name}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {kpi.category}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select
                          value={target.priority}
                          onValueChange={(value) => updateTarget(index, 'priority', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                <Badge variant={getPriorityColor(priority.value)}>
                                  {priority.label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {target.kpiId && (
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Current Value</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                value={target.currentValue}
                                onChange={(e) => updateTarget(index, 'currentValue', parseFloat(e.target.value) || 0)}
                                type="number"
                                step="0.01"
                              />
                              <span className="text-sm text-slate-600">
                                {availableKPIs.find(kpi => kpi.id === target.kpiId)?.unit}
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label>Target Value *</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                value={target.targetValue}
                                onChange={(e) => updateTarget(index, 'targetValue', parseFloat(e.target.value) || 0)}
                                type="number"
                                step="0.01"
                                required
                              />
                              <span className="text-sm text-slate-600">
                                {availableKPIs.find(kpi => kpi.id === target.kpiId)?.unit}
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label>Improvement</Label>
                            <div className="text-lg font-semibold">
                              {target.targetValue > target.currentValue ? (
                                <span className="text-green-600">
                                  +{((target.targetValue - target.currentValue) / target.currentValue * 100).toFixed(1)}%
                                </span>
                              ) : target.targetValue < target.currentValue ? (
                                <span className="text-red-600">
                                  {((target.targetValue - target.currentValue) / target.currentValue * 100).toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-slate-600">0%</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Period</Label>
                        <Select
                          value={target.period}
                          onValueChange={(value) => updateTarget(index, 'period', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            {periods.map((period) => (
                              <SelectItem key={period.value} value={period.value}>
                                {period.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={target.startDate ? target.startDate.toISOString().split('T')[0] : ''}
                          onChange={(e) => updateTarget(index, 'startDate', new Date(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={target.endDate ? target.endDate.toISOString().split('T')[0] : ''}
                          onChange={(e) => updateTarget(index, 'endDate', new Date(e.target.value))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Responsible Person</Label>
                      <Input
                        value={target.responsiblePerson}
                        onChange={(e) => updateTarget(index, 'responsiblePerson', e.target.value)}
                        placeholder="Name of person responsible for achieving this target"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || targets.length === 0}>
              {loading ? 'Saving...' : 'Save Targets'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
