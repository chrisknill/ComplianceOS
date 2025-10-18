'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface WasteRecord {
  id: string
  recordNumber: string
  wasteTypeId: string
  quantity: number
  unit: string
  location: string
  generatedBy: string
  generatedDate: string
  storedDate?: string
  disposalDate?: string
  disposalMethod: string
  disposalFacility?: string
  transporter?: string
  manifestNumber?: string
  cost?: number
  status: string
  notes?: string
  attachments?: string
}

interface WasteType {
  id: string
  name: string
  category: string
  disposalMethod?: string
}

interface WasteDisposalFacility {
  id: string
  name: string
  facilityType: string
}

interface WasteTransporter {
  id: string
  name: string
}

interface WasteRecordFormProps {
  wasteRecord?: WasteRecord | null
  wasteTypes: WasteType[]
  facilities: WasteDisposalFacility[]
  transporters: WasteTransporter[]
  onSubmit: () => void
  onCancel: () => void
}

export function WasteRecordForm({
  wasteRecord,
  wasteTypes,
  facilities,
  transporters,
  onSubmit,
  onCancel,
}: WasteRecordFormProps) {
  const [formData, setFormData] = useState({
    wasteTypeId: '',
    quantity: '',
    unit: 'KG',
    location: '',
    generatedBy: '',
    generatedDate: new Date().toISOString().split('T')[0],
    storedDate: '',
    disposalDate: '',
    disposalMethod: '',
    disposalFacility: '',
    transporter: '',
    manifestNumber: '',
    cost: '',
    status: 'GENERATED',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (wasteRecord) {
      setFormData({
        wasteTypeId: wasteRecord.wasteTypeId,
        quantity: wasteRecord.quantity.toString(),
        unit: wasteRecord.unit,
        location: wasteRecord.location,
        generatedBy: wasteRecord.generatedBy,
        generatedDate: wasteRecord.generatedDate.split('T')[0],
        storedDate: wasteRecord.storedDate ? wasteRecord.storedDate.split('T')[0] : '',
        disposalDate: wasteRecord.disposalDate ? wasteRecord.disposalDate.split('T')[0] : '',
        disposalMethod: wasteRecord.disposalMethod,
        disposalFacility: wasteRecord.disposalFacility || '',
        transporter: wasteRecord.transporter || '',
        manifestNumber: wasteRecord.manifestNumber || '',
        cost: wasteRecord.cost ? wasteRecord.cost.toString() : '',
        status: wasteRecord.status,
        notes: wasteRecord.notes || '',
      })
    }
  }, [wasteRecord])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        generatedDate: new Date(formData.generatedDate).toISOString(),
        storedDate: formData.storedDate ? new Date(formData.storedDate).toISOString() : undefined,
        disposalDate: formData.disposalDate ? new Date(formData.disposalDate).toISOString() : undefined,
      }

      const url = wasteRecord 
        ? `/api/waste-management/records/${wasteRecord.id}`
        : '/api/waste-management/records'
      
      const method = wasteRecord ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save waste record')
      }

      onSubmit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const selectedWasteType = wasteTypes.find(wt => wt.id === formData.wasteTypeId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Waste record details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="wasteTypeId">Waste Type *</Label>
              <Select value={formData.wasteTypeId} onValueChange={(value) => setFormData({ ...formData, wasteTypeId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit *</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KG">KG</SelectItem>
                    <SelectItem value="LITERS">Liters</SelectItem>
                    <SelectItem value="CUBIC_METERS">Cubic Meters</SelectItem>
                    <SelectItem value="PIECES">Pieces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Where was the waste generated?"
                required
              />
            </div>

            <div>
              <Label htmlFor="generatedBy">Generated By *</Label>
              <Input
                id="generatedBy"
                value={formData.generatedBy}
                onChange={(e) => setFormData({ ...formData, generatedBy: e.target.value })}
                placeholder="Department or person"
                required
              />
            </div>

            <div>
              <Label htmlFor="generatedDate">Generated Date *</Label>
              <Input
                id="generatedDate"
                type="date"
                value={formData.generatedDate}
                onChange={(e) => setFormData({ ...formData, generatedDate: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Disposal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Disposal Information</CardTitle>
            <CardDescription>How and where the waste will be disposed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="disposalMethod">Disposal Method *</Label>
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
              <Label htmlFor="disposalFacility">Disposal Facility</Label>
              <Select value={formData.disposalFacility} onValueChange={(value) => setFormData({ ...formData, disposalFacility: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.id} value={facility.name}>
                      {facility.name} ({facility.facilityType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transporter">Transporter</Label>
              <Select value={formData.transporter} onValueChange={(value) => setFormData({ ...formData, transporter: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transporter" />
                </SelectTrigger>
                <SelectContent>
                  {transporters.map((transporter) => (
                    <SelectItem key={transporter.id} value={transporter.name}>
                      {transporter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="manifestNumber">Manifest Number</Label>
              <Input
                id="manifestNumber"
                value={formData.manifestNumber}
                onChange={(e) => setFormData({ ...formData, manifestNumber: e.target.value })}
                placeholder="Waste manifest number"
              />
            </div>

            <div>
              <Label htmlFor="cost">Disposal Cost</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERATED">Generated</SelectItem>
                  <SelectItem value="STORED">Stored</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="DISPOSED">Disposed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Additional notes and dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storedDate">Stored Date</Label>
              <Input
                id="storedDate"
                type="date"
                value={formData.storedDate}
                onChange={(e) => setFormData({ ...formData, storedDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="disposalDate">Disposal Date</Label>
              <Input
                id="disposalDate"
                type="date"
                value={formData.disposalDate}
                onChange={(e) => setFormData({ ...formData, disposalDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this waste record..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : wasteRecord ? 'Update Record' : 'Create Record'}
        </Button>
      </div>
    </form>
  )
}
