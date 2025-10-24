'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, AlertTriangle, Users, Building, Wrench, GraduationCap } from 'lucide-react'

interface NonConformance {
  id: string
  refNumber: string
  caseType: string
  title: string
  raisedBy: string
  dateRaised: Date
  category: string
  severity: string
  status: string
  owner: string | null
  dueDate: Date | null
}

interface ParetoData {
  category: string
  count: number
  percentage: number
  cumulativePercentage: number
}

interface ParetoAnalysisProps {
  records: NonConformance[]
  onFilterChange?: (filter: string, value: string) => void
}

export function ParetoAnalysis({ records, onFilterChange }: ParetoAnalysisProps) {
  const [analysisType, setAnalysisType] = useState<'category' | 'caseType' | 'severity' | 'owner' | 'department'>('category')
  const [timeRange, setTimeRange] = useState<'all' | 'last30' | 'last90' | 'last365'>('all')

  // Filter records by time range
  const filteredRecords = useMemo(() => {
    const now = new Date()
    const cutoffDate = new Date()
    
    switch (timeRange) {
      case 'last30':
        cutoffDate.setDate(now.getDate() - 30)
        break
      case 'last90':
        cutoffDate.setDate(now.getDate() - 90)
        break
      case 'last365':
        cutoffDate.setDate(now.getDate() - 365)
        break
      default:
        return records
    }
    
    return timeRange === 'all' ? records : records.filter(r => new Date(r.dateRaised) >= cutoffDate)
  }, [records, timeRange])

  // Generate Pareto data based on analysis type
  const paretoData = useMemo((): ParetoData[] => {
    const dataMap = new Map<string, number>()
    
    filteredRecords.forEach(record => {
      let key: string
      
      switch (analysisType) {
        case 'category':
          key = record.category || 'Uncategorized'
          break
        case 'caseType':
          key = record.caseType
          break
        case 'severity':
          key = record.severity
          break
        case 'owner':
          key = record.owner || 'Unassigned'
          break
        case 'department':
          // Extract department from owner or category
          key = record.category?.split(' - ')[0] || record.owner?.split(' ')[0] || 'Unknown'
          break
        default:
          key = record.category || 'Uncategorized'
      }
      
      dataMap.set(key, (dataMap.get(key) || 0) + 1)
    })
    
    // Convert to array and sort by count (descending)
    const sortedData = Array.from(dataMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
    
    const total = sortedData.reduce((sum, item) => sum + item.count, 0)
    
    // Calculate percentages and cumulative percentages
    let cumulative = 0
    return sortedData.map(item => {
      const percentage = total > 0 ? (item.count / total) * 100 : 0
      cumulative += percentage
      return {
        category: item.category,
        count: item.count,
        percentage: Math.round(percentage * 10) / 10,
        cumulativePercentage: Math.round(cumulative * 10) / 10
      }
    })
  }, [filteredRecords, analysisType])

  // Find the 80/20 cutoff point
  const eightyPercentCutoff = paretoData.find(item => item.cumulativePercentage >= 80)
  const topIssues = paretoData.filter(item => item.cumulativePercentage <= 80)
  const bottomIssues = paretoData.filter(item => item.cumulativePercentage > 80)

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'category': return <BarChart3 className="h-4 w-4" />
      case 'caseType': return <AlertTriangle className="h-4 w-4" />
      case 'severity': return <TrendingUp className="h-4 w-4" />
      case 'owner': return <Users className="h-4 w-4" />
      case 'department': return <Building className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const getAnalysisLabel = (type: string) => {
    switch (type) {
      case 'category': return 'Issue Category'
      case 'caseType': return 'Case Type'
      case 'severity': return 'Severity Level'
      case 'owner': return 'Owner'
      case 'department': return 'Department'
      default: return 'Category'
    }
  }

  const getCategoryColor = (category: string, index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-orange-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500'
    ]
    return colors[index % colors.length]
  }

  const getCategoryTextColor = (category: string, index: number) => {
    const colors = [
      'text-blue-700',
      'text-green-700', 
      'text-orange-700',
      'text-purple-700',
      'text-red-700',
      'text-yellow-700',
      'text-pink-700',
      'text-indigo-700'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {getAnalysisIcon(analysisType)}
          <span className="text-sm font-medium">Analyze by:</span>
        </div>
        <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Issue Category</SelectItem>
            <SelectItem value="caseType">Case Type</SelectItem>
            <SelectItem value="severity">Severity Level</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="department">Department</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Time range:</span>
        </div>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="last30">Last 30 Days</SelectItem>
            <SelectItem value="last90">Last 90 Days</SelectItem>
            <SelectItem value="last365">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Issues</p>
                <p className="text-2xl font-bold text-slate-900">{filteredRecords.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Top Issues (80%)</p>
                <p className="text-2xl font-bold text-emerald-600">{topIssues.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {topIssues.length > 0 ? `${topIssues[0].category} leads with ${topIssues[0].count} issues` : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">80/20 Cutoff</p>
                <p className="text-2xl font-bold text-amber-600">
                  {eightyPercentCutoff ? eightyPercentCutoff.cumulativePercentage.toFixed(1) : 0}%
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {eightyPercentCutoff ? `At ${eightyPercentCutoff.category}` : 'No data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pareto Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Pareto Analysis - {getAnalysisLabel(analysisType)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart */}
            <div className="relative">
              {/* Chart Container */}
              <div className="flex items-end gap-1 h-80 border-b border-slate-200 border-l border-slate-200 pl-8 pb-8">
                {paretoData.slice(0, 10).map((item, index) => (
                  <div key={item.category} className="flex-1 flex flex-col items-center gap-2 px-1">
                    {/* Bar */}
                    <div className="relative w-full flex flex-col items-center">
                      <div 
                        className="w-full bg-slate-800 rounded-t transition-all duration-500 relative cursor-pointer hover:bg-slate-700"
                        style={{ height: `${(item.percentage / Math.max(...paretoData.slice(0, 10).map(d => d.percentage))) * 200}px` }}
                        onClick={() => {
                          if (onFilterChange) {
                            switch (analysisType) {
                              case 'category':
                                onFilterChange('category', item.category)
                                break
                              case 'caseType':
                                onFilterChange('caseType', item.category)
                                break
                              case 'severity':
                                onFilterChange('severity', item.category)
                                break
                              case 'owner':
                                onFilterChange('owner', item.category)
                                break
                              case 'department':
                                onFilterChange('department', item.category)
                                break
                            }
                          }
                        }}
                      >
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center text-white text-xs font-medium py-1">
                          {item.count}
                        </div>
                      </div>
                    </div>
                    
                    {/* Labels */}
                    <div className="text-xs text-slate-600 text-center leading-tight w-16">
                      {item.category}
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 h-80 flex flex-col justify-between text-xs text-slate-500">
                <div>100%</div>
                <div>80%</div>
                <div>60%</div>
                <div>40%</div>
                <div>20%</div>
                <div>0%</div>
              </div>
              
              {/* Cumulative Line */}
              <svg className="absolute inset-0 w-full h-80 pointer-events-none" style={{ paddingLeft: '32px', paddingBottom: '32px' }}>
                {/* Horizontal reference lines for key percentages */}
                <line x1="0%" y1="40px" x2="100%" y2="40px" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="0%" y1="80px" x2="100%" y2="80px" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="0%" y1="120px" x2="100%" y2="120px" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="0%" y1="160px" x2="100%" y2="160px" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                
                {/* Calculate exact positions for each bar center */}
                {(() => {
                  // Calculate the exact positioning to match the bars
                  const totalBars = paretoData.slice(0, 10).length
                  const barWidth = 100 / totalBars // Each bar takes equal width
                  const barCenters = paretoData.slice(0, 10).map((item, index) => {
                    // Calculate center position accounting for padding and gaps
                    const x = (index * barWidth) + (barWidth / 2)
                    const y = 200 - (item.cumulativePercentage / 100) * 200
                    return { x, y, item }
                  })
                  
                  return (
                    <>
                      {/* Cumulative Line connecting all points */}
                      <polyline
                        points={barCenters.map(({ x, y }) => `${x}%,${y}px`).join(' ')}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="none"
                      />
                      
                      {/* Cumulative Line Points at bar centers */}
                      {barCenters.map(({ x, y }, index) => (
                        <circle
                          key={`point-${index}`}
                          cx={`${x}%`}
                          cy={`${y}px`}
                          r="3"
                          fill="#ef4444"
                          stroke="white"
                          strokeWidth="1"
                        />
                      ))}
                    </>
                  )
                })()}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-800 rounded"></div>
                <span>Issue Count (Bars)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span>Cumulative % (Red Line)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
              Top Issues (Focus Areas)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="space-y-3 flex-1">
              {topIssues.slice(0, 3).map((item, index) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={getCategoryTextColor(item.category, index)}>
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-slate-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{item.count}</div>
                    <div className="text-xs text-slate-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-100 rounded-lg">
              <p className="text-sm text-emerald-800">
                <strong>Recommendation:</strong> Focus improvement efforts on the top {topIssues.length} issues 
                to address {topIssues.reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}% of all problems.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Lower Priority Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="space-y-3 flex-1">
              {bottomIssues.slice(0, 3).map((item, index) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-amber-700">
                      #{topIssues.length + index + 1}
                    </Badge>
                    <span className="font-medium text-slate-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{item.count}</div>
                    <div className="text-xs text-slate-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-amber-100 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> These issues represent the "long tail" - consider addressing 
                them through systematic process improvements rather than individual fixes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
