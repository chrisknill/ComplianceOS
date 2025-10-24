# ComplianceOS Functional Data Flow Specification (FDFS)

## Overview
This document provides a comprehensive mapping of ComplianceOS components, their interactions, data flows, and automation triggers. It serves as the definitive guide for understanding how each module, page, and component connects within the system.

---

## System Architecture Map

### Core Modules
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   Dashboard     │   Employees     │   Risk Mgmt     │   Equipment     │
│   (Overview)    │   (Org Chart)   │   (Assessments) │   (Management)  │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
         │                 │                 │                 │
         └─────────────────┼─────────────────┼─────────────────┘
                           │                 │
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   Audits        │   Training       │   Contracts     │   Work Progress  │
│   (Inspections) │   (Management)   │   (Review)       │   (Tracking)    │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
         │                 │                 │                 │
         └─────────────────┼─────────────────┼─────────────────┘
                           │                 │
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   OHS Actions   │   Management    │   Customer      │   Integrations   │
│   (Safety)      │   Review        │   Satisfaction   │   (External)     │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## Functional Specification Matrix

| Module | Page | Function | Input Fields | Output Data | Linked Pages | Automation Trigger | Workflow | Return Result | Dependencies |
|--------|------|----------|--------------|-------------|--------------|-------------------|----------|---------------|--------------|
| **Dashboard** | Overview | Display KPIs & Stats | User Session | Aggregated Metrics | All Modules | Manual Refresh | Dashboard API | JSON Data | All Modules |
| **Dashboard** | Quick Add | Create New Records | Form Fields | Record JSON | Target Module | Form Submit | API POST | Success Response | Target Module API |
| **Dashboard** | KPI | Performance Metrics | Date Range | KPI Data | Dashboard Overview | Auto Refresh | KPI Calculation | Metrics JSON | All Data Sources |
| **Employees** | Main Page | Employee Management | Search Filters | Employee List | Employee Details | Search/Filter | Employee API | Employee Array | Database |
| **Employees** | Org Chart | Organizational Structure | Employee Data | Hierarchy JSON | Employee Details | Data Load | Org Chart Render | Visual Chart | Employee API |
| **Employees** | Employee Form | Add/Edit Employee | Form Fields | Employee Object | Employee List | Form Submit | Employee API | Success Response | Database |
| **Risk** | Risk Assessment | Risk Management | Risk Data | Risk Object | Risk List | Risk Submit | Risk API | Risk Record | Database |
| **Risk** | Risk List | View All Risks | Filters | Risk Array | Risk Details | Filter Change | Risk API | Filtered Results | Database |
| **Equipment** | Equipment List | Equipment Management | Equipment Data | Equipment Object | Equipment Details | Equipment Submit | Equipment API | Success Response | Database |
| **Equipment** | Calibration | Calibration Tracking | Calibration Data | Calibration Object | Calibration List | Calibration Submit | Calibration API | Success Response | Database |
| **Audits** | Audit List | Audit Management | Audit Data | Audit Object | Audit Details | Audit Submit | Audit API | Success Response | Database |
| **Audits** | Audit Types | Audit Type Management | Type Data | Type Object | Audit List | Type Submit | Type API | Success Response | Database |
| **Training** | Training List | Training Management | Training Data | Training Object | Training Details | Training Submit | Training API | Success Response | Database |
| **Training** | Training Records | Training Records | Record Data | Record Object | Training List | Record Submit | Record API | Success Response | Database |
| **Contract Review** | Contract List | Contract Management | Contract Data | Contract Object | Contract Details | Contract Submit | Contract API | Success Response | Database |
| **Contract Review** | Contract Details | Contract Details View | Contract ID | Contract Object | Contract List | Contract Load | Contract API | Contract Data | Database |
| **Work Progress** | Work List | Work Item Management | Work Data | Work Object | Work Details | Work Submit | Work API | Success Response | Database |
| **Work Progress** | Calendar View | Calendar Display | Date Range | Calendar Data | Work Details | Date Change | Calendar API | Calendar JSON | Work API |
| **Work Progress** | Board View | Kanban Board | Status Filters | Board Data | Work Details | Status Change | Board API | Board JSON | Work API |
| **OHS Actions** | Action List | Safety Action Management | Action Data | Action Object | Action Details | Action Submit | Action API | Success Response | Database |
| **OHS Actions** | Contractor Management | Contractor Tracking | Contractor Data | Contractor Object | Contractor List | Contractor Submit | Contractor API | Success Response | Database |
| **Management Review** | Review List | Management Review | Review Data | Review Object | Review Details | Review Submit | Review API | Success Response | Database |
| **Management Review** | Review Actions | Action Tracking | Action Data | Action Object | Review List | Action Submit | Action API | Success Response | Database |
| **Customer Satisfaction** | Survey List | Survey Management | Survey Data | Survey Object | Survey Details | Survey Submit | Survey API | Success Response | Database |
| **Customer Satisfaction** | Testimonials | Testimonial Management | Testimonial Data | Testimonial Object | Testimonial List | Testimonial Submit | Testimonial API | Success Response | Database |
| **Customer Satisfaction** | Complaints | Complaint Management | Complaint Data | Complaint Object | Complaint Details | Complaint Submit | Complaint API | Success Response | Database |
| **Customer Satisfaction** | Projects | Project Management | Project Data | Project Object | Project Details | Project Submit | Project API | Success Response | Database |
| **Integrations** | Integration List | External System Integration | Integration Data | Integration Object | Integration Details | Integration Submit | Integration API | Success Response | External APIs |
| **Support** | Communication | Communication Management | Message Data | Message Object | Message List | Message Submit | Communication API | Success Response | Database |
| **Support** | Asset Management | Asset Tracking | Asset Data | Asset Object | Asset List | Asset Submit | Asset API | Success Response | Database |
| **Support** | Suppliers | Supplier Management | Supplier Data | Supplier Object | Supplier List | Supplier Submit | Supplier API | Success Response | Database |
| **Operations** | Process Map | Process Visualization | Process Data | Process Object | Process Details | Process Submit | Process API | Success Response | Database |
| **Operations** | Design Development | Design Management | Design Data | Design Object | Design List | Design Submit | Design API | Success Response | Database |
| **Operations** | Contractor Management | Contractor Operations | Contractor Data | Contractor Object | Contractor List | Contractor Submit | Contractor API | Success Response | Database |
| **Operations** | Emergency Preparedness | Emergency Planning | Emergency Data | Emergency Object | Emergency List | Emergency Submit | Emergency API | Success Response | Database |
| **Operations** | SOP Library | Standard Operating Procedures | SOP Data | SOP Object | SOP List | SOP Submit | SOP API | Success Response | Database |
| **Waste Management** | Waste Records | Waste Tracking | Waste Data | Waste Object | Waste List | Waste Submit | Waste API | Success Response | Database |
| **Waste Management** | Transporters | Transporter Management | Transporter Data | Transporter Object | Transporter List | Transporter Submit | Transporter API | Success Response | Database |
| **Waste Management** | Facilities | Facility Management | Facility Data | Facility Object | Facility List | Facility Submit | Facility API | Success Response | Database |
| **Waste Management** | Types | Waste Type Management | Type Data | Type Object | Type List | Type Submit | Type API | Success Response | Database |
| **Nonconformance** | NC List | Nonconformance Management | NC Data | NC Object | NC Details | NC Submit | NC API | Success Response | Database |
| **Nonconformance** | NC Dashboard | NC Overview | NC Data | NC Metrics | NC List | Data Load | NC API | NC Statistics | Database |
| **Planning** | Business Risk | Business Risk Planning | Risk Data | Risk Object | Risk List | Risk Submit | Risk API | Success Response | Database |
| **Planning** | Change Management | Change Planning | Change Data | Change Object | Change List | Change Submit | Change API | Success Response | Database |
| **Planning** | Objectives | Objective Planning | Objective Data | Objective Object | Objective List | Objective Submit | Objective API | Success Response | Database |
| **Governance** | Roles | Role Management | Role Data | Role Object | Role List | Role Submit | Role API | Success Response | Database |
| **Governance** | Policies | Policy Management | Policy Data | Policy Object | Policy List | Policy Submit | Policy API | Success Response | Database |
| **Governance** | Procedures | Procedure Management | Procedure Data | Procedure Object | Procedure List | Procedure Submit | Procedure API | Success Response | Database |
| **Governance** | Documents | Document Management | Document Data | Document Object | Document List | Document Submit | Document API | Success Response | Database |
| **Performance** | Metrics | Performance Tracking | Metric Data | Metric Object | Metric List | Metric Submit | Metric API | Success Response | Database |
| **Performance** | Reports | Report Generation | Report Data | Report Object | Report List | Report Submit | Report API | Success Response | Database |
| **Performance** | Analytics | Data Analytics | Analytics Data | Analytics Object | Analytics Dashboard | Analytics Submit | Analytics API | Success Response | Database |
| **Performance** | KPIs | KPI Management | KPI Data | KPI Object | KPI Dashboard | KPI Submit | KPI API | Success Response | Database |
| **Performance** | Dashboards | Dashboard Management | Dashboard Data | Dashboard Object | Dashboard List | Dashboard Submit | Dashboard API | Success Response | Database |
| **Performance** | Monitoring | System Monitoring | Monitoring Data | Monitoring Object | Monitoring Dashboard | Monitoring Submit | Monitoring API | Success Response | Database |

