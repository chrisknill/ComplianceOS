'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface RiskMatrixProps {
  risks: Array<{ id: string; title: string; likelihood: number; severity: number }>
  onCellClick?: (likelihood: number, severity: number) => void
}

function getRiskColor(score: number): string {
  if (score >= 16) return 'bg-rose-500 hover:bg-rose-600'
  if (score >= 11) return 'bg-orange-500 hover:bg-orange-600'
  if (score >= 6) return 'bg-amber-400 hover:bg-amber-500'
  return 'bg-emerald-400 hover:bg-emerald-500'
}

function getRiskLabel(score: number): string {
  if (score >= 16) return 'Critical'
  if (score >= 11) return 'High'
  if (score >= 6) return 'Medium'
  return 'Low'
}

export function RiskMatrix({ risks, onCellClick }: RiskMatrixProps) {
  const [selectedCell, setSelectedCell] = useState<{ l: number; s: number } | null>(null)

  // Count risks in each cell
  const cellCounts: Record<string, number> = {}
  risks.forEach((risk) => {
    const key = `${risk.likelihood}-${risk.severity}`
    cellCounts[key] = (cellCounts[key] || 0) + 1
  })

  const handleCellClick = (likelihood: number, severity: number) => {
    setSelectedCell({ l: likelihood, s: severity })
    onCellClick?.(likelihood, severity)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        {/* Y-axis label */}
        <div className="flex flex-col items-center justify-center h-full pt-8">
          <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-slate-700">
            Likelihood →
          </div>
        </div>

        {/* Matrix */}
        <div className="flex-1 max-w-md">
          <div className="grid grid-cols-6 gap-1.5">
            {/* Header row */}
            <div className="col-span-1"></div>
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={`header-${s}`} className="text-center text-sm font-medium text-slate-700">
                {s}
              </div>
            ))}

            {/* Matrix rows (reverse order for likelihood 5->1) */}
            {[5, 4, 3, 2, 1].map((likelihood) => (
              <React.Fragment key={`row-${likelihood}`}>
                {/* Row label */}
                <div className="flex items-center justify-center text-sm font-medium text-slate-700">
                  {likelihood}
                </div>

                {/* Cells */}
                {[1, 2, 3, 4, 5].map((severity) => {
                  const score = likelihood * severity
                  const count = cellCounts[`${likelihood}-${severity}`] || 0
                  const isSelected = selectedCell?.l === likelihood && selectedCell?.s === severity

                  return (
                    <button
                      key={`${likelihood}-${severity}`}
                      onClick={() => handleCellClick(likelihood, severity)}
                      className={cn(
                        'aspect-square rounded flex flex-col items-center justify-center transition-all border-2',
                        getRiskColor(score),
                        isSelected ? 'border-slate-900 ring-2 ring-slate-900' : 'border-transparent',
                        'text-white font-semibold cursor-pointer text-xs'
                      )}
                      title={`${getRiskLabel(score)} (${likelihood}×${severity}=${score})`}
                    >
                      <span className="text-sm font-bold">{score}</span>
                      {count > 0 && (
                        <span className="text-[10px] opacity-90">({count})</span>
                      )}
                    </button>
                  )
                })}
              </React.Fragment>
            ))}
          </div>

          {/* X-axis label */}
          <div className="text-center text-sm font-medium text-slate-700 mt-2">
            Severity →
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 justify-center pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-400"></div>
          <span className="text-sm text-slate-700">Low (1-5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-400"></div>
          <span className="text-sm text-slate-700">Medium (6-10)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500"></div>
          <span className="text-sm text-slate-700">High (11-15)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-500"></div>
          <span className="text-sm text-slate-700">Critical (16-25)</span>
        </div>
      </div>
    </div>
  )
}

