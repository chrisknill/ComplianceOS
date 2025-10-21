'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';
import { Shell } from '@/components/layout/Shell';
import { Legend } from '@/components/management-map/Legend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Search,
  Filter,
  X,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  CheckSquare,
  Wand2,
  ExternalLink,
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Folder,
  FileText as FileIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Standardized node component
const CustomNode = ({ data }: { data: any }) => {
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'policy': return 'bg-blue-50 border-blue-200';
      case 'procedure': return 'bg-green-50 border-green-200';
      case 'riskAssessment': return 'bg-red-50 border-red-200';
      case 'training': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-md border-2 ${getNodeColor(data.type)} w-[280px] h-[120px] flex flex-col justify-between`}>
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-900 line-clamp-2">{data.title}</div>
        <div className="text-xs text-gray-600 capitalize mt-1">{data.type.replace(/([A-Z])/g, ' $1')}</div>
        {data.code && (
          <div className="text-xs text-gray-500 mt-1">{data.code}</div>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500">
          Owner: {data.owner}
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(data.status)}`} />
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// Static data with owners
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      id: 'pol-quality-management',
      title: 'Quality Management Policy',
      type: 'policy',
      code: 'POL-001',
      status: 'green',
      owner: 'CEO',
      version: '2.1',
      nextReview: '2024-12-31',
      description: 'Establishes the organization\'s commitment to quality management and continuous improvement',
      supportingDocs: [
        { type: 'policy', name: 'Quality Policy Statement', url: '/documents/policies/quality-policy.pdf' },
        { type: 'procedure', name: 'Management Review Procedure', url: '/documents/procedures/mgmt-review.pdf' }
      ]
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 400, y: 100 },
    data: {
      id: 'proc-doc-control',
      title: 'Document Control Procedure',
      type: 'procedure',
      code: 'PROC-001',
      status: 'green',
      owner: 'Quality Manager',
      version: '1.3',
      nextReview: '2024-11-15',
      description: 'Procedure for creation, review, approval, and distribution of documents',
      supportingDocs: [
        { type: 'sop', name: 'Document Creation SOP', url: '/documents/sops/doc-creation.pdf' },
        { type: 'wi', name: 'Document Approval Work Instruction', url: '/documents/work-instructions/doc-approval.pdf' },
        { type: 'form', name: 'Document Control Form', url: '/documents/forms/doc-control.pdf' }
      ]
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 700, y: 100 },
    data: {
      id: 'risk-assessment',
      title: 'Risk Assessment Process',
      type: 'riskAssessment',
      code: 'RISK-001',
      status: 'amber',
      owner: 'Risk Manager',
      version: '1.2',
      nextReview: '2024-10-30',
      description: 'Process for identifying, assessing, and managing risks',
      supportingDocs: [
        { type: 'procedure', name: 'Risk Management Procedure', url: '/documents/procedures/risk-mgmt.pdf' },
        { type: 'form', name: 'Risk Assessment Form', url: '/documents/forms/risk-assessment.pdf' },
        { type: 'wi', name: 'Risk Identification Work Instruction', url: '/documents/work-instructions/risk-identification.pdf' }
      ]
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 250, y: 300 },
    data: {
      id: 'training-program',
      title: 'Training and Competence Program',
      type: 'training',
      code: 'TRAIN-001',
      status: 'green',
      owner: 'HR Manager',
      version: '1.1',
      nextReview: '2024-09-15',
      description: 'Program for ensuring personnel competence and training effectiveness',
      supportingDocs: [
        { type: 'procedure', name: 'Training Management Procedure', url: '/documents/procedures/training-mgmt.pdf' },
        { type: 'sop', name: 'Competence Assessment SOP', url: '/documents/sops/competence-assessment.pdf' },
        { type: 'form', name: 'Training Record Form', url: '/documents/forms/training-record.pdf' }
      ]
    },
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 550, y: 300 },
    data: {
      id: 'internal-audit',
      title: 'Internal Audit Process',
      type: 'procedure',
      code: 'AUDIT-001',
      status: 'green',
      owner: 'Quality Manager',
      version: '1.4',
      nextReview: '2024-08-20',
      description: 'Process for conducting internal audits and managing audit findings',
      supportingDocs: [
        { type: 'procedure', name: 'Internal Audit Procedure', url: '/documents/procedures/internal-audit.pdf' },
        { type: 'sop', name: 'Audit Planning SOP', url: '/documents/sops/audit-planning.pdf' },
        { type: 'form', name: 'Audit Report Form', url: '/documents/forms/audit-report.pdf' },
        { type: 'wi', name: 'Audit Checklist Work Instruction', url: '/documents/work-instructions/audit-checklist.pdf' }
      ]
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    animated: false,
    label: 'Implemented by',
    labelStyle: { fontSize: '12px', fill: '#374151' },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
    style: { stroke: '#2563eb', strokeWidth: 3 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#2563eb',
    },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    animated: false,
    label: 'Risk management required',
    labelStyle: { fontSize: '12px', fill: '#374151' },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
    style: { stroke: '#dc2626', strokeWidth: 3 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#dc2626',
    },
  },
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    type: 'smoothstep',
    animated: false,
    label: 'Competence required',
    labelStyle: { fontSize: '12px', fill: '#374151' },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
    style: { stroke: '#7c3aed', strokeWidth: 3 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#7c3aed',
    },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    animated: false,
    label: 'Documents risks',
    labelStyle: { fontSize: '12px', fill: '#374151' },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
    style: { stroke: '#059669', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: '#059669',
    },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    animated: false,
    label: 'Audit findings inform risks',
    labelStyle: { fontSize: '12px', fill: '#374151' },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
    style: { stroke: '#6b7280', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: '#6b7280',
    },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    animated: false,
    label: 'Auditor competence',
    labelStyle: { fontSize: '12px', fill: '#374151' },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
    style: { stroke: '#d97706', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: '#d97706',
    },
  },
  {
    id: 'e2-5',
    source: '2',
    target: '5',
    type: 'smoothstep',
    animated: false,
    label: 'Document audit trail',
    labelStyle: { fontSize: '12px', fill: '#374151' },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
    style: { stroke: '#059669', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: '#059669',
    },
  },
];

