'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface WasteType {
  id: string
  name: string
  description?: string
  category: string
  hazardClass?: string
  disposalMethod?: string
  regulatoryCode?: string
  isActive: boolean
}

interface WasteTypeFormProps {
  wasteType?: WasteType | null
  onSubmit: () => void
  onCancel: () => void
}

export function WasteTypeForm({ wasteType, onSubmit, onCancel }: WasteTypeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'NON_HAZARDOUS',
    hazardClass: '',
    disposalMethod: '',
    regulatoryCode: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (wasteType) {
      setFormData({
        name: wasteType.name,
        description: wasteType.description || '',
        category: wasteType.category,
        hazardClass: wasteType.hazardClass || '',
        disposalMethod: wasteType.disposalMethod || '',
        regulatoryCode: wasteType.regulatoryCode || '',
        isActive: wasteType.isActive,
      })
    }
  }, [wasteType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        hazardClass: formData.hazardClass || undefined,
        disposalMethod: formData.disposalMethod || undefined,
        regulatoryCode: formData.regulatoryCode || undefined,
      }

      const url = wasteType 
        ? `/api/waste-management/types/${wasteType.id}`
        : '/api/waste-management/types'
      
      const method = wasteType ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save waste type')
      }

      onSubmit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Waste Type Information</CardTitle>
          <CardDescription>Define a new waste type for tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Used Oil, Paper Waste, Electronic Waste"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of this waste type..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HAZARDOUS">Hazardous</SelectItem>
                <SelectItem value="NON_HAZARDOUS">Non-Hazardous</SelectItem>
                <SelectItem value="RECYCLABLE">Recyclable</SelectItem>
                <SelectItem value="ORGANIC">Organic</SelectItem>
                <SelectItem value="ELECTRONIC">Electronic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.category === 'HAZARDOUS' && (
            <div>
              <Label htmlFor="hazardClass">Hazard Class</Label>
              <Input
                id="hazardClass"
                value={formData.hazardClass}
                onChange={(e) => setFormData({ ...formData, hazardClass: e.target.value })}
                placeholder="e.g., Class 3 - Flammable Liquids"
              />
            </div>
          )}

          <div>
            <Label htmlFor="disposalMethod">Preferred Disposal Method</Label>
            <Select value={formData.disposalMethod} onValueChange={(value) => setFormData({ ...formData, disposalMethod: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select disposal method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LANDFILL">Landfill</SelectItem>
                <SelectItem value="INCINERATION">Incineration</SelectItem>
                <SelectItem value="RECYCLING">Recycling</SelectItem>
                <SelectItem value="COMPOSTING">Composting</SelectItem>
                <SelectItem value="TREATMENT">Treatment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="regulatoryCode">Regulatory Code</Label>
            <Input
              id="regulatoryCode"
              value={formData.regulatoryCode}
              onChange={(e) => setFormData({ ...formData, regulatoryCode: e.target.value })}
              placeholder="e.g., EPA Code, DOT Code"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : wasteType ? 'Update Type' : 'Create Type'}
        </Button>
      </div>
    </form>
  )
}
