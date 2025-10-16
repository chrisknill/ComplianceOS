import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ManagementMap, MapNode, MapEdge, DocType } from "@/types/management-map";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch documents from the database
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Fetch risks for risk assessments
    const risks = await prisma.risk.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Convert to QMS process flow nodes
    const nodes: MapNode[] = [];
    const edges: MapEdge[] = [];

    // Define QMS Process Flow Structure based on ISO 9001
    // MANAGEMENT PROCESSES (Left Column - Green)
    const managementProcesses = [
      {
        id: 'management-system-planning',
        code: 'MSP',
        title: 'Management System Planning',
        type: 'policy' as DocType,
        description: 'Strategic planning, resource allocation, and system governance',
        owner: 'CEO/Board',
        status: 'green' as const,
        location: ['Head Office'],
        roles: ['CEO', 'Board', 'Executive Team'],
        inputs: ['Market Analysis', 'Stakeholder Requirements'],
        outputs: ['Strategic Plans', 'Resource Plans', 'Governance Framework'],
        tags: ['management', 'planning', 'governance'],
        link: { url: '/objectives' },
        position: { x: 50, y: 50 }
      },
      {
        id: 'set-objectives-targets',
        code: 'SOT',
        title: 'Set Objectives & Targets',
        type: 'policy' as DocType,
        description: 'Define measurable objectives and targets for all functions',
        owner: 'CEO',
        status: 'green' as const,
        location: ['Head Office'],
        roles: ['CEO', 'Executive Team', 'Managers'],
        inputs: ['Strategic Plans', 'Performance Data'],
        outputs: ['Objectives', 'KPIs', 'Targets'],
        tags: ['objectives', 'targets', 'performance'],
        link: { url: '/objectives' },
        position: { x: 50, y: 150 }
      },
      {
        id: 'provide-resources-infrastructure',
        code: 'PRI',
        title: 'Provide Resources & Infrastructure',
        type: 'procedure' as DocType,
        description: 'Ensure adequate resources, facilities, and infrastructure',
        owner: 'Operations Director',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Operations Director', 'Facilities Manager'],
        inputs: ['Resource Requirements', 'Budget Approval'],
        outputs: ['Resources', 'Infrastructure', 'Equipment'],
        tags: ['resources', 'infrastructure', 'facilities'],
        link: { url: '/equipment' },
        position: { x: 50, y: 250 }
      },
      {
        id: 'identify-customer-requirements',
        code: 'ICR',
        title: 'Identify Customer Requirements',
        type: 'procedure' as DocType,
        description: 'Gather and analyze customer, market, and stakeholder requirements',
        owner: 'Sales Director',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Sales Director', 'Sales Team', 'Marketing Team'],
        inputs: ['Market Intelligence', 'Customer Feedback'],
        outputs: ['Requirements Specification', 'Customer Profiles'],
        tags: ['customer', 'requirements', 'market'],
        link: { url: '/sales' },
        position: { x: 50, y: 350 }
      },
      {
        id: 'determine-roles-responsibilities',
        code: 'DRR',
        title: 'Determine Roles & Responsibilities',
        type: 'procedure' as DocType,
        description: 'Define organizational structure and accountability',
        owner: 'HR Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['HR Manager', 'Executive Team'],
        inputs: ['Organizational Needs', 'Competence Requirements'],
        outputs: ['Job Descriptions', 'Org Chart', 'Responsibilities Matrix'],
        tags: ['roles', 'responsibilities', 'organization'],
        link: { url: '/employees' },
        position: { x: 50, y: 450 }
      },
      {
        id: 'business-planning',
        code: 'BP',
        title: 'Business Planning',
        type: 'policy' as DocType,
        description: 'Annual business planning and performance monitoring',
        owner: 'CEO',
        status: 'green' as const,
        location: ['Head Office'],
        roles: ['CEO', 'Executive Team'],
        inputs: ['Market Analysis', 'Financial Data', 'Performance Metrics'],
        outputs: ['Business Plans', 'Budgets', 'Performance Reviews'],
        tags: ['business', 'planning', 'performance'],
        link: { url: '/dashboard' },
        position: { x: 50, y: 550 }
      }
    ];

    // CUSTOMER RELATED PROCESSES (Central Column - Blue)
    const customerProcesses = [
      {
        id: 'customer-market-stakeholder-legal-requirements',
        code: 'CMSLR',
        title: 'Customer, Market, Stakeholder & Legal Requirements',
        type: 'procedure' as DocType,
        description: 'Comprehensive requirements gathering and analysis',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Sales Team', 'Legal Team'],
        inputs: ['Customer Input', 'Market Research', 'Legal Updates'],
        outputs: ['Requirements Register', 'Compliance Matrix'],
        tags: ['requirements', 'customer', 'legal', 'compliance'],
        link: { url: '/documentation' },
        position: { x: 250, y: 50 }
      },
      {
        id: 'quote',
        code: 'QT',
        title: 'Quote',
        type: 'procedure' as DocType,
        description: 'Prepare and issue customer quotations',
        owner: 'Sales Manager',
        status: 'green' as const,
        location: ['Sales Offices'],
        roles: ['Sales Manager', 'Sales Team'],
        inputs: ['Customer Requirements', 'Cost Data'],
        outputs: ['Quotations', 'Proposals'],
        tags: ['sales', 'quotation', 'pricing'],
        link: { url: '/sales' },
        position: { x: 250, y: 150 }
      },
      {
        id: 'order',
        code: 'ORD',
        title: 'Order',
        type: 'procedure' as DocType,
        description: 'Process customer orders and confirmations',
        owner: 'Sales Manager',
        status: 'green' as const,
        location: ['Sales Offices'],
        roles: ['Sales Manager', 'Customer Service'],
        inputs: ['Customer Orders', 'Availability'],
        outputs: ['Order Confirmations', 'Production Orders'],
        tags: ['orders', 'sales', 'customer'],
        link: { url: '/sales' },
        position: { x: 250, y: 250 }
      },
      {
        id: 'contract-review',
        code: 'CR',
        title: 'Contract Review',
        type: 'procedure' as DocType,
        description: 'Review and approve customer contracts',
        owner: 'Legal Manager',
        status: 'green' as const,
        location: ['Head Office'],
        roles: ['Legal Manager', 'Sales Manager', 'Operations Manager'],
        inputs: ['Draft Contracts', 'Requirements'],
        outputs: ['Approved Contracts', 'Risk Assessments'],
        tags: ['contracts', 'legal', 'review'],
        link: { url: '/documentation' },
        position: { x: 250, y: 350 }
      },
      {
        id: 'product-process-planning',
        code: 'PPP',
        title: 'Product & Process Planning',
        type: 'procedure' as DocType,
        description: 'Plan products and processes to meet requirements',
        owner: 'Operations Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Operations Manager', 'Production Manager', 'Quality Manager'],
        inputs: ['Customer Requirements', 'Technical Specifications'],
        outputs: ['Production Plans', 'Process Specifications'],
        tags: ['planning', 'production', 'process'],
        link: { url: '/operations' },
        position: { x: 250, y: 450 }
      },
      {
        id: 'design-development',
        code: 'DD',
        title: 'Design & Development',
        type: 'procedure' as DocType,
        description: 'Design and develop products and services',
        owner: 'R&D Manager',
        status: 'green' as const,
        location: ['R&D Facilities'],
        roles: ['R&D Manager', 'Design Team', 'Engineering Team'],
        inputs: ['Design Requirements', 'Technical Inputs'],
        outputs: ['Designs', 'Prototypes', 'Specifications'],
        tags: ['design', 'development', 'engineering'],
        link: { url: '/rd' },
        position: { x: 250, y: 550 }
      },
      {
        id: 'supplier-selection-evaluation',
        code: 'SSE',
        title: 'Supplier Selection & Evaluation',
        type: 'procedure' as DocType,
        description: 'Select and evaluate suppliers and contractors',
        owner: 'Procurement Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Procurement Manager', 'Quality Manager'],
        inputs: ['Requirements', 'Supplier Data'],
        outputs: ['Approved Suppliers', 'Evaluation Reports'],
        tags: ['suppliers', 'procurement', 'evaluation'],
        link: { url: '/suppliers' },
        position: { x: 250, y: 650 }
      },
      {
        id: 'incoming-inspection-handling-storage',
        code: 'IIHS',
        title: 'Incoming Inspection, Handling & Storage',
        type: 'procedure' as DocType,
        description: 'Inspect, handle and store incoming materials',
        owner: 'Warehouse Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Warehouse Manager', 'Quality Inspector'],
        inputs: ['Materials', 'Inspection Criteria'],
        outputs: ['Inspected Materials', 'Storage Records'],
        tags: ['inspection', 'warehouse', 'materials'],
        link: { url: '/equipment' },
        position: { x: 250, y: 750 }
      },
      {
        id: 'production-processes',
        code: 'PP',
        title: 'Production Processes',
        type: 'procedure' as DocType,
        description: 'Execute production and service delivery processes',
        owner: 'Production Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Production Manager', 'Operators', 'Supervisors'],
        inputs: ['Materials', 'Instructions', 'Resources'],
        outputs: ['Products', 'Services', 'Production Records'],
        tags: ['production', 'manufacturing', 'operations'],
        link: { url: '/operations' },
        position: { x: 250, y: 850 }
      },
      {
        id: 'storage-dispatch-delivery',
        code: 'SDD',
        title: 'Storage, Dispatch & Delivery',
        type: 'procedure' as DocType,
        description: 'Store, dispatch and deliver finished products',
        owner: 'Logistics Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Logistics Manager', 'Warehouse Staff'],
        inputs: ['Finished Products', 'Delivery Instructions'],
        outputs: ['Deliveries', 'Shipping Records'],
        tags: ['logistics', 'delivery', 'dispatch'],
        link: { url: '/operations' },
        position: { x: 250, y: 950 }
      },
      {
        id: 'customer-market-stakeholder-feedback',
        code: 'CMSF',
        title: 'Customer, Market & Stakeholder Feedback',
        type: 'procedure' as DocType,
        description: 'Collect and analyze customer and stakeholder feedback',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Customer Service', 'Sales Team'],
        inputs: ['Customer Feedback', 'Market Data', 'Complaints'],
        outputs: ['Feedback Reports', 'Improvement Actions'],
        tags: ['feedback', 'customer', 'improvement'],
        link: { url: '/documentation' },
        position: { x: 250, y: 1050 }
      }
    ];

    // SUPPORT PROCESSES (Right Column - Orange)
    const supportProcesses = [
      {
        id: 'communication-participation',
        code: 'CP',
        title: 'Communication & Participation',
        type: 'procedure' as DocType,
        description: 'Internal and external communication processes',
        owner: 'HR Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['HR Manager', 'Communication Team'],
        inputs: ['Information', 'Messages'],
        outputs: ['Communications', 'Meeting Records'],
        tags: ['communication', 'participation', 'engagement'],
        link: { url: '/employees' },
        position: { x: 450, y: 50 }
      },
      {
        id: 'training-competence',
        code: 'TC',
        title: 'Training & Competence',
        type: 'procedure' as DocType,
        description: 'Develop and maintain staff competence',
        owner: 'HR Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['HR Manager', 'Training Coordinator'],
        inputs: ['Competence Requirements', 'Training Needs'],
        outputs: ['Training Programs', 'Competence Records'],
        tags: ['training', 'competence', 'development'],
        link: { url: '/training' },
        position: { x: 450, y: 150 }
      },
      {
        id: 'maintain-facilities-equipment',
        code: 'MFE',
        title: 'Maintain Facilities & Equipment',
        type: 'procedure' as DocType,
        description: 'Maintain facilities and production equipment',
        owner: 'Facilities Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Facilities Manager', 'Maintenance Team'],
        inputs: ['Maintenance Schedules', 'Equipment Data'],
        outputs: ['Maintenance Records', 'Equipment Status'],
        tags: ['maintenance', 'facilities', 'equipment'],
        link: { url: '/equipment' },
        position: { x: 450, y: 250 }
      },
      {
        id: 'calibrate-equipment',
        code: 'CE',
        title: 'Calibrate Equipment',
        type: 'procedure' as DocType,
        description: 'Calibrate measuring and test equipment',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Calibration Technician'],
        inputs: ['Calibration Schedules', 'Standards'],
        outputs: ['Calibration Records', 'Certificates'],
        tags: ['calibration', 'measurement', 'equipment'],
        link: { url: '/calibration' },
        position: { x: 450, y: 350 }
      },
      {
        id: 'document-data-control',
        code: 'DDC',
        title: 'Document & Data Control',
        type: 'procedure' as DocType,
        description: 'Control documents and data throughout the organization',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Document Controller'],
        inputs: ['Documents', 'Data'],
        outputs: ['Controlled Documents', 'Data Records'],
        tags: ['documents', 'data', 'control'],
        link: { url: '/documentation' },
        position: { x: 450, y: 450 }
      },
      {
        id: 'control-records',
        code: 'CR',
        title: 'Control Records',
        type: 'procedure' as DocType,
        description: 'Manage and control quality records',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Records Manager'],
        inputs: ['Records', 'Retention Requirements'],
        outputs: ['Managed Records', 'Archive Records'],
        tags: ['records', 'control', 'management'],
        link: { url: '/documentation' },
        position: { x: 450, y: 550 }
      }
    ];

    // ASSESSMENT PROCESSES (Bottom Section - Red)
    const assessmentProcesses = [
      {
        id: 'internal-auditing',
        code: 'IA',
        title: 'Internal Auditing',
        type: 'procedure' as DocType,
        description: 'Conduct internal audits of the management system',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Internal Auditors'],
        inputs: ['Audit Plans', 'Procedures'],
        outputs: ['Audit Reports', 'Findings'],
        tags: ['auditing', 'assessment', 'compliance'],
        link: { url: '/documentation' },
        position: { x: 650, y: 850 }
      },
      {
        id: 'nonconformities',
        code: 'NC',
        title: 'Nonconformities',
        type: 'procedure' as DocType,
        description: 'Manage nonconformities and corrective actions',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Process Owners'],
        inputs: ['Nonconformity Reports', 'Audit Findings'],
        outputs: ['Corrective Actions', 'Preventive Actions'],
        tags: ['nonconformities', 'corrective', 'preventive'],
        link: { url: '/nonconformance' },
        position: { x: 650, y: 950 }
      },
      {
        id: 'customer-satisfaction',
        code: 'CS',
        title: 'Customer Satisfaction',
        type: 'procedure' as DocType,
        description: 'Monitor and measure customer satisfaction',
        owner: 'Sales Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Sales Manager', 'Customer Service'],
        inputs: ['Customer Feedback', 'Complaints'],
        outputs: ['Satisfaction Reports', 'Improvement Actions'],
        tags: ['customer', 'satisfaction', 'feedback'],
        link: { url: '/sales' },
        position: { x: 650, y: 1050 }
      },
      {
        id: 'analyze-qms-data',
        code: 'AQD',
        title: 'Analyze QMS Data',
        type: 'procedure' as DocType,
        description: 'Analyze data from the quality management system',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['Head Office'],
        roles: ['Quality Manager', 'Data Analyst'],
        inputs: ['Performance Data', 'Audit Results'],
        outputs: ['Analysis Reports', 'Trends'],
        tags: ['analysis', 'data', 'performance'],
        link: { url: '/dashboard' },
        position: { x: 650, y: 1150 }
      },
      {
        id: 'continual-improvement',
        code: 'CI',
        title: 'Continual Improvement',
        type: 'procedure' as DocType,
        description: 'Identify and implement continual improvements',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Process Owners'],
        inputs: ['Improvement Ideas', 'Performance Data'],
        outputs: ['Improvement Plans', 'Changes'],
        tags: ['improvement', 'continuous', 'change'],
        link: { url: '/objectives' },
        position: { x: 850, y: 850 }
      },
      {
        id: 'corrective-preventive-action',
        code: 'CPA',
        title: 'Corrective & Preventive Action',
        type: 'procedure' as DocType,
        description: 'Implement corrective and preventive actions',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Process Owners'],
        inputs: ['Nonconformities', 'Risk Assessments'],
        outputs: ['Actions', 'Verification Records'],
        tags: ['corrective', 'preventive', 'action'],
        link: { url: '/nonconformance' },
        position: { x: 850, y: 950 }
      },
      {
        id: 'management-review',
        code: 'MR',
        title: 'Management Review',
        type: 'procedure' as DocType,
        description: 'Review management system performance and effectiveness',
        owner: 'CEO',
        status: 'green' as const,
        location: ['Head Office'],
        roles: ['CEO', 'Executive Team'],
        inputs: ['Performance Data', 'Audit Results'],
        outputs: ['Review Reports', 'Decisions'],
        tags: ['management', 'review', 'performance'],
        link: { url: '/dashboard' },
        position: { x: 850, y: 1050 }
      },
      {
        id: 'product-process-monitoring',
        code: 'PPM',
        title: 'Product & Process Monitoring',
        type: 'procedure' as DocType,
        description: 'Monitor products and processes for compliance',
        owner: 'Quality Manager',
        status: 'green' as const,
        location: ['All Sites'],
        roles: ['Quality Manager', 'Production Manager'],
        inputs: ['Product Data', 'Process Data'],
        outputs: ['Monitoring Reports', 'Control Charts'],
        tags: ['monitoring', 'product', 'process'],
        link: { url: '/operations' },
        position: { x: 850, y: 1150 }
      }
    ];

    // Add all process nodes
    nodes.push(...managementProcesses);
    nodes.push(...customerProcesses);
    nodes.push(...supportProcesses);
    nodes.push(...assessmentProcesses);

    // Add documents as supporting nodes if they exist
    documents.forEach((doc, index) => {
      // Map document type to our DocType
      let docType: DocType;
      switch (doc.type) {
        case 'POLICY':
          docType = 'policy';
          break;
        case 'PROCEDURE':
          docType = 'procedure';
          break;
        case 'WORK_INSTRUCTION':
          docType = 'workInstruction';
          break;
        case 'REGISTER':
          docType = 'record';
          break;
        default:
          docType = 'procedure';
      }

      // Determine status based on document status
      let status: "green" | "amber" | "red" | "draft" | "archived" = "draft";
      switch (doc.status) {
        case 'APPROVED':
          status = 'green';
          break;
        case 'PENDING_APPROVAL':
          status = 'amber';
          break;
        case 'ARCHIVED':
          status = 'archived';
          break;
        default:
          status = 'draft';
      }

      // Parse ISO clauses
      let isoClauses: string[] = [];
      try {
        isoClauses = JSON.parse(doc.isoClauses || '[]');
      } catch {
        isoClauses = [];
      }

      nodes.push({
        id: doc.id,
        code: doc.code || undefined,
        title: doc.title,
        type: docType,
        description: `Document version ${doc.version}`,
        owner: doc.owner || undefined,
        version: doc.version,
        status,
        nextReviewDate: doc.nextReview ? doc.nextReview.toISOString() : undefined,
        isoClauses,
        location: ['Head Office'], // Default location
        roles: ['Quality Manager', 'Document Controller'], // Default roles
        inputs: ['Document Creation Request'],
        outputs: ['Controlled Document'],
        tags: [doc.type.toLowerCase(), 'documentation'],
        link: {
          url: doc.url || undefined,
        },
        position: {
          x: Math.random() * 800 + 100,
          y: Math.random() * 600 + 100,
        }
      });
    });

    // Add risks as risk assessment nodes
    risks.forEach((risk, index) => {
      let status: "green" | "amber" | "red" | "draft" | "archived" = "green";
      switch (risk.status) {
        case 'OPEN':
          status = 'amber';
          break;
        case 'TREATED':
          status = 'green';
          break;
        case 'CLOSED':
          status = 'green';
          break;
      }

      // Parse ISO clauses
      let isoClauses: string[] = [];
      try {
        isoClauses = JSON.parse(risk.isoRefs || '[]');
      } catch {
        isoClauses = [];
      }

      nodes.push({
        id: `risk-${risk.id}`,
        code: `RISK-${risk.id.slice(-4).toUpperCase()}`,
        title: risk.title,
        type: 'riskAssessment',
        description: `Risk assessment for ${risk.category.toLowerCase()} risks`,
        owner: risk.owner || undefined,
        version: '1.0',
        status,
        nextReviewDate: risk.reviewDate ? risk.reviewDate.toISOString() : undefined,
        isoClauses,
        location: ['All Sites'],
        roles: ['Risk Manager', 'Operations Manager'],
        inputs: ['Risk Identification'],
        outputs: ['Risk Register', 'Control Measures'],
        tags: ['risk', risk.category.toLowerCase()],
        position: {
          x: Math.random() * 800 + 100,
          y: Math.random() * 600 + 100,
        }
      });
    });

    // Add some sample external standards
    nodes.push({
      id: 'iso-9001',
      code: 'ISO-9001',
      title: 'ISO 9001:2015 Quality Management Systems',
      type: 'externalStandard',
      description: 'International standard for quality management systems',
      owner: 'ISO',
      version: '2015',
      status: 'green',
      nextReviewDate: '2027-12-31',
      isoClauses: ['ISO9001: All'],
      location: ['All Sites'],
      roles: ['Quality Manager', 'Management'],
      outputs: ['Compliance Requirements'],
      tags: ['iso', 'standard', 'quality'],
      link: {
        url: 'https://www.iso.org/standard/62085.html'
      },
      position: {
        x: 100,
        y: 100,
      }
    });

    nodes.push({
      id: 'iso-45001',
      code: 'ISO-45001',
      title: 'ISO 45001:2018 Occupational Health and Safety',
      type: 'externalStandard',
      description: 'International standard for occupational health and safety management systems',
      owner: 'ISO',
      version: '2018',
      status: 'green',
      nextReviewDate: '2027-12-31',
      isoClauses: ['ISO45001: All'],
      location: ['All Sites'],
      roles: ['H&S Manager', 'Management'],
      outputs: ['Compliance Requirements'],
      tags: ['iso', 'standard', 'health', 'safety'],
      link: {
        url: 'https://www.iso.org/standard/63787.html'
      },
      position: {
        x: 100,
        y: 200,
      }
    });

    // Create QMS Process Flow Edges
    // Management processes feed into customer requirements
    const managementPlanning = nodes.find(n => n.id === 'management-system-planning');
    const customerRequirements = nodes.find(n => n.id === 'customer-market-stakeholder-legal-requirements');
    
    if (managementPlanning && customerRequirements) {
      edges.push({
        id: 'msp-to-customer-requirements',
        source: managementPlanning.id,
        target: customerRequirements.id,
        relationship: 'prerequisite',
        label: 'Strategic Input',
        critical: true
      });
    }

    // Customer process flow (sequential)
    const quote = nodes.find(n => n.id === 'quote');
    const order = nodes.find(n => n.id === 'order');
    const contractReview = nodes.find(n => n.id === 'contract-review');
    const productPlanning = nodes.find(n => n.id === 'product-process-planning');
    const designDev = nodes.find(n => n.id === 'design-development');
    const supplierSelection = nodes.find(n => n.id === 'supplier-selection-evaluation');
    const incomingInspection = nodes.find(n => n.id === 'incoming-inspection-handling-storage');
    const production = nodes.find(n => n.id === 'production-processes');
    const storageDispatch = nodes.find(n => n.id === 'storage-dispatch-delivery');
    const customerFeedback = nodes.find(n => n.id === 'customer-market-stakeholder-feedback');

    // Sequential customer process flow
    if (customerRequirements && quote) {
      edges.push({
        id: 'requirements-to-quote',
        source: customerRequirements.id,
        target: quote.id,
        relationship: 'outputToInput',
        label: 'Requirements',
        critical: true
      });
    }
    if (quote && order) {
      edges.push({
        id: 'quote-to-order',
        source: quote.id,
        target: order.id,
        relationship: 'outputToInput',
        label: 'Accepted Quote',
        critical: true
      });
    }
    if (order && contractReview) {
      edges.push({
        id: 'order-to-contract',
        source: order.id,
        target: contractReview.id,
        relationship: 'outputToInput',
        label: 'Order Details',
        critical: true
      });
    }
    if (contractReview && productPlanning) {
      edges.push({
        id: 'contract-to-planning',
        source: contractReview.id,
        target: productPlanning.id,
        relationship: 'outputToInput',
        label: 'Approved Contract',
        critical: true
      });
    }
    if (productPlanning && designDev) {
      edges.push({
        id: 'planning-to-design',
        source: productPlanning.id,
        target: designDev.id,
        relationship: 'outputToInput',
        label: 'Design Requirements',
        critical: true
      });
    }
    if (designDev && supplierSelection) {
      edges.push({
        id: 'design-to-supplier',
        source: designDev.id,
        target: supplierSelection.id,
        relationship: 'outputToInput',
        label: 'Material Requirements',
        critical: true
      });
    }
    if (supplierSelection && incomingInspection) {
      edges.push({
        id: 'supplier-to-inspection',
        source: supplierSelection.id,
        target: incomingInspection.id,
        relationship: 'outputToInput',
        label: 'Supplied Materials',
        critical: true
      });
    }
    if (incomingInspection && production) {
      edges.push({
        id: 'inspection-to-production',
        source: incomingInspection.id,
        target: production.id,
        relationship: 'outputToInput',
        label: 'Approved Materials',
        critical: true
      });
    }
    if (production && storageDispatch) {
      edges.push({
        id: 'production-to-dispatch',
        source: production.id,
        target: storageDispatch.id,
        relationship: 'outputToInput',
        label: 'Finished Products',
        critical: true
      });
    }
    if (storageDispatch && customerFeedback) {
      edges.push({
        id: 'dispatch-to-feedback',
        source: storageDispatch.id,
        target: customerFeedback.id,
        relationship: 'outputToInput',
        label: 'Delivered Products',
        critical: true
      });
    }

    // Support processes interact with main flow
    const training = nodes.find(n => n.id === 'training-competence');
    const maintainEquipment = nodes.find(n => n.id === 'maintain-facilities-equipment');
    const calibrateEquipment = nodes.find(n => n.id === 'calibrate-equipment');
    const docControl = nodes.find(n => n.id === 'document-data-control');
    const controlRecords = nodes.find(n => n.id === 'control-records');

    // Training supports all processes
    if (training && production) {
      edges.push({
        id: 'training-to-production',
        source: training.id,
        target: production.id,
        relationship: 'prerequisite',
        label: 'Competent Staff',
        critical: true
      });
    }

    // Equipment maintenance and calibration support production
    if (maintainEquipment && production) {
      edges.push({
        id: 'maintenance-to-production',
        source: maintainEquipment.id,
        target: production.id,
        relationship: 'prerequisite',
        label: 'Maintained Equipment',
        critical: true
      });
    }
    if (calibrateEquipment && production) {
      edges.push({
        id: 'calibration-to-production',
        source: calibrateEquipment.id,
        target: production.id,
        relationship: 'prerequisite',
        label: 'Calibrated Equipment',
        critical: true
      });
    }

    // Document and record control support all processes
    if (docControl && production) {
      edges.push({
        id: 'doc-control-to-production',
        source: docControl.id,
        target: production.id,
        relationship: 'prerequisite',
        label: 'Controlled Documents',
        critical: true
      });
    }
    if (controlRecords && production) {
      edges.push({
        id: 'records-to-production',
        source: controlRecords.id,
        target: production.id,
        relationship: 'prerequisite',
        label: 'Record Management',
        critical: true
      });
    }

    // Assessment processes receive input from main flow
    const internalAudit = nodes.find(n => n.id === 'internal-auditing');
    const nonconformities = nodes.find(n => n.id === 'nonconformities');
    const customerSatisfaction = nodes.find(n => n.id === 'customer-satisfaction');
    const analyzeData = nodes.find(n => n.id === 'analyze-qms-data');
    const continualImprovement = nodes.find(n => n.id === 'continual-improvement');
    const correctivePreventive = nodes.find(n => n.id === 'corrective-preventive-action');
    const managementReview = nodes.find(n => n.id === 'management-review');
    const productMonitoring = nodes.find(n => n.id === 'product-process-monitoring');

    // Assessment processes receive input from delivery and feedback
    if (storageDispatch && customerSatisfaction) {
      edges.push({
        id: 'dispatch-to-satisfaction',
        source: storageDispatch.id,
        target: customerSatisfaction.id,
        relationship: 'evidence',
        label: 'Delivery Performance',
        critical: true
      });
    }
    if (customerFeedback && customerSatisfaction) {
      edges.push({
        id: 'feedback-to-satisfaction',
        source: customerFeedback.id,
        target: customerSatisfaction.id,
        relationship: 'evidence',
        label: 'Customer Input',
        critical: true
      });
    }

    // Assessment processes feed into analysis and improvement
    if (customerSatisfaction && analyzeData) {
      edges.push({
        id: 'satisfaction-to-analysis',
        source: customerSatisfaction.id,
        target: analyzeData.id,
        relationship: 'evidence',
        label: 'Satisfaction Data',
        critical: true
      });
    }
    if (internalAudit && analyzeData) {
      edges.push({
        id: 'audit-to-analysis',
        source: internalAudit.id,
        target: analyzeData.id,
        relationship: 'evidence',
        label: 'Audit Results',
        critical: true
      });
    }
    if (nonconformities && correctivePreventive) {
      edges.push({
        id: 'nc-to-cpa',
        source: nonconformities.id,
        target: correctivePreventive.id,
        relationship: 'evidence',
        label: 'Nonconformities',
        critical: true
      });
    }

    // Analysis feeds into improvement and management review
    if (analyzeData && continualImprovement) {
      edges.push({
        id: 'analysis-to-improvement',
        source: analyzeData.id,
        target: continualImprovement.id,
        relationship: 'evidence',
        label: 'Analysis Results',
        critical: true
      });
    }
    if (analyzeData && managementReview) {
      edges.push({
        id: 'analysis-to-review',
        source: analyzeData.id,
        target: managementReview.id,
        relationship: 'evidence',
        label: 'Performance Data',
        critical: true
      });
    }

    // Management review feeds back to planning
    if (managementReview && managementPlanning) {
      edges.push({
        id: 'review-to-planning',
        source: managementReview.id,
        target: managementPlanning.id,
        relationship: 'evidence',
        label: 'Review Outputs',
        critical: true
      });
    }

    // Create the management map
    const managementMap: ManagementMap = {
      metadata: {
        name: 'ComplianceOS QMS Process Flow Map',
        version: '3.0.0',
        generatedAt: new Date().toISOString()
      },
      nodes,
      edges,
      rolesCatalog: [
        'CEO/Board',
        'Executive Team',
        'CEO',
        'Operations Director',
        'Sales Director',
        'Sales Manager',
        'Sales Team',
        'Marketing Team',
        'HR Manager',
        'Training Coordinator',
        'Communication Team',
        'Legal Manager',
        'Legal Team',
        'Operations Manager',
        'Production Manager',
        'R&D Manager',
        'Design Team',
        'Engineering Team',
        'Procurement Manager',
        'Quality Manager',
        'Warehouse Manager',
        'Quality Inspector',
        'Logistics Manager',
        'Warehouse Staff',
        'Customer Service',
        'Facilities Manager',
        'Maintenance Team',
        'Calibration Technician',
        'Document Controller',
        'Records Manager',
        'Internal Auditors',
        'Process Owners',
        'Data Analyst',
        'Managers',
        'Supervisors',
        'Operators',
        'Employees'
      ],
      locationsCatalog: [
        'Head Office',
        'All Sites',
        'Sales Offices',
        'R&D Facilities',
        'Manufacturing Site'
      ],
      activitiesCatalog: [
        'Management System Planning',
        'Strategic Planning',
        'Resource Allocation',
        'System Governance',
        'Objective Setting',
        'Target Definition',
        'Performance Measurement',
        'Infrastructure Provision',
        'Facility Management',
        'Customer Requirements Analysis',
        'Market Intelligence',
        'Stakeholder Engagement',
        'Organizational Design',
        'Role Definition',
        'Business Planning',
        'Performance Monitoring',
        'Quotation Preparation',
        'Order Processing',
        'Contract Review',
        'Risk Assessment',
        'Product Planning',
        'Process Design',
        'Design Development',
        'Prototyping',
        'Supplier Evaluation',
        'Procurement',
        'Incoming Inspection',
        'Material Handling',
        'Storage Management',
        'Production Execution',
        'Service Delivery',
        'Quality Control',
        'Dispatch Management',
        'Customer Feedback Collection',
        'Communication Management',
        'Training Delivery',
        'Competence Development',
        'Equipment Maintenance',
        'Calibration',
        'Document Control',
        'Data Management',
        'Records Management',
        'Internal Auditing',
        'Nonconformity Management',
        'Corrective Action',
        'Preventive Action',
        'Customer Satisfaction Monitoring',
        'Data Analysis',
        'Performance Analysis',
        'Continual Improvement',
        'Management Review',
        'Product Monitoring',
        'Process Monitoring'
      ]
    };

    return NextResponse.json(managementMap);
  } catch (error) {
    console.error('Error fetching management map data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch management map data' 
    }, { status: 500 });
  }
}
