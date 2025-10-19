// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter } from 'lucide-react'

interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
}

interface DataTableProps {
  columns: DataTableColumn[]
  data: any[]
  searchPlaceholder?: string
  onAdd?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onSearch?: (term: string) => void
}

export function DataTable({ 
  columns, 
  data, 
  searchPlaceholder = "Search...",
  onAdd,
  onEdit,
  onDelete,
  onSearch 
}: DataTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-10 w-64"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-slate-900">
                      {row[column.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {onEdit && (
                        <Button variant="outline" size="sm" onClick={() => onEdit(row.id)}>
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="outline" size="sm" onClick={() => onDelete(row.id)}>
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
