'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface WasteDisposalFacility {
  id: string
  name: string
  facilityType: string
  address?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  licenseNumber?: string
  licenseExpiry?: string
  acceptedWasteTypes?: string
  isActive: boolean
}

interface FacilityFormProps {
  facility?: WasteDisposalFacility | null
  onSubmit: () => void
  onCancel: () => void
}

export function FacilityForm({ facility, onSubmit, onCancel }: FacilityFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    facilityType: 'LANDFILL',
    address: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    licenseNumber: '',
    licenseExpiry: '',
    acceptedWasteTypes: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name,
        facilityType: facility.facilityType,
        address: facility.address || '',
        contactPerson: facility.contactPerson || '',
        contactPhone: facility.contactPhone || '',
        contactEmail: facility.contactEmail || '',
        licenseNumber: facility.licenseNumber || '',
        licenseExpiry: facility.licenseExpiry ? facility.licenseExpiry.split('T')[0] : '',
        acceptedWasteTypes: facility.acceptedWasteTypes || '',
        isActive: facility.isActive,
      })
    }
  }, [facility])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        address: formData.address || undefined,
        contactPerson: formData.contactPerson || undefined,
        contactPhone: formData.contactPhone || undefined,
        contactEmail: formData.contactEmail || undefined,
        licenseNumber: formData.licenseNumber || undefined,
        licenseExpiry: formData.licenseExpiry ? new Date(formData.licenseExpiry).toISOString() : undefined,
        acceptedWasteTypes: formData.acceptedWasteTypes || undefined,
      }

      const url = facility 
        ? `/api/waste-management/facilities/${facility.id}`
        : '/api/waste-management/facilities'
      
      const method = facility ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save facility')
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
          <CardTitle>Facility Information</CardTitle>
          <CardDescription>Add or update disposal facility details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Facility Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Green Valley Landfill"
              required
            />
          </div>

          <div>
            <Label htmlFor="facilityType">Facility Type *</Label>
            <Select value={formData.facilityType} onValueChange={(value) => setFormData({ ...formData, facilityType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LANDFILL">Landfill</SelectItem>
                <SelectItem value="INCINERATION">Incineration</SelectItem>
                <SelectItem value="RECYCLING">Recycling</SelectItem>
                <SelectItem value="TREATMENT">Treatment</SelectItem>
                <SelectItem value="COMPOSTING">Composting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full facility address..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Contact person name"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="email@facility.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="Facility license number"
              />
            </div>
            <div>
              <Label htmlFor="licenseExpiry">License Expiry</Label>
              <Input
                id="licenseExpiry"
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="acceptedWasteTypes">Accepted Waste Types</Label>
            <Textarea
              id="acceptedWasteTypes"
              value={formData.acceptedWasteTypes}
              onChange={(e) => setFormData({ ...formData, acceptedWasteTypes: e.target.value })}
              placeholder="List of accepted waste types (one per line)..."
              rows={3}
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
          {loading ? 'Saving...' : facility ? 'Update Facility' : 'Create Facility'}
        </Button>
      </div>
    </form>
  )
}
