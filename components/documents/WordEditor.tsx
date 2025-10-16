'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, ExternalLink, Download, FileEdit, 
  History, Lock, Unlock, MessageSquare, Users 
} from 'lucide-react'
import { getOfficeOnlineEditUrl, getOfficeOnlineViewUrl, getWordDesktopUrl } from '@/lib/microsoft'

interface WordEditorProps {
  open: boolean
  onClose: () => void
  document: {
    id: string
    title: string
    code?: string
    url?: string
    sharepointId?: string
    driveId?: string
    status: string
    trackChanges?: boolean
    lastEditedBy?: string
    lastEditedAt?: Date
    commentsCount?: number
  }
  onRefresh: () => void
}

export function WordEditor({ open, onClose, document, onRefresh }: WordEditorProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isCheckedOut, setIsCheckedOut] = useState(false)
  const [showVersions, setShowVersions] = useState(false)

  // For demo purposes - in production, these would come from API
  const versions = [
    { version: '3.0', date: '2025-10-14', author: 'John Doe', comment: 'Updated section 4.2' },
    { version: '2.0', date: '2025-09-15', author: 'Jane Smith', comment: 'Annual review' },
    { version: '1.0', date: '2025-01-10', author: 'Admin', comment: 'Initial version' },
  ]

  const handleEditInBrowser = () => {
    if (!document.url) {
      alert('No SharePoint URL configured for this document')
      return
    }
    
    const editUrl = getOfficeOnlineEditUrl(document.url)
    window.open(editUrl, '_blank', 'width=1200,height=800')
  }

  const handleOpenInWord = () => {
    if (!document.url) {
      alert('No SharePoint URL configured for this document')
      return
    }
    
    const desktopUrl = getWordDesktopUrl(document.url)
    window.location.href = desktopUrl
  }

  const handleViewOnly = () => {
    if (!document.url) {
      alert('No SharePoint URL configured for this document')
      return
    }
    
    const viewUrl = getOfficeOnlineViewUrl(document.url)
    window.open(viewUrl, '_blank', 'width=1200,height=800')
  }

  const handleCheckOut = async () => {
    setIsCheckingOut(true)
    // In production: call /api/documents/[id]/checkout
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsCheckedOut(true)
    setIsCheckingOut(false)
    alert('Document checked out - you can now edit')
  }

  const handleCheckIn = async () => {
    const comment = prompt('Enter check-in comment:')
    if (!comment) return
    
    setIsCheckingOut(true)
    // In production: call /api/documents/[id]/checkin
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsCheckedOut(false)
    setIsCheckingOut(false)
    alert('Document checked in successfully')
    onRefresh()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Edit Document in Microsoft Word
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{document.title}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {document.code} • Version {document.code ? document.code.split('-').pop() : '1.0'}
                </p>
              </div>
              <Badge variant={document.status === 'APPROVED' ? 'default' : 'secondary'}>
                {document.status.replace('_', ' ')}
              </Badge>
            </div>

            {document.lastEditedBy && (
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                <p>Last edited by: {document.lastEditedBy}</p>
                {document.lastEditedAt && (
                  <p>Last edited: {new Date(document.lastEditedAt).toLocaleString()}</p>
                )}
              </div>
            )}
          </div>

          {/* Track Changes Notice */}
          {document.trackChanges && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Track Changes Enabled</p>
                  <p className="text-xs text-blue-700 mt-1">
                    All edits will be tracked and reviewable. Track Changes cannot be disabled for compliance.
                  </p>
                  {document.commentsCount && document.commentsCount > 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      📝 {document.commentsCount} comments/changes pending review
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Editing Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Choose how to edit:</h3>

            {/* Edit in Browser */}
            <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-slate-900">Edit in Browser</h4>
                    <Badge variant="outline" className="text-xs">Recommended</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    Edit using Microsoft Word Online in your browser. Best for quick edits and collaboration.
                  </p>
                  <ul className="text-xs text-slate-500 mt-2 ml-4 list-disc space-y-1">
                    <li>No software installation required</li>
                    <li>Real-time co-authoring supported</li>
                    <li>Track changes automatically enabled</li>
                    <li>Auto-saves to SharePoint</li>
                  </ul>
                </div>
                <Button onClick={handleEditInBrowser} className="ml-4">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Edit Online
                </Button>
              </div>
            </div>

            {/* Open in Desktop Word */}
            <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileEdit className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium text-slate-900">Open in Desktop Word</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    Open in Microsoft Word desktop app for advanced features and offline editing.
                  </p>
                  <ul className="text-xs text-slate-500 mt-2 ml-4 list-disc space-y-1">
                    <li>Full Word features available</li>
                    <li>Works offline (syncs when online)</li>
                    <li>Advanced formatting tools</li>
                    <li>Requires Word desktop installed</li>
                  </ul>
                </div>
                <Button onClick={handleOpenInWord} variant="outline" className="ml-4">
                  <FileEdit className="h-4 w-4 mr-2" />
                  Open in Word
                </Button>
              </div>
            </div>

            {/* View Only */}
            <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    <h4 className="font-medium text-slate-900">View Only (Read-Only)</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    Preview the document without making changes. Safe for reviewers.
                  </p>
                </div>
                <Button onClick={handleViewOnly} variant="ghost" className="ml-4">
                  <FileText className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>

          {/* Document Control */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <h3 className="font-semibold text-slate-900">Document Control:</h3>

            {/* Check Out / Check In */}
            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                {isCheckedOut ? (
                  <Lock className="h-5 w-5 text-amber-600" />
                ) : (
                  <Unlock className="h-5 w-5 text-emerald-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {isCheckedOut ? 'Checked Out' : 'Available'}
                  </p>
                  <p className="text-xs text-slate-600">
                    {isCheckedOut 
                      ? 'You are currently editing this document' 
                      : 'Document is available for editing'}
                  </p>
                </div>
              </div>
              {!isCheckedOut ? (
                <Button
                  size="sm"
                  onClick={handleCheckOut}
                  disabled={isCheckingOut || document.status === 'APPROVED'}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Check Out
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCheckIn}
                  disabled={isCheckingOut}
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Check In
                </Button>
              )}
            </div>

            {document.status === 'APPROVED' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  ⚠️ This document is APPROVED. Editing will create a new draft version requiring re-approval.
                </p>
              </div>
            )}
          </div>

          {/* Version History */}
          <div className="border-t border-slate-200 pt-4">
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-blue-600"
            >
              <History className="h-4 w-4" />
              Version History ({versions.length})
            </button>

            {showVersions && (
              <div className="mt-3 space-y-2">
                {versions.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">v{v.version}</Badge>
                      <div>
                        <p className="font-medium text-slate-900">{v.author}</p>
                        <p className="text-xs text-slate-600">{v.date} • {v.comment}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SharePoint Info */}
          {document.url && (
            <div className="border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                📁 Stored in SharePoint: {document.url}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{document.editorsCount || 0} editors</span>
            </div>
            {document.commentsCount && document.commentsCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{document.commentsCount} comments</span>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

