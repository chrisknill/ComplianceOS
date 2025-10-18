'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, Plus, Download, Search, LayoutDashboard, 
  TrendingUp, Clock, CheckCircle, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown,
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, MessageSquare,
  ThumbsUp, ThumbsDown, BarChart3, PieChart, Target, Award, FileText, ChevronDown
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { convertToCSV, downloadFile } from '@/lib/export'
import { toast } from 'sonner'
import { ViewToggle } from '@/components/ui/view-toggle'
import { SurveyForm } from '@/components/forms/SurveyForm'
import { ComplaintForm } from '@/components/forms/ComplaintForm'
import { TestimonialForm } from '@/components/forms/TestimonialForm'

interface CustomerSatisfactionSurvey {
  id: string
  title: string
  description?: string
  surveyType: string
  status: string
  targetAudience?: string
  startDate?: Date
  endDate?: Date
  createdByName?: string
  totalResponses: number
  averageRating?: number
  responseRate?: number
  createdAt: Date
  updatedAt: Date
  questions: CustomerSatisfactionQuestion[]
  responses: CustomerSatisfactionResponse[]
  _count: {
    questions: number
    responses: number
  }
}

interface CustomerSatisfactionQuestion {
  id: string
  questionText: string
  questionType: string
  options?: string
  required: boolean
  order: number
  weight: number
}

interface CustomerSatisfactionResponse {
  id: string
  customerName?: string
  customerEmail?: string
  customerCompany?: string
  customerSegment?: string
  responseDate: Date
  overallRating?: number
  npsScore?: number
  comments?: string
  completed: boolean
  answers: CustomerSatisfactionAnswer[]
}

interface CustomerSatisfactionAnswer {
  id: string
  answerText?: string
  answerRating?: number
  answerChoice?: string
}

interface CustomerComplaint {
  id: string
  complaintNumber: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  customerCompany?: string
  complaintType: string
  priority: string
  status: string
  subject: string
  description: string
  receivedDate: Date
  dueDate?: Date
  assignedToName?: string
  resolution?: string
  resolutionDate?: Date
  customerSatisfied?: boolean
  followUpRequired: boolean
  followUpDate?: Date
  tags?: string
  createdAt: Date
  updatedAt: Date
  actions: CustomerComplaintAction[]
  logs: CustomerComplaintLog[]
  _count: {
    actions: number
    logs: number
  }
}

interface CustomerComplaintAction {
  id: string
  actionType: string
  description: string
  assignedToName?: string
  dueDate?: Date
  completedDate?: Date
  status: string
  effectiveness?: string
}

interface CustomerComplaintLog {
  id: string
  action: string
  performedByName?: string
  comments?: string
  timestamp: Date
}

interface Testimonial {
  id: string
  customerName: string
  customerEmail?: string
  customerCompany?: string
  customerTitle?: string
  projectName?: string
  projectType?: string
  testimonialText: string
  rating: number
  status: string
  approvedByName?: string
  approvedAt?: Date
  publishedAt?: Date
  featured: boolean
  tags?: string
  attachments?: string
  createdAt: Date
  updatedAt: Date
  project?: Project
  questionnaire?: TestimonialQuestionnaire
  responses: TestimonialResponse[]
  _count: {
    responses: number
  }
}

interface TestimonialQuestionnaire {
  id: string
  questionnaireType: string
  status: string
  sentDate?: Date
  completedDate?: Date
  expiresAt?: Date
  emailSubject?: string
  emailBody?: string
  promptingStatements?: string
  questions?: string
}

interface TestimonialResponse {
  id: string
  customerName: string
  customerEmail?: string
  customerCompany?: string
  responseDate: Date
  overallRating?: number
  npsScore?: number
  responses: string
  comments?: string
  completed: boolean
}

interface Project {
  id: string
  projectName: string
  projectNumber: string
  customerName: string
  customerEmail?: string
  customerCompany?: string
  projectType: string
  status: string
  startDate?: Date
  endDate?: Date
  completionDate?: Date
  projectManagerName?: string
  value?: number
  currency: string
  description?: string
  location?: string
  autoTestimonial: boolean
  testimonialSent: boolean
  testimonialSentDate?: Date
  testimonialReceived: boolean
  testimonialReceivedDate?: Date
  createdAt: Date
  updatedAt: Date
  testimonials: Testimonial[]
  complaints: CustomerComplaint[]
  _count: {
    testimonials: number
    complaints: number
  }
}

