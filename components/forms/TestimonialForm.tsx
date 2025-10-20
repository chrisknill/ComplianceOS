'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Save, Star, Building2, User, Mail, Calendar, Tag, Paperclip } from 'lucide-react'
import { toast } from 'sonner'

interface TestimonialFormData {
  customerName: string
  customerEmail: string
  customerCompany: string
  customerTitle: string
  projectName: string
  projectType: string
  testimonialText: string
  rating: number
  status: string
  featured: boolean
  tags: string[]
}

interface TestimonialFormProps {
  onClose: () => void
  onSubmit: () => void
  testimonialId?: string
  projectId?: string
}

export function TestimonialForm({ onClose, onSubmit, testimonialId, projectId }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<TestimonialFormData>({
    customerName: '',
    customerEmail: '',
    customerCompany: '',
    customerTitle: '',
    projectName: '',
    projectType: 'COMPLETED',
    testimonialText: '',
    rating: 5,
    status: 'DRAFT',
    featured: false,
    tags: []
  })

  const projectTypes = [
    { value: 'COMPLETED', label: 'Completed Project' },
    { value: 'ONGOING', label: 'Ongoing Project' },
    { value: 'MAINTENANCE', label: 'Maintenance Service' },
  ]

  const statuses = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'REJECTED', label: 'Rejected' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerName.trim()) {
      toast.error('Customer name is required')
      return
    }

    if (formData.rating < 1 || formData.rating > 5) {
      toast.error('Rating must be between 1 and 5')
      return
    }

    setLoading(true)
    
    try {
      // Use webhook endpoint for new testimonials, regular API for edits
      const url = testimonialId 
        ? `/api/customer-satisfaction/testimonials/${testimonialId}` 
        : '/api/customer-satisfaction/testimonials/webhook'
      const method = testimonialId ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        projectId: projectId || undefined,
        tags: JSON.stringify(formData.tags)
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        
        if (testimonialId) {
          toast.success('Testimonial updated successfully')
        } else {
          toast.success('Testimonial form submitted successfully! It will be sent to the customer via email.')
        }
        onSubmit()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit testimonial')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof TestimonialFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    const tag = prompt('Enter a tag:')
    if (tag && tag.trim()) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag.trim()] }))
    }
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }))
  }

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleInputChange('rating', star)}
            className={`p-1 transition-colors ${
              star <= formData.rating 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className={`h-6 w-6 ${star <= formData.rating ? 'fill-current' : ''}`} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating} star{formData.rating !== 1 ? 's' : ''}
        </span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {testimonialId ? 'Edit Testimonial' : 'Create New Testimonial'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerCompany">Company</Label>
                  <Input
                    id="customerCompany"
                    value={formData.customerCompany}
                    onChange={(e) => handleInputChange('customerCompany', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerTitle">Job Title</Label>
                  <Input
                    id="customerTitle"
                    value={formData.customerTitle}
                    onChange={(e) => handleInputChange('customerTitle', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Project Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    placeholder="Project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Star className="h-5 w-5" />
                Testimonial Content
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rating *</Label>
                  {renderStars()}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonialText">Testimonial Text (Optional)</Label>
                  <Textarea
                    id="testimonialText"
                    value={formData.testimonialText}
                    onChange={(e) => handleInputChange('testimonialText', e.target.value)}
                    placeholder="Leave blank to send to customer for completion..."
                    rows={6}
                  />
                  <p className="text-sm text-gray-600">
                    💡 Leave this blank to send the form to the customer for completion via email
                  </p>
                </div>
              </div>
            </div>

            {/* Status and Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status and Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="featured">Featured Testimonial</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {testimonialId ? 'Updating...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {testimonialId ? 'Update Testimonial' : 'Send to Customer'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