---

## Data Flow Diagram (DFD)

### Level 0: Global System Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───▶│   Frontend  │───▶│   Backend    │───▶│   Database  │
│   Interface │    │   (Next.js) │    │   (API)      │    │   (Prisma)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   External  │    │   n8n       │    │   Microsoft │    │   File      │
│   APIs      │    │   Workflows │    │   Graph     │    │   Storage   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Level 1: Detailed Data Movement
```
User Input → Form Validation → API Processing → Database Storage → Response
     │              │                │                │              │
     ▼              ▼                ▼                ▼              ▼
Form Fields → Zod Schema → Prisma ORM → SQLite DB → JSON Response
     │              │                │                │              │
     ▼              ▼                ▼                ▼              ▼
Validation → Error Handling → Transaction → Commit → Success/Error
```

---

## Automation Specification Sheet

| Page | Trigger Event | Action | Workflow | Return Value | System |
|------|---------------|--------|----------|--------------|---------|
| **Risk Assessment** | "Assign Task" Button | POST to Webhook | n8n Action Assigned | Confirmation Email | Outlook |
| **Audit Creation** | "Schedule Audit" | POST to Webhook | n8n Audit Scheduled | Calendar Invite | Microsoft Calendar |
| **Training Completion** | "Mark Complete" | POST to Webhook | n8n Training Complete | Certificate Email | Email System |
| **Contract Review** | "Send for Approval" | POST to Webhook | n8n Contract Approval | Approval Email | Email System |
| **Work Progress** | "Status Change" | POST to Webhook | n8n Status Update | Notification Email | Email System |
| **OHS Action** | "Create Action" | POST to Webhook | n8n Action Created | Action Email | Email System |
| **Management Review** | "Schedule Review" | POST to Webhook | n8n Review Scheduled | Meeting Invite | Microsoft Teams |
| **Customer Survey** | "Send Survey" | POST to Webhook | n8n Survey Sent | Survey Email | Email System |
| **Equipment Calibration** | "Calibration Due" | POST to Webhook | n8n Calibration Alert | Reminder Email | Email System |
| **Nonconformance** | "Create NC" | POST to Webhook | n8n NC Created | NC Email | Email System |
| **Dashboard Report** | "Generate Report" | POST to Webhook | n8n Dashboard Report | HTML Email | Gmail |

