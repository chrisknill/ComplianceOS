'use client'

import { useEffect, useState, useMemo } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { 
  Building2, Plus, Download, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  CheckCircle, AlertCircle, Clock, FileText, Users, Award, Shield, Eye, Edit, Trash2,
  Calendar, MapPin, Phone, Mail, Globe, Star, AlertTriangle, Target, ClipboardCheck
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { convertToCSV, downloadFile } from '@/lib/export'

// Interfaces
interface Supplier {
  id: string
  name: string
  category: 'Raw Materials' | 'Services' | 'Equipment' | 'Software' | 'Consulting' | 'Logistics'
  contactPerson: string
  email: string
  phone: string
  address: string
  website?: string
  registrationNumber: string
  taxId: string
  status: 'Draft' | 'Under Review' | 'Approved' | 'Suspended' | 'Rejected'
  rating: 'A' | 'B' | 'C' | 'D'
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  lastAudit?: Date
  nextAudit?: Date
  approvalDate?: Date
  approvedBy?: string
  complianceScore: number // 0-100
  certifications: string[]
  financialStability: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  deliveryPerformance: number // 0-100
  qualityPerformance: number // 0-100
  questionnaireScores: {
    legalCompliance: number // 1-5 stars
    financialStability: number // 1-5 stars
    qualityManagement: number // 1-5 stars
    environmentalSafety: number // 1-5 stars
    technicalCapability: number // 1-5 stars
    performanceDelivery: number // 1-5 stars
    overallScore: number // 1-5 stars
  }
  questionnaireResponses: {
    [key: string]: {
      question: string
      answer: string
      score: number
      evidence: string
      notes: string
    }
  }
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface ApprovalChecklist {
  id: string
  supplierId: string
  checklistItems: ChecklistItem[]
  overallScore: number
  status: 'In Progress' | 'Completed' | 'Failed'
  reviewedBy: string
  reviewDate: Date
  comments: string
}

interface ChecklistItem {
  id: string
  category: string
  requirement: string
  description: string
  weight: number // 1-5 importance
  status: 'Not Started' | 'In Progress' | 'Passed' | 'Failed' | 'N/A'
  evidence: string
  reviewer: string
  reviewDate?: Date
  notes: string
}

type ViewMode = 'list' | 'grid' | 'board' | 'calendar'

// Star rating component
const StarRating = ({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-slate-600">({rating})</span>
    </div>
  )
}

export default function SupplierManagementPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [approvalChecklists, setApprovalChecklists] = useState<ApprovalChecklist[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showSupplierForm, setShowSupplierForm] = useState(false)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>()
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | undefined>()

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [ratingFilter, setRatingFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'suppliers', label: 'Suppliers List' },
    { key: 'audits', label: 'Audits & Reviews' },
    { key: 'performance', label: 'Performance' },
  ]

  // Load data
  const loadSuppliers = () => {
    // Mock data for suppliers
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'ABC Materials Ltd',
        category: 'Raw Materials',
        contactPerson: 'John Smith',
        email: 'john.smith@abcmaterials.com',
        phone: '+44 20 7123 4567',
        address: '123 Industrial Estate, London, UK',
        website: 'https://abcmaterials.com',
        registrationNumber: 'REG123456',
        taxId: 'TAX789012',
        status: 'Approved',
        rating: 'A',
        riskLevel: 'Low',
        lastAudit: new Date('2024-11-15'),
        nextAudit: new Date('2025-05-15'),
        approvalDate: new Date('2024-01-15'),
        approvedBy: 'Procurement Manager',
        complianceScore: 95,
        certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
        financialStability: 'Excellent',
        deliveryPerformance: 98,
        qualityPerformance: 96,
        questionnaireScores: {
          legalCompliance: 5,
          financialStability: 5,
          qualityManagement: 5,
          environmentalSafety: 4,
          technicalCapability: 5,
          performanceDelivery: 5,
          overallScore: 5
        },
        questionnaireResponses: {
          'legal-1': {
            question: 'Valid company registration certificate',
            answer: 'Yes, certificate provided and verified',
            score: 5,
            evidence: 'Certificate uploaded and verified by legal team',
            notes: 'Valid registration with Companies House'
          },
          'financial-1': {
            question: 'Audited financial statements (last 3 years)',
            answer: 'Yes, all statements provided',
            score: 5,
            evidence: 'Statements from 2022-2024 provided',
            notes: 'Strong financial position with consistent growth'
          }
        },
        notes: 'Reliable supplier with excellent track record',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-11-15')
      },
      {
        id: '2',
        name: 'XYZ Services Inc',
        category: 'Services',
        contactPerson: 'Sarah Johnson',
        email: 'sarah.johnson@xyzservices.com',
        phone: '+44 20 7654 3210',
        address: '456 Business Park, Manchester, UK',
        website: 'https://xyzservices.com',
        registrationNumber: 'REG789012',
        taxId: 'TAX345678',
        status: 'Under Review',
        rating: 'B',
        riskLevel: 'Medium',
        lastAudit: new Date('2024-10-20'),
        nextAudit: new Date('2025-04-20'),
        approvalDate: new Date('2023-06-01'),
        approvedBy: 'Quality Manager',
        complianceScore: 78,
        certifications: ['ISO 9001:2015'],
        financialStability: 'Good',
        deliveryPerformance: 85,
        qualityPerformance: 82,
        questionnaireScores: {
          legalCompliance: 4,
          financialStability: 3,
          qualityManagement: 4,
          environmentalSafety: 3,
          technicalCapability: 4,
          performanceDelivery: 3,
          overallScore: 4
        },
        questionnaireResponses: {
          'legal-1': {
            question: 'Valid company registration certificate',
            answer: 'Yes, certificate provided',
            score: 4,
            evidence: 'Certificate uploaded',
            notes: 'Valid registration'
          },
          'quality-1': {
            question: 'ISO 9001:2015 certification or equivalent',
            answer: 'Yes, ISO 9001:2015 certified',
            score: 4,
            evidence: 'Certificate provided',
            notes: 'Certification valid until 2026'
          }
        },
        notes: 'Good performance but needs improvement in quality metrics',
        createdAt: new Date('2023-05-01'),
        updatedAt: new Date('2024-10-20')
      },
      {
        id: '3',
        name: 'DEF Equipment Co',
        category: 'Equipment',
        contactPerson: 'Mike Wilson',
        email: 'mike.wilson@defequipment.com',
        phone: '+44 20 9876 5432',
        address: '789 Technology Centre, Birmingham, UK',
        website: 'https://defequipment.com',
        registrationNumber: 'REG345678',
        taxId: 'TAX901234',
        status: 'Approved',
        rating: 'A',
        riskLevel: 'Low',
        lastAudit: new Date('2024-12-01'),
        nextAudit: new Date('2025-06-01'),
        approvalDate: new Date('2024-03-01'),
        approvedBy: 'Technical Manager',
        complianceScore: 92,
        certifications: ['ISO 9001:2015', 'ISO 45001:2018'],
        financialStability: 'Excellent',
        deliveryPerformance: 94,
        qualityPerformance: 90,
        questionnaireScores: {
          legalCompliance: 5,
          financialStability: 5,
          qualityManagement: 5,
          environmentalSafety: 4,
          technicalCapability: 5,
          performanceDelivery: 4,
          overallScore: 5
        },
        questionnaireResponses: {
          'legal-1': {
            question: 'Valid company registration certificate',
            answer: 'Yes, certificate provided and verified',
            score: 5,
            evidence: 'Certificate uploaded and verified',
            notes: 'Valid registration'
          },
          'tech-1': {
            question: 'Technical qualifications and certifications',
            answer: 'Yes, extensive technical certifications',
            score: 5,
            evidence: 'Multiple technical certifications provided',
            notes: 'Highly qualified technical team'
          }
        },
        notes: 'Specialized equipment supplier with technical expertise',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-12-01')
      }
    ]
    setSuppliers(mockSuppliers)
  }

  const loadApprovalChecklists = () => {
    // Mock data for approval checklists
    const mockChecklists: ApprovalChecklist[] = [
      {
        id: '1',
        supplierId: '2',
        checklistItems: [
          {
            id: '1',
            category: 'Legal & Compliance',
            requirement: 'Company Registration',
            description: 'Valid company registration certificate',
            weight: 5,
            status: 'Passed',
            evidence: 'Certificate uploaded',
            reviewer: 'Legal Team',
            reviewDate: new Date('2024-10-15'),
            notes: 'Valid registration'
          },
          {
            id: '2',
            category: 'Financial',
            requirement: 'Financial Statements',
            description: 'Audited financial statements for last 3 years',
            weight: 4,
            status: 'Passed',
            evidence: 'Statements provided',
            reviewer: 'Finance Team',
            reviewDate: new Date('2024-10-16'),
            notes: 'Financial health good'
          },
          {
            id: '3',
            category: 'Quality',
            requirement: 'Quality Management System',
            description: 'ISO 9001 certification or equivalent',
            weight: 5,
            status: 'Passed',
            evidence: 'ISO 9001:2015 certificate',
            reviewer: 'Quality Manager',
            reviewDate: new Date('2024-10-17'),
            notes: 'Certification valid'
          }
        ],
        overallScore: 85,
        status: 'Completed',
        reviewedBy: 'Procurement Manager',
        reviewDate: new Date('2024-10-20'),
        comments: 'Supplier meets most requirements with minor improvements needed'
      }
    ]
    setApprovalChecklists(mockChecklists)
  }

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)
      loadSuppliers()
      loadApprovalChecklists()
      setLoading(false)
    }
    loadAllData()
  }, [])

  // Filtering and sorting logic
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredSuppliers = suppliers
    .filter(supplier => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          supplier.name.toLowerCase().includes(search) ||
          supplier.contactPerson.toLowerCase().includes(search) ||
          supplier.email.toLowerCase().includes(search) ||
          supplier.category.toLowerCase().includes(search)
        )
      }
      return true
    })
    .filter(supplier => statusFilter === 'ALL' || supplier.status === statusFilter)
    .filter(supplier => categoryFilter === 'ALL' || supplier.category === categoryFilter)
    .filter(supplier => ratingFilter === 'ALL' || supplier.rating === ratingFilter)
    .sort((a, b) => {
      let aVal: any = a[sortField as keyof Supplier]
      let bVal: any = b[sortField as keyof Supplier]
      
      if (sortField === 'lastAudit' || sortField === 'nextAudit' || sortField === 'approvalDate') {
        aVal = aVal ? new Date(aVal).getTime() : 0
        bVal = bVal ? new Date(bVal).getTime() : 0
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  // Calculate statistics
  const stats = {
    totalSuppliers: suppliers.length,
    approvedSuppliers: suppliers.filter(s => s.status === 'Approved').length,
    underReviewSuppliers: suppliers.filter(s => s.status === 'Under Review').length,
    averageComplianceScore: suppliers.length > 0 ? Math.round(suppliers.reduce((sum, s) => sum + s.complianceScore, 0) / suppliers.length) : 0,
    highRiskSuppliers: suppliers.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical').length,
    auditsDue: suppliers.filter(s => s.nextAudit && new Date(s.nextAudit) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length
  }

  const handleExport = () => {
    const data = filteredSuppliers.map(supplier => ({
      Name: supplier.name,
      Category: supplier.category,
      Status: supplier.status,
      Rating: supplier.rating,
      'Risk Level': supplier.riskLevel,
      'Compliance Score': supplier.complianceScore,
      'Last Audit': supplier.lastAudit ? formatDate(supplier.lastAudit) : '-',
      'Next Audit': supplier.nextAudit ? formatDate(supplier.nextAudit) : '-',
      'Contact Person': supplier.contactPerson,
      Email: supplier.email,
      Phone: supplier.phone
    }))
    
    const csv = convertToCSV(data)
    downloadFile(csv, `suppliers-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading supplier data...</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Supplier Management</h1>
            <p className="text-slate-600 mt-1">ISO-compliant supplier approval and performance management</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => { setEditingSupplier(undefined); setShowSupplierForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.key
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
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.approvedSuppliers} approved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.underReviewSuppliers}</div>
                  <p className="text-xs text-muted-foreground">
                    Pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Compliance</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageComplianceScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    Overall score
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.highRiskSuppliers}</div>
                  <p className="text-xs text-muted-foreground">
                    Require attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Supplier Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Status Distribution</CardTitle>
                  <CardDescription>Current status of all suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Approved</span>
                      </div>
                      <span className="text-sm font-medium">{stats.approvedSuppliers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Under Review</span>
                      </div>
                      <span className="text-sm font-medium">{stats.underReviewSuppliers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Suspended/Rejected</span>
                      </div>
                      <span className="text-sm font-medium">{suppliers.filter(s => s.status === 'Suspended' || s.status === 'Rejected').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Level Distribution</CardTitle>
                  <CardDescription>Risk assessment of suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Low Risk</span>
                      </div>
                      <span className="text-sm font-medium">{suppliers.filter(s => s.riskLevel === 'Low').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Medium Risk</span>
                      </div>
                      <span className="text-sm font-medium">{suppliers.filter(s => s.riskLevel === 'Medium').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">High/Critical Risk</span>
                      </div>
                      <span className="text-sm font-medium">{stats.highRiskSuppliers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Ratings</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Suppliers Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <button onClick={() => handleSort('name')} className="flex items-center gap-1">
                          Supplier Name
                          {sortField === 'name' && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risk Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Compliance Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <button onClick={() => handleSort('lastAudit')} className="flex items-center gap-1">
                          Last Audit
                          {sortField === 'lastAudit' && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredSuppliers.map((supplier) => (
                      <tr 
                        key={supplier.id} 
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => {
                          setViewingSupplier(supplier)
                          setShowQuestionnaire(true)
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <Building2 className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{supplier.name}</div>
                              <div className="text-sm text-slate-500">{supplier.contactPerson}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{supplier.category}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={supplier.status === 'Approved' ? 'green' : 
                                   supplier.status === 'Under Review' ? 'amber' : 'red'} 
                            label={supplier.status} 
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StarRating rating={supplier.questionnaireScores.overallScore} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={supplier.riskLevel === 'Low' ? 'default' : 
                                   supplier.riskLevel === 'Medium' ? 'secondary' : 'destructive'}
                          >
                            {supplier.riskLevel}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  supplier.complianceScore >= 90 ? 'bg-green-500' :
                                  supplier.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${supplier.complianceScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{supplier.complianceScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {supplier.lastAudit ? formatDate(supplier.lastAudit) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingSupplier(supplier)
                                setShowSupplierForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* Audits & Reviews Tab */}
        {activeTab === 'audits' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Audits & Reviews</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Audit
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Audits</CardTitle>
                  <CardDescription>Suppliers with audits due in the next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suppliers.filter(s => s.nextAudit && new Date(s.nextAudit) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).map(supplier => (
                      <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-slate-500">{supplier.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{supplier.nextAudit ? formatDate(supplier.nextAudit) : '-'}</div>
                          <Badge variant={supplier.riskLevel === 'Low' ? 'default' : 'destructive'}>
                            {supplier.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Audit Results</CardTitle>
                  <CardDescription>Latest audit outcomes and scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suppliers.filter(s => s.lastAudit).map(supplier => (
                      <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-slate-500">Audit: {supplier.lastAudit ? formatDate(supplier.lastAudit) : '-'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{supplier.complianceScore}%</div>
                          <Badge variant={supplier.complianceScore >= 90 ? 'default' : supplier.complianceScore >= 70 ? 'secondary' : 'destructive'}>
                            {supplier.complianceScore >= 90 ? 'Excellent' : supplier.complianceScore >= 70 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Performance Metrics</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance</CardTitle>
                  <CardDescription>On-time delivery metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suppliers.map(supplier => (
                      <div key={supplier.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{supplier.name}</span>
                          <span className="font-medium">{supplier.deliveryPerformance}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              supplier.deliveryPerformance >= 95 ? 'bg-green-500' :
                              supplier.deliveryPerformance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${supplier.deliveryPerformance}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Performance</CardTitle>
                  <CardDescription>Quality metrics and defect rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suppliers.map(supplier => (
                      <div key={supplier.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{supplier.name}</span>
                          <span className="font-medium">{supplier.qualityPerformance}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              supplier.qualityPerformance >= 95 ? 'bg-green-500' :
                              supplier.qualityPerformance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${supplier.qualityPerformance}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Stability</CardTitle>
                  <CardDescription>Financial health assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suppliers.map(supplier => (
                      <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-slate-500">{supplier.category}</div>
                        </div>
                        <Badge 
                          variant={supplier.financialStability === 'Excellent' ? 'default' : 
                                 supplier.financialStability === 'Good' ? 'secondary' : 'destructive'}
                        >
                          {supplier.financialStability}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Supplier Form Dialog with Comprehensive Questionnaire */}
        <Dialog open={showSupplierForm} onOpenChange={setShowSupplierForm}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier - ISO Compliance Questionnaire'}
              </DialogTitle>
              <DialogDescription>
                Complete supplier information and ISO-compliant approval questionnaire
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier-name">Supplier Name *</Label>
                    <Input id="supplier-name" placeholder="Enter supplier name" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contact-person">Contact Person *</Label>
                    <Input id="contact-person" placeholder="Enter contact person name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="Enter website URL" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea id="address" placeholder="Enter full address" rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="registration-number">Registration Number *</Label>
                    <Input id="registration-number" placeholder="Enter registration number" />
                  </div>
                  <div>
                    <Label htmlFor="tax-id">Tax ID *</Label>
                    <Input id="tax-id" placeholder="Enter tax identification number" />
                  </div>
                </div>
              </div>

              {/* ISO Compliance Questionnaire */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">ISO 9001:2015 Compliance Questionnaire</h3>
                
                {/* Legal & Compliance Section */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Legal & Compliance
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Valid company registration certificate</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox id="legal-1" />
                          <Label htmlFor="legal-1" className="text-sm">Yes</Label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Score:</span>
                        <Select>
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="1-5" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Tax identification number</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox id="legal-2" />
                          <Label htmlFor="legal-2" className="text-sm">Yes</Label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Score:</span>
                        <Select>
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="1-5" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Insurance certificates (Public Liability, Professional Indemnity)</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox id="legal-3" />
                          <Label htmlFor="legal-3" className="text-sm">Yes</Label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Score:</span>
                        <Select>
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="1-5" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Stability Section */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Financial Stability
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Audited financial statements (last 3 years)</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox id="financial-1" />
                          <Label htmlFor="financial-1" className="text-sm">Yes</Label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Score:</span>
                        <Select>
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="1-5" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Credit check and financial health assessment</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox id="financial-2" />
                          <Label htmlFor="financial-2" className="text-sm">Yes</Label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Score:</span>
                        <Select>
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="1-5" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Management Section */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    Quality Management System
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">ISO 9001:2015 certification or equivalent</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox id="quality-1" />
                          <Label htmlFor="quality-1" className="text-sm">Yes</Label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Score:</span>
                        <Select>
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="1-5" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Quality policy and objectives documentation</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox id="quality-2" />
                          <Label htmlFor="quality-2" className="text-sm">Yes</Label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Score:</span>
                        <Select>
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="1-5" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overall Assessment */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-slate-800 mb-4">Overall Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="overall-score" className="text-sm font-medium">
                        Overall Score (1-5 stars)
                      </Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select overall score" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star - Poor</SelectItem>
                          <SelectItem value="2">2 Stars - Below Average</SelectItem>
                          <SelectItem value="3">3 Stars - Average</SelectItem>
                          <SelectItem value="4">4 Stars - Good</SelectItem>
                          <SelectItem value="5">5 Stars - Excellent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="recommendation" className="text-sm font-medium">
                        Recommendation
                      </Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select recommendation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approve">Approve</SelectItem>
                          <SelectItem value="approve-conditions">Approve with Conditions</SelectItem>
                          <SelectItem value="reject">Reject</SelectItem>
                          <SelectItem value="additional-review">Requires Additional Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="comments" className="text-sm font-medium">
                      Comments and Recommendations
                    </Label>
                    <Textarea 
                      id="comments" 
                      className="mt-1" 
                      rows={4}
                      placeholder="Enter detailed comments and recommendations..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSupplierForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowSupplierForm(false)}>
                {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Completed Questionnaire View Dialog */}
        <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Completed Questionnaire - {viewingSupplier?.name}
              </DialogTitle>
              <DialogDescription>
                View completed ISO compliance questionnaire and scores
              </DialogDescription>
            </DialogHeader>
            
            {viewingSupplier && (
              <div className="space-y-6">
                {/* Supplier Overview */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">Overall Score</h4>
                      <StarRating rating={viewingSupplier.questionnaireScores.overallScore} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Status</h4>
                      <StatusBadge 
                        status={viewingSupplier.status === 'Approved' ? 'green' : 
                               viewingSupplier.status === 'Under Review' ? 'amber' : 'red'} 
                        label={viewingSupplier.status} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Risk Level</h4>
                      <Badge 
                        variant={viewingSupplier.riskLevel === 'Low' ? 'default' : 
                               viewingSupplier.riskLevel === 'Medium' ? 'secondary' : 'destructive'}
                      >
                        {viewingSupplier.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Detailed Scores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Legal & Compliance</h4>
                      <StarRating rating={viewingSupplier.questionnaireScores.legalCompliance} />
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Financial Stability</h4>
                      <StarRating rating={viewingSupplier.questionnaireScores.financialStability} />
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Quality Management</h4>
                      <StarRating rating={viewingSupplier.questionnaireScores.qualityManagement} />
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Environmental & Safety</h4>
                      <StarRating rating={viewingSupplier.questionnaireScores.environmentalSafety} />
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Technical Capability</h4>
                      <StarRating rating={viewingSupplier.questionnaireScores.technicalCapability} />
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Performance & Delivery</h4>
                      <StarRating rating={viewingSupplier.questionnaireScores.performanceDelivery} />
                    </div>
                  </div>
                </div>

                {/* Questionnaire Responses */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Questionnaire Responses</h3>
                  <div className="space-y-3">
                    {Object.entries(viewingSupplier.questionnaireResponses).map(([key, response]) => (
                      <div key={key} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-slate-900">{response.question}</h4>
                          <StarRating rating={response.score} />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-slate-600">Answer:</span>
                            <p className="text-sm text-slate-900">{response.answer}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-600">Evidence:</span>
                            <p className="text-sm text-slate-900">{response.evidence}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-600">Notes:</span>
                            <p className="text-sm text-slate-900">{response.notes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingSupplier.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Performance Metrics</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Delivery Performance:</span>
                          <span className="font-medium">{viewingSupplier.deliveryPerformance}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Quality Performance:</span>
                          <span className="font-medium">{viewingSupplier.qualityPerformance}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Compliance Score:</span>
                          <span className="font-medium">{viewingSupplier.complianceScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {viewingSupplier.notes && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                      <p className="text-sm text-slate-900">{viewingSupplier.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQuestionnaire(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  )
}
