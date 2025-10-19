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
    <div className="p-3 h-full overflow-y-auto">
      <div className="space-y-3">
        {/* Node Types - Horizontal Layout */}
        <div>
          <h4 className="font-medium text-xs mb-2 text-gray-700">Document Types</h4>
          <div className="flex flex-wrap gap-2">
            {nodeTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs">
                <span className="text-sm">{type.icon}</span>
                <span className="whitespace-nowrap">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Status Colors - Horizontal Layout */}
        <div>
          <h4 className="font-medium text-xs mb-2 text-gray-700">Status Colors</h4>
          <div className="flex flex-wrap gap-3">
            {statusTypes.map((status, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs">
                <div className={`w-2.5 h-2.5 rounded ${status.color}`}></div>
                <span className="whitespace-nowrap">{status.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Edge Types - Horizontal Layout */}
        <div>
          <h4 className="font-medium text-xs mb-2 text-gray-700">Connection Types</h4>
          <div className="flex flex-wrap gap-3">
            {edgeTypes.map((edge, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs">
                <div className={edge.style}></div>
                <span className="whitespace-nowrap">{edge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Help */}
        <div className="border-t pt-2">
          <h4 className="font-medium text-xs mb-2 text-gray-700">Quick Help</h4>
          <div className="space-y-1 text-xs text-gray-500">
            <p>• Click nodes to view details</p>
            <p>• Double-click to open documents</p>
            <p>• Use search and filters to find specific items</p>
            <p>• Try the &quot;What do I need?&quot; wizard for guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
}