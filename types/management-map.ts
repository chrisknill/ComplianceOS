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

export interface MapNode {
  id: string;                     // unique
  code?: string;                  // e.g., POL-001
  title: string;
  type: DocType;
  description?: string;
  owner?: string;                 // role or person
  version?: string;
  status?: "green" | "amber" | "red" | "draft" | "archived";
  nextReviewDate?: string;        // ISO date
  isoClauses?: string[];          // e.g., ["ISO9001: 7.5", "ISO45001: 8.1"]
  location?: string[];            // sites/areas
  roles?: string[];               // responsible/consulted
  inputs?: string[];              // expected inputs
  outputs?: string[];             // produced artifacts
  risks?: string[];               // risk IDs linked
  records?: string[];             // record IDs linked
  linkedRecords?: string[];       // record IDs
  linkedTags?: string[];          // tags
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
  relationship:
    | "prerequisite" | "control" | "evidence"
    | "outputToInput" | "escalation" | "reference";
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

export interface WizardResult {
  path: MapNode[];
  checklist: ChecklistItem[];
  estimatedTime?: string;
}

export interface ChecklistItem {
  id: string;
  nodeId: string;
  title: string;
  description?: string;
  completed: boolean;
  order: number;
  link?: {
    url?: string;
    filePath?: string;
  };
}

export interface ApprovalTrail {
  id: string;
  nodeId: string;
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  status: "pending" | "approved" | "rejected";
  comments?: string;
}

export interface IssueReport {
  id: string;
  nodeId: string;
  reportedBy: string;
  reportedDate: string;
  issue: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
}