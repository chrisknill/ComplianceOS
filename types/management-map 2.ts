export type DocType =
  | "policy" 
  | "procedure" 
  | "workInstruction" 
  | "sop"
  | "riskAssessment" 
  | "form" 
  | "record" 
  | "training" 
  | "externalStandard";

export type StatusType = "green" | "amber" | "red" | "draft" | "archived";

export type RelationshipType =
  | "prerequisite" 
  | "control" 
  | "evidence"
  | "outputToInput" 
  | "escalation" 
  | "reference";

export interface MapNode {
  id: string;                     // unique
  code?: string;                  // e.g., POL-001
  title: string;
  type: DocType;
  description?: string;
  owner?: string;                 // role or person
  version?: string;
  status?: StatusType;
  nextReviewDate?: string;        // ISO date
  isoClauses?: string[];          // e.g., ["ISO9001: 7.5", "ISO45001: 8.1"]
  location?: string[];            // sites/areas
  roles?: string[];               // responsible/consulted
  inputs?: string[];              // expected inputs
  outputs?: string[];             // produced artifacts
  risks?: string[];               // risk IDs linked
  records?: string[];             // record IDs linked
  tags?: string[];
  link?: {                        // where to open the doc
    url?: string;                 // SharePoint/Confluence/public URL
    filePath?: string;            // if stored locally/public folder
  };
  position?: { x: number; y: number }; // optional saved position
}

export interface MapEdge {
  id: string;
  source: string;
  target: string;
  relationship: RelationshipType;
  label?: string;
  critical?: boolean; // used for path emphasis
}

export interface ManagementMap {
  metadata: {
    name: string;
    version: string;
    generatedAt: string;
  };
  nodes: MapNode[];
  edges: MapEdge[];
  rolesCatalog?: string[];      // for wizard
  locationsCatalog?: string[];  // for wizard
  activitiesCatalog?: string[]; // for wizard autosuggest
}

// React Flow specific types
export interface FlowNode extends MapNode {
  position: { x: number; y: number };
  data: {
    label: string;
    type: DocType;
    status: StatusType;
    owner?: string;
    description?: string;
    version?: string;
    nextReviewDate?: string;
    isoClauses?: string[];
    roles?: string[];
    inputs?: string[];
    outputs?: string[];
    tags?: string[];
    link?: {
      url?: string;
      filePath?: string;
    };
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  data: {
    relationship: RelationshipType;
    critical?: boolean;
    label?: string;
  };
  style?: {
    stroke?: string;
    strokeWidth?: number;
  };
  animated?: boolean;
}

// Store types
export interface MapFilters {
  types: DocType[];
  status: StatusType[];
  owners: string[];
  locations: string[];
  isoClauses: string[];
  roles: string[];
  tags: string[];
  showDependencies: boolean;
  showNonCritical: boolean;
  showExternal: boolean;
}

export interface MapState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  filters: MapFilters;
  searchQuery: string;
  isInspectorOpen: boolean;
  isWizardOpen: boolean;
  isChecklistOpen: boolean;
  checklistItems: ChecklistItem[];
  breadcrumbs: string[];
  highlightedPath: string[];
}

export interface ChecklistItem {
  id: string;
  nodeId: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface WizardResult {
  path: string[];
  nodes: MapNode[];
  steps: ChecklistItem[];
}
