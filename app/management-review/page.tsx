'use client'

import { useState, useEffect } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { CalendarEventForm } from '@/components/forms/CalendarEventForm'

interface ManagementReview {
  id: string
  title: string
  scheduledAt: string
  status: string
  meetingType: string
  standards: string[]
  createdAt: string
  _count: {
    attendees: number
    inputs: number
    outputs: number
    actions: number
  }
}

export default function ManagementReviewPage() {
  const [reviews, setReviews] = useState<ManagementReview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [standardFilter, setStandardFilter] = useState<string>('ALL')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [searchQuery, statusFilter, standardFilter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter && statusFilter !== 'ALL') params.append('status', statusFilter)
      if (standardFilter && standardFilter !== 'ALL') params.append('standards', standardFilter)
      
      const response = await fetch(`/api/management-review?${params.toString()}`, {
        credentials: 'include',
      })
      const data = await response.json()
      
      if (response.ok) {
        setReviews(data.reviews)
      } else if (response.status === 401) {
        // User not authenticated - this is expected behavior
        console.log('User not authenticated - please log in to view management reviews')
        setReviews([])
      } else {
        console.error('Failed to fetch reviews:', data.error)
        setReviews([])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
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
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading management reviews...</p>
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Management Review</h1>
            <p className="text-gray-600">
              ISO 9001, 14001, and 45001 Management Review Meetings
            </p>
          </div>
          <div className="flex gap-3">
            <CalendarEventForm 
              trigger={
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              }
              defaultTitle="Management Review Meeting"
              defaultDescription="ISO Management Review Meeting"
              defaultAttendees={[
                { email: "christopher.knill@gmail.com", name: "Chris Knill" }
              ]}
              onSuccess={() => {
                console.log('Calendar event created successfully!')
              }}
            />
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Review
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Management Review</DialogTitle>
                <DialogDescription>
                  Create a new management review meeting for ISO standards compliance.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Title
                  </label>
                  <Input placeholder="e.g., Q1 2024 Management Review" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date
                  </label>
                  <Input type="datetime-local" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="extraordinary">Extraordinary</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Standards
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      ISO 9001 (Quality)
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      ISO 14001 (Environmental)
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      ISO 45001 (OH&S)
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create Review
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={standardFilter} onValueChange={setStandardFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Standards</SelectItem>
                  <SelectItem value="ISO9001">ISO 9001</SelectItem>
                  <SelectItem value="ISO14001">ISO 14001</SelectItem>
                  <SelectItem value="ISO45001">ISO 45001</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <CardTitle>Management Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600 mb-4">
                  {loading ? 'Loading management reviews...' : 'Get started by creating your first management review.'}
                </p>
                {!loading && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Review
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Standards</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div>
                          <Link 
                            href={`/management-review/${review.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            {review.title}
                          </Link>
                          <p className="text-sm text-gray-500">{review.meetingType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(review.scheduledAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getStandardBadges(review.standards)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(review.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center space-x-4">
                            <span>{review._count.attendees} attendees</span>
                            <span>{review._count.inputs} inputs</span>
                            <span>{review._count.outputs} outputs</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(review.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/management-review/${review.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/management-review/${review.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
