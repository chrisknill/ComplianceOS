'use client'

import { useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, Filter, Plus, Settings, Zap, CheckCircle, 
  XCircle, Clock, ExternalLink, Download, Upload,
  FileText, Users, BarChart3, CreditCard, Shield,
  Mail, Calendar, MessageSquare, Database, Cloud,
  Smartphone, Monitor, Server, Globe, Lock
} from 'lucide-react'

type IntegrationStatus = 'active' | 'inactive' | 'pending' | 'error'
type IntegrationCategory = 'all' | 'productivity' | 'accounting' | 'analytics' | 'communication' | 'document' | 'project' | 'crm' | 'security'

interface Integration {
  id: string
  name: string
  category: string
  description: string
  status: IntegrationStatus
  lastSync?: string
  nextSync?: string
  features: string[]
  pricing: string
  logo: string
  website: string
  apiAvailable: boolean
}

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const integrations: Integration[] = [
    // Microsoft Suite
    {
      id: '1',
      name: 'Microsoft 365',
      category: 'productivity',
      description: 'Complete productivity suite including Word, Excel, PowerPoint, Teams, and SharePoint',
      status: 'active',
      lastSync: '2025-01-22 14:30',
      nextSync: '2025-01-22 15:30',
      features: ['Document Management', 'Collaboration', 'Email Integration', 'Calendar Sync'],
      pricing: 'Included',
      logo: '🔵',
      website: 'https://microsoft.com',
      apiAvailable: true
    },
    {
      id: '2',
      name: 'Microsoft Teams',
      category: 'communication',
      description: 'Team collaboration and communication platform with video conferencing',
      status: 'active',
      lastSync: '2025-01-22 14:25',
      nextSync: '2025-01-22 15:25',
      features: ['Video Calls', 'Chat', 'File Sharing', 'Meeting Integration'],
      pricing: 'Included',
      logo: '💬',
      website: 'https://teams.microsoft.com',
      apiAvailable: true
    },
    {
      id: '3',
      name: 'SharePoint',
      category: 'document',
      description: 'Enterprise document management and collaboration platform',
      status: 'active',
      lastSync: '2025-01-22 14:20',
      nextSync: '2025-01-22 15:20',
      features: ['Document Storage', 'Version Control', 'Workflow Automation', 'Search'],
      pricing: 'Included',
      logo: '📁',
      website: 'https://sharepoint.com',
      apiAvailable: true
    },
    {
      id: '4',
      name: 'Power BI',
      category: 'analytics',
      description: 'Business intelligence and data visualization platform',
      status: 'pending',
      features: ['Data Visualization', 'Reports', 'Dashboards', 'Real-time Analytics'],
      pricing: '$10/user/month',
      logo: '📊',
      website: 'https://powerbi.microsoft.com',
      apiAvailable: true
    },

    // Google Workspace
    {
      id: '5',
      name: 'Google Workspace',
      category: 'productivity',
      description: 'Complete productivity suite with Gmail, Drive, Docs, Sheets, and Meet',
      status: 'inactive',
      features: ['Email', 'Document Collaboration', 'Cloud Storage', 'Video Conferencing'],
      pricing: '$6/user/month',
      logo: '🔴',
      website: 'https://workspace.google.com',
      apiAvailable: true
    },
    {
      id: '6',
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Web analytics and business intelligence platform',
      status: 'inactive',
      features: ['Website Analytics', 'User Behavior', 'Conversion Tracking', 'Custom Reports'],
      pricing: 'Free',
      logo: '📈',
      website: 'https://analytics.google.com',
      apiAvailable: true
    },

    // Accounting Software
    {
      id: '7',
      name: 'Xero',
      category: 'accounting',
      description: 'Cloud-based accounting software for small to medium businesses',
      status: 'pending',
      features: ['Invoicing', 'Expense Tracking', 'Bank Reconciliation', 'Financial Reporting'],
      pricing: '$13/month',
      logo: '💰',
      website: 'https://xero.com',
      apiAvailable: true
    },
    {
      id: '8',
      name: 'QuickBooks',
      category: 'accounting',
      description: 'Popular accounting software with comprehensive financial management',
      status: 'inactive',
      features: ['Bookkeeping', 'Payroll', 'Tax Preparation', 'Inventory Management'],
      pricing: '$15/month',
      logo: '📋',
      website: 'https://quickbooks.intuit.com',
      apiAvailable: true
    },
    {
      id: '9',
      name: 'Sage',
      category: 'accounting',
      description: 'Enterprise accounting and financial management solution',
      status: 'inactive',
      features: ['ERP Integration', 'Multi-currency', 'Advanced Reporting', 'Compliance'],
      pricing: 'Custom',
      logo: '🏢',
      website: 'https://sage.com',
      apiAvailable: true
    },

    // CRM Systems
    {
      id: '10',
      name: 'Salesforce',
      category: 'crm',
      description: 'Leading CRM platform with sales, service, and marketing automation',
      status: 'pending',
      features: ['Lead Management', 'Sales Pipeline', 'Customer Service', 'Marketing Automation'],
      pricing: '$25/user/month',
      logo: '☁️',
      website: 'https://salesforce.com',
      apiAvailable: true
    },
    {
      id: '11',
      name: 'HubSpot',
      category: 'crm',
      description: 'Inbound marketing and sales platform with CRM capabilities',
      status: 'inactive',
      features: ['Marketing Automation', 'Sales CRM', 'Customer Service', 'Content Management'],
      pricing: 'Free - $1,200/month',
      logo: '🎯',
      website: 'https://hubspot.com',
      apiAvailable: true
    },
    {
      id: '12',
      name: 'Pipedrive',
      category: 'crm',
      description: 'Sales-focused CRM with visual pipeline management',
      status: 'inactive',
      features: ['Sales Pipeline', 'Deal Management', 'Activity Tracking', 'Reporting'],
      pricing: '$12.50/user/month',
      logo: '🔧',
      website: 'https://pipedrive.com',
      apiAvailable: true
    },

    // Project Management
    {
      id: '13',
      name: 'Asana',
      category: 'project',
      description: 'Project management and team collaboration platform',
      status: 'pending',
      features: ['Task Management', 'Project Tracking', 'Team Collaboration', 'Timeline View'],
      pricing: 'Free - $10.99/user/month',
      logo: '📋',
      website: 'https://asana.com',
      apiAvailable: true
    },
    {
      id: '14',
      name: 'Monday.com',
      category: 'project',
      description: 'Work operating system for project and team management',
      status: 'inactive',
      features: ['Workflow Automation', 'Project Tracking', 'Team Collaboration', 'Custom Dashboards'],
      pricing: '$8/user/month',
      logo: '📅',
      website: 'https://monday.com',
      apiAvailable: true
    },
    {
      id: '15',
      name: 'Trello',
      category: 'project',
      description: 'Visual project management with Kanban boards',
      status: 'inactive',
      features: ['Kanban Boards', 'Task Cards', 'Team Collaboration', 'Power-ups'],
      pricing: 'Free - $5/user/month',
      logo: '📌',
      website: 'https://trello.com',
      apiAvailable: true
    },
    {
      id: '16',
      name: 'Jira',
      category: 'project',
      description: 'Issue and project tracking for software development teams',
      status: 'inactive',
      features: ['Issue Tracking', 'Agile Management', 'Bug Tracking', 'Release Management'],
      pricing: 'Free - $7/user/month',
      logo: '🎫',
      website: 'https://atlassian.com/software/jira',
      apiAvailable: true
    },

    // Electronic Signing
    {
      id: '17',
      name: 'DocuSign',
      category: 'document',
      description: 'Electronic signature and document management platform',
      status: 'pending',
      features: ['Electronic Signatures', 'Document Workflow', 'Compliance', 'Audit Trail'],
      pricing: '$10/user/month',
      logo: '✍️',
      website: 'https://docusign.com',
      apiAvailable: true
    },
    {
      id: '18',
      name: 'Adobe Sign',
      category: 'document',
      description: 'Adobe\'s electronic signature and document management solution',
      status: 'inactive',
      features: ['Electronic Signatures', 'PDF Management', 'Workflow Automation', 'Mobile Signing'],
      pricing: '$9.99/user/month',
      logo: '📄',
      website: 'https://adobe.com/sign',
      apiAvailable: true
    },
    {
      id: '19',
      name: 'HelloSign',
      category: 'document',
      description: 'Simple electronic signature solution for businesses',
      status: 'inactive',
      features: ['Electronic Signatures', 'Template Library', 'Bulk Sending', 'API Integration'],
      pricing: '$15/user/month',
      logo: '👋',
      website: 'https://hellosign.com',
      apiAvailable: true
    },

    // Document Scanning
    {
      id: '20',
      name: 'Adobe Scan',
      category: 'document',
      description: 'Mobile document scanning and OCR solution',
      status: 'pending',
      features: ['Mobile Scanning', 'OCR Text Recognition', 'PDF Creation', 'Cloud Storage'],
      pricing: 'Free',
      logo: '📱',
      website: 'https://adobe.com/products/scan',
      apiAvailable: false
    },
    {
      id: '21',
      name: 'CamScanner',
      category: 'document',
      description: 'Mobile document scanning and management app',
      status: 'inactive',
      features: ['Document Scanning', 'OCR Recognition', 'Cloud Sync', 'Batch Processing'],
      pricing: 'Free - $4.99/month',
      logo: '📷',
      website: 'https://camscanner.com',
      apiAvailable: false
    },
    {
      id: '22',
      name: 'Evernote',
      category: 'document',
      description: 'Note-taking and document organization platform',
      status: 'inactive',
      features: ['Note Taking', 'Document Scanning', 'Web Clipping', 'Search'],
      pricing: 'Free - $7.99/month',
      logo: '🐘',
      website: 'https://evernote.com',
      apiAvailable: true
    },

    // Business Analytics
    {
      id: '23',
      name: 'Tableau',
      category: 'analytics',
      description: 'Advanced data visualization and business intelligence platform',
      status: 'inactive',
      features: ['Data Visualization', 'Advanced Analytics', 'Dashboard Creation', 'Data Discovery'],
      pricing: '$70/user/month',
      logo: '📊',
      website: 'https://tableau.com',
      apiAvailable: true
    },
    {
      id: '24',
      name: 'Looker',
      category: 'analytics',
      description: 'Modern business intelligence and data platform',
      status: 'inactive',
      features: ['Data Modeling', 'Self-Service Analytics', 'Embedded Analytics', 'Data Governance'],
      pricing: 'Custom',
      logo: '👁️',
      website: 'https://looker.com',
      apiAvailable: true
    },
    {
      id: '25',
      name: 'Mixpanel',
      category: 'analytics',
      description: 'Product analytics and user behavior tracking',
      status: 'inactive',
      features: ['User Analytics', 'Event Tracking', 'Funnel Analysis', 'Cohort Analysis'],
      pricing: 'Free - $25/month',
      logo: '📈',
      website: 'https://mixpanel.com',
      apiAvailable: true
    },

    // Communication Tools
    {
      id: '26',
      name: 'Slack',
      category: 'communication',
      description: 'Team communication and collaboration platform',
      status: 'pending',
      features: ['Team Chat', 'File Sharing', 'Video Calls', 'App Integrations'],
      pricing: 'Free - $6.67/user/month',
      logo: '💬',
      website: 'https://slack.com',
      apiAvailable: true
    },
    {
      id: '27',
      name: 'Zoom',
      category: 'communication',
      description: 'Video conferencing and webinar platform',
      status: 'inactive',
      features: ['Video Meetings', 'Webinars', 'Screen Sharing', 'Recording'],
      pricing: 'Free - $14.99/month',
      logo: '📹',
      website: 'https://zoom.us',
      apiAvailable: true
    },
    {
      id: '28',
      name: 'Webex',
      category: 'communication',
      description: 'Cisco\'s video conferencing and collaboration platform',
      status: 'inactive',
      features: ['Video Conferencing', 'Team Collaboration', 'Webinars', 'Security'],
      pricing: '$13.50/user/month',
      logo: '🌐',
      website: 'https://webex.com',
      apiAvailable: true
    },

    // Security & Compliance
    {
      id: '29',
      name: 'Okta',
      category: 'security',
      description: 'Identity and access management platform',
      status: 'pending',
      features: ['Single Sign-On', 'Multi-Factor Authentication', 'User Management', 'Compliance'],
      pricing: '$2/user/month',
      logo: '🔐',
      website: 'https://okta.com',
      apiAvailable: true
    },
    {
      id: '30',
      name: 'Auth0',
      category: 'security',
      description: 'Authentication and authorization platform',
      status: 'inactive',
      features: ['Authentication', 'Authorization', 'User Management', 'Social Login'],
      pricing: 'Free - $23/month',
      logo: '🛡️',
      website: 'https://auth0.com',
      apiAvailable: true
    },
    {
      id: '31',
      name: 'LastPass',
      category: 'security',
      description: 'Password management and security platform',
      status: 'inactive',
      features: ['Password Management', 'Secure Sharing', 'Multi-Factor Auth', 'Dark Web Monitoring'],
      pricing: '$3/user/month',
      logo: '🔑',
      website: 'https://lastpass.com',
      apiAvailable: true
    }
  ]

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📦' },
    { value: 'productivity', label: 'Productivity', icon: '⚡' },
    { value: 'accounting', label: 'Accounting', icon: '💰' },
    { value: 'analytics', label: 'Analytics', icon: '📊' },
    { value: 'communication', label: 'Communication', icon: '💬' },
    { value: 'document', label: 'Document Management', icon: '📄' },
    { value: 'project', label: 'Project Management', icon: '📋' },
    { value: 'crm', label: 'CRM', icon: '👥' },
    { value: 'security', label: 'Security', icon: '🔐' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'error', label: 'Error' }
  ]

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || integration.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: IntegrationStatus) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      error: { color: 'bg-red-100 text-red-800', icon: XCircle }
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getCategoryIcon = (category: string) => {
    const categoryMap: Record<string, string> = {
      productivity: '⚡',
      accounting: '💰',
      analytics: '📊',
      communication: '💬',
      document: '📄',
      project: '📋',
      crm: '👥',
      security: '🔐'
    }
    return categoryMap[category] || '📦'
  }

  return (
    <Shell>
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">System Integrations</h1>
            <p className="text-slate-600 mt-1">Connect ComplianceOS with external software and services</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integrations.length}</div>
              <p className="text-xs text-muted-foreground">Available integrations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {integrations.filter(i => i.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Currently connected</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {integrations.filter(i => i.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting setup</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Available</CardTitle>
              <Globe className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {integrations.filter(i => i.apiAvailable).length}
              </div>
              <p className="text-xs text-muted-foreground">With API access</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as IntegrationCategory)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl flex-shrink-0">{integration.logo}</div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-medium truncate">{integration.name}</CardTitle>
                      <CardDescription className="text-xs text-gray-600">
                        {getCategoryIcon(integration.category)} {integration.category.charAt(0).toUpperCase() + integration.category.slice(1)}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-gray-700 line-clamp-2">
                    {integration.description}
                  </p>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Pricing:</span>
                      <span className="font-medium truncate ml-2">{integration.pricing}</span>
                    </div>
                    
                    {integration.lastSync && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="font-medium text-xs truncate ml-2">{integration.lastSync}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">API:</span>
                      <Badge variant={integration.apiAvailable ? "default" : "secondary"} className="text-xs px-1 py-0">
                        {integration.apiAvailable ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                        {feature}
                      </Badge>
                    ))}
                    {integration.features.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        +{integration.features.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Fixed button placement at bottom */}
                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100">
                  <Button size="sm" className="flex-1 text-xs h-7">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
                    <a href={integration.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find the integration you're looking for.
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedStatus('all')
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Shell>
  )
}
