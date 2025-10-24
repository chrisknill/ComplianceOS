'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, Target, AlertCircle, CheckCircle, BarChart3, 
  Calendar, Download, RefreshCw, ArrowUp, ArrowDown, Minus,
  LayoutDashboard, List, Eye
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { KPIForm } from '@/components/forms/KPIForm'
import { KPITargetForm } from '@/components/forms/KPITargetForm'

export default function KPIPage() {
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard')
  const [showKPIForm, setShowKPIForm] = useState(false)
  const [showTargetForm, setShowTargetForm] = useState(false)
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

  // Update KPI data based on selected period
  useEffect(() => {
    // Simulate different data for different periods
    const periodData = {
      week: {
        quality: { current: 92, target: 95, trend: 'up', change: 1 },
        environmental: { current: 85, target: 90, trend: 'up', change: 8 },
        safety: { current: 100, target: 100, trend: 'stable', change: 0 },
        customer: { current: 82, target: 85, trend: 'up', change: 2 },
        waste: { current: 70, target: 80, trend: 'up', change: 10 },
        training: { current: 95, target: 95, trend: 'up', change: 3 }
      },
      month: {
        quality: { current: 94, target: 95, trend: 'up', change: 2 },
        environmental: { current: 88, target: 90, trend: 'up', change: 12 },
        safety: { current: 100, target: 100, trend: 'stable', change: 0 },
        customer: { current: 84, target: 85, trend: 'up', change: 3 },
        waste: { current: 75, target: 80, trend: 'up', change: 15 },
        training: { current: 98, target: 95, trend: 'up', change: 5 }
      },
      quarter: {
        quality: { current: 96, target: 95, trend: 'up', change: 4 },
        environmental: { current: 92, target: 90, trend: 'up', change: 18 },
        safety: { current: 100, target: 100, trend: 'stable', change: 0 },
        customer: { current: 87, target: 85, trend: 'up', change: 6 },
        waste: { current: 82, target: 80, trend: 'up', change: 22 },
        training: { current: 99, target: 95, trend: 'up', change: 8 }
      },
      year: {
        quality: { current: 97, target: 95, trend: 'up', change: 6 },
        environmental: { current: 95, target: 90, trend: 'up', change: 25 },
        safety: { current: 100, target: 100, trend: 'stable', change: 0 },
        customer: { current: 89, target: 85, trend: 'up', change: 9 },
        waste: { current: 88, target: 80, trend: 'up', change: 35 },
        training: { current: 100, target: 95, trend: 'up', change: 12 }
      }
    }
    
    setKpiData(periodData[selectedPeriod as keyof typeof periodData] || periodData.month)
  }, [selectedPeriod])

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

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return 'Weekly'
      case 'month': return 'Monthly'
      case 'quarter': return 'Quarterly'
      case 'year': return 'Yearly'
      default: return 'Monthly'
    }
  }

  const getValueColor = (current: number, target: number) => {
    return current >= target ? 'text-green-600' : 'text-red-600'
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
          <div className="flex flex-col items-end gap-3">
            {/* Top row - Action buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowTargetForm(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Set Targets
              </Button>
              <Button variant="outline" onClick={() => setShowKPIForm(true)}>
                <Target className="h-4 w-4 mr-2" />
                Add KPI
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
            
            {/* Bottom row - View Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1 text-sm font-medium rounded flex items-center gap-2 ${
                  viewMode === 'dashboard'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm font-medium rounded flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
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

        {/* KPI Content */}
        {viewMode === 'dashboard' ? (
          /* Dashboard View */
          <div className="space-y-6">
            {/* Main KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/nonconformance" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Quality Score</p>
                <p className={`text-3xl font-bold mt-2 ${getValueColor(kpiData.quality.current, kpiData.quality.target)}`}>{kpiData.quality.current}%</p>
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
          </Link>

          <Link href="/waste-management" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Environmental Impact</p>
                <p className={`text-3xl font-bold mt-2 ${getValueColor(kpiData.environmental.current, kpiData.environmental.target)}`}>-{kpiData.environmental.change}%</p>
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
          </Link>

          <Link href="/ohs/dashboard" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Safety Performance</p>
                <p className={`text-3xl font-bold mt-2 ${getValueColor(kpiData.safety.current, kpiData.safety.target)}`}>{kpiData.safety.current}%</p>
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
          </Link>
            </div>

            {/* Detailed KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link href="/customer-satisfaction" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Satisfaction</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Overall Rating</p>
                  <p className="text-sm text-slate-500">QMS Performance</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getValueColor(kpiData.customer.current, kpiData.customer.target)}`}>{kpiData.customer.current}/5</p>
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
          </Link>

          <Link href="/waste-management" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Waste Reduction</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reduction Achieved</p>
                  <p className="text-sm text-slate-500">EMS Performance</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getValueColor(kpiData.waste.current, kpiData.waste.target)}`}>{kpiData.waste.change}%</p>
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
          </Link>
            </div>

            {/* Training Completion */}
            <Link href="/training" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Training Completion</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold text-slate-900 mb-2 ${getValueColor(kpiData.training.current, kpiData.training.target)}`}>{kpiData.training.current}%</div>
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
            </Link>

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
        ) : (
          /* List View - KPI Table */
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Current KPIs ({getPeriodLabel(selectedPeriod)})</h3>
              <p className="text-sm text-slate-600 mt-1">All active KPIs across your management system</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">KPI Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Current Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trend</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">Quality Score</div>
                          <div className="text-sm text-slate-500">Non-conformance rate</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">Quality</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={getValueColor(kpiData.quality.current, kpiData.quality.target)}>
                        {kpiData.quality.current}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {kpiData.quality.target}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(kpiData.quality.trend)}
                        <span className={`ml-1 text-sm ${getTrendColor(kpiData.quality.trend)}`}>
                          {kpiData.quality.change}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={kpiData.quality.current >= kpiData.quality.target ? 'compliant' : 'warning'}
                        text={kpiData.quality.current >= kpiData.quality.target ? 'On Target' : 'Below Target'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href="/nonconformance" className="text-blue-600 hover:text-blue-800 text-sm">
                        Non-Conformance
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(new Date())}
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">Environmental Impact</div>
                          <div className="text-sm text-slate-500">Carbon footprint reduction</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">Environmental</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={getValueColor(kpiData.environmental.current, kpiData.environmental.target)}>
                        -{kpiData.environmental.change}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {kpiData.environmental.target}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(kpiData.environmental.trend)}
                        <span className={`ml-1 text-sm ${getTrendColor(kpiData.environmental.trend)}`}>
                          Improving
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={kpiData.environmental.current >= kpiData.environmental.target ? 'compliant' : 'warning'}
                        text={kpiData.environmental.current >= kpiData.environmental.target ? 'On Target' : 'Below Target'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href="/waste-management" className="text-blue-600 hover:text-blue-800 text-sm">
                        Waste Management
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(new Date())}
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">Safety Performance</div>
                          <div className="text-sm text-slate-500">Zero lost time incidents</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">Safety</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={getValueColor(kpiData.safety.current, kpiData.safety.target)}>
                        {kpiData.safety.current}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {kpiData.safety.target}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(kpiData.safety.trend)}
                        <span className={`ml-1 text-sm ${getTrendColor(kpiData.safety.trend)}`}>
                          Stable
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={kpiData.safety.current >= kpiData.safety.target ? 'compliant' : 'warning'}
                        text={kpiData.safety.current >= kpiData.safety.target ? 'On Target' : 'Below Target'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href="/ohs/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
                        OHS Dashboard
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(new Date())}
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-purple-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">Customer Satisfaction</div>
                          <div className="text-sm text-slate-500">Overall rating</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">Customer</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={getValueColor(kpiData.customer.current, kpiData.customer.target)}>
                        {kpiData.customer.current}/5
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {kpiData.customer.target}/5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(kpiData.customer.trend)}
                        <span className={`ml-1 text-sm ${getTrendColor(kpiData.customer.trend)}`}>
                          +{kpiData.customer.change}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={kpiData.customer.current >= kpiData.customer.target ? 'compliant' : 'warning'}
                        text={kpiData.customer.current >= kpiData.customer.target ? 'On Target' : 'Below Target'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href="/customer-satisfaction" className="text-blue-600 hover:text-blue-800 text-sm">
                        Customer Satisfaction
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(new Date())}
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-orange-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">Waste Reduction</div>
                          <div className="text-sm text-slate-500">Reduction achieved</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">Environmental</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={getValueColor(kpiData.waste.current, kpiData.waste.target)}>
                        {kpiData.waste.change}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {kpiData.waste.target}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(kpiData.waste.trend)}
                        <span className={`ml-1 text-sm ${getTrendColor(kpiData.waste.trend)}`}>
                          Improving
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={kpiData.waste.current >= kpiData.waste.target ? 'compliant' : 'warning'}
                        text={kpiData.waste.current >= kpiData.waste.target ? 'On Target' : 'Below Target'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href="/waste-management" className="text-blue-600 hover:text-blue-800 text-sm">
                        Waste Management
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(new Date())}
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Eye className="h-5 w-5 text-indigo-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">Training Completion</div>
                          <div className="text-sm text-slate-500">Overall completion rate</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">Training</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={getValueColor(kpiData.training.current, kpiData.training.target)}>
                        {kpiData.training.current}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {kpiData.training.target}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(kpiData.training.trend)}
                        <span className={`ml-1 text-sm ${getTrendColor(kpiData.training.trend)}`}>
                          +{kpiData.training.change}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={kpiData.training.current >= kpiData.training.target ? 'compliant' : 'warning'}
                        text={kpiData.training.current >= kpiData.training.target ? 'On Target' : 'Below Target'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href="/training" className="text-blue-600 hover:text-blue-800 text-sm">
                        Training
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(new Date())}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Forms */}
      <KPIForm
        open={showKPIForm}
        onClose={() => setShowKPIForm(false)}
        onSave={() => {
          setShowKPIForm(false)
          console.log('KPI created successfully!')
        }}
      />

      <KPITargetForm
        open={showTargetForm}
        onClose={() => setShowTargetForm(false)}
        onSave={() => {
          setShowTargetForm(false)
          console.log('KPI targets set successfully!')
        }}
      />
    </Shell>
  )
}
