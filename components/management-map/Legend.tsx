import React from 'react';
import { Badge } from '@/components/ui/badge';

export function Legend() {
  const nodeTypes = [
    { 
      icon: '🛡️', 
      label: 'Policy',
      description: 'High-level organizational commitments and direction'
    },
    { 
      icon: '⚙️', 
      label: 'Procedure',
      description: 'Step-by-step processes and workflows'
    },
    { 
      icon: '📋', 
      label: 'Work Instruction',
      description: 'Detailed task-specific guidance'
    },
    { 
      icon: '✅', 
      label: 'SOP',
      description: 'Standard operating procedures'
    },
    { 
      icon: '⚠️', 
      label: 'Risk Assessment',
      description: 'Risk identification and control measures'
    },
    { 
      icon: '📄', 
      label: 'Form',
      description: 'Documentation templates and data collection'
    },
    { 
      icon: '📁', 
      label: 'Record',
      description: 'Completed documentation and evidence'
    },
    { 
      icon: '🎓', 
      label: 'Training',
      description: 'Competency development programs'
    },
    { 
      icon: '🔗', 
      label: 'External Standard',
      description: 'Industry standards and regulations'
    },
  ];

  const statusTypes = [
    { color: 'bg-green-500', label: 'Green (Approved)', description: 'Active and compliant' },
    { color: 'bg-yellow-500', label: 'Amber (Pending)', description: 'Under review or approval' },
    { color: 'bg-red-500', label: 'Red (Issues)', description: 'Non-compliant or requires attention' },
    { color: 'bg-gray-400', label: 'Draft', description: 'In development' },
    { color: 'bg-gray-600', label: 'Archived', description: 'No longer active' },
  ];

  const edgeTypes = [
    { 
      style: 'w-4 h-0.5 bg-red-500', 
      label: 'Critical Path',
      description: 'Essential process flow'
    },
    { 
      style: 'w-4 h-0.5 bg-gray-400', 
      label: 'Reference',
      description: 'Supporting relationship'
    },
  ];

  return (
    <div className="p-4 h-full overflow-y-auto bg-white">
      <div className="space-y-4">
        {/* Header */}
        <div className="border-b pb-3">
          <h3 className="font-semibold text-sm text-gray-800 mb-1">Management System Map Key</h3>
          <p className="text-xs text-gray-600">Understanding the symbols and connections in your management system</p>
        </div>

        {/* Node Types - Grid Layout */}
        <div>
          <h4 className="font-medium text-sm mb-3 text-gray-700">Document Types</h4>
          <div className="grid grid-cols-2 gap-2">
            {nodeTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded">
                <span className="text-base">{type.icon}</span>
                <div>
                  <div className="font-medium text-gray-800">{type.label}</div>
                  <div className="text-gray-600 text-xs">{type.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Status Colors - Grid Layout */}
        <div>
          <h4 className="font-medium text-sm mb-3 text-gray-700">Status Indicators</h4>
          <div className="grid grid-cols-2 gap-2">
            {statusTypes.map((status, index) => (
              <div key={index} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded">
                <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                <div>
                  <div className="font-medium text-gray-800">{status.label}</div>
                  <div className="text-gray-600 text-xs">{status.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Edge Types - Grid Layout */}
        <div>
          <h4 className="font-medium text-sm mb-3 text-gray-700">Connection Types</h4>
          <div className="grid grid-cols-1 gap-2">
            {edgeTypes.map((edge, index) => (
              <div key={index} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded">
                <div className={`${edge.style} rounded`}></div>
                <div>
                  <div className="font-medium text-gray-800">{edge.label}</div>
                  <div className="text-gray-600 text-xs">{edge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Colors */}
        <div>
          <h4 className="font-medium text-sm mb-3 text-gray-700">Connection Colors</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded">
              <div className="w-4 h-0.5 bg-blue-500 rounded"></div>
              <div>
                <div className="font-medium text-gray-800">Blue - Implementation</div>
                <div className="text-gray-600 text-xs">How policies are implemented</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded">
              <div className="w-4 h-0.5 bg-red-500 rounded"></div>
              <div>
                <div className="font-medium text-gray-800">Red - Risk Management</div>
                <div className="text-gray-600 text-xs">Risk-related connections</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded">
              <div className="w-4 h-0.5 bg-purple-500 rounded"></div>
              <div>
                <div className="font-medium text-gray-800">Purple - Training</div>
                <div className="text-gray-600 text-xs">Competence requirements</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded">
              <div className="w-4 h-0.5 bg-green-500 rounded"></div>
              <div>
                <div className="font-medium text-gray-800">Green - Documentation</div>
                <div className="text-gray-600 text-xs">Document relationships</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Help */}
        <div className="border-t pt-3">
          <h4 className="font-medium text-sm mb-3 text-gray-700">How to Use</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Click nodes</strong> to view detailed information</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Double-click</strong> to open documents</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Search</strong> to find specific procedures</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Filter</strong> by type or status</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Use wizard</strong> for guidance on requirements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}