---

## Integration Mapping

| External System | Integration Type | Data Flow | Authentication | Purpose |
|-----------------|------------------|-----------|----------------|---------|
| **Microsoft 365** | OAuth2 | Bidirectional | Azure AD | User Management, Calendar, Email |
| **Microsoft Teams** | Webhook | Outbound | API Key | Notifications, Meetings |
| **SharePoint** | REST API | Bidirectional | OAuth2 | Document Storage |
| **Power BI** | REST API | Inbound | API Key | Analytics, Reporting |
| **Google Workspace** | OAuth2 | Bidirectional | Google OAuth | Alternative Office Suite |
| **Salesforce** | REST API | Bidirectional | OAuth2 | CRM Integration |
| **HubSpot** | REST API | Bidirectional | API Key | Marketing Automation |
| **DocuSign** | REST API | Outbound | API Key | Electronic Signatures |
| **Slack** | Webhook | Outbound | API Key | Team Communication |
| **Zoom** | REST API | Outbound | OAuth2 | Video Conferencing |
| **Xero** | REST API | Bidirectional | OAuth2 | Accounting Integration |
| **QuickBooks** | REST API | Bidirectional | OAuth2 | Financial Management |

---

## API Endpoints Mapping

| Endpoint | Method | Purpose | Input | Output | Dependencies |
|----------|--------|---------|-------|--------|--------------|
| `/api/auth/session` | GET | User Session | Session Token | User Data | NextAuth |
| `/api/employees` | GET/POST | Employee Management | Employee Data | Employee Array/Object | Database |
| `/api/risks` | GET/POST | Risk Management | Risk Data | Risk Array/Object | Database |
| `/api/equipment` | GET/POST | Equipment Management | Equipment Data | Equipment Array/Object | Database |
| `/api/audits` | GET/POST | Audit Management | Audit Data | Audit Array/Object | Database |
| `/api/training` | GET/POST | Training Management | Training Data | Training Array/Object | Database |
| `/api/contract-review` | GET/POST | Contract Management | Contract Data | Contract Array/Object | Database |
| `/api/work-progress` | GET/POST | Work Management | Work Data | Work Array/Object | Database |
| `/api/ohs/actions` | GET/POST | OHS Management | Action Data | Action Array/Object | Database |
| `/api/management-review` | GET/POST | Management Review | Review Data | Review Array/Object | Database |
| `/api/customer-satisfaction/*` | GET/POST | Customer Management | Customer Data | Customer Array/Object | Database |
| `/api/dashboard/overview` | GET | Dashboard Data | Date Range | Aggregated Metrics | All Modules |
| `/api/dashboard-report` | POST | Report Generation | Report Request | HTML Report | n8n Workflow |