// Toolbar Component
const MapToolbar = ({ 
  onChecklistOpen, 
  onWizardOpen, 
  isFullscreen, 
  onToggleFullscreen,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearFilters,
  nodeCount,
  edgeCount
}: any) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const nodeTypes = ['policy', 'procedure', 'riskAssessment', 'training'];
  const statuses = ['green', 'amber', 'red', 'draft'];

  const handleFilterChange = (key: string, value: string) => {
    const currentFilters = filters[key] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter((item: string) => item !== value)
      : [...currentFilters, value];
    
    onFiltersChange({ [key]: newFilters });
  };

  const activeFiltersCount = Object.values(filters).flat().length;

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold text-gray-800">Management System Map</h1>
        <Button variant="ghost" size="sm" onClick={onChecklistOpen}>
          <CheckSquare className="h-4 w-4 mr-2" /> What do I need?
        </Button>
        <Button variant="ghost" size="sm" onClick={onWizardOpen}>
          <Wand2 className="h-4 w-4 mr-2" /> Wizard
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search nodes..."
            className="pl-8 w-64"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" /> Filters
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Type</h4>
                <div className="space-y-2">
                  {nodeTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.type?.includes(type) || false}
                        onChange={() => handleFilterChange('type', type)}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Status</h4>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(status) || false}
                        onChange={() => handleFilterChange('status', status)}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={onClearFilters}>
                  Clear All
                </Button>
                <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>

        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={onToggleFullscreen}>
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        
        <span className="text-sm text-gray-600 ml-4">
          {nodeCount} nodes, {edgeCount} connections
        </span>
      </div>
    </div>
  );
};

