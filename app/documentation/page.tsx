'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { FileText, Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ViewToggle } from '@/components/ui/view-toggle'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { ApprovalWorkflow } from '@/components/forms/ApprovalWorkflow'
import { WordEditor } from '@/components/documents/WordEditor'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportDocumentsToPDF } from '@/lib/pdf'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { getDocumentRAG } from '@/lib/rag'
import { LayoutDashboard, FileCheck, Clock, AlertCircle, FileSignature, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, FileEdit } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Document {
  id: string
  type: string
  title: string
  code: string | undefined
  version: string
  status: string
  owner: string | null
  nextReview: Date | null
  url: string | undefined
  updatedAt: Date
}

export default function DocumentationPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filter, setFilter] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'board' | 'calendar'>('list')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Document | undefined>()
  const [showApprovalWorkflow, setShowApprovalWorkflow] = useState(false)
  const [approvalDoc, setApprovalDoc] = useState<Document | null>(null)
  const [showWordEditor, setShowWordEditor] = useState(false)
  const [editorDoc, setEditorDoc] = useState<Document | null>(null)
  const [sortField, setSortField] = useState<keyof Document>('code')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')

  const loadDocuments = () => {
    setLoading(true)
    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        // Add some sample SOP data
        const sampleSOPs = [
          {
            id: 'sop-1',
            type: 'SOP',
            title: 'Production Line Setup',
            code: 'SOP-PROD-001',
            version: '2.1',
            status: 'APPROVED',
            owner: 'Operations Manager',
            nextReview: new Date('2025-04-01'),
            url: undefined,
            updatedAt: new Date('2025-01-10')
          },
          {
            id: 'sop-2',
            type: 'SOP',
            title: 'Quality Control Procedures',
            code: 'SOP-QC-002',
            version: '1.8',
            status: 'PENDING_APPROVAL',
            owner: 'Quality Manager',
            nextReview: new Date('2025-03-15'),
            url: undefined,
            updatedAt: new Date('2024-12-15')
          },
          {
            id: 'sop-3',
            type: 'SOP',
            title: 'Safety Protocols',
            code: 'SOP-SAF-003',
            version: '3.0',
            status: 'APPROVED',
            owner: 'Safety Officer',
            nextReview: new Date('2025-05-05'),
            url: undefined,
            updatedAt: new Date('2025-01-05')
          }
        ]
        
        setDocuments([...data, ...sampleSOPs])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load documents:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  // Filter and sort logic
  const handleSort = (field: keyof Document) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedDocs = documents
    // Filter by tab
    .filter(d => filter === 'ALL' || filter === 'DASHBOARD' || d.type === filter)
    // Filter by status
    .filter(d => statusFilter === 'ALL' || d.status === statusFilter)
    // Filter by type (secondary filter)
    .filter(d => typeFilter === 'ALL' || d.type === typeFilter)
    // Search filter
    .filter(d => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return (
        d.title.toLowerCase().includes(search) ||
        (d.code?.toLowerCase() || '').includes(search) ||
        (d.owner?.toLowerCase() || '').includes(search)
      )
    })
    // Sort
    .sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      // Handle null values
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      
      // Convert to string for comparison
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredDocs = filteredAndSortedDocs

  const handleExport = () => {
    const csv = convertToCSV(filteredDocs.map(d => ({
      Type: d.type,
      Title: d.title,
      Code: d.code || '-',
      Version: d.version,
      Status: d.status,
      Owner: d.owner || '-',
      'Next Review': d.nextReview ? formatDate(d.nextReview) : '-',
    })))
    downloadFile(csv, `documents-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const tabs = [
    { key: 'DASHBOARD', label: 'Dashboard' },
    { key: 'ALL', label: 'All Documents' },
    { key: 'POLICY', label: 'Policies' },
    { key: 'PROCEDURE', label: 'Procedures' },
    { key: 'WORK_INSTRUCTION', label: 'Work Instructions' },
    { key: 'SOP', label: 'SOP Library' },
    { key: 'REGISTER', label: 'Registers' },
  ]

  // Calculate dashboard stats
  const docStats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'APPROVED').length,
    draft: documents.filter(d => d.status === 'DRAFT').length,
    archived: documents.filter(d => d.status === 'ARCHIVED').length,
    dueReview: documents.filter(d => d.nextReview && getDocumentRAG(d.nextReview) !== 'green').length,
    policies: documents.filter(d => d.type === 'POLICY').length,
    procedures: documents.filter(d => d.type === 'PROCEDURE').length,
    wis: documents.filter(d => d.type === 'WORK_INSTRUCTION').length,
    sops: documents.filter(d => d.type === 'SOP').length,
    registers: documents.filter(d => d.type === 'REGISTER').length,
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading documents...</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Documentation</h1>
            <p className="text-slate-600 mt-1">Policies, procedures, work instructions, and registers</p>
          </div>
          <div className="flex items-center gap-2">
            {filter !== 'DASHBOARD' && <ViewToggle view={viewMode} onViewChange={setViewMode} />}
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => exportDocumentsToPDF(filteredDocs)}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={() => { setEditingDoc(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    filter === tab.key
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {filter === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Documents</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{docStats.total}</p>
                  </div>
                  <FileText className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Approved</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{docStats.approved}</p>
                  </div>
                  <FileCheck className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Ready for use</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Draft</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{docStats.draft}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Pending approval</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Due for Review</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{docStats.dueReview}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Next 30 days</p>
              </div>
            </div>

            {/* Document Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <button
                onClick={() => setFilter('POLICY')}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-blue-900">Policies</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{docStats.policies}</p>
                <p className="text-xs text-blue-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => setFilter('PROCEDURE')}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-purple-900">Procedures</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{docStats.procedures}</p>
                <p className="text-xs text-purple-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => setFilter('WORK_INSTRUCTION')}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-emerald-900">Work Instructions</p>
                <p className="text-3xl font-bold text-emerald-900 mt-2">{docStats.wis}</p>
                <p className="text-xs text-emerald-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => setFilter('SOP')}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-orange-900">SOP Library</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">{docStats.sops}</p>
                <p className="text-xs text-orange-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => setFilter('REGISTER')}
                className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-amber-900">Registers</p>
                <p className="text-3xl font-bold text-amber-900 mt-2">{docStats.registers}</p>
                <p className="text-xs text-amber-700 mt-1">Click to view →</p>
              </button>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Document Status Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-700">Approved & Current</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{docStats.approved - docStats.dueReview}</span>
                    <span className="text-sm text-slate-500">
                      ({Math.round(((docStats.approved - docStats.dueReview) / docStats.total) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-700">Draft / Pending</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{docStats.draft}</span>
                    <span className="text-sm text-slate-500">
                      ({Math.round((docStats.draft / docStats.total) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="text-slate-700">Due for Review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{docStats.dueReview}</span>
                    <span className="text-sm text-slate-500">
                      ({Math.round((docStats.dueReview / docStats.total) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Document Control Compliance</span>
                  <span className="font-semibold">
                    {Math.round(((docStats.approved / docStats.total) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full transition-all"
                    style={{ width: `${(docStats.approved / docStats.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  ISO 9001:7.5 & ISO 14001:7.5 - Documented Information
                </p>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Recently Updated Documents</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {documents
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 5)
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50 p-2 rounded"
                        onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">{doc.title}</p>
                            <p className="text-sm text-slate-500">{doc.code} • v{doc.version} • {doc.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <StatusBadge status={getDocumentRAG(doc.nextReview)} label={doc.status} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters (List View Only) */}
        {filter !== 'DASHBOARD' && viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by title, code, or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="POLICY">Policy</SelectItem>
                    <SelectItem value="PROCEDURE">Procedure</SelectItem>
                    <SelectItem value="WORK_INSTRUCTION">Work Instruction</SelectItem>
                    <SelectItem value="SOP">SOP</SelectItem>
                    <SelectItem value="REGISTER">Register</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: &quot;{searchTerm}&quot;
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {statusFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter.replace('_', ' ')}
                    <button onClick={() => setStatusFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {typeFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {typeFilter.replace('_', ' ')}
                    <button onClick={() => setTypeFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setTypeFilter('ALL')
                  }}
                  className="ml-auto text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Count */}
            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredDocs.length} of {documents.filter(d => filter === 'ALL' || d.type === filter).length} documents
            </p>
          </div>
        )}

        {/* Document Grid/List View */}
        {filter !== 'DASHBOARD' && (
          viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                    <Badge variant={doc.status === 'APPROVED' ? 'default' : 'secondary'}>
                      {doc.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-2">{doc.title}</h3>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Code:</span> {doc.code || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Version:</span> {doc.version}
                    </p>
                    <p>
                      <span className="font-medium">Owner:</span> {doc.owner || 'Unassigned'}
                    </p>
                    <p>
                      <span className="font-medium">Next Review:</span> {formatDate(doc.nextReview)}
                    </p>
                  </div>

                  {doc.url && (
                    <a
                      href={doc.url}
                      className="mt-4 inline-block text-sm text-slate-900 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Document →
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  {/* Edit in Word Button */}
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditorDoc(doc)
                      setShowWordEditor(true)
                    }}
                  >
                    <FileEdit className="h-4 w-4 mr-2" />
                    Edit in Word
                  </Button>

                  {/* Approval Button */}
                  {(doc.status === 'PENDING_APPROVAL' || doc.status === 'APPROVED') && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        setApprovalDoc(doc)
                        setShowApprovalWorkflow(true)
                      }}
                    >
                      <FileSignature className="h-4 w-4 mr-2" />
                      View Approvals
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center gap-2">
                      Code
                      {sortField === 'code' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      Title
                      {sortField === 'title' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      {sortField === 'type' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('version')}
                  >
                    <div className="flex items-center gap-2">
                      Version
                      {sortField === 'version' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('owner')}
                  >
                    <div className="flex items-center gap-2">
                      Owner
                      {sortField === 'owner' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Status
                      {sortField === 'status' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('nextReview')}
                  >
                    <div className="flex items-center gap-2">
                      Next Review
                      {sortField === 'nextReview' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDocs.map((doc) => (
                  <tr 
                    key={doc.id} 
                    className="hover:bg-slate-50"
                  >
                    <td 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-slate-400" />
                        <span className="font-mono text-sm font-semibold text-slate-900">{doc.code || '-'}</span>
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      <span className="font-medium text-slate-900">{doc.title}</span>
                    </td>
                    <td 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      <Badge variant="outline">{doc.type.replace('_', ' ')}</Badge>
                    </td>
                    <td 
                      className="px-6 py-4 text-sm text-slate-600 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      {doc.version}
                    </td>
                    <td 
                      className="px-6 py-4 text-sm text-slate-600 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      {doc.owner || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Badge variant={doc.status === 'APPROVED' ? 'default' : 'secondary'}>
                          {doc.status.replace('_', ' ')}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditorDoc(doc)
                            setShowWordEditor(true)
                          }}
                          className="h-7 px-2"
                          title="Edit in Word"
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        {(doc.status === 'PENDING_APPROVAL' || doc.status === 'APPROVED') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setApprovalDoc(doc)
                              setShowApprovalWorkflow(true)
                            }}
                            className="h-7 px-2"
                            title="View Approvals"
                          >
                            <FileSignature className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 text-sm text-slate-600 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      {formatDate(doc.nextReview)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        )}

        {/* Board View (Kanban) - Approval Workflow */}
        {filter !== 'DASHBOARD' && viewMode === 'board' && (
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-4">
              {/* DRAFT Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Draft</h3>
                    <Badge variant="secondary">
                      {filteredDocs.filter(d => d.status === 'DRAFT').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredDocs
                      .filter(d => d.status === 'DRAFT')
                      .map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-slate-400"
                          onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                            <span className="text-xs text-slate-500">{doc.version}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{doc.code}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{doc.title}</h4>
                          <div className="text-xs text-slate-600">
                            <p>{doc.owner || 'Unassigned'}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* PENDING APPROVAL Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Pending Approval</h3>
                    <Badge variant="secondary">
                      {filteredDocs.filter(d => d.status === 'PENDING_APPROVAL').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredDocs
                      .filter(d => d.status === 'PENDING_APPROVAL')
                      .map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-amber-500"
                          onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                            <span className="text-xs text-slate-500">{doc.version}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{doc.code}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{doc.title}</h4>
                          <div className="text-xs text-slate-600">
                            <p>{doc.owner || 'Unassigned'}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              setApprovalDoc(doc)
                              setShowApprovalWorkflow(true)
                            }}
                          >
                            <FileSignature className="h-3 w-3 mr-1" />
                            Approvals
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* APPROVED Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Approved</h3>
                    <Badge variant="secondary">
                      {filteredDocs.filter(d => d.status === 'APPROVED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredDocs
                      .filter(d => d.status === 'APPROVED')
                      .map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-emerald-500"
                          onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                            <span className="text-xs text-slate-500">{doc.version}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{doc.code}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{doc.title}</h4>
                          <div className="text-xs text-slate-600">
                            <p>{doc.owner || 'Unassigned'}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* ARCHIVED Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Archived</h3>
                    <Badge variant="secondary">
                      {filteredDocs.filter(d => d.status === 'ARCHIVED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredDocs
                      .filter(d => d.status === 'ARCHIVED')
                      .map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-slate-300 opacity-75"
                          onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                            <span className="text-xs text-slate-500">{doc.version}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{doc.code}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{doc.title}</h4>
                          <div className="text-xs text-slate-600">
                            <p>{doc.owner || 'Unassigned'}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filter !== 'DASHBOARD' && filteredDocs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No documents found</p>
          </div>
        )}

        <DocumentForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingDoc(undefined); }}
          document={editingDoc}
          onSave={loadDocuments}
          nextSequence={documents.length + 1}
        />

        {approvalDoc && (
          <ApprovalWorkflow
            open={showApprovalWorkflow}
            onClose={() => { setShowApprovalWorkflow(false); setApprovalDoc(null); }}
            documentId={approvalDoc.id}
            documentTitle={approvalDoc.title}
            currentApprovals={[]}
          />
        )}

        {editorDoc && (
          <WordEditor
            open={showWordEditor}
            onClose={() => { setShowWordEditor(false); setEditorDoc(null); }}
            document={editorDoc}
            onRefresh={loadDocuments}
          />
        )}
      </div>
    </Shell>
  )
}

