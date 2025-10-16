import { getDaysUntil } from './utils'

export type RAGStatus = 'green' | 'amber' | 'red'

export interface RAGConfig {
  amberThreshold: number // days
  redThreshold: number // days (negative = overdue)
}

const defaultConfig: RAGConfig = {
  amberThreshold: 30,
  redThreshold: 0,
}

export function getTrainingRAG(
  status: string,
  dueDate: Date | string | null,
  completed: Date | string | null,
  config: RAGConfig = defaultConfig
): RAGStatus {
  if (status === 'EXPIRED') return 'red'
  if (status === 'NOT_STARTED' && dueDate) {
    const days = getDaysUntil(dueDate)
    if (days < config.redThreshold) return 'red'
    if (days < config.amberThreshold) return 'amber'
    return 'green'
  }
  if (status === 'IN_PROGRESS' && dueDate) {
    const days = getDaysUntil(dueDate)
    if (days < config.redThreshold) return 'red'
    if (days < config.amberThreshold) return 'amber'
    return 'green'
  }
  if (status === 'COMPLETE') {
    if (!dueDate) return 'green'
    const days = getDaysUntil(dueDate)
    if (days < config.redThreshold) return 'red'
    if (days < config.amberThreshold) return 'amber'
    return 'green'
  }
  return 'green'
}

export function getRiskRAG(score: number): RAGStatus {
  if (score >= 16) return 'red'
  if (score >= 11) return 'amber'
  if (score >= 6) return 'amber'
  return 'green'
}

export function getDocumentRAG(nextReview: Date | string | null): RAGStatus {
  if (!nextReview) return 'green'
  const days = getDaysUntil(nextReview)
  if (days < 0) return 'red'
  if (days < 30) return 'amber'
  return 'green'
}

export function getCalibrationRAG(dueDate: Date | string, performedOn: Date | string | null): RAGStatus {
  if (performedOn) return 'green'
  const days = getDaysUntil(dueDate)
  if (days < 0) return 'red'
  if (days < 30) return 'amber'
  return 'green'
}

export function getRAGColor(status: RAGStatus): string {
  switch (status) {
    case 'green':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'amber':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'red':
      return 'bg-rose-100 text-rose-700 border-rose-200'
  }
}

export function getRAGLabel(status: RAGStatus): string {
  switch (status) {
    case 'green':
      return 'OK'
    case 'amber':
      return 'Due Soon'
    case 'red':
      return 'Overdue'
  }
}