---

## Database Schema Dependencies

| Table | Primary Key | Foreign Keys | Dependencies | Related Tables |
|-------|-------------|--------------|--------------|----------------|
| **User** | id | - | Authentication | Session, Employee |
| **Employee** | id | userId | User Management | OrgChart, Training |
| **Risk** | id | employeeId | Risk Management | RiskAssessment, Action |
| **Equipment** | id | employeeId | Equipment Management | Calibration, Maintenance |
| **Audit** | id | auditorId | Audit Management | AuditType, Finding |
| **Training** | id | employeeId | Training Management | TrainingRecord, Certificate |
| **ContractReview** | id | reviewerId | Contract Management | ContractLog, Attachment |
| **WorkProgress** | id | ownerId | Work Management | WorkItem, Status |
| **OHSAction** | id | assigneeId | Safety Management | Contractor, Incident |
| **ManagementReview** | id | reviewerId | Management | ReviewAction, Decision |
| **CustomerSurvey** | id | customerId | Customer Management | SurveyResponse, Feedback |
| **Nonconformance** | id | reporterId | Quality Management | NCAction, Resolution |

---

## Security & Access Control

| Role | Permissions | Accessible Modules | Restrictions |
|------|-------------|-------------------|--------------|
| **Admin** | Full Access | All Modules | None |
| **Manager** | Read/Write | Assigned Modules | Cannot Delete Users |
| **Employee** | Read/Write | Own Records | Cannot Access Admin |
| **Auditor** | Read Only | Audit, Risk, Equipment | Cannot Modify Data |
| **Contractor** | Limited | OHS, Training | Cannot Access Financial |

---

## Error Handling & Logging

| Component | Error Type | Handling Method | Log Level | Notification |
|-----------|------------|-----------------|-----------|--------------|
| **API Endpoints** | Validation Error | 400 Response | Warning | User Notification |
| **API Endpoints** | Authentication Error | 401 Response | Error | Login Redirect |
| **API Endpoints** | Authorization Error | 403 Response | Error | Access Denied |
| **API Endpoints** | Not Found Error | 404 Response | Warning | Not Found Message |
| **API Endpoints** | Server Error | 500 Response | Error | Admin Notification |
| **Database** | Connection Error | Retry Logic | Error | Admin Alert |
| **Database** | Query Error | Rollback | Error | Error Log |
| **n8n Workflows** | Workflow Error | Retry Logic | Error | Admin Notification |
| **External APIs** | API Error | Fallback | Warning | User Notification |

---

## Performance Monitoring

| Metric | Target | Monitoring Method | Alert Threshold | Action |
|--------|--------|-------------------|----------------|--------|
| **Page Load Time** | < 2 seconds | Browser Metrics | > 3 seconds | Performance Review |
| **API Response Time** | < 500ms | Server Metrics | > 1 second | Optimization |
| **Database Query Time** | < 100ms | Database Metrics | > 200ms | Query Optimization |
| **Memory Usage** | < 80% | System Metrics | > 90% | Memory Cleanup |
| **CPU Usage** | < 70% | System Metrics | > 85% | Load Balancing |
| **Error Rate** | < 1% | Error Tracking | > 5% | Error Investigation |

---

## Deployment & Environment

| Environment | Purpose | URL | Database | Features |
|-------------|---------|-----|----------|----------|
| **Development** | Local Development | localhost:3000 | SQLite | All Features |
| **Staging** | Testing | staging.complianceos.com | PostgreSQL | Production-like |
| **Production** | Live System | complianceos.com | PostgreSQL | Production Features |

---

## Maintenance & Updates

| Task | Frequency | Responsible | Dependencies |
|------|-----------|-------------|--------------|
| **Database Backup** | Daily | System | Automated |
| **Security Updates** | Weekly | Admin | Security Team |
| **Feature Updates** | Monthly | Development | Testing |
| **Performance Review** | Quarterly | Development | Monitoring |
| **User Training** | As Needed | Training | Documentation |

---

*This document serves as the comprehensive guide for ComplianceOS system architecture, data flows, and automation specifications. It should be updated whenever new features or integrations are added to the system.*