// Inspector Panel Component
const InspectorPanel = ({ 
  node, 
  onClose, 
  onPrevious, 
  onNext, 
  canGoPrevious, 
  canGoNext 
}: { 
  node: any; 
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}) => {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'policy': return <BookOpen className="h-6 w-6 text-blue-600" />;
      case 'procedure': return <ClipboardList className="h-6 w-6 text-green-600" />;
      case 'riskAssessment': return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'training': return <GraduationCap className="h-6 w-6 text-purple-600" />;
      default: return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case 'policy': return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'procedure': return <ClipboardList className="h-4 w-4 text-green-600" />;
      case 'sop': return <FileText className="h-4 w-4 text-orange-600" />;
      case 'wi': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'form': return <FileText className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleOpenDocument = (url: string) => {
    window.open(url, '_blank');
  };

  if (!node) return null;

  return (
    <div className="w-96 border-l bg-white shadow-lg h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold">Document Details</h2>
            <span className="text-xs text-gray-500">
              {node && `${node.data.code || 'Node'} • ${node.data.type}`}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onNext}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {getNodeIcon(node.data.type)}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{node.data.title}</h3>
            <p className="text-sm text-gray-600 capitalize">
              {node.data.type.replace(/([A-Z])/g, ' $1')}
            </p>
            {node.data.code && (
              <Badge variant="outline" className="mt-1">
                {node.data.code}
              </Badge>
            )}
          </div>
          <Badge className={`${getStatusColor(node.data.status)} text-white`}>
            {node.data.status}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Owner</p>
              <p className="text-sm font-medium">{node.data.owner}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Version</p>
              <p className="text-sm font-medium">{node.data.version}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Next Review</p>
              <p className="text-sm font-medium">{node.data.nextReview}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-medium text-sm mb-2">Description</h4>
          <p className="text-sm text-gray-700">{node.data.description}</p>
        </div>

        {/* Related Documents - Tabbed Interface */}
        <div>
          <h4 className="font-medium text-sm mb-3 text-gray-700">Related Documents</h4>
          
          <Tabs defaultValue="policy" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="policy" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Policy
              </TabsTrigger>
              <TabsTrigger value="supporting" className="flex items-center gap-1">
                <Folder className="h-3 w-3" />
                Supporting
              </TabsTrigger>
              <TabsTrigger value="forms" className="flex items-center gap-1">
                <FileIcon className="h-3 w-3" />
                Forms
              </TabsTrigger>
            </TabsList>
            
            {/* Policy Tab */}
            <TabsContent value="policy" className="mt-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">{node.data.title}</p>
                    <p className="text-xs text-blue-600 uppercase">{node.data.type}</p>
                    <p className="text-xs text-blue-500 mt-1">Version {node.data.version}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleOpenDocument(`/documents/${node.data.type}s/${node.data.id}.pdf`)}
                  className="ml-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </TabsContent>
            
            {/* Supporting Documents Tab */}
            <TabsContent value="supporting" className="mt-3">
              {node.data.supportingDocs && node.data.supportingDocs.filter((doc: any) => ['procedure', 'sop', 'wi'].includes(doc.type)).length > 0 ? (
                <div className="space-y-2">
                  {node.data.supportingDocs.filter((doc: any) => ['procedure', 'sop', 'wi'].includes(doc.type)).map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2">
                        {getDocTypeIcon(doc.type)}
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500 uppercase">{doc.type}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenDocument(doc.url)}
                        className="ml-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No supporting documents
                </div>
              )}
            </TabsContent>
            
            {/* Forms Tab */}
            <TabsContent value="forms" className="mt-3">
              {node.data.supportingDocs && node.data.supportingDocs.filter((doc: any) => doc.type === 'form').length > 0 ? (
                <div className="space-y-2">
                  {node.data.supportingDocs.filter((doc: any) => doc.type === 'form').map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center gap-2">
                        {getDocTypeIcon(doc.type)}
                        <div>
                          <p className="text-sm font-medium text-green-900">{doc.name}</p>
                          <p className="text-xs text-green-600 uppercase">{doc.type}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenDocument(doc.url)}
                        className="ml-2 border-green-300 text-green-700 hover:bg-green-100"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <FileIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No related forms
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Actions</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open File
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Report Issue */}
        <Button variant="outline" size="sm" className="w-full">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report an Issue
        </Button>
      </div>
    </div>
  );
};

