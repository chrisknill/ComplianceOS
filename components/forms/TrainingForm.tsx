'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Upload, FileText, X } from 'lucide-react'

interface TrainingFormProps {
  open: boolean
  onClose: () => void
  record?: any
  users: any[]
  courses: any[]
  onSave: () => void
}

export function TrainingForm({ open, onClose, record, users, courses, onSave }: TrainingFormProps) {
  const [formData, setFormData] = useState({
    userId: record?.userId || '',
    courseId: record?.courseId || '',
    status: record?.status || 'NOT_STARTED',
    dueDate: record?.dueDate ? new Date(record.dueDate).toISOString().split('T')[0] : '',
    completed: record?.completed ? new Date(record.completed).toISOString().split('T')[0] : '',
    score: record?.score?.toString() || '',
    documentUrl: record?.documentUrl || '',
    documentName: record?.documentName || '',
    notes: record?.notes || '',
  })

  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  useEffect(() => {
    if (record) {
      setFormData({
        userId: record.userId || '',
        courseId: record.courseId || '',
        status: record.status || 'NOT_STARTED',
        dueDate: record.dueDate ? new Date(record.dueDate).toISOString().split('T')[0] : '',
        completed: record.completed ? new Date(record.completed).toISOString().split('T')[0] : '',
        score: record.score?.toString() || '',
        documentUrl: record.documentUrl || '',
        documentName: record.documentName || '',
        notes: record.notes || '',
      })
    } else {
      setFormData({
        userId: '',
        courseId: '',
        status: 'NOT_STARTED',
        dueDate: '',
        completed: '',
        score: '',
        documentUrl: '',
        documentName: '',
        notes: '',
      })
    }
    setUploadedFile(null)
  }, [record, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      
      // Check file type (PDFs, images, docs)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, images, and Word documents are allowed')
        return
      }
      
      setUploadedFile(file)
      setFormData({ 
        ...formData, 
        documentName: file.name 
      })
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setFormData({ 
      ...formData, 
      documentUrl: '',
      documentName: '' 
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let documentUrl = formData.documentUrl
      let documentName = formData.documentName

      // Handle file upload if there's a new file
      if (uploadedFile) {
        // In a real implementation, you would upload to a cloud storage service
        // For now, we'll create a simulated URL with the file name
        // In production, replace this with actual file upload logic (S3, Azure Blob, etc.)
        
        const formDataUpload = new FormData()
        formDataUpload.append('file', uploadedFile)
        
        // Simulate file upload - in production, uncomment and configure:
        // const uploadResponse = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formDataUpload,
        // })
        // const uploadData = await uploadResponse.json()
        // documentUrl = uploadData.url
        
        // For now, use a simulated URL
        documentUrl = `/uploads/training/${Date.now()}-${uploadedFile.name}`
        documentName = uploadedFile.name
      }

      const method = record?.id ? 'PUT' : 'POST'
      const url = record?.id ? `/api/training/${record.id}` : '/api/training'

      const payload = {
        userId: formData.userId,
        courseId: formData.courseId,
        status: formData.status,
        dueDate: formData.dueDate || null,
        completed: formData.completed || null,
        score: formData.score ? parseInt(formData.score) : null,
        documentUrl: documentUrl || null,
        documentName: documentName || null,
        notes: formData.notes || null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save training record')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving training record:', error)
      alert('Failed to save training record')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!record?.id) return
    if (!confirm('Are you sure you want to delete this training record?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/training/${record.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete training record')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error deleting training record:', error)
      alert('Failed to delete training record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{record?.id ? 'Edit' : 'Add'} Training Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userId">Employee *</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) => setFormData({ ...formData, userId: value })}
              disabled={!!record?.userId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="courseId">Course *</Label>
            <Select
              value={formData.courseId}
              onValueChange={(value) => setFormData({ ...formData, courseId: value })}
              disabled={!!record?.courseId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title} {course.mandatory && '(Mandatory)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETE">Complete</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="completed">Completed Date</Label>
              <Input
                id="completed"
                type="date"
                value={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="score">Score (%)</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              placeholder="0-100"
            />
          </div>

          {/* Document Upload */}
          <div className="border-t border-slate-200 pt-4">
            <Label htmlFor="document">Training Certificate / Evidence</Label>
            <p className="text-xs text-slate-500 mb-2">
              Upload completion certificate, attendance record, or other evidence (PDF, JPG, PNG, DOC - Max 10MB)
            </p>
            
            {/* Existing document */}
            {formData.documentUrl && !uploadedFile && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{formData.documentName || 'Document'}</p>
                  <a 
                    href={formData.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View document →
                  </a>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* New upload */}
            {uploadedFile && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg mb-3">
                <FileText className="h-5 w-5 text-emerald-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-900">{uploadedFile.name}</p>
                  <p className="text-xs text-emerald-700">
                    {(uploadedFile.size / 1024).toFixed(1)} KB - Ready to upload
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Upload button */}
            {!uploadedFile && (
              <div className="relative">
                <input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="document"
                  className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Upload className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    {formData.documentUrl ? 'Replace document' : 'Upload document'}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes, training provider, location, etc."
              rows={3}
            />
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {record?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !formData.userId || !formData.courseId}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