type ViewMode = 'dashboard' | 'all-feedback' | 'surveys' | 'complaints' | 'testimonials' | 'projects' | 'analytics'
type DisplayView = 'list' | 'grid' | 'board' | 'calendar'

export default function CustomerSatisfactionPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [displayView, setDisplayView] = useState<DisplayView>('list')
  const [loading, setLoading] = useState(true)
  const [surveys, setSurveys] = useState<CustomerSatisfactionSurvey[]>([])
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [showSurveyForm, setShowSurveyForm] = useState(false)
  const [showComplaintForm, setShowComplaintForm] = useState(false)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarViewMode, setCalendarViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const [filters, setFilters] = useState({
    search: '',
    surveyType: 'ALL',
    status: 'ALL',
    priority: 'ALL',
    complaintType: 'ALL',
  })

  const [sort, setSort] = useState({
    field: 'createdAt',
    direction: 'desc' as 'asc' | 'desc'
  })

  // Fetch data
  const fetchSurveys = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.surveyType !== 'ALL') params.append('surveyType', filters.surveyType)
      if (filters.status !== 'ALL') params.append('status', filters.status)

      const response = await fetch(`/api/customer-satisfaction/surveys?${params.toString()}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setSurveys(Array.isArray(data.surveys) ? data.surveys : [])
      } else {
        console.error('Failed to fetch surveys')
        setSurveys([])
      }
    } catch (error) {
      console.error('Error fetching surveys:', error)
      setSurveys([])
    }
  }, [filters])

  const fetchComplaints = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.complaintType !== 'ALL') params.append('complaintType', filters.complaintType)
      if (filters.priority !== 'ALL') params.append('priority', filters.priority)
      if (filters.status !== 'ALL') params.append('status', filters.status)

      const response = await fetch(`/api/customer-satisfaction/complaints?${params.toString()}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setComplaints(Array.isArray(data.complaints) ? data.complaints : [])
      } else {
        console.error('Failed to fetch complaints')
        setComplaints([])
      }
    } catch (error) {
      console.error('Error fetching complaints:', error)
      setComplaints([])
    }
  }, [filters])

  const fetchTestimonials = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.status !== 'ALL') params.append('status', filters.status)

      const response = await fetch(`/api/customer-satisfaction/testimonials?${params.toString()}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setTestimonials(Array.isArray(data.testimonials) ? data.testimonials : [])
      } else {
        console.error('Failed to fetch testimonials')
        setTestimonials([])
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setTestimonials([])
    }
  }, [filters])

  const fetchProjects = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.status !== 'ALL') params.append('status', filters.status)

      const response = await fetch(`/api/customer-satisfaction/projects?${params.toString()}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(Array.isArray(data.projects) ? data.projects : [])
      } else {
        console.error('Failed to fetch projects')
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    }
  }, [filters])

  // Generate dummy data with dates for calendar
  const generateDummyData = useCallback(() => {
    const now = new Date()
    const dummySurveys: CustomerSatisfactionSurvey[] = [
      {
        id: 'survey-1',
        title: 'Q4 Customer Satisfaction Survey',
        description: 'Quarterly customer feedback collection',
        surveyType: 'SATISFACTION',
        status: 'ACTIVE',
        totalResponses: 45,
        averageRating: 4.2,
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        questions: []
      },
      {
        id: 'survey-2',
        title: 'Product Feedback Survey',
        description: 'Feedback on new product features',
        surveyType: 'PRODUCT',
        status: 'CLOSED',
        totalResponses: 23,
        averageRating: 3.8,
        createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        expiresAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        questions: []
      },
      {
        id: 'survey-3',
        title: 'Service Quality Assessment',
        description: 'Monthly service quality review',
        surveyType: 'SERVICE',
        status: 'DRAFT',
        totalResponses: 0,
        averageRating: 0,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        expiresAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        questions: []
      }
    ]

    const dummyComplaints: CustomerComplaint[] = [
      {
        id: 'complaint-1',
        complaintNumber: 'CMP-2024-001',
        customerName: 'John Smith',
        customerEmail: 'john.smith@example.com',
        customerCompany: 'ABC Corp',
        complaintType: 'SERVICE',
        priority: 'HIGH',
        status: 'OPEN',
        description: 'Delayed delivery and poor communication',
        resolution: '',
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        resolvedAt: null,
        actions: []
      },
      {
        id: 'complaint-2',
        complaintNumber: 'CMP-2024-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        customerCompany: 'XYZ Ltd',
        complaintType: 'PRODUCT',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        description: 'Product defect reported',
        resolution: 'Investigating the issue',
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        resolvedAt: null,
        actions: []
      },
      {
        id: 'complaint-3',
        complaintNumber: 'CMP-2024-003',
        customerName: 'Mike Wilson',
        customerEmail: 'mike.w@example.com',
        customerCompany: 'Tech Solutions',
        complaintType: 'BILLING',
        priority: 'LOW',
        status: 'RESOLVED',
        description: 'Billing discrepancy',
        resolution: 'Refund processed',
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        resolvedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        actions: []
      }
    ]

    const dummyTestimonials: Testimonial[] = [
      {
        id: 'testimonial-1',
        customerName: 'Alice Brown',
        customerEmail: 'alice.brown@example.com',
        customerCompany: 'Design Co',
        customerTitle: 'CEO',
        projectName: 'Website Redesign',
        projectType: 'COMPLETED',
        testimonialText: 'Excellent service and great results!',
        rating: 5,
        status: 'PUBLISHED',
        approvedBy: 'admin',
        approvedByName: 'Admin User',
        approvedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        featured: true,
        tags: '["design", "website"]',
        attachments: null,
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        projectId: null
      },
      {
        id: 'testimonial-2',
        customerName: 'David Lee',
        customerEmail: 'david.lee@example.com',
        customerCompany: 'Marketing Pro',
        customerTitle: 'Marketing Director',
        projectName: 'Digital Campaign',
        projectType: 'COMPLETED',
        testimonialText: 'Outstanding work and professional team.',
        rating: 4,
        status: 'APPROVED',
        approvedBy: 'admin',
        approvedByName: 'Admin User',
        approvedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        publishedAt: null,
        featured: false,
        tags: '["marketing", "digital"]',
        attachments: null,
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        projectId: null
      }
    ]

    // Add dummy data to existing arrays
    setSurveys(prev => [...prev, ...dummySurveys])
    setComplaints(prev => [...prev, ...dummyComplaints])
    setTestimonials(prev => [...prev, ...dummyTestimonials])
  }, [])

  // Calendar helper functions
  const getCalendarEvents = useCallback(() => {
    const events: Array<{
      id: string
      title: string
      date: Date
      type: 'survey' | 'complaint' | 'testimonial'
      status: string
      priority?: string
    }> = []

    // Add survey events
    surveys.forEach(survey => {
      events.push({
        id: `survey-${survey.id}`,
        title: survey.title,
        date: survey.createdAt,
        type: 'survey',
        status: survey.status
      })
      if (survey.expiresAt) {
        events.push({
          id: `survey-expire-${survey.id}`,
          title: `${survey.title} (Expires)`,
          date: survey.expiresAt,
          type: 'survey',
          status: 'EXPIRES'
        })
      }
    })

    // Add complaint events
    complaints.forEach(complaint => {
      events.push({
        id: `complaint-${complaint.id}`,
        title: complaint.complaintNumber,
        date: complaint.createdAt,
        type: 'complaint',
        status: complaint.status,
        priority: complaint.priority
      })
      if (complaint.resolvedAt) {
        events.push({
          id: `complaint-resolved-${complaint.id}`,
          title: `${complaint.complaintNumber} (Resolved)`,
          date: complaint.resolvedAt,
          type: 'complaint',
          status: 'RESOLVED'
        })
      }
    })

    // Add testimonial events
    testimonials.forEach(testimonial => {
      events.push({
        id: `testimonial-${testimonial.id}`,
        title: testimonial.projectName || 'Testimonial',
        date: testimonial.createdAt,
        type: 'testimonial',
        status: testimonial.status
      })
      if (testimonial.publishedAt) {
        events.push({
          id: `testimonial-published-${testimonial.id}`,
          title: `${testimonial.projectName} (Published)`,
          date: testimonial.publishedAt,
          type: 'testimonial',
          status: 'PUBLISHED'
        })
      }
    })

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [surveys, complaints, testimonials])

  const getEventsForDate = useCallback((date: Date) => {
    const events = getCalendarEvents()
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }, [getCalendarEvents])

  const getCalendarDays = useCallback(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }, [currentMonth])

  // Daily calendar helper functions
  const getDailyEvents = useCallback(() => {
    const events = getCalendarEvents()
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === currentDate.toDateString()
    })
  }, [getCalendarEvents, currentDate])

  const getHourlyEvents = useCallback(() => {
    const dailyEvents = getDailyEvents()
    const hourlyEvents: { [hour: number]: typeof dailyEvents } = {}
    
    // Initialize hours 0-23
    for (let i = 0; i < 24; i++) {
      hourlyEvents[i] = []
    }
    
    dailyEvents.forEach(event => {
      const hour = new Date(event.date).getHours()
      if (!hourlyEvents[hour]) {
        hourlyEvents[hour] = []
      }
      hourlyEvents[hour].push(event)
    })
    
    return hourlyEvents
  }, [getDailyEvents])

  // Weekly calendar helper functions
  const getWeekDays = useCallback(() => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    
    return days
  }, [currentDate])

  const getWeekEvents = useCallback(() => {
    const weekDays = getWeekDays()
    const weekEvents: { [dayIndex: number]: ReturnType<typeof getCalendarEvents> } = {}
    
    weekDays.forEach((day, index) => {
      weekEvents[index] = getEventsForDate(day)
    })
    
    return weekEvents
  }, [getWeekDays, getEventsForDate])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchSurveys(), fetchComplaints(), fetchTestimonials(), fetchProjects()])
      generateDummyData() // Add dummy data for calendar
      setLoading(false)
    }
    fetchData()
  }, [fetchSurveys, fetchComplaints, fetchTestimonials, fetchProjects, generateDummyData])

  // Statistics
  const stats = useMemo(() => {
    const totalSurveys = surveys.length
    const activeSurveys = surveys.filter(s => s.status === 'ACTIVE').length
    const totalResponses = surveys.reduce((sum, s) => sum + s.totalResponses, 0)
    const averageRating = surveys.reduce((sum, s) => sum + (s.averageRating || 0), 0) / totalSurveys || 0

    const totalComplaints = complaints.length
    const openComplaints = complaints.filter(c => c.status === 'OPEN').length
    const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED').length
    const criticalComplaints = complaints.filter(c => c.priority === 'CRITICAL').length

    const totalTestimonials = testimonials.length
    const publishedTestimonials = testimonials.filter(t => t.status === 'PUBLISHED').length
    const featuredTestimonials = testimonials.filter(t => t.featured).length
    const averageTestimonialRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / totalTestimonials || 0

    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length
    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length
    const projectsWithTestimonials = projects.filter(p => p.testimonialReceived).length

    return {
      totalSurveys,
      activeSurveys,
      totalResponses,
      averageRating,
      totalComplaints,
      openComplaints,
      resolvedComplaints,
      criticalComplaints,
      totalTestimonials,
      publishedTestimonials,
      featuredTestimonials,
      averageTestimonialRating,
      totalProjects,
      completedProjects,
      activeProjects,
      projectsWithTestimonials,
    }
  }, [surveys, complaints, testimonials, projects])

  // Tabs definition
  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'all-feedback', label: 'All Feedback' },
    { key: 'surveys', label: 'Surveys' },
    { key: 'complaints', label: 'Complaints' },
    { key: 'testimonials', label: 'Testimonials' },
  ]

  // Sorting
  const sortedSurveys = useMemo(() => {
    return [...surveys].sort((a, b) => {
      const aValue = a[sort.field as keyof CustomerSatisfactionSurvey]
      const bValue = b[sort.field as keyof CustomerSatisfactionSurvey]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.direction === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
      }
      return 0
    })
  }, [surveys, sort])

  const sortedComplaints = useMemo(() => {
    return [...complaints].sort((a, b) => {
      const aValue = a[sort.field as keyof CustomerComplaint]
      const bValue = b[sort.field as keyof CustomerComplaint]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.direction === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
      }
      return 0
    })
  }, [complaints, sort])

  const sortedTestimonials = useMemo(() => {
    return [...testimonials].sort((a, b) => {
      const aValue = a[sort.field as keyof Testimonial]
      const bValue = b[sort.field as keyof Testimonial]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.direction === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
      }
      return 0
    })
  }, [testimonials, sort])

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const aValue = a[sort.field as keyof Project]
      const bValue = b[sort.field as keyof Project]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.direction === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
      }
      return 0
    })
  }, [projects, sort])

  // Export functions
  const handleExportSurveys = useCallback(() => {
    try {
      const csvData = convertToCSV(sortedSurveys, [
        { key: 'title', label: 'Survey Title' },
        { key: 'surveyType', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'totalResponses', label: 'Responses' },
        { key: 'averageRating', label: 'Avg Rating' },
        { key: 'createdAt', label: 'Created' },
      ])
      downloadFile(csvData, 'customer-satisfaction-surveys.csv', 'text/csv')
      toast.success('Survey data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export survey data')
    }
  }, [sortedSurveys])

  const handleExportComplaints = useCallback(() => {
    try {
      const csvData = convertToCSV(sortedComplaints, [
        { key: 'complaintNumber', label: 'Complaint #' },
        { key: 'customerName', label: 'Customer' },
        { key: 'customerCompany', label: 'Company' },
        { key: 'complaintType', label: 'Type' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'receivedDate', label: 'Received' },
        { key: 'dueDate', label: 'Due Date' },
      ])
      downloadFile(csvData, 'customer-complaints.csv', 'text/csv')
      toast.success('Complaint data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export complaint data')
    }
  }, [sortedComplaints])

  const handleExportTestimonials = useCallback(() => {
    try {
      const csvData = convertToCSV(sortedTestimonials, [
        { key: 'customerName', label: 'Customer' },
        { key: 'customerCompany', label: 'Company' },
        { key: 'projectName', label: 'Project' },
        { key: 'rating', label: 'Rating' },
        { key: 'status', label: 'Status' },
        { key: 'featured', label: 'Featured' },
        { key: 'createdAt', label: 'Created' },
      ])
      downloadFile(csvData, 'customer-testimonials.csv', 'text/csv')
      toast.success('Testimonial data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export testimonial data')
    }
  }, [sortedTestimonials])

  const handleExportProjects = useCallback(() => {
    try {
      const csvData = convertToCSV(sortedProjects, [
        { key: 'projectNumber', label: 'Project #' },
        { key: 'projectName', label: 'Project Name' },
        { key: 'customerName', label: 'Customer' },
        { key: 'customerCompany', label: 'Company' },
        { key: 'projectType', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'value', label: 'Value' },
        { key: 'createdAt', label: 'Created' },
      ])
      downloadFile(csvData, 'customer-projects.csv', 'text/csv')
      toast.success('Project data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export project data')
    }
  }, [sortedProjects])

  // Utility functions
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CLOSED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      ARCHIVED: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      OPEN: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      INVESTIGATING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      RESOLVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      ESCALATED: { color: 'bg-purple-100 text-purple-800', icon: TrendingUp },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: { color: 'bg-green-100 text-green-800' },
      MEDIUM: { color: 'bg-yellow-100 text-yellow-800' },
      HIGH: { color: 'bg-orange-100 text-orange-800' },
      CRITICAL: { color: 'bg-red-100 text-red-800' },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM
    return (
      <Badge className={config.color}>
        {priority}
      </Badge>
    )
  }

  const getSurveyTypeOptions = () => [
    { value: 'GENERAL', label: 'General' },
    { value: 'PRODUCT', label: 'Product' },
    { value: 'SERVICE', label: 'Service' },
    { value: 'SUPPORT', label: 'Support' },
    { value: 'PROJECT', label: 'Project' },
  ]

  const getComplaintTypeOptions = () => [
    { value: 'PRODUCT', label: 'Product' },
    { value: 'SERVICE', label: 'Service' },
    { value: 'BILLING', label: 'Billing' },
    { value: 'DELIVERY', label: 'Delivery' },
    { value: 'SUPPORT', label: 'Support' },
    { value: 'OTHER', label: 'Other' },
  ]

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleItemSelect = (id: string) => {
    setSelectedId(id)
    setShowDetailView(true)
  }

  const handleCalendarEventClick = (eventId: string) => {
    // Extract the base ID and type from the event ID
    const parts = eventId.split('-')
    const type = parts[0] // 'survey', 'complaint', 'testimonial'
    const baseId = parts.slice(1).join('-') // Remove the type prefix
    
    // Set the selected item and open the appropriate form
    setSelectedId(baseId)
    
    if (type === 'survey') {
      setShowSurveyForm(true)
    } else if (type === 'complaint') {
      setShowComplaintForm(true)
    } else if (type === 'testimonial') {
      setShowTestimonialForm(true)
    }
  }

  const handleFormSubmit = () => {
    setShowSurveyForm(false)
    setShowComplaintForm(false)
    setShowTestimonialForm(false)
    fetchSurveys()
    fetchComplaints()
    fetchTestimonials()
    fetchProjects()
  }

  const handleDetailClose = () => {
    setShowDetailView(false)
    setSelectedId(null)
    fetchSurveys()
    fetchComplaints()
    fetchTestimonials()
    fetchProjects()
  }

  if (loading) {
    return (
      <Shell title="Customer Satisfaction" subtitle="Manage surveys and complaints">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell title="Customer Satisfaction" subtitle="Manage surveys, complaints, and testimonials">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Customer Satisfaction</h1>
            <p className="text-slate-600 mt-1">Surveys, complaints, testimonials, and customer feedback</p>
          </div>
          <div className="flex items-center gap-2">
            {viewMode !== 'dashboard' && <ViewToggle view={displayView} onViewChange={setDisplayView} />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowSurveyForm(true)}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Add New Survey
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowComplaintForm(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add New Complaint
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowTestimonialForm(true)}>
                  <Star className="h-4 w-4 mr-2" />
                  Add New Testimonial
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setViewMode(tab.key as ViewMode)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    viewMode === tab.key
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search surveys and complaints..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            
            {viewMode === 'surveys' && (
              <>
                <Select value={filters.surveyType} onValueChange={(value) => handleFilterChange('surveyType', value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {getSurveyTypeOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {viewMode === 'complaints' && (
              <>
                <Select value={filters.complaintType} onValueChange={(value) => handleFilterChange('complaintType', value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {getComplaintTypeOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Priorities</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {viewMode === 'surveys' ? (
                  <>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="ESCALATED">Escalated</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

        {/* Dashboard Tab */}
        {viewMode === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Surveys</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalSurveys}</p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Surveys</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.activeSurveys}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Currently collecting feedback</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Responses</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalResponses}</p>
                  </div>
                  <Users className="h-10 w-10 text-green-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Customer feedback received</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Rating</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.averageRating.toFixed(1)}</p>
                  </div>
                  <Star className="h-10 w-10 text-yellow-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Out of 5 stars</p>
              </div>
            </div>

            {/* Complaint Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Complaints</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalComplaints}</p>
                  </div>
                  <MessageSquare className="h-10 w-10 text-red-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Customer complaints received</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Open Complaints</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats.openComplaints}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Require attention</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Resolved</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.resolvedComplaints}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {stats.totalComplaints > 0 ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0}% resolution rate
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Critical</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats.criticalComplaints}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">High priority issues</p>
              </div>
            </div>

            {/* Testimonial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Testimonials</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalTestimonials}</p>
                  </div>
                  <Star className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Customer testimonials</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Published</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.publishedTestimonials}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Live testimonials</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Featured</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats.featuredTestimonials}</p>
                  </div>
                  <Award className="h-10 w-10 text-purple-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Highlighted testimonials</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Testimonial Rating</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.averageTestimonialRating.toFixed(1)}</p>
                  </div>
                  <Star className="h-10 w-10 text-yellow-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Out of 5 stars</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Surveys</h3>
                <div className="space-y-3">
                  {sortedSurveys.slice(0, 5).map((survey) => (
                    <div 
                      key={survey.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleItemSelect(survey.id)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{survey.title}</div>
                        <div className="text-sm text-gray-500">{survey.surveyType} • {survey.totalResponses} responses</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(survey.status)}
                        {survey.averageRating && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {survey.averageRating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {sortedSurveys.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No surveys yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Complaints</h3>
                <div className="space-y-3">
                  {sortedComplaints.slice(0, 5).map((complaint) => (
                    <div 
                      key={complaint.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleItemSelect(complaint.id)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{complaint.complaintNumber}</div>
                        <div className="text-sm text-gray-500">{complaint.customerName} • {complaint.complaintType}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(complaint.priority)}
                        {getStatusBadge(complaint.status)}
                      </div>
                    </div>
                  ))}
                  {sortedComplaints.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No complaints yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Feedback Tab */}
        {viewMode === 'all-feedback' && (
          <div className="space-y-6">
            {displayView === 'list' && (
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title/Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Surveys */}
                      {sortedSurveys.map((survey) => (
                        <tr key={`survey-${survey.id}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              Survey
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{survey.title}</div>
                            <div className="text-sm text-gray-500">{survey.surveyType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(survey.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {survey.averageRating ? (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">{survey.averageRating.toFixed(1)}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(survey.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleItemSelect(survey.id)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      
                      {/* Complaints */}
                      {sortedComplaints.map((complaint) => (
                        <tr key={`complaint-${complaint.id}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Complaint
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{complaint.complaintNumber}</div>
                            <div className="text-sm text-gray-500">{complaint.complaintType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{complaint.customerName}</div>
                            <div className="text-sm text-gray-500">{complaint.customerCompany}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(complaint.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getPriorityBadge(complaint.priority)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">-</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(complaint.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleItemSelect(complaint.id)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      
                      {/* Testimonials */}
                      {sortedTestimonials.map((testimonial) => (
                        <tr key={`testimonial-${testimonial.id}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <Star className="h-3 w-3 mr-1" />
                              Testimonial
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{testimonial.projectName}</div>
                            <div className="text-sm text-gray-500">{testimonial.projectType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{testimonial.customerName}</div>
                            <div className="text-sm text-gray-500">{testimonial.customerCompany}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(testimonial.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium">{testimonial.rating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(testimonial.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleItemSelect(testimonial.id)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {displayView === 'board' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                    Surveys
                  </h3>
                  {sortedSurveys.map((survey) => (
                    <div key={survey.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">{survey.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{survey.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{survey.surveyType}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleItemSelect(survey.id)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    Complaints
                  </h3>
                  {sortedComplaints.map((complaint) => (
                    <div key={complaint.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">{complaint.complaintNumber}</h4>
                      <p className="text-sm text-gray-600 mb-3">{complaint.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{complaint.customerName}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleItemSelect(complaint.id)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    Testimonials
                  </h3>
                  {sortedTestimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">{testimonial.projectName}</h4>
                      <p className="text-sm text-gray-600 mb-3">{testimonial.testimonialText}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{testimonial.customerName}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleItemSelect(testimonial.id)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {displayView === 'calendar' && (
              <div className="bg-white rounded-lg border overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {calendarViewMode === 'daily' && currentDate.toLocaleDateString('en-US', { 
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                      {calendarViewMode === 'weekly' && `Week of ${getWeekDays()[0].toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric' 
                      })}`}
                      {calendarViewMode === 'monthly' && currentMonth.toLocaleDateString('en-US', { 
                        month: 'long', year: 'numeric' 
                      })}
                    </h3>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={calendarViewMode === 'daily' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCalendarViewMode('daily')}
                        className="text-xs"
                      >
                        Daily
                      </Button>
                      <Button
                        variant={calendarViewMode === 'weekly' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCalendarViewMode('weekly')}
                        className="text-xs"
                      >
                        Weekly
                      </Button>
                      <Button
                        variant={calendarViewMode === 'monthly' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCalendarViewMode('monthly')}
                        className="text-xs"
                      >
                        Monthly
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (calendarViewMode === 'daily') {
                          setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))
                        } else if (calendarViewMode === 'weekly') {
                          setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
                        } else {
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                        }
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const now = new Date()
                        setCurrentDate(now)
                        setCurrentMonth(now)
                      }}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (calendarViewMode === 'daily') {
                          setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))
                        } else if (calendarViewMode === 'weekly') {
                          setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
                        } else {
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                        }
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Daily View */}
                {calendarViewMode === 'daily' && (
                  <div className="p-4">
                    <div className="flex gap-1">
                      {/* Hour labels */}
                      <div className="w-16 flex-shrink-0">
                        {Array.from({ length: 24 }, (_, i) => (
                          <div key={i} className="h-12 text-xs text-gray-500 text-right pr-2 pt-1">
                            {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                          </div>
                        ))}
                      </div>
                      
                      {/* Events grid */}
                      <div className="flex-1">
                        {Array.from({ length: 24 }, (_, hour) => {
                          const hourlyEvents = getHourlyEvents()[hour] || []
                          return (
                            <div key={hour} className="h-12 border-b border-gray-100 relative">
                              {hourlyEvents.map((event, index) => (
                                <div
                                  key={event.id}
                                  className={`absolute left-0 right-0 top-0 bottom-0 m-1 p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                                    event.type === 'survey' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                    event.type === 'complaint' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                    'bg-green-100 text-green-800 hover:bg-green-200'
                                  }`}
                                  onClick={() => handleCalendarEventClick(event.id)}
                                  title={`Click to edit ${event.type}`}
                                >
                                  <div className="font-medium truncate">{event.title}</div>
                                  <div className="text-xs opacity-75">
                                    {new Date(event.date).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', minute: '2-digit' 
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Weekly View */}
                {calendarViewMode === 'weekly' && (
                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {getWeekDays().map((day, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm font-medium text-gray-500 mb-1">
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className={`text-lg font-semibold p-2 rounded ${
                            day.toDateString() === new Date().toDateString() 
                              ? 'bg-blue-500 text-white' 
                              : 'text-gray-900'
                          }`}>
                            {day.getDate()}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getWeekDays().map((day, dayIndex) => {
                        const events = getWeekEvents()[dayIndex] || []
                        return (
                          <div key={dayIndex} className="min-h-[200px] border rounded p-2">
                            <div className="space-y-1">
                              {events.map(event => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                                    event.type === 'survey' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                    event.type === 'complaint' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                    'bg-green-100 text-green-800 hover:bg-green-200'
                                  }`}
                                  onClick={() => handleCalendarEventClick(event.id)}
                                  title={`Click to edit ${event.type}`}
                                >
                                  <div className="font-medium truncate">{event.title}</div>
                                  <div className="text-xs opacity-75">
                                    {new Date(event.date).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', minute: '2-digit' 
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Monthly View */}
                {calendarViewMode === 'monthly' && (
                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getCalendarDays().map((day, index) => {
                        const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
                        const isToday = day.toDateString() === new Date().toDateString()
                        const events = getEventsForDate(day)
                        
                        return (
                          <div
                            key={index}
                            className={`min-h-[100px] p-2 border rounded ${
                              isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                            } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                          >
                            <div className={`text-sm font-medium mb-1 ${
                              isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                            } ${isToday ? 'text-blue-600' : ''}`}>
                              {day.getDate()}
                            </div>
                            <div className="space-y-1">
                              {events.slice(0, 3).map(event => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded cursor-pointer truncate hover:opacity-80 transition-opacity ${
                                    event.type === 'survey' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                    event.type === 'complaint' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                    'bg-green-100 text-green-800 hover:bg-green-200'
                                  }`}
                                  onClick={() => handleCalendarEventClick(event.id)}
                                  title={`Click to edit ${event.type}`}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {events.length > 3 && (
                                <div className="text-xs text-gray-500">
                                  +{events.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      {/* Surveys View */}
      {viewMode === 'surveys' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Survey Title
                      {sort.field === 'title' && (
                        sort.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedSurveys.map((survey) => (
                  <tr 
                    key={survey.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleItemSelect(survey.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{survey.title}</div>
                      {survey.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{survey.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">{survey.surveyType}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(survey.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {survey.totalResponses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {survey.averageRating ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{survey.averageRating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(survey.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleItemSelect(survey.id)
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complaints View */}
      {viewMode === 'complaints' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('complaintNumber')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Complaint #
                      {sort.field === 'complaintNumber' && (
                        sort.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedComplaints.map((complaint) => (
                  <tr 
                    key={complaint.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleItemSelect(complaint.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{complaint.complaintNumber}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{complaint.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{complaint.customerName}</div>
                      {complaint.customerCompany && (
                        <div className="text-sm text-gray-500">{complaint.customerCompany}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">{complaint.complaintType}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(complaint.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(complaint.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(complaint.receivedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.dueDate ? formatDate(complaint.dueDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleItemSelect(complaint.id)
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Survey Response Trends</h3>
              <div className="text-center py-8 text-gray-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Survey analytics coming soon</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Complaint Resolution Times</h3>
              <div className="text-center py-8 text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <p>Resolution analytics coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {showSurveyForm && (
        <SurveyForm
          onClose={() => setShowSurveyForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {showComplaintForm && (
        <ComplaintForm
          onClose={() => setShowComplaintForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {showTestimonialForm && (
        <TestimonialForm
          onClose={() => setShowTestimonialForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
      </div>
    </Shell>
  )
}
