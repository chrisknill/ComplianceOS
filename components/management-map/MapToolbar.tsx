import React, { useState } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  X, 
  Wand2, 
  List, 
  Maximize2, 
  Minimize2,
  Download,
  Printer,
  Settings,
  HelpCircle
} from 'lucide-react';
import { MapNode, MapEdge } from '@/types/management-map';

interface MapToolbarProps {
  onChecklistOpen: () => void;
  onWizardOpen: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    type: string[];
    status: string[];
    owner: string[];
    location: string[];
    isoClause: string[];
    tags: string[];
  };
  onFiltersChange: (filters: Partial<MapToolbarProps['filters']>) => void;
  onClearFilters: () => void;
}

export function MapToolbar({
  onChecklistOpen,
  onWizardOpen,
  isFullscreen,
  onToggleFullscreen,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearFilters,
}: MapToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const docTypes = ['policy', 'procedure', 'workInstruction', 'sop', 'riskAssessment', 'form', 'record', 'training', 'externalStandard'];
  const statusTypes = ['green', 'amber', 'red', 'draft', 'archived'];

  const handleFilterChange = (filterType: keyof typeof filters, value: string, checked: boolean) => {
    const currentValues = filters[filterType];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFiltersChange({ [filterType]: newValues });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  const handleExport = (format: 'png' | 'svg' | 'pdf') => {
    // TODO: Implement export functionality
    console.log(`Exporting to ${format}`);
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    console.log('Printing map');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Management System Map
        </h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Center Section - Filters */}
      <div className="flex items-center gap-2">
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="center">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filter Options</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>

              {/* Document Type Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Document Type
                </label>
                <div className="flex flex-wrap gap-1">
                  {docTypes.map((type) => (
                    <Button
                      key={type}
                      variant={filters.type.includes(type) ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => handleFilterChange('type', type, !filters.type.includes(type))}
                    >
                      {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <div className="flex flex-wrap gap-1">
                  {statusTypes.map((status) => (
                    <Button
                      key={status}
                      variant={filters.status.includes(status) ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => handleFilterChange('status', status, !filters.status.includes(status))}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* ISO Clause Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ISO Clauses
                </label>
                <Input
                  placeholder="e.g., ISO9001: 7.5"
                  onChange={(e) => {
                    const clauses = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                    onFiltersChange({ isoClause: clauses });
                  }}
                  className="text-sm"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-1 max-w-md">
            {Object.entries(filters).map(([key, values]) =>
              values.map((value) => (
                <Badge
                  key={`${key}-${value}`}
                  variant="secondary"
                  className="text-xs"
                >
                  {value}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange(key as keyof typeof filters, value, false)}
                  />
                </Badge>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Wizard Button */}
        <Button onClick={onWizardOpen} variant="outline" size="sm">
          <Wand2 className="h-4 w-4 mr-2" />
          What do I need?
        </Button>

        {/* Checklist Button */}
        <Button onClick={onChecklistOpen} variant="outline" size="sm">
          <List className="h-4 w-4 mr-2" />
          Checklist
        </Button>

        {/* Export Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('png')}>
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('svg')}>
              Export as SVG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Print Button */}
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>

        {/* Fullscreen Toggle */}
        <Button onClick={onToggleFullscreen} variant="outline" size="sm">
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>

        {/* Help Button */}
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}