'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { FileText, Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ViewToggle } from '@/components/ui/view-toggle'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { ApprovalWorkflow } from '@/components/forms/ApprovalWorkflow'
import { WordEditor } from '@/components/documents/WordEditor'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportDocumentsToPDF } from '@/lib/pdf'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { getDocumentRAG } from '@/lib/rag'
import { LayoutDashboard, FileCheck, Clock, AlertCircle, FileSignature, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, FileEdit } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDocumentPrefix } from '@/lib/document-prefix'

interface Document {
  id: string
  type: string
  title: string
  code: string | undefined
  version: string
  status: string
  owner: string | null
  nextReview: Date | null
  url: string | undefined
  updatedAt: Date
}

export default function DocumentationPage() {
  const { prefix, generateDocumentCode, updateDocumentCode } = useDocumentPrefix()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filter, setFilter] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'board' | 'calendar'>('list')
  const [calendarView, setCalendarView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Document | undefined>()
  const [showApprovalWorkflow, setShowApprovalWorkflow] = useState(false)
  const [approvalDoc, setApprovalDoc] = useState<Document | null>(null)
  const [showWordEditor, setShowWordEditor] = useState(false)
  const [editorDoc, setEditorDoc] = useState<Document | null>(null)
  const [sortField, setSortField] = useState<keyof Document>('code')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')

  const loadDocuments = () => {
    setLoading(true)
    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        // Add comprehensive ISO 9001/14001/45001 procedures
        const isoProcedures = [
          // Core Management System Procedures
          {
            id: 'proc-doc-control',
            type: 'PROCEDURE',
            title: 'Document Control',
            code: generateDocumentCode('PROC', '001'),
            version: '3.2',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2025-06-30'),
            url: undefined,
            updatedAt: new Date('2025-01-15')
          },
          {
            id: 'proc-records-mgmt',
            type: 'PROCEDURE',
            title: 'Records Management',
            code: generateDocumentCode('PROC', '002'),
            version: '2.1',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2025-07-15'),
            url: undefined,
            updatedAt: new Date('2025-01-10')
          },
          {
            id: 'proc-info-control',
            type: 'PROCEDURE',
            title: 'Control of Information (Internal + External)',
            code: generateDocumentCode('PROC', '003'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'IT Manager',
            nextReview: new Date('2025-08-20'),
            url: undefined,
            updatedAt: new Date('2025-01-05')
          },
          {
            id: 'proc-mgmt-review',
            type: 'PROCEDURE',
            title: 'Management Review',
            code: generateDocumentCode('PROC', '004'),
            version: '2.5',
            status: 'APPROVED',
            owner: 'CEO',
            nextReview: new Date('2025-09-30'),
            url: undefined,
            updatedAt: new Date('2025-01-20')
          },
          {
            id: 'proc-internal-audit',
            type: 'PROCEDURE',
            title: 'Internal Audit',
            code: generateDocumentCode('PROC', '005'),
            version: '2.3',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2025-10-15'),
            url: undefined,
            updatedAt: new Date('2025-01-12')
          },
          {
            id: 'proc-capa',
            type: 'PROCEDURE',
            title: 'Corrective and Preventive Action',
            code: generateDocumentCode('PROC', '006'),
            version: '1.9',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2025-11-30'),
            url: undefined,
            updatedAt: new Date('2025-01-08')
          },
          {
            id: 'proc-nonconformance',
            type: 'PROCEDURE',
            title: 'Non-Conformance Management',
            code: generateDocumentCode('PROC', '007'),
            version: '2.0',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2025-12-15'),
            url: undefined,
            updatedAt: new Date('2025-01-18')
          },
          {
            id: 'proc-risk-opportunity',
            type: 'PROCEDURE',
            title: 'Risk & Opportunity Assessment',
            code: generateDocumentCode('PROC', '008'),
            version: '1.7',
            status: 'APPROVED',
            owner: 'Risk Manager',
            nextReview: new Date('2026-01-20'),
            url: undefined,
            updatedAt: new Date('2025-01-14')
          },
          {
            id: 'proc-context-org',
            type: 'PROCEDURE',
            title: 'Context of the Organisation',
            code: generateDocumentCode('PROC', '009'),
            version: '1.5',
            status: 'APPROVED',
            owner: 'CEO',
            nextReview: new Date('2026-02-28'),
            url: undefined,
            updatedAt: new Date('2025-01-16')
          },
          {
            id: 'proc-interested-parties',
            type: 'PROCEDURE',
            title: 'Interested Parties and Legal / Compliance Register',
            code: generateDocumentCode('PROC', '010'),
            version: '1.6',
            status: 'APPROVED',
            owner: 'Compliance Manager',
            nextReview: new Date('2026-03-15'),
            url: undefined,
            updatedAt: new Date('2025-01-22')
          },
          // Operational Procedures
          {
            id: 'proc-operational-control',
            type: 'PROCEDURE',
            title: 'Operational Control',
            code: generateDocumentCode('PROC', '011'),
            version: '2.2',
            status: 'APPROVED',
            owner: 'Operations Manager',
            nextReview: new Date('2026-04-10'),
            url: undefined,
            updatedAt: new Date('2025-01-25')
          },
          {
            id: 'proc-change-mgmt',
            type: 'PROCEDURE',
            title: 'Change Management',
            code: generateDocumentCode('PROC', '012'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'Change Manager',
            nextReview: new Date('2026-05-20'),
            url: undefined,
            updatedAt: new Date('2025-01-28')
          },
          {
            id: 'proc-procurement',
            type: 'PROCEDURE',
            title: 'Procurement / Supplier Evaluation',
            code: generateDocumentCode('PROC', '013'),
            version: '2.4',
            status: 'APPROVED',
            owner: 'Procurement Manager',
            nextReview: new Date('2026-06-15'),
            url: undefined,
            updatedAt: new Date('2025-01-30')
          },
          {
            id: 'proc-contract-service',
            type: 'PROCEDURE',
            title: 'Contract & Service Delivery Control',
            code: generateDocumentCode('PROC', '014'),
            version: '1.9',
            status: 'APPROVED',
            owner: 'Contract Manager',
            nextReview: new Date('2026-07-30'),
            url: undefined,
            updatedAt: new Date('2025-02-02')
          },
          {
            id: 'proc-outsourced-processes',
            type: 'PROCEDURE',
            title: 'Control of Outsourced Processes',
            code: generateDocumentCode('PROC', '015'),
            version: '1.7',
            status: 'APPROVED',
            owner: 'Operations Manager',
            nextReview: new Date('2026-08-25'),
            url: undefined,
            updatedAt: new Date('2025-02-05')
          },
          {
            id: 'proc-design-development',
            type: 'PROCEDURE',
            title: 'Design & Development Control',
            code: generateDocumentCode('PROC', '016'),
            version: '2.1',
            status: 'APPROVED',
            owner: 'Design Manager',
            nextReview: new Date('2026-09-20'),
            url: undefined,
            updatedAt: new Date('2025-02-08')
          },
          {
            id: 'proc-monitoring-measurement',
            type: 'PROCEDURE',
            title: 'Monitoring & Measurement Control',
            code: generateDocumentCode('PROC', '017'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2026-10-15'),
            url: undefined,
            updatedAt: new Date('2025-02-10')
          },
          {
            id: 'proc-calibration-equipment',
            type: 'PROCEDURE',
            title: 'Calibration / Equipment Maintenance',
            code: generateDocumentCode('PROC', '018'),
            version: '2.3',
            status: 'APPROVED',
            owner: 'Maintenance Manager',
            nextReview: new Date('2026-11-30'),
            url: undefined,
            updatedAt: new Date('2025-02-12')
          },
          // Quality-Specific Procedures (ISO 9001)
          {
            id: 'proc-product-service-realisation',
            type: 'PROCEDURE',
            title: 'Product / Service Realisation',
            code: generateDocumentCode('PROC', '019'),
            version: '2.0',
            status: 'APPROVED',
            owner: 'Operations Manager',
            nextReview: new Date('2026-12-20'),
            url: undefined,
            updatedAt: new Date('2025-02-15')
          },
          {
            id: 'proc-customer-requirements',
            type: 'PROCEDURE',
            title: 'Customer Requirements & Feedback',
            code: generateDocumentCode('PROC', '020'),
            version: '1.9',
            status: 'APPROVED',
            owner: 'Customer Service Manager',
            nextReview: new Date('2027-01-15'),
            url: undefined,
            updatedAt: new Date('2025-02-18')
          },
          {
            id: 'proc-nonconforming-product',
            type: 'PROCEDURE',
            title: 'Nonconforming Product / Service Control',
            code: generateDocumentCode('PROC', '021'),
            version: '2.2',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2027-02-28'),
            url: undefined,
            updatedAt: new Date('2025-02-20')
          },
          // Environmental-Specific Procedures (ISO 14001)
          {
            id: 'proc-env-aspects-impacts',
            type: 'PROCEDURE',
            title: 'Environmental Aspects & Impacts Assessment',
            code: generateDocumentCode('PROC', '022'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'Environmental Manager',
            nextReview: new Date('2027-03-20'),
            url: undefined,
            updatedAt: new Date('2025-02-22')
          },
          {
            id: 'proc-compliance-obligations',
            type: 'PROCEDURE',
            title: 'Compliance Obligations Review',
            code: generateDocumentCode('PROC', '023'),
            version: '1.7',
            status: 'APPROVED',
            owner: 'Compliance Manager',
            nextReview: new Date('2027-04-15'),
            url: undefined,
            updatedAt: new Date('2025-02-25')
          },
          {
            id: 'proc-waste-mgmt',
            type: 'PROCEDURE',
            title: 'Waste Management',
            code: generateDocumentCode('PROC', '024'),
            version: '2.1',
            status: 'APPROVED',
            owner: 'Environmental Manager',
            nextReview: new Date('2027-05-30'),
            url: undefined,
            updatedAt: new Date('2025-02-28')
          },
          {
            id: 'proc-resource-efficiency',
            type: 'PROCEDURE',
            title: 'Resource Efficiency & Energy Use',
            code: generateDocumentCode('PROC', '025'),
            version: '1.9',
            status: 'APPROVED',
            owner: 'Environmental Manager',
            nextReview: new Date('2027-06-20'),
            url: undefined,
            updatedAt: new Date('2025-03-02')
          },
          {
            id: 'proc-pollution-prevention',
            type: 'PROCEDURE',
            title: 'Pollution Prevention & Spill Control',
            code: generateDocumentCode('PROC', '026'),
            version: '2.0',
            status: 'APPROVED',
            owner: 'Environmental Manager',
            nextReview: new Date('2027-07-15'),
            url: undefined,
            updatedAt: new Date('2025-03-05')
          },
          {
            id: 'proc-emergency-prep-env',
            type: 'PROCEDURE',
            title: 'Emergency Preparedness & Response (Environmental)',
            code: generateDocumentCode('PROC', '027'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'Environmental Manager',
            nextReview: new Date('2027-08-30'),
            url: undefined,
            updatedAt: new Date('2025-03-08')
          },
          // Health & Safety-Specific Procedures (ISO 45001)
          {
            id: 'proc-hazard-risk-assessment',
            type: 'PROCEDURE',
            title: 'Hazard Identification & Risk Assessment',
            code: generateDocumentCode('PROC', '028'),
            version: '2.3',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2027-09-20'),
            url: undefined,
            updatedAt: new Date('2025-03-10')
          },
          {
            id: 'proc-legal-compliance-hs',
            type: 'PROCEDURE',
            title: 'Legal Compliance Evaluation (H&S)',
            code: generateDocumentCode('PROC', '029'),
            version: '1.9',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2027-10-15'),
            url: undefined,
            updatedAt: new Date('2025-03-12')
          },
          {
            id: 'proc-incident-accident',
            type: 'PROCEDURE',
            title: 'Incident & Accident Investigation',
            code: generateDocumentCode('PROC', '030'),
            version: '2.1',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2027-11-30'),
            url: undefined,
            updatedAt: new Date('2025-03-15')
          },
          {
            id: 'proc-emergency-prep-safety',
            type: 'PROCEDURE',
            title: 'Emergency Preparedness & Response (Safety)',
            code: generateDocumentCode('PROC', '031'),
            version: '2.0',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2027-12-20'),
            url: undefined,
            updatedAt: new Date('2025-03-18')
          },
          {
            id: 'proc-consultation-worker',
            type: 'PROCEDURE',
            title: 'Consultation & Worker Participation',
            code: generateDocumentCode('PROC', '032'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2028-01-15'),
            url: undefined,
            updatedAt: new Date('2025-03-20')
          },
          {
            id: 'proc-ppe-work-activities',
            type: 'PROCEDURE',
            title: 'PPE & Control of Work Activities',
            code: generateDocumentCode('PROC', '033'),
            version: '2.2',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2028-02-28'),
            url: undefined,
            updatedAt: new Date('2025-03-22')
          },
          {
            id: 'proc-contractor-mgmt',
            type: 'PROCEDURE',
            title: 'Contractor Management',
            code: generateDocumentCode('PROC', '034'),
            version: '1.9',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2028-03-20'),
            url: undefined,
            updatedAt: new Date('2025-03-25')
          },
          {
            id: 'proc-first-aid-welfare',
            type: 'PROCEDURE',
            title: 'First Aid & Welfare',
            code: generateDocumentCode('PROC', '035'),
            version: '1.7',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2028-04-15'),
            url: undefined,
            updatedAt: new Date('2025-03-28')
          },
          {
            id: 'proc-health-surveillance',
            type: 'PROCEDURE',
            title: 'Health Surveillance & Monitoring',
            code: generateDocumentCode('PROC', '036'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2028-05-30'),
            url: undefined,
            updatedAt: new Date('2025-03-30')
          },
          // Support & Awareness
          {
            id: 'proc-training-competence',
            type: 'PROCEDURE',
            title: 'Training & Competence',
            code: generateDocumentCode('PROC', '037'),
            version: '2.1',
            status: 'APPROVED',
            owner: 'HR Manager',
            nextReview: new Date('2028-06-20'),
            url: undefined,
            updatedAt: new Date('2025-04-02')
          },
          {
            id: 'proc-communication-awareness',
            type: 'PROCEDURE',
            title: 'Communication & Awareness',
            code: generateDocumentCode('PROC', '038'),
            version: '1.9',
            status: 'APPROVED',
            owner: 'HR Manager',
            nextReview: new Date('2028-07-15'),
            url: undefined,
            updatedAt: new Date('2025-04-05')
          },
          {
            id: 'proc-visitor-site-access',
            type: 'PROCEDURE',
            title: 'Visitor & Site Access Control',
            code: generateDocumentCode('PROC', '039'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'Security Manager',
            nextReview: new Date('2028-08-30'),
            url: undefined,
            updatedAt: new Date('2025-04-08')
          },
          // Performance Evaluation & Reporting
          {
            id: 'proc-continuous-improvement',
            type: 'PROCEDURE',
            title: 'Continuous Improvement',
            code: generateDocumentCode('PROC', '040'),
            version: '2.0',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2028-09-20'),
            url: undefined,
            updatedAt: new Date('2025-04-10')
          }
        ]

        // Add some sample SOP data
        const sampleSOPs = [
          {
            id: 'sop-1',
            type: 'SOP',
            title: 'Production Line Setup',
            code: generateDocumentCode('SOP-PROD', '001'),
            version: '2.1',
            status: 'APPROVED',
            owner: 'Operations Manager',
            nextReview: new Date('2025-04-01'),
            url: undefined,
            updatedAt: new Date('2025-01-10')
          },
          {
            id: 'sop-2',
            type: 'SOP',
            title: 'Quality Control Procedures',
            code: generateDocumentCode('SOP-QC', '002'),
            version: '1.8',
            status: 'PENDING_APPROVAL',
            owner: 'Quality Manager',
            nextReview: new Date('2025-03-15'),
            url: undefined,
            updatedAt: new Date('2024-12-15')
          },
          {
            id: 'sop-3',
            type: 'SOP',
            title: 'Safety Protocols',
            code: generateDocumentCode('SOP-SAF', '003'),
            version: '3.0',
            status: 'APPROVED',
            owner: 'Safety Officer',
            nextReview: new Date('2025-05-05'),
            url: undefined,
            updatedAt: new Date('2025-01-05')
          }
        ]

        // Add comprehensive Essential Company Policies
        const essentialPolicies = [
          {
            id: 'policy-quality',
            type: 'POLICY',
            title: 'Quality Policy',
            code: generateDocumentCode('POL', '001'),
            version: '2.0',
            status: 'APPROVED',
            owner: 'CEO',
            nextReview: new Date('2025-12-31'),
            url: undefined,
            updatedAt: new Date('2025-01-01')
          },
          {
            id: 'policy-environmental',
            type: 'POLICY',
            title: 'Environmental Policy',
            code: generateDocumentCode('POL', '002'),
            version: '1.5',
            status: 'APPROVED',
            owner: 'Environmental Manager',
            nextReview: new Date('2025-11-30'),
            url: undefined,
            updatedAt: new Date('2024-12-15')
          },
          {
            id: 'policy-health-safety',
            type: 'POLICY',
            title: 'Health & Safety Policy',
            code: generateDocumentCode('POL', '003'),
            version: '3.1',
            status: 'APPROVED',
            owner: 'H&S Manager',
            nextReview: new Date('2025-10-15'),
            url: undefined,
            updatedAt: new Date('2024-11-20')
          },
          {
            id: 'policy-info-security',
            type: 'POLICY',
            title: 'Information Security / Data Protection Policy',
            code: generateDocumentCode('POL', '004'),
            version: '2.2',
            status: 'APPROVED',
            owner: 'IT Manager',
            nextReview: new Date('2025-09-30'),
            url: undefined,
            updatedAt: new Date('2024-10-25')
          },
          {
            id: 'policy-risk-management',
            type: 'POLICY',
            title: 'Risk Management Policy',
            code: generateDocumentCode('POL', '005'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'Risk Manager',
            nextReview: new Date('2025-08-20'),
            url: undefined,
            updatedAt: new Date('2024-09-15')
          },
          {
            id: 'policy-anti-bribery',
            type: 'POLICY',
            title: 'Anti-Bribery & Corruption Policy',
            code: generateDocumentCode('POL', '006'),
            version: '1.4',
            status: 'APPROVED',
            owner: 'Compliance Manager',
            nextReview: new Date('2025-07-15'),
            url: undefined,
            updatedAt: new Date('2024-08-10')
          },
          {
            id: 'policy-equality-diversity',
            type: 'POLICY',
            title: 'Equality, Diversity & Inclusion Policy',
            code: generateDocumentCode('POL', '007'),
            version: '2.1',
            status: 'APPROVED',
            owner: 'HR Manager',
            nextReview: new Date('2025-06-30'),
            url: undefined,
            updatedAt: new Date('2024-07-05')
          },
          {
            id: 'policy-csr',
            type: 'POLICY',
            title: 'Corporate Social Responsibility (CSR) Policy',
            code: generateDocumentCode('POL', '008'),
            version: '1.7',
            status: 'APPROVED',
            owner: 'CEO',
            nextReview: new Date('2025-05-25'),
            url: undefined,
            updatedAt: new Date('2024-06-20')
          },
          {
            id: 'policy-whistleblowing',
            type: 'POLICY',
            title: 'Whistleblowing & Ethics Policy',
            code: generateDocumentCode('POL', '009'),
            version: '1.9',
            status: 'APPROVED',
            owner: 'Compliance Manager',
            nextReview: new Date('2025-04-20'),
            url: undefined,
            updatedAt: new Date('2024-05-15')
          },
          {
            id: 'policy-supplier-procurement',
            type: 'POLICY',
            title: 'Supplier & Procurement Policy',
            code: generateDocumentCode('POL', '010'),
            version: '2.3',
            status: 'APPROVED',
            owner: 'Procurement Manager',
            nextReview: new Date('2025-03-15'),
            url: undefined,
            updatedAt: new Date('2024-04-10')
          },
          {
            id: 'policy-business-continuity',
            type: 'POLICY',
            title: 'Business Continuity / Disaster Recovery Policy',
            code: generateDocumentCode('POL', '011'),
            version: '1.6',
            status: 'APPROVED',
            owner: 'Operations Manager',
            nextReview: new Date('2025-02-28'),
            url: undefined,
            updatedAt: new Date('2024-03-25')
          },
          {
            id: 'policy-document-control',
            type: 'POLICY',
            title: 'Document Control & Records Retention Policy',
            code: generateDocumentCode('POL', '012'),
            version: '2.4',
            status: 'APPROVED',
            owner: 'Document Controller',
            nextReview: new Date('2025-01-31'),
            url: undefined,
            updatedAt: new Date('2024-02-20')
          },
          {
            id: 'policy-complaints-feedback',
            type: 'POLICY',
            title: 'Complaints & Feedback Policy',
            code: generateDocumentCode('POL', '013'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'Customer Service Manager',
            nextReview: new Date('2024-12-31'),
            url: undefined,
            updatedAt: new Date('2024-01-15')
          },
          {
            id: 'policy-continuous-improvement',
            type: 'POLICY',
            title: 'Continuous Improvement Policy',
            code: generateDocumentCode('POL', '014'),
            version: '2.0',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2024-11-30'),
            url: undefined,
            updatedAt: new Date('2023-12-10')
          }
        ]

        // Add sample Work Instructions
        const sampleWorkInstructions = [
          {
            id: 'wi-1',
            type: 'WORK_INSTRUCTION',
            title: 'Document Creation Process',
            code: generateDocumentCode('WI', '001'),
            version: '1.2',
            status: 'APPROVED',
            owner: 'Document Controller',
            nextReview: new Date('2025-08-15'),
            url: undefined,
            updatedAt: new Date('2025-01-05')
          },
          {
            id: 'wi-2',
            type: 'WORK_INSTRUCTION',
            title: 'Internal Audit Process',
            code: generateDocumentCode('WI', '002'),
            version: '2.0',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2025-09-20'),
            url: undefined,
            updatedAt: new Date('2024-12-10')
          },
          {
            id: 'wi-3',
            type: 'WORK_INSTRUCTION',
            title: 'Supplier Evaluation Process',
            code: generateDocumentCode('WI', '003'),
            version: '1.8',
            status: 'APPROVED',
            owner: 'Procurement Manager',
            nextReview: new Date('2025-07-30'),
            url: undefined,
            updatedAt: new Date('2024-11-25')
          }
        ]

        // Add sample Registers
        const sampleRegisters = [
          {
            id: 'reg-1',
            type: 'REGISTER',
            title: 'Document Register',
            code: generateDocumentCode('REG', '001'),
            version: '1.0',
            status: 'APPROVED',
            owner: 'Document Controller',
            nextReview: new Date('2025-06-30'),
            url: undefined,
            updatedAt: new Date('2025-01-10')
          },
          {
            id: 'reg-2',
            type: 'REGISTER',
            title: 'Training Register',
            code: generateDocumentCode('REG', '002'),
            version: '2.1',
            status: 'APPROVED',
            owner: 'HR Manager',
            nextReview: new Date('2025-05-15'),
            url: undefined,
            updatedAt: new Date('2024-12-20')
          },
          {
            id: 'reg-3',
            type: 'REGISTER',
            title: 'Non-Conformance Register',
            code: generateDocumentCode('REG', '003'),
            version: '1.5',
            status: 'APPROVED',
            owner: 'Quality Manager',
            nextReview: new Date('2025-04-20'),
            url: undefined,
            updatedAt: new Date('2024-11-30')
          }
        ]
        
        // Filter out any existing policies, procedures, work instructions, and registers from API data to avoid duplicates
        const filteredApiData = data.filter(doc => doc.type !== 'POLICY' && doc.type !== 'PROCEDURE' && doc.type !== 'WORK_INSTRUCTION' && doc.type !== 'REGISTER')
        setDocuments([...filteredApiData, ...isoProcedures, ...sampleSOPs, ...essentialPolicies, ...sampleWorkInstructions, ...sampleRegisters])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load documents:', err)
        setLoading(false)
      })
  }

  // RAG system helper function for document status
  const getRAGStatus = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'green'
      case 'DRAFT':
        return 'red'
      case 'PENDING_APPROVAL':
        return 'amber'
      case 'ARCHIVED':
        return 'navy'
      default:
        return 'green'
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [prefix]) // Reload when prefix changes

  // Filter and sort logic
  const handleSort = (field: keyof Document) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedDocs = documents
    // Filter by tab
    .filter(d => filter === 'ALL' || filter === 'DASHBOARD' || d.type === filter)
    // Filter by status
    .filter(d => statusFilter === 'ALL' || d.status === statusFilter)
    // Filter by type (secondary filter)
    .filter(d => typeFilter === 'ALL' || d.type === typeFilter)
    // Search filter
    .filter(d => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return (
        d.title.toLowerCase().includes(search) ||
        (d.code?.toLowerCase() || '').includes(search) ||
        (d.owner?.toLowerCase() || '').includes(search)
      )
    })
    // Sort
    .sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      // Handle null values
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      
      // Handle date fields specially
      if (sortField === 'nextReview' || sortField === 'updatedAt') {
        const aDate = aVal instanceof Date ? aVal : new Date(aVal as string)
        const bDate = bVal instanceof Date ? bVal : new Date(bVal as string)
        
        if (sortDirection === 'asc') {
          return aDate.getTime() - bDate.getTime()
        } else {
          return bDate.getTime() - aDate.getTime()
        }
      }
      
      // Handle numeric fields
      if (sortField === 'version') {
        const aNum = parseFloat(String(aVal))
        const bNum = parseFloat(String(bVal))
        
        if (sortDirection === 'asc') {
          return aNum - bNum
        } else {
          return bNum - aNum
        }
      }
      
      // Convert to string for comparison (for text fields)
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredDocs = filteredAndSortedDocs

  const handleExport = () => {
    const csv = convertToCSV(filteredDocs.map(d => ({
      Type: d.type,
      Title: d.title,
      Code: d.code || '-',
      Version: d.version,
      Status: d.status,
      Owner: d.owner || '-',
      'Next Review': d.nextReview ? formatDate(d.nextReview) : '-',
    })))
    downloadFile(csv, `documents-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const tabs = [
    { key: 'DASHBOARD', label: 'Dashboard' },
    { key: 'ALL', label: 'All Documents' },
    { key: 'POLICY', label: 'Policies' },
    { key: 'PROCEDURE', label: 'Procedures' },
    { key: 'WORK_INSTRUCTION', label: 'Work Instructions' },
    { key: 'SOP', label: 'SOP' },
    { key: 'REGISTER', label: 'Registers' },
  ]

  // Calculate dashboard stats
  const docStats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'APPROVED').length,
    draft: documents.filter(d => d.status === 'DRAFT').length,
    archived: documents.filter(d => d.status === 'ARCHIVED').length,
    dueReview: documents.filter(d => d.nextReview && getDocumentRAG(d.nextReview) !== 'green').length,
    policies: documents.filter(d => d.type === 'POLICY').length,
    procedures: documents.filter(d => d.type === 'PROCEDURE').length,
    wis: documents.filter(d => d.type === 'WORK_INSTRUCTION').length,
    sops: documents.filter(d => d.type === 'SOP').length,
    registers: documents.filter(d => d.type === 'REGISTER').length,
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading documents...</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Documentation</h1>
            <p className="text-slate-600 mt-1">Policies, procedures, work instructions, and registers</p>
          </div>
          <div className="flex items-center gap-2">
            {filter !== 'DASHBOARD' && (
              <div className="flex items-center gap-4">
                <ViewToggle view={viewMode} onViewChange={setViewMode} />
              </div>
            )}
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => exportDocumentsToPDF(filteredDocs)}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={() => { setEditingDoc(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    filter === tab.key
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {filter === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Documents</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{docStats.total}</p>
                  </div>
                  <FileText className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Approved</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{docStats.approved}</p>
                  </div>
                  <FileCheck className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Ready for use</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Draft</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{docStats.draft}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Pending approval</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Due for Review</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{docStats.dueReview}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Next 30 days</p>
              </div>
            </div>

            {/* Document Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <button
                onClick={() => setFilter('POLICY')}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-blue-900">Policies</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{docStats.policies}</p>
                <p className="text-xs text-blue-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => setFilter('PROCEDURE')}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-purple-900">Procedures</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{docStats.procedures}</p>
                <p className="text-xs text-purple-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => setFilter('WORK_INSTRUCTION')}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-emerald-900">Work Instructions</p>
                <p className="text-3xl font-bold text-emerald-900 mt-2">{docStats.workInstructions}</p>
                <p className="text-xs text-emerald-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => setFilter('SOP')}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-orange-900">SOP</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">{docStats.sops}</p>
                <p className="text-xs text-orange-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => setFilter('REGISTER')}
                className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-amber-900">Registers</p>
                <p className="text-3xl font-bold text-amber-900 mt-2">{docStats.registers}</p>
                <p className="text-xs text-amber-700 mt-1">Click to view →</p>
              </button>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Document Status Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-700">Approved & Current</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{docStats.approved - docStats.dueReview}</span>
                    <span className="text-sm text-slate-500">
                      ({Math.round(((docStats.approved - docStats.dueReview) / docStats.total) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-700">Draft / Pending</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{docStats.draft}</span>
                    <span className="text-sm text-slate-500">
                      ({Math.round((docStats.draft / docStats.total) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="text-slate-700">Due for Review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{docStats.dueReview}</span>
                    <span className="text-sm text-slate-500">
                      ({Math.round((docStats.dueReview / docStats.total) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Document Control Compliance</span>
                  <span className="font-semibold">
                    {Math.round(((docStats.approved / docStats.total) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full transition-all"
                    style={{ width: `${(docStats.approved / docStats.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  ISO 9001:7.5 & ISO 14001:7.5 - Documented Information
                </p>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Recently Updated Documents</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {documents
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 5)
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50 p-2 rounded"
                        onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">{doc.title}</p>
                            <p className="text-sm text-slate-500">{doc.code} • v{doc.version} • {doc.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <StatusBadge status={getDocumentRAG(doc.nextReview)} label={doc.status} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View Controls */}
        {filter !== 'DASHBOARD' && viewMode === 'calendar' && (
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">View:</span>
              <div className="flex gap-1">
                {[
                  { key: 'daily', label: 'Daily' },
                  { key: 'weekly', label: 'Weekly' },
                  { key: 'monthly', label: 'Monthly' },
                  { key: 'yearly', label: 'Yearly' }
                ].map((view) => (
                  <button
                    key={view.key}
                    onClick={() => setCalendarView(view.key as 'daily' | 'weekly' | 'monthly' | 'yearly')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      calendarView === view.key
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters (List View Only) */}
        {filter !== 'DASHBOARD' && viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by title, code, or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="POLICY">Policy</SelectItem>
                    <SelectItem value="PROCEDURE">Procedure</SelectItem>
                    <SelectItem value="WORK_INSTRUCTION">Work Instruction</SelectItem>
                    <SelectItem value="SOP">SOP</SelectItem>
                    <SelectItem value="REGISTER">Register</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: &quot;{searchTerm}&quot;
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {statusFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter.replace('_', ' ')}
                    <button onClick={() => setStatusFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {typeFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {typeFilter.replace('_', ' ')}
                    <button onClick={() => setTypeFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setTypeFilter('ALL')
                  }}
                  className="ml-auto text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Count */}
            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredDocs.length} of {documents.filter(d => filter === 'ALL' || d.type === filter).length} documents
            </p>
          </div>
        )}

        {/* Document Grid/List View */}
        {filter !== 'DASHBOARD' && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                    <Badge variant={doc.status === 'APPROVED' ? 'default' : 'secondary'}>
                      {doc.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-2">{doc.title}</h3>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Code:</span> {doc.code || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Version:</span> {doc.version}
                    </p>
                    <p>
                      <span className="font-medium">Owner:</span> {doc.owner || 'Unassigned'}
                    </p>
                    <p>
                      <span className="font-medium">Next Review:</span> {formatDate(doc.nextReview)}
                    </p>
                  </div>

                  {doc.url && (
                    <a
                      href={doc.url}
                      className="mt-4 inline-block text-sm text-slate-900 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Document →
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  {/* Edit in Word Button */}
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditorDoc(doc)
                      setShowWordEditor(true)
                    }}
                  >
                    <FileEdit className="h-4 w-4 mr-2" />
                    Edit in Word
                  </Button>

                  {/* Approval Button */}
                  {(doc.status === 'PENDING_APPROVAL' || doc.status === 'APPROVED') && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        setApprovalDoc(doc)
                        setShowApprovalWorkflow(true)
                      }}
                    >
                      <FileSignature className="h-4 w-4 mr-2" />
                      View Approvals
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Document Table View */}
        {filter !== 'DASHBOARD' && viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full min-w-full table-fixed">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th 
                    className="w-48 px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center gap-2">
                      Code
                      {sortField === 'code' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="w-1/4 px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      Title
                      {sortField === 'title' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="w-24 px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      {sortField === 'type' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="w-20 px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('version')}
                  >
                    <div className="flex items-center gap-2">
                      Version
                      {sortField === 'version' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="w-40 px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('owner')}
                  >
                    <div className="flex items-center gap-2">
                      Owner
                      {sortField === 'owner' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="w-32 px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Status
                      {sortField === 'status' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="w-16 px-3 py-3 text-center text-xs font-medium text-slate-700 uppercase"
                  >
                    Edit
                  </th>
                  <th 
                    className="w-16 px-3 py-3 text-center text-xs font-medium text-slate-700 uppercase"
                  >
                    Approvals
                  </th>
                  <th 
                    className="w-32 px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('nextReview')}
                  >
                    <div className="flex items-center gap-2">
                      Next Review
                      {sortField === 'nextReview' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDocs.map((doc) => (
                  <tr 
                    key={doc.id} 
                    className="hover:bg-slate-50"
                  >
                    <td 
                      className="w-48 px-6 py-4 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-slate-400 flex-shrink-0" />
                        <span className="font-mono text-sm font-semibold text-slate-900 truncate">{doc.code || '-'}</span>
                      </div>
                    </td>
                    <td 
                      className="w-1/4 px-6 py-4 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      <span className="font-medium text-slate-900 truncate block">{doc.title}</span>
                    </td>
                    <td 
                      className="w-24 px-6 py-4 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      <Badge variant="outline" className="truncate">{doc.type.replace('_', ' ')}</Badge>
                    </td>
                    <td 
                      className="w-20 px-6 py-4 text-sm text-slate-600 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      <span className="truncate block">{doc.version}</span>
                    </td>
                    <td 
                      className="w-40 px-6 py-4 text-sm text-slate-600 cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      <span className="truncate block">{doc.owner || '-'}</span>
                    </td>
                    <td className="w-32 px-6 py-4 text-center">
                      <Badge 
                        variant={doc.status === 'APPROVED' ? 'default' : 'secondary'} 
                        className={`truncate text-xs ${
                          getRAGStatus(doc.status) === 'red' 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : getRAGStatus(doc.status) === 'amber' 
                            ? 'bg-amber-100 text-amber-800 border-amber-200' 
                            : getRAGStatus(doc.status) === 'navy'
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-green-100 text-green-800 border-green-200'
                        }`}
                      >
                        {doc.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="w-16 px-3 py-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditorDoc(doc)
                          setShowWordEditor(true)
                        }}
                        className="h-7 w-7 p-0"
                        title="Edit in Word"
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="w-16 px-3 py-4 text-center">
                      {(doc.status === 'PENDING_APPROVAL' || doc.status === 'APPROVED') ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setApprovalDoc(doc)
                            setShowApprovalWorkflow(true)
                          }}
                          className="h-7 w-7 p-0"
                          title="View Approvals"
                        >
                          <FileSignature className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td 
                      className="w-32 px-6 py-4 text-sm cursor-pointer"
                      onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                    >
                      <span className={`truncate block px-2 py-1 rounded-md ${
                        getRAGStatus(doc.nextReview) === 'red' 
                          ? 'bg-red-100 text-red-800' 
                          : getRAGStatus(doc.nextReview) === 'amber' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {formatDate(doc.nextReview)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Board View (Kanban) - Approval Workflow */}
        {filter !== 'DASHBOARD' && viewMode === 'board' && (
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-4">
              {/* DRAFT Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Draft</h3>
                    <Badge variant="secondary">
                      {filteredDocs.filter(d => d.status === 'DRAFT').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredDocs
                      .filter(d => d.status === 'DRAFT')
                      .map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-slate-400"
                          onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                            <span className="text-xs text-slate-500">{doc.version}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{doc.code}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{doc.title}</h4>
                          <div className="text-xs text-slate-600">
                            <p>{doc.owner || 'Unassigned'}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* PENDING APPROVAL Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Pending Approval</h3>
                    <Badge variant="secondary">
                      {filteredDocs.filter(d => d.status === 'PENDING_APPROVAL').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredDocs
                      .filter(d => d.status === 'PENDING_APPROVAL')
                      .map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-amber-500"
                          onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                            <span className="text-xs text-slate-500">{doc.version}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{doc.code}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{doc.title}</h4>
                          <div className="text-xs text-slate-600">
                            <p>{doc.owner || 'Unassigned'}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              setApprovalDoc(doc)
                              setShowApprovalWorkflow(true)
                            }}
                          >
                            <FileSignature className="h-3 w-3 mr-1" />
                            Approvals
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* APPROVED Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Approved</h3>
                    <Badge variant="secondary">
                      {filteredDocs.filter(d => d.status === 'APPROVED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredDocs
                      .filter(d => d.status === 'APPROVED')
                      .map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-emerald-500"
                          onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                            <span className="text-xs text-slate-500">{doc.version}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{doc.code}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{doc.title}</h4>
                          <div className="text-xs text-slate-600">
                            <p>{doc.owner || 'Unassigned'}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* ARCHIVED Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Archived</h3>
                    <Badge variant="secondary">
                      {filteredDocs.filter(d => d.status === 'ARCHIVED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredDocs
                      .filter(d => d.status === 'ARCHIVED')
                      .map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-slate-300 opacity-75"
                          onClick={() => { setEditingDoc(doc); setShowForm(true); }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                            <span className="text-xs text-slate-500">{doc.version}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{doc.code}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{doc.title}</h4>
                          <div className="text-xs text-slate-600">
                            <p>{doc.owner || 'Unassigned'}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filter !== 'DASHBOARD' && filteredDocs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No documents found</p>
          </div>
        )}

        <DocumentForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingDoc(undefined); }}
          document={editingDoc}
          onSave={loadDocuments}
          nextSequence={documents.length + 1}
        />

        {approvalDoc && (
          <ApprovalWorkflow
            open={showApprovalWorkflow}
            onClose={() => { setShowApprovalWorkflow(false); setApprovalDoc(null); }}
            documentId={approvalDoc.id}
            documentTitle={approvalDoc.title}
            currentApprovals={[]}
          />
        )}

        {/* Calendar View */}
        {filter !== 'DASHBOARD' && viewMode === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Document Review Calendar - {calendarView.charAt(0).toUpperCase() + calendarView.slice(1)} View
              </h3>
            <div className="text-sm text-slate-600">
              <span className="inline-block w-3 h-3 bg-red-100 rounded-full mr-2"></span>
              Draft (Review Due)
              <span className="inline-block w-3 h-3 bg-amber-100 rounded-full mr-2 ml-4"></span>
              Pending Approval (Review Due)
              <span className="inline-block w-3 h-3 bg-green-100 rounded-full mr-2 ml-4"></span>
              Approved (Review Due)
              <span className="inline-block w-3 h-3 bg-slate-800 rounded-full mr-2 ml-4"></span>
              Archived (Review Due)
            </div>
            </div>

            {/* Calendar Content */}
            {calendarView === 'daily' && (
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold mb-4">Today's Review Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocs
                    .filter(doc => {
                      if (!doc.nextReview) return false
                      const today = new Date()
                      const reviewDate = new Date(doc.nextReview)
                      return reviewDate.toDateString() === today.toDateString()
                    })
                    .map(doc => (
                      <div key={doc.id} className={`p-4 rounded-lg border-2 ${
                        getRAGStatus(doc.status) === 'red' 
                          ? 'border-red-200 bg-red-50' 
                          : getRAGStatus(doc.status) === 'amber' 
                          ? 'border-amber-200 bg-amber-50' 
                          : getRAGStatus(doc.status) === 'navy'
                          ? 'border-slate-800 bg-slate-100'
                          : 'border-green-200 bg-green-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{doc.title}</span>
                          <Badge variant={getRAGStatus(doc.status) === 'red' ? 'destructive' : 'secondary'} className="text-xs">
                            {doc.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-600">{doc.code}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Review due: {formatDate(doc.nextReview)}
                        </div>
                      </div>
                    ))}
                  {filteredDocs.filter(doc => {
                    if (!doc.nextReview) return false
                    const today = new Date()
                    const reviewDate = new Date(doc.nextReview)
                    return reviewDate.toDateString() === today.toDateString()
                  }).length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-500">No reviews scheduled for today</div>
                  )}
                </div>
              </div>
            )}

            {calendarView === 'weekly' && (
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold mb-4">This Week's Review Schedule</h4>
                <div className="grid grid-cols-7 gap-2">
                  {/* Day headers */}
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-slate-600 py-2 border-b">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar cells */}
                  {Array.from({ length: 7 }, (_, i) => {
                    const today = new Date()
                    const startOfWeek = new Date(today)
                    startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
                    const dayDate = new Date(startOfWeek)
                    dayDate.setDate(startOfWeek.getDate() + i)
                    
                    const docsForDay = filteredDocs.filter(doc => {
                      if (!doc.nextReview) return false
                      const reviewDate = new Date(doc.nextReview)
                      return reviewDate.toDateString() === dayDate.toDateString()
                    })
                    
                    return (
                      <div key={i} className="min-h-32 border border-slate-200 p-2">
                        <div className="text-xs text-slate-500 mb-1">
                          {dayDate.getDate()}/{dayDate.getMonth() + 1}
                        </div>
                        <div className="space-y-1">
                          {docsForDay.map(doc => (
                            <div key={doc.id} className={`text-xs p-1 rounded ${
                              getRAGStatus(doc.status) === 'red' 
                                ? 'bg-red-100 text-red-800' 
                                : getRAGStatus(doc.status) === 'amber' 
                                ? 'bg-amber-100 text-amber-800' 
                                : getRAGStatus(doc.status) === 'navy'
                                ? 'bg-slate-800 text-white'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              <div className="truncate font-medium">{doc.title}</div>
                              <div className="truncate text-xs opacity-75">{doc.code}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {calendarView === 'monthly' && (
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold mb-4">This Month's Review Schedule</h4>
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-slate-600 py-2 border-b">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar cells - 6 weeks x 7 days = 42 cells */}
                  {Array.from({ length: 42 }, (_, i) => {
                    const today = new Date()
                    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                    const startOfCalendar = new Date(firstDayOfMonth)
                    startOfCalendar.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay() + 1) // Monday
                    
                    const dayDate = new Date(startOfCalendar)
                    dayDate.setDate(startOfCalendar.getDate() + i)
                    
                    const docsForDay = filteredDocs.filter(doc => {
                      if (!doc.nextReview) return false
                      const reviewDate = new Date(doc.nextReview)
                      return reviewDate.toDateString() === dayDate.toDateString()
                    })
                    
                    return (
                      <div key={i} className={`min-h-20 border border-slate-200 p-1 ${
                        dayDate.getMonth() !== today.getMonth() ? 'bg-slate-50' : ''
                      }`}>
                        <div className="text-xs text-slate-500 mb-1">
                          {dayDate.getDate()}
                        </div>
                        <div className="space-y-1">
                          {docsForDay.slice(0, 2).map(doc => (
                            <div key={doc.id} className={`text-xs p-1 rounded ${
                              getRAGStatus(doc.status) === 'red' 
                                ? 'bg-red-100 text-red-800' 
                                : getRAGStatus(doc.status) === 'amber' 
                                ? 'bg-amber-100 text-amber-800' 
                                : getRAGStatus(doc.status) === 'navy'
                                ? 'bg-slate-800 text-white'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              <div className="truncate font-medium">{doc.title}</div>
                            </div>
                          ))}
                          {docsForDay.length > 2 && (
                            <div className="text-xs text-slate-500 text-center">
                              +{docsForDay.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {calendarView === 'yearly' && (
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold mb-4">This Year's Review Schedule by Month</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map(month => {
                    const monthIndex = [
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].indexOf(month)
                    
                    const monthDocs = filteredDocs.filter(doc => {
                      if (!doc.nextReview) return false
                      const reviewDate = new Date(doc.nextReview)
                      return reviewDate.getMonth() === monthIndex && reviewDate.getFullYear() === new Date().getFullYear()
                    })
                    
                    return (
                      <div key={month} className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 text-center">{month}</h5>
                        <div className="space-y-2">
                          {monthDocs.slice(0, 4).map(doc => (
                            <div key={doc.id} className={`text-sm p-2 rounded ${
                              getRAGStatus(doc.status) === 'red' 
                                ? 'bg-red-100 text-red-800' 
                                : getRAGStatus(doc.status) === 'amber' 
                                ? 'bg-amber-100 text-amber-800' 
                                : getRAGStatus(doc.status) === 'navy'
                                ? 'bg-slate-800 text-white'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              <div className="font-medium truncate">{doc.title}</div>
                              <div className="text-xs opacity-75">{doc.code}</div>
                              <div className="text-xs opacity-75">
                                Due: {formatDate(doc.nextReview)}
                              </div>
                            </div>
                          ))}
                          {monthDocs.length > 4 && (
                            <div className="text-xs text-slate-500 text-center">
                              +{monthDocs.length - 4} more reviews
                            </div>
                          )}
                          {monthDocs.length === 0 && (
                            <div className="text-xs text-slate-400 text-center py-4">No reviews due</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {editorDoc && (
          <WordEditor
            open={showWordEditor}
            onClose={() => { setShowWordEditor(false); setEditorDoc(null); }}
            document={editorDoc}
            onRefresh={loadDocuments}
          />
        )}
      </div>
    </Shell>
  )
}

