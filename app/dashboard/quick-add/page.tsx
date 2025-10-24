'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, FileText, AlertTriangle, CheckCircle, Target, 
  Calendar, BarChart3, Shield, Activity, Clock, Users,
  AlertCircle, TrendingUp, FileSignature, ClipboardList
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { NCIntakeForm } from '@/components/forms/NCIntakeForm'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { AuditForm } from '@/components/forms/AuditForm'
import { TrainingForm } from '@/components/forms/TrainingForm'
import { IncidentForm } from '@/components/forms/IncidentForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function QuickAddPage() {
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  
  // Form states
  const [showNCForm, setShowNCForm] = useState(false)
  const [showDocumentForm, setShowDocumentForm] = useState(false)
  const [showAuditForm, setShowAuditForm] = useState(false)
  const [showTrainingForm, setShowTrainingForm] = useState(false)
  const [showIncidentForm, setShowIncidentForm] = useState(false)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const handleCreateClick = (categoryId: string) => {
    switch (categoryId) {
      case 'incident':
        setShowIncidentForm(true)
        break
      case 'nonconformity':
        setShowNCForm(true)
        break
      case 'improvement':
        setShowNCForm(true) // OFI uses the same form
        break
      case 'document':
        setShowDocumentForm(true)
        break
      case 'audit':
        setShowAuditForm(true)
        break
      case 'training':
        setShowTrainingForm(true)
        break
      default:
        console.log(`Creating ${categoryId}`)
    }
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading quick add options...</p>
        </div>
      </Shell>
    )
  }

  const quickAddCategories = [
    {
      id: 'incident',
      title: 'Incident Report',
      description: 'Report safety incidents, near misses, or accidents',
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'nonconformity',
      title: 'Non-Conformity',
      description: 'Document quality, environmental, or safety non-conformities',
      icon: AlertCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'improvement',
      title: 'Improvement Opportunity',
      description: 'Suggest process improvements or corrective actions',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'document',
      title: 'New Document',
      description: 'Create policies, procedures, or work instructions',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'audit',
      title: 'Audit Finding',
      description: 'Record internal or external audit findings',
      icon: ClipboardList,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'training',
      title: 'Training Record',
      description: 'Log employee training and competency records',
      icon: Users,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ]

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Quick Add</h1>
            <p className="text-slate-600 mt-1">Rapidly create new records across all management system areas</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileSignature className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </div>
        </div>

        {/* Quick Add Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAddCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${category.borderColor} ${category.bgColor} h-full flex flex-col`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader className="pb-3 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <CardDescription className="text-sm mb-4">
                    {category.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCreateClick(category.id)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create {category.title}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Quick Adds */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Quick Adds</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">Near miss in production area</p>
                  <p className="text-sm text-slate-500">Incident Report • 2 hours ago</p>
                </div>
              </div>
              <StatusBadge status="red" label="Open" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Documentation gap identified</p>
                  <p className="text-sm text-slate-500">Non-Conformity • 4 hours ago</p>
                </div>
              </div>
              <StatusBadge status="amber" label="In Progress" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Process optimization opportunity</p>
                  <p className="text-sm text-slate-500">Improvement • 1 day ago</p>
                </div>
              </div>
              <StatusBadge status="green" label="Draft" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today&apos;s Adds</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">7</p>
                <p className="text-sm text-slate-500 mt-1">+3 from yesterday</p>
              </div>
              <Plus className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">This Week</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">23</p>
                <p className="text-sm text-slate-500 mt-1">Mostly incidents</p>
              </div>
              <Calendar className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Review</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">5</p>
                <p className="text-sm text-slate-500 mt-1">Require attention</p>
              </div>
              <Clock className="h-10 w-10 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completion Rate</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">87%</p>
                <p className="text-sm text-slate-500 mt-1">+5% this month</p>
              </div>
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Forms */}
        <NCIntakeForm
          open={showNCForm}
          onClose={() => setShowNCForm(false)}
          onSave={() => {
            setShowNCForm(false)
            console.log('Non-conformance case created successfully!')
          }}
          defaultCaseType={selectedCategory === 'improvement' ? 'OFI' : 'NC'}
        />

        <DocumentForm
          open={showDocumentForm}
          onClose={() => setShowDocumentForm(false)}
          onSave={() => {
            setShowDocumentForm(false)
            console.log('Document created successfully!')
          }}
        />

        <Dialog open={showAuditForm} onOpenChange={setShowAuditForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Audit</DialogTitle>
              <DialogDescription>Create a new audit</DialogDescription>
            </DialogHeader>
            <AuditForm
              audit={undefined}
              auditTypes={[]}
              onSubmit={() => {
                setShowAuditForm(false)
                console.log('Audit created successfully!')
              }}
              onCancel={() => setShowAuditForm(false)}
            />
          </DialogContent>
        </Dialog>

        <TrainingForm
          open={showTrainingForm}
          onClose={() => setShowTrainingForm(false)}
          users={[]}
          courses={[]}
          onSave={() => {
            setShowTrainingForm(false)
            console.log('Training record created successfully!')
          }}
        />

        <IncidentForm
          open={showIncidentForm}
          onClose={() => setShowIncidentForm(false)}
          onSave={() => {
            setShowIncidentForm(false)
            console.log('Incident report created successfully!')
          }}
        />
      </div>
    </Shell>
  )
}
