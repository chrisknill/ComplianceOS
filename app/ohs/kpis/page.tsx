'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { TrendingUp, TrendingDown, Plus, Edit, Calculator } from 'lucide-react'
import { calculateTRIR, calculateLTIFR, calculateDART, getNearMissRatio } from '@/lib/ohs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface MetricsData {
  period: string
  totalHours: number
  workers: number
  workDays: number
  incidents: number
  nearMisses: number
  firstAid: number
  medicalTreatment: number
  restrictedWork: number
  lostTime: number
  fatalities: number
  lostTimeDays: number
}

export default function OHSKPIsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showDataEntry, setShowDataEntry] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Calculator state
  const [workers, setWorkers] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState('8')
  const [daysPerWeek, setDaysPerWeek] = useState('5')
  const [weeks, setWeeks] = useState('4')
  const [calculatedHours, setCalculatedHours] = useState(0)

  // Data entry state
  const [formData, setFormData] = useState({
    period: new Date().toISOString().slice(0, 7), // YYYY-MM
    totalHours: '',
    workers: '',
    workDays: '',
    incidents: '',
    nearMisses: '',
    firstAid: '',
    medicalTreatment: '',
    restrictedWork: '',
    lostTime: '',
    fatalities: '',
    lostTimeDays: '',
  })

  const loadMetrics = () => {
    setLoading(true)
    fetch('/api/ohs/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMetrics(data[0])
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadMetrics()
  }, [])

  // Auto-calculate hours
  useEffect(() => {
    const w = parseInt(workers) || 0
    const hpd = parseFloat(hoursPerDay) || 8
    const dpw = parseFloat(daysPerWeek) || 5
    const wks = parseFloat(weeks) || 4
    
    const total = w * hpd * dpw * wks
    setCalculatedHours(total)
  }, [workers, hoursPerDay, daysPerWeek, weeks])

  const handleSaveMetrics = async () => {
    try {
      const response = await fetch('/api/ohs/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalHours: parseFloat(formData.totalHours) || 0,
          workers: parseInt(formData.workers) || 0,
          workDays: parseInt(formData.workDays) || 0,
          incidents: parseInt(formData.incidents) || 0,
          nearMisses: parseInt(formData.nearMisses) || 0,
          firstAid: parseInt(formData.firstAid) || 0,
          medicalTreatment: parseInt(formData.medicalTreatment) || 0,
          restrictedWork: parseInt(formData.restrictedWork) || 0,
          lostTime: parseInt(formData.lostTime) || 0,
          fatalities: parseInt(formData.fatalities) || 0,
          lostTimeDays: parseInt(formData.lostTimeDays) || 0,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      loadMetrics()
      setShowDataEntry(false)
    } catch (error) {
      console.error('Failed to save metrics:', error)
      alert('Failed to save metrics. Please try again.')
    }
  }

  const currentPeriod = metrics || {
    period: new Date().toISOString().slice(0, 7),
    totalHours: 16000,
    workers: 100,
    workDays: 20,
    incidents: 2,
    nearMisses: 12,
    firstAid: 1,
    medicalTreatment: 1,
    restrictedWork: 0,
    lostTime: 0,
    fatalities: 0,
    lostTimeDays: 0,
  }

  const recordableIncidents = currentPeriod.medicalTreatment + currentPeriod.restrictedWork + currentPeriod.lostTime + currentPeriod.fatalities

  const trir = calculateTRIR(recordableIncidents, currentPeriod.totalHours)
  const ltifr = calculateLTIFR(currentPeriod.lostTime, currentPeriod.totalHours)
  const dart = calculateDART(currentPeriod.restrictedWork + currentPeriod.lostTimeDays, currentPeriod.totalHours)
  const nearMissRatio = getNearMissRatio(currentPeriod.nearMisses, currentPeriod.incidents)

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">OH&S Key Performance Indicators</h1>
            <p className="text-slate-600 mt-1">Safety metrics, trends, and performance tracking</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCalculator(true)}>
              <Calculator className="h-4 w-4 mr-2" />
              Hours Calculator
            </Button>
            <Button onClick={() => {
              setFormData({
                period: currentPeriod.period || new Date().toISOString().slice(0, 7),
                totalHours: currentPeriod.totalHours?.toString() || '',
                workers: currentPeriod.workers?.toString() || '',
                workDays: currentPeriod.workDays?.toString() || '',
                incidents: currentPeriod.incidents?.toString() || '',
                nearMisses: currentPeriod.nearMisses?.toString() || '',
                firstAid: currentPeriod.firstAid?.toString() || '',
                medicalTreatment: currentPeriod.medicalTreatment?.toString() || '',
                restrictedWork: currentPeriod.restrictedWork?.toString() || '',
                lostTime: currentPeriod.lostTime?.toString() || '',
                fatalities: currentPeriod.fatalities?.toString() || '',
                lostTimeDays: currentPeriod.lostTimeDays?.toString() || '',
              })
              setShowDataEntry(true)
            }}>
              {metrics ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {metrics ? 'Edit Data' : 'Enter Data'}
            </Button>
          </div>
        </div>

        {/* Period Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Reporting Period</p>
              <p className="text-lg font-semibold text-blue-900 mt-1">
                {new Date(currentPeriod.period + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700">Total Hours Worked</p>
              <p className="text-2xl font-bold text-blue-900">{currentPeriod.totalHours.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">
                {currentPeriod.workers} workers × {currentPeriod.workDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-900">TRIR</p>
              {trir < 3.0 ? (
                <TrendingDown className="h-5 w-5 text-emerald-600" />
              ) : (
                <TrendingUp className="h-5 w-5 text-rose-600" />
              )}
            </div>
            <p className="text-4xl font-bold text-blue-900">{trir}</p>
            <p className="text-xs text-blue-700 mt-1">Total Recordable Incident Rate</p>
            <p className="text-xs text-blue-600 mt-2">Target: {'<'}3.0</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-emerald-900">LTIFR</p>
              {ltifr < 1.0 ? (
                <TrendingDown className="h-5 w-5 text-emerald-600" />
              ) : (
                <TrendingUp className="h-5 w-5 text-rose-600" />
              )}
            </div>
            <p className="text-4xl font-bold text-emerald-900">{ltifr}</p>
            <p className="text-xs text-emerald-700 mt-1">Lost Time Injury Frequency Rate</p>
            <p className="text-xs text-emerald-600 mt-2">Target: {'<'}1.0</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-900">DART</p>
              {dart < 2.0 ? (
                <TrendingDown className="h-5 w-5 text-emerald-600" />
              ) : (
                <TrendingUp className="h-5 w-5 text-rose-600" />
              )}
            </div>
            <p className="text-4xl font-bold text-purple-900">{dart}</p>
            <p className="text-xs text-purple-700 mt-1">Days Away, Restricted or Transferred</p>
            <p className="text-xs text-purple-600 mt-2">Target: {'<'}2.0</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-amber-900">Near-Miss Ratio</p>
              {nearMissRatio > 10 ? (
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-rose-600" />
              )}
            </div>
            <p className="text-4xl font-bold text-amber-900">{nearMissRatio}:1</p>
            <p className="text-xs text-amber-700 mt-1">Near-misses per Incident</p>
            <p className="text-xs text-amber-600 mt-2">Target: {'>'}10:1</p>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Period Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Hours Worked</span>
                <span className="font-semibold text-slate-900">{currentPeriod.totalHours.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Incidents</span>
                <span className="font-semibold text-slate-900">{currentPeriod.incidents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Near-Misses</span>
                <span className="font-semibold text-emerald-600">{currentPeriod.nearMisses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">First Aid Cases</span>
                <span className="font-semibold text-blue-600">{currentPeriod.firstAid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Medical Treatment</span>
                <span className="font-semibold text-amber-600">{currentPeriod.medicalTreatment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Restricted Work Cases</span>
                <span className="font-semibold text-orange-600">{currentPeriod.restrictedWork}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Lost Time Injuries</span>
                <span className="font-semibold text-rose-600">{currentPeriod.lostTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Lost Time Days</span>
                <span className="font-semibold text-rose-600">{currentPeriod.lostTimeDays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Fatalities</span>
                <span className="font-semibold text-rose-900">{currentPeriod.fatalities}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">KPI Definitions</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-slate-900">TRIR (Total Recordable Incident Rate)</p>
                <p className="text-sm text-slate-600 mt-1">
                  Formula: (Recordable Incidents × 200,000) / Total Hours
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Industry benchmark: {'<'}3.0 excellent
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900">LTIFR (Lost Time Injury Frequency Rate)</p>
                <p className="text-sm text-slate-600 mt-1">
                  Formula: (Lost Time Injuries × 1,000,000) / Total Hours
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Industry benchmark: {'<'}1.0 excellent
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900">DART (Days Away, Restricted or Transferred)</p>
                <p className="text-sm text-slate-600 mt-1">
                  Formula: (DART Cases × 200,000) / Total Hours
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Industry benchmark: {'<'}2.0 excellent
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ISO 45001 Alignment */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-slate-900 mb-3">ISO 45001:2018 Alignment</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-700">Clause 9.1.1</span>
              <span className="text-slate-600"> - Monitoring, Measurement, Analysis and Performance Evaluation</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Clause 9.3</span>
              <span className="text-slate-600"> - Management Review (KPIs as input)</span>
            </div>
          </div>
        </div>

        {/* Hours Calculator Dialog */}
        <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Work Hours Calculator</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">Calculate total hours worked for a period</p>
                <p className="text-xs text-blue-700">
                  Enter the number of workers, hours per day, days per week, and number of weeks to automatically calculate total hours.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workers">Number of Workers</Label>
                  <Input
                    id="workers"
                    type="number"
                    value={workers}
                    onChange={(e) => setWorkers(e.target.value)}
                    placeholder="e.g., 100"
                  />
                </div>

                <div>
                  <Label htmlFor="hoursPerDay">Hours per Day</Label>
                  <Input
                    id="hoursPerDay"
                    type="number"
                    step="0.5"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    placeholder="e.g., 8"
                  />
                </div>

                <div>
                  <Label htmlFor="daysPerWeek">Days per Week</Label>
                  <Input
                    id="daysPerWeek"
                    type="number"
                    step="0.5"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(e.target.value)}
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <Label htmlFor="weeks">Number of Weeks</Label>
                  <Input
                    id="weeks"
                    type="number"
                    step="0.1"
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    placeholder="e.g., 4"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm font-medium text-emerald-900 mb-2">Calculated Total Hours:</p>
                <p className="text-4xl font-bold text-emerald-900">{calculatedHours.toLocaleString()}</p>
                <p className="text-xs text-emerald-700 mt-2">
                  {workers || 0} workers × {hoursPerDay || 0} hrs/day × {daysPerWeek || 0} days/week × {weeks || 0} weeks
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setFormData({ ...formData, totalHours: calculatedHours.toString(), workers: workers })
                    setShowCalculator(false)
                    setShowDataEntry(true)
                  }}
                  disabled={calculatedHours === 0}
                >
                  Use This Value
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCalculator(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Data Entry Dialog */}
        <Dialog open={showDataEntry} onOpenChange={setShowDataEntry}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enter OH&S Metrics Data</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="period">Period (Month)</Label>
                <Input
                  id="period"
                  type="month"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                />
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-slate-900 mb-3">Work Hours</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="totalHours">Total Hours *</Label>
                    <Input
                      id="totalHours"
                      type="number"
                      value={formData.totalHours}
                      onChange={(e) => setFormData({ ...formData, totalHours: e.target.value })}
                      required
                      placeholder="e.g., 16000"
                    />
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="mt-1 h-auto p-0 text-xs"
                      onClick={() => setShowCalculator(true)}
                    >
                      Open Calculator →
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="workers">Workers</Label>
                    <Input
                      id="workers"
                      type="number"
                      value={formData.workers}
                      onChange={(e) => setFormData({ ...formData, workers: e.target.value })}
                      placeholder="e.g., 100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="workDays">Work Days</Label>
                    <Input
                      id="workDays"
                      type="number"
                      value={formData.workDays}
                      onChange={(e) => setFormData({ ...formData, workDays: e.target.value })}
                      placeholder="e.g., 20"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-slate-900 mb-3">Incident Data</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="incidents">Total Incidents</Label>
                    <Input
                      id="incidents"
                      type="number"
                      value={formData.incidents}
                      onChange={(e) => setFormData({ ...formData, incidents: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nearMisses">Near Misses</Label>
                    <Input
                      id="nearMisses"
                      type="number"
                      value={formData.nearMisses}
                      onChange={(e) => setFormData({ ...formData, nearMisses: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="firstAid">First Aid</Label>
                    <Input
                      id="firstAid"
                      type="number"
                      value={formData.firstAid}
                      onChange={(e) => setFormData({ ...formData, firstAid: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medicalTreatment">Medical Treatment</Label>
                    <Input
                      id="medicalTreatment"
                      type="number"
                      value={formData.medicalTreatment}
                      onChange={(e) => setFormData({ ...formData, medicalTreatment: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="restrictedWork">Restricted Work</Label>
                    <Input
                      id="restrictedWork"
                      type="number"
                      value={formData.restrictedWork}
                      onChange={(e) => setFormData({ ...formData, restrictedWork: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lostTime">Lost Time Injuries</Label>
                    <Input
                      id="lostTime"
                      type="number"
                      value={formData.lostTime}
                      onChange={(e) => setFormData({ ...formData, lostTime: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lostTimeDays">Lost Time Days</Label>
                    <Input
                      id="lostTimeDays"
                      type="number"
                      value={formData.lostTimeDays}
                      onChange={(e) => setFormData({ ...formData, lostTimeDays: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fatalities">Fatalities</Label>
                    <Input
                      id="fatalities"
                      type="number"
                      value={formData.fatalities}
                      onChange={(e) => setFormData({ ...formData, fatalities: e.target.value })}
                      placeholder="0"
                      className="border-rose-200 bg-rose-50"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600">
                  💡 <strong>Tip:</strong> Use the Hours Calculator to automatically calculate total hours based on workers, days, and hours per day.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDataEntry(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMetrics}>
                Save Metrics
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  )
}
