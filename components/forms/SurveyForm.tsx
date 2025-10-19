'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'

interface SurveyFormData {
  title: string
  description: string
  surveyType: string
  targetAudience: string
  startDate: string
  endDate: string
  questions: QuestionData[]
}

interface QuestionData {
  id: string
  questionText: string
  questionType: string
  options: string[]
  required: boolean
  order: number
  weight: number
}

interface SurveyFormProps {
  onClose: () => void
  onSubmit: () => void
  surveyId?: string
}

export function SurveyForm({ onClose, onSubmit, surveyId }: SurveyFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<SurveyFormData>({
    title: '',
    description: '',
    surveyType: 'GENERAL',
    targetAudience: '',
    startDate: '',
    endDate: '',
    questions: []
  })

  const questionTypes = [
    { value: 'RATING', label: 'Rating (1-5)' },
    { value: 'NPS', label: 'Net Promoter Score (0-10)' },
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
    { value: 'YES_NO', label: 'Yes/No' },
    { value: 'TEXT', label: 'Text Response' },
  ]

  const surveyTypes = [
    { value: 'GENERAL', label: 'General' },
    { value: 'PRODUCT', label: 'Product' },
    { value: 'SERVICE', label: 'Service' },
    { value: 'SUPPORT', label: 'Support' },
    { value: 'PROJECT', label: 'Project' },
  ]

  const addQuestion = () => {
    const newQuestion: QuestionData = {
      id: `q_${Date.now()}`,
      questionText: '',
      questionType: 'RATING',
      options: [],
      required: true,
      order: formData.questions.length,
      weight: 1.0
    }
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  const updateQuestion = (questionId: string, field: keyof QuestionData, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }))
  }

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      const questions = [...prev.questions]
      const index = questions.findIndex(q => q.id === questionId)
      
      if (direction === 'up' && index > 0) {
        [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]]
      } else if (direction === 'down' && index < questions.length - 1) {
        [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]]
      }
      
      // Update order numbers
      questions.forEach((q, i) => {
        q.order = i
      })
      
      return { ...prev, questions }
    })
  }

  const addOption = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    }))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map((opt, i) => i === optionIndex ? value : opt)
            }
          : q
      )
    }))
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.filter((_, i) => i !== optionIndex)
            }
          : q
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Survey title is required')
      return
    }

    if (formData.questions.length === 0) {
      toast.error('At least one question is required')
      return
    }

    setLoading(true)
    
    try {
      const url = surveyId ? `/api/customer-satisfaction/surveys/${surveyId}` : '/api/customer-satisfaction/surveys'
      const method = surveyId ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        questions: formData.questions.map(q => ({
          ...q,
          options: q.questionType === 'MULTIPLE_CHOICE' ? q.options : undefined
        }))
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
        toast.success(surveyId ? 'Survey updated successfully' : 'Survey created successfully')
        onSubmit()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save survey')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {surveyId ? 'Edit Survey' : 'Create New Survey'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Survey Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Survey Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter survey title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surveyType">Survey Type</Label>
                  <Select value={formData.surveyType} onValueChange={(value) => setFormData(prev => ({ ...prev, surveyType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {surveyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the purpose of this survey"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="e.g., VIP customers, new customers"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Survey Questions</h3>
                <Button type="button" variant="outline" onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-4">
                {formData.questions.map((question, index) => (
                  <Card key={question.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveQuestion(question.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveQuestion(question.id, 'down')}
                            disabled={index === formData.questions.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Question Text *</Label>
                          <Input
                            value={question.questionText}
                            onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                            placeholder="Enter your question"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select value={question.questionType} onValueChange={(value) => updateQuestion(question.id, 'questionType', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {questionTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Multiple Choice Options */}
                      {question.questionType === 'MULTIPLE_CHOICE' && (
                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(question.id, optionIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(question.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`required-${question.id}`}
                            checked={question.required}
                            onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <Label htmlFor={`required-${question.id}`}>Required</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`weight-${question.id}`}>Weight:</Label>
                          <Input
                            id={`weight-${question.id}`}
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="5"
                            value={question.weight}
                            onChange={(e) => updateQuestion(question.id, 'weight', parseFloat(e.target.value))}
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {formData.questions.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Plus className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No questions added yet</p>
                    <p className="text-xs">Click &quot;Add Question&quot; to get started</p>
                  </div>
                )}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {surveyId ? 'Update Survey' : 'Create Survey'}
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
