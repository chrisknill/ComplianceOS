'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, Target, AlertCircle, CheckCircle, BarChart3, 
  Calendar, Download, RefreshCw, ArrowUp, ArrowDown, Minus
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/rag/StatusBadge'

export default function KPIPage() {
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [kpiData, setKpiData] = useState({
    quality: { current: 94, target: 95, trend: 'up', change: 2 },
    environmental: { current: 88, target: 90, trend: 'up', change: 12 },
    safety: { current: 100, target: 100, trend: 'stable', change: 0 },
    customer: { current: 84, target: 85, trend: 'up', change: 3 },
    waste: { current: 75, target: 80, trend: 'up', change: 15 },
    training: { current: 98, target: 95, trend: 'up', change: 5 }
  })

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-slate-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-slate-600'
    }
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading KPIs...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Key Performance Indicators</h1>
            <p className="text-slate-600 mt-1">Monitor critical metrics across your management system</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Set Targets
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Reporting Period:</span>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              {['week', 'month', 'quarter', 'year'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-sm font-medium rounded capitalize ${
                    selectedPeriod === period
                      ? 'bg-white text-slate-900 shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Quality Score</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{kpiData.quality.current}%</p>
                <div className="flex items-center gap-2 mt-1">
                  {getTrendIcon(kpiData.quality.trend)}
                  <span className={`text-sm ${getTrendColor(kpiData.quality.trend)}`}>
                    {kpiData.quality.change}% from last period
                  </span>
                </div>
              </div>
              <Target className="h-10 w-10 text-blue-500" />
            </div>
            <Progress value={kpiData.quality.current} className="mb-2" />
            <p className="text-sm text-slate-500">Target: {kpiData.quality.target}%</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Environmental Impact</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">-{kpiData.environmental.change}%</p>
                <div className="flex items-center gap-2 mt-1">
                  {getTrendIcon(kpiData.environmental.trend)}
                  <span className={`text-sm ${getTrendColor(kpiData.environmental.trend)}`}>
                    Carbon footprint reduction
                  </span>
                </div>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500" />
            </div>
            <Progress value={kpiData.environmental.current} className="mb-2" />
            <p className="text-sm text-slate-500">Target: {kpiData.environmental.target}% reduction</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Safety Performance</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{kpiData.safety.current}%</p>
                <div className="flex items-center gap-2 mt-1">
                  {getTrendIcon(kpiData.safety.trend)}
                  <span className={`text-sm ${getTrendColor(kpiData.safety.trend)}`}>
                    Zero lost time incidents
                  </span>
                </div>
              </div>
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <Progress value={kpiData.safety.current} className="mb-2" />
            <p className="text-sm text-slate-500">Target: {kpiData.safety.target}% (zero incidents)</p>
          </div>
        </div>

        {/* Detailed KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Satisfaction</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Overall Rating</p>
                  <p className="text-sm text-slate-500">QMS Performance</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{kpiData.customer.current}/5</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(kpiData.customer.trend)}
                    <span className={`text-sm ${getTrendColor(kpiData.customer.trend)}`}>
                      +{kpiData.customer.change}%
                    </span>
                  </div>
                </div>
              </div>
              <Progress value={(kpiData.customer.current / 5) * 100} />
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Target: {kpiData.customer.target}/5</span>
                <span>Last updated: {formatDate(new Date())}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Waste Reduction</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reduction Achieved</p>
                  <p className="text-sm text-slate-500">EMS Performance</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{kpiData.waste.change}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(kpiData.waste.trend)}
                    <span className={`text-sm ${getTrendColor(kpiData.waste.trend)}`}>
                      vs target
                    </span>
                  </div>
                </div>
              </div>
              <Progress value={kpiData.waste.current} />
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Target: {kpiData.waste.target}%</span>
                <span>Last updated: {formatDate(new Date())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Training Completion */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Training Completion</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">{kpiData.training.current}%</div>
              <p className="text-sm text-slate-600">Overall Completion</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {getTrendIcon(kpiData.training.trend)}
                <span className={`text-sm ${getTrendColor(kpiData.training.trend)}`}>
                  +{kpiData.training.change}%
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">156</div>
              <p className="text-sm text-slate-600">Employees Trained</p>
              <p className="text-xs text-slate-500 mt-1">This period</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">12</div>
              <p className="text-sm text-slate-600">Courses Completed</p>
              <p className="text-xs text-slate-500 mt-1">Average per employee</p>
            </div>
          </div>
          <Progress value={kpiData.training.current} className="mt-4" />
        </div>

        {/* KPI Status Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">KPI Status Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">On Target</span>
              </div>
              <span className="text-2xl font-bold text-green-600">4</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Below Target</span>
              </div>
              <span className="text-2xl font-bold text-amber-600">2</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Improving</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">5</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
