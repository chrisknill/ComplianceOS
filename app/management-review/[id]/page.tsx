'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Shell } from '@/components/layout/Shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Settings,
  Save,
  Send,
  Eye,
  Plus,
} from 'lucide-react'
import Link from 'next/link'

// Import tab components (we'll create these next)
import OverviewTab from '@/components/management-review/OverviewTab'
import AttendeesTab from '@/components/management-review/AttendeesTab'
import InputsTab from '@/components/management-review/InputsTab'
import DiscussionTab from '@/components/management-review/DiscussionTab'
import OutputsTab from '@/components/management-review/OutputsTab'
import ActionsTab from '@/components/management-review/ActionsTab'
import EvidenceTab from '@/components/management-review/EvidenceTab'
import AuditTab from '@/components/management-review/AuditTab'

interface ManagementReview {
  id: string
  title: string
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  location?: string
  meetingType: string
  standards: string[]
  agenda?: any
  discussionNotes?: string
  status: string
  createdAt: string
  updatedAt: string
  attendees: any[]
  inputs: any[]
  outputs: any[]
  actions: any[]
  evidenceLinks: any[]
  auditLog: any[]
}

export default function ManagementReviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [review, setReview] = useState<ManagementReview | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (params.id) {
      fetchReview(params.id as string)
    }
  }, [params.id])

  const fetchReview = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/management-review/${id}`, {
        credentials: 'include',
      })
      const data = await response.json()
      
      if (response.ok) {
        setReview(data)
      } else {
        console.error('Failed to fetch review:', data.error)
        router.push('/management-review')
      }
    } catch (error) {
      console.error('Error fetching review:', error)
      router.push('/management-review')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      SCHEDULED: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      IN_PROGRESS: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CLOSED: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getStandardBadges = (standards: string[]) => {
    const standardColors = {
      ISO9001: 'bg-blue-100 text-blue-800',
      ISO14001: 'bg-green-100 text-green-800',
      ISO45001: 'bg-purple-100 text-purple-800',
    }

    return standards.map((standard) => (
      <Badge
        key={standard}
        className={standardColors[standard as keyof typeof standardColors] || 'bg-gray-100 text-gray-800'}
      >
        {standard}
      </Badge>
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading management review...</p>
          </div>
        </div>
      </Shell>
    )
  }

  if (!review) {
    return (
      <Shell>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Review not found</h3>
          <p className="text-gray-600 mb-4">
            The management review you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/management-review">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reviews
            </Button>
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/management-review">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{review.title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-gray-600">{formatDate(review.scheduledAt)}</span>
                {getStatusBadge(review.status)}
                <div className="flex space-x-1">
                  {getStandardBadges(review.standards)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Attendees</p>
                  <p className="text-2xl font-bold">{review.attendees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inputs</p>
                  <p className="text-2xl font-bold">{review.inputs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Outputs</p>
                  <p className="text-2xl font-bold">{review.outputs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Actions</p>
                  <p className="text-2xl font-bold">{review.actions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
            <TabsTrigger value="outputs">Outputs</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab review={review} onUpdate={setReview} />
          </TabsContent>

          <TabsContent value="attendees">
            <AttendeesTab review={review} onUpdate={setReview} />
          </TabsContent>

          <TabsContent value="inputs">
            <InputsTab review={review} onUpdate={setReview} />
          </TabsContent>

          <TabsContent value="discussion">
            <DiscussionTab review={review} onUpdate={setReview} />
          </TabsContent>

          <TabsContent value="outputs">
            <OutputsTab review={review} onUpdate={setReview} />
          </TabsContent>

          <TabsContent value="actions">
            <ActionsTab review={review} onUpdate={setReview} />
          </TabsContent>

          <TabsContent value="evidence">
            <EvidenceTab review={review} onUpdate={setReview} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTab review={review} />
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  )
}
