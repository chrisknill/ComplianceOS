'use client'

import { Users, ZoomOut, ZoomIn, RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

interface Employee {
  id: string
  name: string | null
  email: string
  jobTitle: string | null
  department: string | null
  managerId: string | null
  status: string
  role: string
  phone: string | null
  startDate: Date | null
  location: string | null
}

interface OrgChartProps {
  employees: Employee[]
  onEmployeeClick: (employee: Employee) => void
}

interface LineStyle {
  type: 'solid' | 'dotted'
  color: string
}

export function OrgChart({ employees, onEmployeeClick }: OrgChartProps) {
  const [zoomLevel, setZoomLevel] = useState(0.8)
  const [lineStyle, setLineStyle] = useState<LineStyle>({ type: 'solid', color: '#64748b' })

  // Find the CEO (employee with no manager)
  const ceo = employees.find(e => !e.managerId)
  
  // Get all direct reports to the CEO
  const ceoDirectReports = ceo ? employees.filter(e => e.managerId === ceo.id) : []

  // Get subordinates for an employee
  const getSubordinates = (managerId: string) => {
    return employees.filter((e) => e.managerId === managerId)
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">No employees found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-slate-600">
            Click employee to edit • Proper organizational hierarchy
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Total employees: {employees.length}
            {ceo && (
              <span> • CEO: {ceo.name} • Direct reports: {ceoDirectReports.length}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Line Style Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Lines:</span>
            <button
              onClick={() => setLineStyle({ type: 'solid', color: '#64748b' })}
              className={`px-2 py-1 text-xs rounded ${
                lineStyle.type === 'solid' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Solid
            </button>
            <button
              onClick={() => setLineStyle({ type: 'dotted', color: '#64748b' })}
              className={`px-2 py-1 text-xs rounded ${
                lineStyle.type === 'dotted' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Dotted
            </button>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(Math.max(0.3, zoomLevel - 0.1))}
              className="p-1 text-slate-600 hover:text-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-600 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
              className="p-1 text-slate-600 hover:text-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoomLevel(0.8)}
              className="p-1 text-slate-600 hover:text-slate-800"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Org Chart Container */}
      <div 
        className="overflow-auto border rounded-lg bg-slate-50 p-4 max-h-[75vh] w-full"
        style={{ 
          minHeight: '500px'
        }}
      >
        <div 
          className="w-full max-w-full mx-auto"
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            minHeight: '500px',
            width: 'fit-content',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          {/* CEO Level */}
          {ceo && (
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* CEO Card */}
                <div
                  className="w-48 p-3 rounded-lg border-2 bg-blue-50 border-blue-300 shadow-lg cursor-pointer hover:shadow-xl"
                  onClick={() => onEmployeeClick(ceo)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-800">
                        {ceo.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CEO'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-sm font-bold text-blue-900 truncate">{ceo.name || 'CEO'}</p>
                        {ceo.role === 'ADMIN' && (
                          <Badge variant="destructive" className="text-xs">Admin</Badge>
                        )}
                      </div>
                      <p className="text-xs text-blue-700 truncate">{ceo.jobTitle || 'Chief Executive Officer'}</p>
                      <p className="text-xs text-blue-600 truncate">{ceo.department || 'Executive'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={ceo.status === 'ACTIVE' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {ceo.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-blue-600 font-semibold">
                      {ceoDirectReports.length} direct reports
                    </span>
                  </div>
                </div>

                {/* Vertical line down from CEO */}
                {ceoDirectReports.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <div 
                      className={`w-1 h-6 ${
                        lineStyle.type === 'dotted' ? 'border-l-2 border-dotted' : ''
                      }`}
                      style={{ 
                        backgroundColor: lineStyle.type === 'solid' ? lineStyle.color : 'transparent',
                        borderColor: lineStyle.type === 'dotted' ? lineStyle.color : 'transparent'
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Managers Level */}
          {ceoDirectReports.length > 0 && (
            <div className="flex justify-center mb-6">
              {/* Horizontal line connecting all managers */}
              <div className="flex items-center">
                <div 
                  className={`h-1 ${
                    lineStyle.type === 'dotted' ? 'border-t-2 border-dotted' : ''
                  }`}
                  style={{ 
                    width: `${(ceoDirectReports.length - 1) * 200}px`,
                    backgroundColor: lineStyle.type === 'solid' ? lineStyle.color : 'transparent',
                    borderColor: lineStyle.type === 'dotted' ? lineStyle.color : 'transparent'
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Managers Level - Dynamic Column Widths */}
          {ceoDirectReports.length > 0 && (
            <div className="flex justify-center mb-6 max-w-full overflow-x-auto">
              {ceoDirectReports.map((manager) => {
                const subordinates = getSubordinates(manager.id)
                const columnWidth = Math.max(200, Math.min(400, subordinates.length * 120)) // Dynamic width with max constraint
                
                return (
                  <div key={manager.id} className="relative" style={{ width: `${columnWidth}px` }}>
                    {/* Vertical line up to CEO */}
                    <div className="flex justify-center mb-2">
                      <div 
                        className={`w-1 h-4 ${
                          lineStyle.type === 'dotted' ? 'border-l-2 border-dotted' : ''
                        }`}
                        style={{ 
                          backgroundColor: lineStyle.type === 'solid' ? lineStyle.color : 'transparent',
                          borderColor: lineStyle.type === 'dotted' ? lineStyle.color : 'transparent'
                        }}
                      ></div>
                    </div>

                    {/* Manager Card - Centered in their column */}
                    <div className="flex justify-center mb-2">
                      <div
                        className="w-44 p-3 rounded-lg border-2 bg-purple-50 border-purple-200 shadow-md cursor-pointer hover:shadow-lg"
                        onClick={() => onEmployeeClick(manager)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-800">
                              {manager.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'MGR'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <p className="text-sm font-semibold text-purple-900 truncate">{manager.name || 'Manager'}</p>
                              {manager.role === 'ADMIN' && (
                                <Badge variant="destructive" className="text-xs">Admin</Badge>
                              )}
                            </div>
                            <p className="text-xs text-purple-700 truncate">{manager.jobTitle || 'Manager'}</p>
                            <p className="text-xs text-purple-600 truncate">{manager.department || 'Department'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={manager.status === 'ACTIVE' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {manager.status.replace('_', ' ')}
                          </Badge>
                          {subordinates.length > 6 && (
                            <Badge 
                              variant="destructive" 
                              className="text-xs animate-pulse"
                              title="Warning: This manager has more than 6 direct reports"
                            >
                              ⚠ {subordinates.length}
                            </Badge>
                          )}
                          {subordinates.length > 0 && (
                            <span className={`text-xs ${
                              subordinates.length > 6 ? 'text-red-600 font-semibold' : 'text-purple-600'
                            }`}>
                              {subordinates.length} reports
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Vertical line down to subordinates */}
                    {subordinates.length > 0 && (
                      <div className="flex justify-center mb-2">
                        <div 
                          className={`w-1 h-4 ${
                            lineStyle.type === 'dotted' ? 'border-l-2 border-dotted' : ''
                          }`}
                          style={{ 
                            backgroundColor: lineStyle.type === 'solid' ? lineStyle.color : 'transparent',
                            borderColor: lineStyle.type === 'dotted' ? lineStyle.color : 'transparent'
                          }}
                        ></div>
                      </div>
                    )}

                    {/* Subordinates - Spread across manager's column width */}
                    {subordinates.length > 0 ? (
                      <div className="flex justify-center gap-2 flex-wrap max-w-full">
                        {subordinates.map((subordinate) => (
                          <div key={subordinate.id} className="relative">
                            {/* Vertical line up to manager */}
                            <div className="flex justify-center mb-2">
                              <div 
                                className={`w-1 h-4 ${
                                  lineStyle.type === 'dotted' ? 'border-l-2 border-dotted' : ''
                                }`}
                                style={{ 
                                  backgroundColor: lineStyle.type === 'solid' ? lineStyle.color : 'transparent',
                                  borderColor: lineStyle.type === 'dotted' ? lineStyle.color : 'transparent'
                                }}
                              ></div>
                            </div>

                            {/* Subordinate Card */}
                            <div
                              className="w-32 p-2 rounded-lg border-2 bg-slate-50 border-slate-200 shadow-sm cursor-pointer hover:shadow-md"
                              onClick={() => onEmployeeClick(subordinate)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-slate-700">
                                    {subordinate.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EMP'}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-slate-900 truncate">{subordinate.name || 'Employee'}</p>
                                  <p className="text-xs text-slate-600 truncate">{subordinate.jobTitle || 'Role'}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-center">
                                <Badge 
                                  variant={subordinate.status === 'ACTIVE' ? 'default' : 'outline'}
                                  className="text-xs"
                                >
                                  {subordinate.status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-32 h-16 flex items-center justify-center mx-auto">
                        <span className="text-xs text-slate-400">No reports</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="text-sm font-semibold text-slate-900 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-50 border-2 border-blue-300 rounded"></div>
            <span>CEO</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-50 border-2 border-purple-200 rounded"></div>
            <span>Managers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-50 border-2 border-slate-200 rounded"></div>
            <span>Employees</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-slate-400"></div>
            <span>Solid Lines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dotted border-slate-400"></div>
            <span>Dotted Lines</span>
          </div>
        </div>
      </div>
    </div>
  )
}