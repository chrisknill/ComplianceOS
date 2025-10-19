import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Wand2, 
  Eye, 
  EyeOff,
  RotateCcw,
  Grid3X3,
  HelpCircle,
  CheckSquare
} from 'lucide-react';
import { useManagementMapStore } from '@/lib/stores/management-map-store';
import { DocType, StatusType } from '@/types/management-map';
import { debounce } from '@/lib/utils/management-map';

interface MapToolbarProps {
  onExport: (format: 'png' | 'svg' | 'pdf') => void;
  onPrint: () => void;
  onResetLayout: () => void;
  onAutoLayout: () => void;
  onToggleLegend: () => void;
  onWizardOpen: () => void;
  onChecklistOpen: () => void;
}

export default function MapToolbar({
  onExport,
  onPrint,
  onResetLayout,
  onAutoLayout,
  onToggleLegend,
  onWizardOpen,
  onChecklistOpen
}: MapToolbarProps) {
  const {
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    resetFilters,
    getFilteredNodes,
    getFilteredEdges
  } = useManagementMapStore();

  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const toggleTypeFilter = (type: DocType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    setFilters({ types: newTypes });
  };

  const toggleStatusFilter = (status: StatusType) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    setFilters({ status: newStatuses });
  };

  const filteredNodes = getFilteredNodes();
  const filteredEdges = getFilteredEdges();

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {/* Main toolbar */}
      <div className="flex items-center gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search documents, codes, tags..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filters.types.length > 0 || filters.status.length > 0 || filters.owners.length > 0) && (
              <Badge variant="secondary" className="ml-1">
                {filters.types.length + filters.status.length + filters.owners.length}
              </Badge>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleLegend}
            className="flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Legend
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onWizardOpen}
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            What do I need?
          </Button>

          <div className="h-6 w-px bg-gray-300" />

          <Button
            variant="outline"
            size="sm"
            onClick={onResetLayout}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onAutoLayout}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            Auto Layout
          </Button>

          <div className="h-6 w-px bg-gray-300" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('png')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PNG
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Document Types */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Document Types</h4>
              <div className="space-y-1">
                {(['policy', 'procedure', 'workInstruction', 'sop', 'riskAssessment', 'form', 'record', 'training', 'externalStandard'] as DocType[]).map(type => (
                  <label key={type} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => toggleTypeFilter(type)}
                      className="rounded border-gray-300"
                    />
                    <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
              <div className="space-y-1">
                {(['green', 'amber', 'red', 'draft', 'archived'] as StatusType[]).map(status => (
                  <label key={status} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleStatusFilter(status)}
                      className="rounded border-gray-300"
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.showDependencies}
                    onChange={(e) => setFilters({ showDependencies: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>Show Dependencies</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.showNonCritical}
                    onChange={(e) => setFilters({ showNonCritical: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>Show Non-Critical</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.showExternal}
                    onChange={(e) => setFilters({ showExternal: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>Show External</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredNodes.length} nodes, {filteredEdges.length} connections
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
