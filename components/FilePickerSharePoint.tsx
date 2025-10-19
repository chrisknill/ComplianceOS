// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, Upload, FileText } from 'lucide-react'

interface FilePickerSharePointProps {
  onFileSelect?: (files: File[]) => void
  acceptedTypes?: string[]
  maxFiles?: number
}

export function FilePickerSharePoint({ 
  onFileSelect, 
  acceptedTypes = ['*/*'],
  maxFiles = 10 
}: FilePickerSharePointProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="h-5 w-5" />
          <span>SharePoint Integration</span>
        </CardTitle>
        <CardDescription>
          Connect to SharePoint for file management and collaboration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
          <Cloud className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Connect SharePoint
          </h3>
          <p className="text-slate-600 mb-4">
            Integrate with Microsoft SharePoint for seamless file management
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Connect SharePoint
          </Button>
        </div>
        
        <div className="text-sm text-slate-500 space-y-2">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Access shared document libraries</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Version control and collaboration</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Automatic backup and sync</span>
          </div>
        </div>
        
        {/* TODO: Wire Graph API integration */}
        <div className="text-xs text-slate-400 italic">
          TODO: Implement Microsoft Graph API integration for SharePoint connectivity
        </div>
      </CardContent>
    </Card>
  )
}