export default function ManagementSystemMapPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: [],
    status: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Initialize the map
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const nodeIndex = nodes.findIndex(n => n.id === node.id);
    setSelectedNode(node);
    setSelectedNodeIndex(nodeIndex);
    setIsInspectorOpen(true);
  }, [nodes]);

  const handlePreviousNode = useCallback(() => {
    if (selectedNodeIndex > 0) {
      const prevIndex = selectedNodeIndex - 1;
      setSelectedNodeIndex(prevIndex);
      setSelectedNode(nodes[prevIndex]);
    }
  }, [selectedNodeIndex, nodes]);

  const handleNextNode = useCallback(() => {
    if (selectedNodeIndex < nodes.length - 1) {
      const nextIndex = selectedNodeIndex + 1;
      setSelectedNodeIndex(nextIndex);
      setSelectedNode(nodes[nextIndex]);
    }
  }, [selectedNodeIndex, nodes]);

  const canGoPrevious = selectedNodeIndex > 0;
  const canGoNext = selectedNodeIndex < nodes.length - 1;

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({ type: [], status: [] });
    setSearchQuery('');
  };

  const handleChecklistOpen = () => {
    console.log('Checklist opened');
  };

  const handleWizardOpen = () => {
    console.log('Wizard opened');
  };

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 ml-0' : 'h-full'} flex flex-col bg-gray-50 -m-6`}>
        {/* Toolbar */}
        <MapToolbar
          onChecklistOpen={handleChecklistOpen}
          onWizardOpen={handleWizardOpen}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          nodeCount={nodes.length}
          edgeCount={edges.length}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            {/* React Flow Map */}
            <div className="flex-1 relative">
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={handleNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ 
                    padding: 0.2, 
                    minZoom: 0.3, 
                    maxZoom: 1.2,
                    includeHiddenNodes: false
                  }}
                  attributionPosition="bottom-left"
                  minZoom={0.1}
                  maxZoom={2}
                  defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
                  proOptions={{ hideAttribution: true }}
                >
                  <Controls 
                    position="top-right"
                    showInteractive={false}
                  />
                  <MiniMap 
                    position="bottom-left"
                    nodeColor={(node) => {
                      switch (node.data?.type) {
                        case 'policy': return '#3b82f6';
                        case 'procedure': return '#10b981';
                        case 'riskAssessment': return '#ef4444';
                        case 'training': return '#8b5cf6';
                        default: return '#6b7280';
                      }
                    }}
                    nodeStrokeWidth={3}
                    zoomable
                    pannable
                  />
                  <Background 
                    variant={BackgroundVariant.Dots} 
                    gap={12} 
                    size={1}
                    color="#e5e7eb"
                  />
                </ReactFlow>
              </ReactFlowProvider>
            </div>

                {/* Inspector Panel */}
                {isInspectorOpen && (
                  <InspectorPanel
                    node={selectedNode}
                    onClose={() => setIsInspectorOpen(false)}
                    onPrevious={handlePreviousNode}
                    onNext={handleNextNode}
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                  />
                )}
          </div>
          
              {/* Legend at Bottom */}
              <div className="h-32 border-t bg-white shadow-lg overflow-y-auto">
                <Legend />
              </div>
        </div>
      </div>
    </Shell>
  );
}