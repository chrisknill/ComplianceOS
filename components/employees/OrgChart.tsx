'use client'

import { Users, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
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

export function OrgChart({ employees, onEmployeeClick }: OrgChartProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Find root employees (no manager or manager not in list)
  const roots = employees.filter(
    (e) => !e.managerId || !employees.find((emp) => emp.id === e.managerId)
  )

  // Get subordinates for an employee
  const getSubordinates = (managerId: string) => {
    return employees.filter((e) => e.managerId === managerId)
  }

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedNodes(newExpanded)
  }

  const EmployeeNode = ({ employee, level = 0 }: { employee: Employee; level?: number }) => {
    const subordinates = getSubordinates(employee.id)
    const hasSubordinates = subordinates.length > 0
    const isExpanded = expandedNodes.has(employee.id)

    return (
      <div className="relative">
        <div
          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
            level === 0
              ? 'bg-blue-50 border-blue-300'
              : level === 1
              ? 'bg-purple-50 border-purple-200'
              : 'bg-slate-50 border-slate-200'
          } hover:shadow-md`}
          style={{ marginLeft: `${level * 2}rem` }}
        >
          {hasSubordinates && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(employee.id)
              }}
              className="flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-600" />
              )}
            </button>
          )}
          {!hasSubordinates && <div className="w-4" />}

          <div
            className="flex-1"
            onClick={() => onEmployeeClick(employee)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-slate-700">
                  {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900">{employee.name || 'Unknown'}</p>
                  {employee.role === 'ADMIN' && (
                    <Badge variant="destructive" className="text-xs">Admin</Badge>
                  )}
                  <Badge 
                    variant={employee.status === 'ACTIVE' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {employee.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{employee.jobTitle || 'No title'}</p>
                <p className="text-xs text-slate-500">{employee.department || 'No department'}</p>
              </div>
              {hasSubordinates && (
                <div className="text-xs text-slate-500">
                  {subordinates.length} direct report{subordinates.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subordinates */}
        {hasSubordinates && isExpanded && (
          <div className="mt-2 space-y-2 relative">
            {/* Connecting line */}
            <div 
              className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-300"
              style={{ marginLeft: `${level * 2}rem` }}
            />
            
            {subordinates.map((sub) => (
              <EmployeeNode key={sub.id} employee={sub} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (roots.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">No organizational structure defined</p>
        <p className="text-xs text-slate-400 mt-2">Add managers to employees to build the org chart</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600">
          Click employee to edit • Click chevron to expand/collapse
        </p>
        <button
          onClick={() => {
            // Expand all
            const allIds = new Set(employees.map(e => e.id))
            setExpandedNodes(allIds)
          }}
          className="text-xs text-blue-600 hover:underline"
        >
          Expand All
        </button>
      </div>

      {roots.map((root) => (
        <EmployeeNode key={root.id} employee={root} level={0} />
      ))}

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="text-sm font-semibold text-slate-900 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-50 border-2 border-blue-300 rounded"></div>
            <span>Top Level (CEO/Directors)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-50 border-2 border-purple-200 rounded"></div>
            <span>Level 1 (Managers)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-50 border-2 border-slate-200 rounded"></div>
            <span>Level 2+ (Team Members)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

