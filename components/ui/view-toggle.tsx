'use client'

import { List, Grid, Kanban } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  view: 'list' | 'grid' | 'board'
  onViewChange: (view: 'list' | 'grid' | 'board') => void
  className?: string
  showBoard?: boolean
}

export function ViewToggle({ view, onViewChange, className, showBoard = true }: ViewToggleProps) {
  return (
    <div className={cn('inline-flex rounded-lg border border-slate-200 p-1', className)}>
      <button
        onClick={() => onViewChange('list')}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          view === 'list'
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        )}
      >
        <List className="h-4 w-4" />
        List
      </button>
      <button
        onClick={() => onViewChange('grid')}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          view === 'grid'
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        )}
      >
        <Grid className="h-4 w-4" />
        Grid
      </button>
      {showBoard && (
        <button
          onClick={() => onViewChange('board')}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            view === 'board'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <Kanban className="h-4 w-4" />
          Board
        </button>
      )}
    </div>
  )
}

