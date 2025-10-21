'use client'

import { useState, useEffect } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Settings as SettingsIcon, Building, Bell, Shield, Database, FileText } from 'lucide-react'
import { useDocumentPrefix } from '@/lib/document-prefix'

export default function SettingsPage() {
  const { prefix, updatePrefix } = useDocumentPrefix()
  const [localPrefix, setLocalPrefix] = useState(prefix)
  const [nextDocNumber, setNextDocNumber] = useState(1)
  const [autoGenerate, setAutoGenerate] = useState(true)

  // Update local prefix when global prefix changes
  useEffect(() => {
    setLocalPrefix(prefix)
  }, [prefix])

  // Handle prefix change
  const handlePrefixChange = (newPrefix: string) => {
    setLocalPrefix(newPrefix)
    updatePrefix(newPrefix)
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">System configuration and preferences</p>
        </div>

        {/* Organization Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Building className="h-6 w-6 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Organization</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                defaultValue="ComplianceOS Demo"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Industry
              </label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                <option>Manufacturing</option>
                <option>Services</option>
                <option>Healthcare</option>
                <option>Technology</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documentation Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Documentation</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Document Code Prefix
              </label>
              <input
                type="text"
                placeholder="MET"
                value={localPrefix}
                onChange={(e) => handlePrefixChange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Prefix for all document codes (e.g., {localPrefix}-PROC-001)</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Auto-generate Document Codes</p>
                <p className="text-sm text-slate-500">Automatically generate sequential document codes</p>
              </div>
              <input 
                type="checkbox" 
                checked={autoGenerate}
                onChange={(e) => setAutoGenerate(e.target.checked)}
                className="h-5 w-5 text-slate-900 rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Next Document Number
              </label>
              <input
                type="number"
                value={nextDocNumber}
                onChange={(e) => setNextDocNumber(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Starting number for new document codes</p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Document Review Reminders</p>
                <p className="text-sm text-slate-500">Get notified when documents are due for review</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 text-slate-900 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Training Due Alerts</p>
                <p className="text-sm text-slate-500">Receive alerts for upcoming training deadlines</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 text-slate-900 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Calibration Reminders</p>
                <p className="text-sm text-slate-500">Get notified about upcoming calibrations</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 text-slate-900 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Risk Review Notifications</p>
                <p className="text-sm text-slate-500">Alerts for risk assessments due for review</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 text-slate-900 rounded" />
            </div>
          </div>
        </div>

        {/* Risk Thresholds */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-6 w-6 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Risk & RAG Thresholds</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amber Threshold (days before due)
              </label>
              <input
                type="number"
                defaultValue={30}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Items turn amber this many days before due date</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Training Renewal Period (days)
              </label>
              <input
                type="number"
                defaultValue={365}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Default training renewal period</p>
            </div>
          </div>
        </div>

        {/* ISO Standards */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">ISO Standards</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">ISO 9001:2015</p>
                <p className="text-sm text-slate-500">Quality Management System</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">ISO 14001:2015</p>
                <p className="text-sm text-slate-500">Environmental Management System</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">System Information</h2>
            </div>
          </div>
          <div className="p-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Version:</span>
              <span className="font-medium text-slate-900">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Database:</span>
              <span className="font-medium text-slate-900">SQLite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Deployment:</span>
              <span className="font-medium text-slate-900">Azure-Ready</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}