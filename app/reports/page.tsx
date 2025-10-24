'use client'

import { useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  FileText, Download, Mail, Calendar, Users, Shield, 
  AlertTriangle, Wrench, ClipboardCheck, GraduationCap,
  Search, Filter, Settings, Eye, EyeOff, CheckCircle,
  Clock, BarChart3, PieChart, TrendingUp, FileSpreadsheet,
  File, FileImage, Send, RefreshCw
} from 'lucide-react'

interface ReportSection {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  dataCount: number
  lastUpdated: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  sections: string[]
  format: 'pdf' | 'excel' | 'csv' | 'html'
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
}

export default function ReportsPage() {
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv' | 'html'>('pdf')
  const [emailRecipients, setEmailRecipients] = useState<string>('')
  const [emailSubject, setEmailSubject] = useState<string>('')
  const [emailMessage, setEmailMessage] = useState<string>('')
  const [dateRange, setDateRange] = useState<'last7days' | 'last30days' | 'last90days' | 'custom'>('last30days')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const reportSections: ReportSection[] = [
    // Dashboard & Overview
    {
      id: 'dashboard-overview',
      name: 'Dashboard Overview',
      description: 'Key metrics, KPIs, and system status',
      icon: <BarChart3 className="h-5 w-5" />,
      category: 'Overview',
      dataCount: 25,
      lastUpdated: '2025-01-23'
    },
    {
      id: 'performance-metrics',
      name: 'Performance Metrics',
      description: 'System performance and efficiency data',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'Overview',
      dataCount: 15,
      lastUpdated: '2025-01-23'
    },

    // Employee Management
    {
      id: 'employee-list',
      name: 'Employee Directory',
      description: 'Complete employee information and org chart',
      icon: <Users className="h-5 w-5" />,
      category: 'Human Resources',
      dataCount: 25,
      lastUpdated: '2025-01-23'
    },
    {
      id: 'employee-training',
      name: 'Training Records',
      description: 'Employee training completion and certifications',
      icon: <GraduationCap className="h-5 w-5" />,
      category: 'Human Resources',
      dataCount: 45,
      lastUpdated: '2025-01-22'
    },

    // Risk Management
    {
      id: 'risk-assessments',
      name: 'Risk Assessments',
      description: 'All risk assessments and mitigation plans',
      icon: <AlertTriangle className="h-5 w-5" />,
      category: 'Risk Management',
      dataCount: 12,
      lastUpdated: '2025-01-23'
    },
    {
      id: 'risk-mitigation',
      name: 'Risk Mitigation Actions',
      description: 'Actions taken to mitigate identified risks',
      icon: <Shield className="h-5 w-5" />,
      category: 'Risk Management',
      dataCount: 8,
      lastUpdated: '2025-01-21'
    },

    // Equipment & Calibration
    {
      id: 'equipment-list',
      name: 'Equipment Inventory',
      description: 'Complete equipment list and maintenance records',
      icon: <Wrench className="h-5 w-5" />,
      category: 'Equipment',
      dataCount: 8,
      lastUpdated: '2025-01-23'
    },
    {
      id: 'calibration-records',
      name: 'Calibration Records',
      description: 'Equipment calibration history and schedules',
      icon: <ClipboardCheck className="h-5 w-5" />,
      category: 'Equipment',
      dataCount: 15,
      lastUpdated: '2025-01-22'
    },

    // Work Progress
    {
      id: 'work-progress',
      name: 'Work Progress Tracking',
      description: 'Current work items and project status',
      icon: <Clock className="h-5 w-5" />,
      category: 'Operations',
      dataCount: 32,
      lastUpdated: '2025-01-23'
    },

    // OHS (Occupational Health & Safety)
    {
      id: 'ohs-incidents',
      name: 'OHS Incidents',
      description: 'Safety incidents and investigation reports',
      icon: <AlertTriangle className="h-5 w-5" />,
      category: 'Safety',
      dataCount: 3,
      lastUpdated: '2025-01-20'
    },
    {
      id: 'ohs-actions',
      name: 'OHS Actions',
      description: 'Safety actions and corrective measures',
      icon: <Shield className="h-5 w-5" />,
      category: 'Safety',
      dataCount: 12,
      lastUpdated: '2025-01-23'
    },
    {
      id: 'ohs-contractors',
      name: 'Contractor Management',
      description: 'Contractor approvals and safety records',
      icon: <Users className="h-5 w-5" />,
      category: 'Safety',
      dataCount: 5,
      lastUpdated: '2025-01-21'
    },

    // Contract Review
    {
      id: 'contract-reviews',
      name: 'Contract Reviews',
      description: 'Contract review status and legal compliance',
      icon: <FileText className="h-5 w-5" />,
      category: 'Legal',
      dataCount: 5,
      lastUpdated: '2025-01-23'
    },

    // Training
    {
      id: 'training-programs',
      name: 'Training Programs',
      description: 'Training schedules and completion tracking',
      icon: <GraduationCap className="h-5 w-5" />,
      category: 'Training',
      dataCount: 8,
      lastUpdated: '2025-01-22'
    },

    // Audits
    {
      id: 'audit-reports',
      name: 'Audit Reports',
      description: 'Internal and external audit findings',
      icon: <FileText className="h-5 w-5" />,
      category: 'Compliance',
      dataCount: 6,
      lastUpdated: '2025-01-19'
    },

    // Integrations
    {
      id: 'integration-status',
      name: 'Integration Status',
      description: 'External system integration health',
      icon: <Settings className="h-5 w-5" />,
      category: 'Technical',
      dataCount: 31,
      lastUpdated: '2025-01-23'
    },

    // Communication
    {
      id: 'communication-logs',
      name: 'Communication Logs',
      description: 'System communications and notifications',
      icon: <Mail className="h-5 w-5" />,
      category: 'Communication',
      dataCount: 127,
      lastUpdated: '2025-01-23'
    }
  ]

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'High-level overview for management',
      sections: ['dashboard-overview', 'performance-metrics', 'risk-assessments'],
      format: 'pdf',
      frequency: 'monthly'
    },
    {
      id: 'compliance-report',
      name: 'Compliance Report',
      description: 'Complete compliance status report',
      sections: ['audit-reports', 'contract-reviews', 'ohs-incidents', 'training-programs'],
      format: 'pdf',
      frequency: 'quarterly'
    },
    {
      id: 'safety-report',
      name: 'Safety Report',
      description: 'Occupational health and safety summary',
      sections: ['ohs-incidents', 'ohs-actions', 'ohs-contractors', 'employee-training'],
      format: 'pdf',
      frequency: 'monthly'
    },
    {
      id: 'equipment-maintenance',
      name: 'Equipment Maintenance',
      description: 'Equipment and calibration status',
      sections: ['equipment-list', 'calibration-records'],
      format: 'excel',
      frequency: 'weekly'
    },
    {
      id: 'hr-report',
      name: 'Human Resources Report',
      description: 'Employee and training information',
      sections: ['employee-list', 'employee-training', 'training-programs'],
      format: 'excel',
      frequency: 'monthly'
    },
    {
      id: 'full-system-report',
      name: 'Full System Report',
      description: 'Complete system data export',
      sections: reportSections.map(s => s.id),
      format: 'excel',
      frequency: 'yearly'
    }
  ]

  const categories = [...new Set(reportSections.map(s => s.category))]

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleSelectAll = (category: string) => {
    const categorySections = reportSections
      .filter(s => s.category === category)
      .map(s => s.id)
    
    const allSelected = categorySections.every(id => selectedSections.includes(id))
    
    if (allSelected) {
      setSelectedSections(prev => prev.filter(id => !categorySections.includes(id)))
    } else {
      setSelectedSections(prev => [...new Set([...prev, ...categorySections])])
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setSelectedSections(template.sections)
      setReportFormat(template.format)
    }
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsGenerating(false)
    
    // Here you would call your API to generate the report
    console.log('Generating report with:', {
      sections: selectedSections,
      format: reportFormat,
      dateRange,
      customStartDate,
      customEndDate,
      emailRecipients,
      emailSubject,
      emailMessage
    })
  }

  const handleSendReport = async () => {
    setIsGenerating(true)
    
    // Simulate sending report
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsGenerating(false)
    
    // Here you would call your API to send the report
    console.log('Sending report to:', emailRecipients)
  }

  const selectedSectionsData = reportSections.filter(s => selectedSections.includes(s.id))
  const totalDataCount = selectedSectionsData.reduce((sum, s) => sum + s.dataCount, 0)

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">
              Generate comprehensive reports and export data from your compliance management system
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Report Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Quick Templates</span>
                </CardTitle>
                <CardDescription>
                  Pre-configured report templates for common use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTemplates.map(template => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {template.format.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{template.sections.length} sections</span>
                        <span>{template.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Sections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Report Sections</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {selectedSections.length} selected
                    </Badge>
                    <Badge variant="outline">
                      {totalDataCount} records
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  Select the data sections to include in your report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(category => {
                    const categorySections = reportSections.filter(s => s.category === category)
                    const selectedInCategory = categorySections.filter(s => selectedSections.includes(s.id)).length
                    const allSelected = selectedInCategory === categorySections.length
                    
                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{category}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectAll(category)}
                            className="text-xs"
                          >
                            {allSelected ? (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Deselect All
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Select All
                              </>
                            )}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categorySections.map(section => (
                            <div
                              key={section.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedSections.includes(section.id)
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleSectionToggle(section.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  checked={selectedSections.includes(section.id)}
                                  onChange={() => handleSectionToggle(section.id)}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {section.icon}
                                    <h4 className="font-medium text-sm">{section.name}</h4>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">{section.description}</p>
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{section.dataCount} records</span>
                                    <span>Updated {section.lastUpdated}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Report Configuration */}
          <div className="space-y-6">
            {/* Report Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Report Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="format">Report Format</Label>
                  <Select value={reportFormat} onValueChange={(value: any) => setReportFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">
                        <div className="flex items-center space-x-2">
                          <File className="h-4 w-4" />
                          <span>PDF Document</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="excel">
                        <div className="flex items-center space-x-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          <span>Excel Spreadsheet</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="csv">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>CSV Data</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="html">
                        <div className="flex items-center space-x-2">
                          <FileImage className="h-4 w-4" />
                          <span>HTML Report</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 Days</SelectItem>
                      <SelectItem value="last30days">Last 30 Days</SelectItem>
                      <SelectItem value="last90days">Last 90 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dateRange === 'custom' && (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Advanced Options</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <Label>Include Charts & Graphs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <Label>Include Raw Data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <Label>Include Audit Trail</Label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Report</span>
                </CardTitle>
                <CardDescription>
                  Send the report directly via email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Input
                    placeholder="email@company.com, manager@company.com"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    placeholder="ComplianceOS Report - January 2025"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    placeholder="Please find attached the requested compliance report..."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleGenerateReport}
                  disabled={selectedSections.length === 0 || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSendReport}
                  disabled={selectedSections.length === 0 || !emailRecipients || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Report
                    </>
                  )}
                </Button>

                <Separator />

                <div className="text-xs text-gray-500 space-y-1">
                  <div>Selected: {selectedSections.length} sections</div>
                  <div>Records: {totalDataCount} total</div>
                  <div>Format: {reportFormat.toUpperCase()}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  )
}
