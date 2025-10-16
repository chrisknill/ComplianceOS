import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MapNode, MapEdge, WizardResult, ChecklistItem } from '@/types/management-map';

interface ManagementMapState {
  // Data
  nodes: MapNode[];
  edges: MapEdge[];
  
  // UI State
  selectedNode: MapNode | null;
  isInspectorOpen: boolean;
  isWizardOpen: boolean;
  isChecklistOpen: boolean;
  
  // Filters & Search
  searchQuery: string;
  filters: {
    type: string[];
    status: string[];
    owner: string[];
    location: string[];
    isoClause: string[];
    tags: string[];
  };
  
  // Wizard Results
  wizardResult: WizardResult | null;
  
  // Checklist
  checklist: ChecklistItem[];
  checklistProgress: { [key: string]: boolean };
  
  // Layout
  nodePositions: { [key: string]: { x: number; y: number } };
  layoutMode: 'auto' | 'manual' | 'hierarchical';
  
  // View Settings
  showDependencies: boolean;
  showNonCritical: boolean;
  showExternal: boolean;
  highlightPath: boolean;
  
  // Actions
  setNodes: (nodes: MapNode[]) => void;
  setEdges: (edges: MapEdge[]) => void;
  selectNode: (node: MapNode | null) => void;
  toggleInspector: (open?: boolean) => void;
  toggleWizard: (open?: boolean) => void;
  toggleChecklist: (open?: boolean) => void;
  
  // Search & Filters
  setSearchQuery: (query: string) => void;
  updateFilters: (filters: Partial<ManagementMapState['filters']>) => void;
  clearFilters: () => void;
  
  // Wizard
  setWizardResult: (result: WizardResult | null) => void;
  generateChecklist: (result: WizardResult) => void;
  
  // Checklist
  updateChecklistItem: (itemId: string, completed: boolean) => void;
  resetChecklist: () => void;
  
  // Layout
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  setLayoutMode: (mode: 'auto' | 'manual' | 'hierarchical') => void;
  resetLayout: () => void;
  
  // View Settings
  toggleShowDependencies: () => void;
  toggleShowNonCritical: () => void;
  toggleShowExternal: () => void;
  toggleHighlightPath: () => void;
}

export const useManagementMapStore = create<ManagementMapState>()(
  persist(
    (set, get) => ({
      // Initial state
      nodes: [],
      edges: [],
      selectedNode: null,
      isInspectorOpen: false,
      isWizardOpen: false,
      isChecklistOpen: false,
      searchQuery: '',
      filters: {
        type: [],
        status: [],
        owner: [],
        location: [],
        isoClause: [],
        tags: [],
      },
      wizardResult: null,
      checklist: [],
      checklistProgress: {},
      nodePositions: {},
      layoutMode: 'auto',
      showDependencies: true,
      showNonCritical: true,
      showExternal: true,
      highlightPath: false,
      
      // Actions
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      
      selectNode: (node) => set({ 
        selectedNode: node,
        isInspectorOpen: !!node 
      }),
      
      toggleInspector: (open) => set((state) => ({
        isInspectorOpen: open !== undefined ? open : !state.isInspectorOpen
      })),
      
      toggleWizard: (open) => set((state) => ({
        isWizardOpen: open !== undefined ? open : !state.isWizardOpen
      })),
      
      toggleChecklist: (open) => set((state) => ({
        isChecklistOpen: open !== undefined ? open : !state.isChecklistOpen
      })),
      
      // Search & Filters
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      updateFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),
      
      clearFilters: () => set({
        filters: {
          type: [],
          status: [],
          owner: [],
          location: [],
          isoClause: [],
          tags: [],
        },
        searchQuery: ''
      }),
      
      // Wizard
      setWizardResult: (result) => set({ wizardResult: result }),
      
      generateChecklist: (result) => {
        const checklist = result.checklist.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
        set({ 
          checklist,
          isChecklistOpen: true 
        });
      },
      
      // Checklist
      updateChecklistItem: (itemId, completed) => set((state) => ({
        checklistProgress: {
          ...state.checklistProgress,
          [itemId]: completed
        }
      })),
      
      resetChecklist: () => set({
        checklist: [],
        checklistProgress: {}
      }),
      
      // Layout
      updateNodePosition: (nodeId, position) => set((state) => ({
        nodePositions: {
          ...state.nodePositions,
          [nodeId]: position
        }
      })),
      
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      
      resetLayout: () => set({
        nodePositions: {},
        layoutMode: 'auto'
      }),
      
      // View Settings
      toggleShowDependencies: () => set((state) => ({
        showDependencies: !state.showDependencies
      })),
      
      toggleShowNonCritical: () => set((state) => ({
        showNonCritical: !state.showNonCritical
      })),
      
      toggleShowExternal: () => set((state) => ({
        showExternal: !state.showExternal
      })),
      
      toggleHighlightPath: () => set((state) => ({
        highlightPath: !state.highlightPath
      })),
    }),
    {
      name: 'management-map-storage',
      partialize: (state) => ({
        nodePositions: state.nodePositions,
        layoutMode: state.layoutMode,
        showDependencies: state.showDependencies,
        showNonCritical: state.showNonCritical,
        showExternal: state.showExternal,
        highlightPath: state.highlightPath,
        checklistProgress: state.checklistProgress,
      }),
    }
  )
);