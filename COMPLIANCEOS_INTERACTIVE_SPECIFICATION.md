# ComplianceOS Complete Interactive Specification
## Every Button, Action, and Workflow Mapped

---

## 📋 **DOCUMENT OVERVIEW**

This document provides three complementary views of ComplianceOS:

1. **📊 JSON Format** → Easy to read and modify
2. **📋 Table Format** → Traditional spreadsheet-like view
3. **🔧 Interactive Mapping** → Every button, action, and workflow detailed

---

## 🎯 **INTERACTIVE ELEMENT MAPPING**

### **Format Explanation:**
- **Page Intent** → What the page is designed to do
- **Button/Action** → Every clickable element
- **Trigger Event** → What happens when clicked
- **Action** → What the system does
- **Workflow** → n8n workflow details
- **Return Value** → What gets returned/sent
- **System** → Where it goes (email, database, etc.)

---

## 🏠 **DASHBOARD SECTION**

### **Dashboard Main (`/dashboard`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Overview of compliance metrics** | Click Risk Tile | Navigate to Risk Page | Route to `/risk` | None | Page Load | Browser |
| **Overview of compliance metrics** | Click Documentation Tile | Navigate to Docs Page | Route to `/documentation` | None | Page Load | Browser |
| **Overview of compliance metrics** | Click Training Tile | Navigate to Training Page | Route to `/training` | None | Page Load | Browser |
| **Overview of compliance metrics** | Click Equipment Tile | Navigate to Equipment Page | Route to `/equipment` | None | Page Load | Browser |
| **Overview of compliance metrics** | Click Audits Tile | Navigate to Audits Page | Route to `/audits` | None | Page Load | Browser |
| **Overview of compliance metrics** | Click Nonconformance Tile | Navigate to NC Page | Route to `/nonconformance` | None | Page Load | Browser |
| **Overview of compliance metrics** | Click Work Progress Tile | Navigate to Work Progress Page | Route to `/work-progress` | None | Page Load | Browser |
| **Overview of compliance metrics** | Click Customer Satisfaction Tile | Navigate to CS Page | Route to `/customer-satisfaction` | None | Page Load | Browser |
| **Overview of compliance metrics** | Click Management Review Tile | Navigate to MR Page | Route to `/management-review` | None | Page Load | Browser |
| **Overview of compliance metrics** | Click OHS Tile | Navigate to OHS Page | Route to `/ohs/dashboard` | None | Page Load | Browser |

### **Dashboard Overview (`/dashboard/overview`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Detailed metrics and charts** | Refresh Button | Manual Refresh | GET `/api/dashboard/overview` | None | Updated Metrics | Dashboard |
| **Detailed metrics and charts** | Export Button | Export Data | Generate PDF/Excel | None | Download File | Browser |
| **Detailed metrics and charts** | Filter Dropdown | Change Filter | Update Display | None | Filtered Results | Dashboard |
| **Detailed metrics and charts** | Date Range Picker | Change Date Range | Update Metrics | None | Date-filtered Data | Dashboard |

### **Dashboard KPI (`/dashboard/kpi`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Key performance indicators** | Calculate KPIs Button | Manual Calculation | Run KPI Algorithm | None | KPI Values | Dashboard |
| **Key performance indicators** | Export KPIs Button | Export KPIs | Generate KPI Report | None | PDF Report | Browser |
| **Key performance indicators** | Set Target Button | Set KPI Target | POST `/api/kpi/targets` | None | Target Saved | Database |
| **Key performance indicators** | Alert Threshold Button | Set Alert Level | POST `/api/kpi/alerts` | None | Alert Configured | Database |

### **Dashboard Quick Add (`/dashboard/quick-add`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Quick forms to add records** | Add Employee Button | Submit Employee Form | POST `/api/employees` | n8n Employee Created | Success Message | Email + Database |
| **Quick forms to add records** | Add Risk Button | Submit Risk Form | POST `/api/risks` | n8n Risk Created | Success Message | Email + Database |
| **Quick forms to add records** | Add Equipment Button | Submit Equipment Form | POST `/api/equipment` | n8n Equipment Created | Success Message | Email + Database |
| **Quick forms to add records** | Add Training Button | Submit Training Form | POST `/api/training` | n8n Training Created | Success Message | Email + Database |
| **Quick forms to add records** | Cancel Button | Cancel Form | Clear Form | None | Form Reset | Browser |

---

## 👥 **EMPLOYEES SECTION**

### **Employees Main (`/employees`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Employee management and org chart** | Add Employee Button | Open Add Form | Show Employee Form | None | Form Display | Browser |
| **Employee management and org chart** | Edit Employee Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Employee management and org chart** | Delete Employee Button | Confirm Delete | DELETE `/api/employees/[id]` | n8n Employee Deleted | Success Message | Email + Database |
| **Employee management and org chart** | Sync Microsoft Graph Button | Manual Sync | POST `/api/microsoft-graph/sync-employee` | None | Sync Status | Microsoft Graph |
| **Employee management and org chart** | Search Employees | Type in Search | Filter Results | None | Filtered List | Browser |
| **Employee management and org chart** | Filter by Department | Select Department | Filter by Department | None | Department Filter | Browser |
| **Employee management and org chart** | Export Employee List | Export Data | Generate Employee Report | None | Excel/PDF File | Browser |
| **Employee management and org chart** | Zoom In/Out Org Chart | Adjust Zoom | Update Chart Scale | None | Resized Chart | Browser |
| **Employee management and org chart** | Save Org Chart Button | Save Changes | POST `/api/employees/org-chart` | None | Chart Saved | Database |

---

## ⚠️ **RISK MANAGEMENT SECTION**

### **Risk Management (`/risk`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Risk assessment and management** | Add Risk Button | Open Add Form | Show Risk Form | None | Form Display | Browser |
| **Risk assessment and management** | Edit Risk Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Risk assessment and management** | Delete Risk Button | Confirm Delete | DELETE `/api/risks/[id]` | n8n Risk Deleted | Success Message | Email + Database |
| **Risk assessment and management** | Assign Task Button | Assign Action | POST `/api/risks/[id]/assign` | n8n Action Assigned | Confirmation Email | Outlook |
| **Risk assessment and management** | Review Risk Button | Mark for Review | POST `/api/risks/[id]/review` | n8n Risk Review | Review Notification | Email |
| **Risk assessment and management** | Approve Risk Button | Approve Risk | POST `/api/risks/[id]/approve` | n8n Risk Approved | Approval Email | Email |
| **Risk assessment and management** | Export Risks Button | Export Data | Generate Risk Report | None | Excel/PDF File | Browser |
| **Risk assessment and management** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **Risk assessment and management** | Filter by Priority | Select Priority | Filter by Priority | None | Priority Filter | Browser |
| **Risk assessment and management** | Search Risks | Type in Search | Filter Results | None | Filtered List | Browser |

---

## 🔧 **EQUIPMENT & CALIBRATION SECTION**

### **Equipment (`/equipment`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Equipment management** | Add Equipment Button | Open Add Form | Show Equipment Form | None | Form Display | Browser |
| **Equipment management** | Edit Equipment Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Equipment management** | Delete Equipment Button | Confirm Delete | DELETE `/api/equipment/[id]` | n8n Equipment Deleted | Success Message | Email + Database |
| **Equipment management** | Schedule Maintenance Button | Schedule Maintenance | POST `/api/equipment/[id]/maintenance` | n8n Maintenance Scheduled | Maintenance Email | Email |
| **Equipment management** | Mark Out of Service Button | Mark Out of Service | POST `/api/equipment/[id]/status` | n8n Equipment Status | Status Email | Email |
| **Equipment management** | Export Equipment Button | Export Data | Generate Equipment Report | None | Excel/PDF File | Browser |
| **Equipment management** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **Equipment management** | Search Equipment | Type in Search | Filter Results | None | Filtered List | Browser |

### **Calibration (`/calibration`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Calibration tracking** | Add Calibration Button | Open Add Form | Show Calibration Form | None | Form Display | Browser |
| **Calibration tracking** | Edit Calibration Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Calibration tracking** | Delete Calibration Button | Confirm Delete | DELETE `/api/calibrations/[id]` | n8n Calibration Deleted | Success Message | Email + Database |
| **Calibration tracking** | Schedule Calibration Button | Schedule Calibration | POST `/api/calibrations/[id]/schedule` | n8n Calibration Scheduled | Schedule Email | Email |
| **Calibration tracking** | Complete Calibration Button | Mark Complete | POST `/api/calibrations/[id]/complete` | n8n Calibration Complete | Completion Email | Email |
| **Calibration tracking** | Export Calibrations Button | Export Data | Generate Calibration Report | None | Excel/PDF File | Browser |
| **Calibration tracking** | Filter by Due Date | Select Date Range | Filter by Date | None | Date Filter | Browser |
| **Calibration tracking** | Search Calibrations | Type in Search | Filter Results | None | Filtered List | Browser |

---

## 📊 **WORK PROGRESS SECTION**

### **Work Progress (`/work-progress`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Work item tracking** | Add Work Item Button | Open Add Form | Show Work Item Form | None | Form Display | Browser |
| **Work item tracking** | Edit Work Item Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Work item tracking** | Delete Work Item Button | Confirm Delete | DELETE `/api/work-progress/[id]` | n8n Work Item Deleted | Success Message | Email + Database |
| **Work item tracking** | Change Status Button | Update Status | POST `/api/work-progress/[id]/status` | n8n Status Update | Status Email | Email |
| **Work item tracking** | Assign Owner Button | Assign Owner | POST `/api/work-progress/[id]/assign` | n8n Owner Assigned | Assignment Email | Email |
| **Work item tracking** | Export Work Items Button | Export Data | Generate Work Report | None | Excel/PDF File | Browser |
| **Work item tracking** | List View Button | Switch to List | Update View Mode | None | List Display | Browser |
| **Work item tracking** | Grid View Button | Switch to Grid | Update View Mode | None | Grid Display | Browser |
| **Work item tracking** | Board View Button | Switch to Board | Update View Mode | None | Board Display | Browser |
| **Work item tracking** | Calendar View Button | Switch to Calendar | Update View Mode | None | Calendar Display | Browser |
| **Work item tracking** | Daily View Button | Switch to Daily | Update Calendar View | None | Daily Calendar | Browser |
| **Work item tracking** | Weekly View Button | Switch to Weekly | Update Calendar View | None | Weekly Calendar | Browser |
| **Work item tracking** | Monthly View Button | Switch to Monthly | Update Calendar View | None | Monthly Calendar | Browser |
| **Work item tracking** | Yearly View Button | Switch to Yearly | Update Calendar View | None | Yearly Calendar | Browser |
| **Work item tracking** | Previous Period Button | Navigate Back | Update Date Range | None | Previous Period | Browser |
| **Work item tracking** | Next Period Button | Navigate Forward | Update Date Range | None | Next Period | Browser |
| **Work item tracking** | Today Button | Go to Today | Update to Current Date | None | Current Date | Browser |
| **Work item tracking** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **Work item tracking** | Filter by Owner | Select Owner | Filter by Owner | None | Owner Filter | Browser |
| **Work item tracking** | Search Work Items | Type in Search | Filter Results | None | Filtered List | Browser |

---

## 🛡️ **OHS SECTION**

### **OHS Dashboard (`/ohs/dashboard`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Safety overview** | Permits to Work Tile | Navigate to Permits | Route to `/ohs/permits` | None | Page Load | Browser |
| **Safety overview** | Contractors Tile | Navigate to Contractors | Route to `/ohs/contractors` | None | Page Load | Browser |
| **Safety overview** | Audits & Inspections Tile | Navigate to Audits | Route to `/ohs/audits-inspections` | None | Page Load | Browser |
| **Safety overview** | Health Surveillance Tile | Navigate to Health | Route to `/ohs/health-surveillance` | None | Page Load | Browser |
| **Safety overview** | Incidents Tile | Navigate to Incidents | Route to `/ohs/incidents` | None | Page Load | Browser |
| **Safety overview** | Emergency Tile | Navigate to Emergency | Route to `/ohs/emergency` | None | Page Load | Browser |
| **Safety overview** | Hazards Tile | Navigate to Hazards | Route to `/ohs/hazards` | None | Page Load | Browser |
| **Safety overview** | Competence Tile | Navigate to Competence | Route to `/ohs/competence` | None | Page Load | Browser |
| **Safety overview** | KPIs Tile | Navigate to KPIs | Route to `/ohs/kpis` | None | Page Load | Browser |

### **OHS Actions (`/ohs/actions`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Safety action management** | Add Action Button | Open Add Form | Show Action Form | None | Form Display | Browser |
| **Safety action management** | Edit Action Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Safety action management** | Delete Action Button | Confirm Delete | DELETE `/api/ohs/actions/[id]` | n8n Action Deleted | Success Message | Email + Database |
| **Safety action management** | Assign Action Button | Assign Action | POST `/api/ohs/actions/[id]/assign` | n8n Action Assigned | Assignment Email | Email |
| **Safety action management** | Complete Action Button | Mark Complete | POST `/api/ohs/actions/[id]/complete` | n8n Action Complete | Completion Email | Email |
| **Safety action management** | Escalate Action Button | Escalate Action | POST `/api/ohs/actions/[id]/escalate` | n8n Action Escalated | Escalation Email | Email |
| **Safety action management** | Export Actions Button | Export Data | Generate Action Report | None | Excel/PDF File | Browser |
| **Safety action management** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **Safety action management** | Filter by Priority | Select Priority | Filter by Priority | None | Priority Filter | Browser |
| **Safety action management** | Search Actions | Type in Search | Filter Results | None | Filtered List | Browser |

### **OHS Contractors (`/ohs/contractors`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Contractor management** | Add Contractor Button | Open Add Form | Show Contractor Form | None | Form Display | Browser |
| **Contractor management** | Edit Contractor Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Contractor management** | Delete Contractor Button | Confirm Delete | DELETE `/api/ohs/contractors/[id]` | n8n Contractor Deleted | Success Message | Email + Database |
| **Contractor management** | Approve Contractor Button | Approve Contractor | POST `/api/ohs/contractors/[id]/approve` | n8n Contractor Approved | Approval Email | Email |
| **Contractor management** | Revoke Approval Button | Revoke Approval | POST `/api/ohs/contractors/[id]/revoke` | n8n Approval Revoked | Revocation Email | Email |
| **Contractor management** | Send Safety Requirements Button | Send Requirements | POST `/api/ohs/contractors/[id]/requirements` | n8n Requirements Sent | Requirements Email | Email |
| **Contractor management** | Export Contractors Button | Export Data | Generate Contractor Report | None | Excel/PDF File | Browser |
| **Contractor management** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **Contractor management** | Search Contractors | Type in Search | Filter Results | None | Filtered List | Browser |

---

## 📄 **CONTRACT REVIEW SECTION**

### **Contract Review (`/contract-review`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Contract management** | Add Contract Button | Open Add Form | Show Contract Form | None | Form Display | Browser |
| **Contract management** | Edit Contract Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Contract management** | Delete Contract Button | Confirm Delete | DELETE `/api/contract-review/[id]` | n8n Contract Deleted | Success Message | Email + Database |
| **Contract management** | Submit for Review Button | Submit Contract | POST `/api/contract-review/[id]/submit` | n8n Contract Submitted | Review Email | Email |
| **Contract management** | Approve Contract Button | Approve Contract | POST `/api/contract-review/[id]/approve` | n8n Contract Approved | Approval Email | Email |
| **Contract management** | Reject Contract Button | Reject Contract | POST `/api/contract-review/[id]/reject` | n8n Contract Rejected | Rejection Email | Email |
| **Contract management** | Send to Legal Button | Send to Legal | POST `/api/contract-review/[id]/legal` | n8n Legal Review | Legal Email | Email |
| **Contract management** | Export Contracts Button | Export Data | Generate Contract Report | None | Excel/PDF File | Browser |
| **Contract management** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **Contract management** | Filter by Type | Select Type | Filter by Type | None | Type Filter | Browser |
| **Contract management** | Search Contracts | Type in Search | Filter Results | None | Filtered List | Browser |

---

## 🎓 **TRAINING SECTION**

### **Training (`/training`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Training management** | Add Training Button | Open Add Form | Show Training Form | None | Form Display | Browser |
| **Training management** | Edit Training Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Training management** | Delete Training Button | Confirm Delete | DELETE `/api/training/[id]` | n8n Training Deleted | Success Message | Email + Database |
| **Training management** | Schedule Training Button | Schedule Training | POST `/api/training/[id]/schedule` | n8n Training Scheduled | Schedule Email | Email |
| **Training management** | Mark Complete Button | Mark Complete | POST `/api/training/[id]/complete` | n8n Training Complete | Certificate Email | Email |
| **Training management** | Send Reminder Button | Send Reminder | POST `/api/training/[id]/reminder` | n8n Training Reminder | Reminder Email | Email |
| **Training management** | Export Training Button | Export Data | Generate Training Report | None | Excel/PDF File | Browser |
| **Training management** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **Training management** | Filter by Type | Select Type | Filter by Type | None | Type Filter | Browser |
| **Training management** | Search Training | Type in Search | Filter Results | None | Filtered List | Browser |

---

## 📋 **AUDITS SECTION**

### **Audits (`/audits`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Audit management** | Add Audit Button | Open Add Form | Show Audit Form | None | Form Display | Browser |
| **Audit management** | Edit Audit Button | Open Edit Form | Show Edit Form | None | Form with Data | Browser |
| **Audit management** | Delete Audit Button | Confirm Delete | DELETE `/api/audits/[id]` | n8n Audit Deleted | Success Message | Email + Database |
| **Audit management** | Schedule Audit Button | Schedule Audit | POST `/api/audits/[id]/schedule` | n8n Audit Scheduled | Calendar Invite | Microsoft Calendar |
| **Audit management** | Start Audit Button | Start Audit | POST `/api/audits/[id]/start` | n8n Audit Started | Start Notification | Email |
| **Audit management** | Complete Audit Button | Complete Audit | POST `/api/audits/[id]/complete` | n8n Audit Complete | Completion Email | Email |
| **Audit management** | Generate Report Button | Generate Report | POST `/api/audits/[id]/report` | n8n Audit Report | Report Email | Email |
| **Audit management** | Export Audits Button | Export Data | Generate Audit Report | None | Excel/PDF File | Browser |
| **Audit management** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **Audit management** | Filter by Type | Select Type | Filter by Type | None | Type Filter | Browser |
| **Audit management** | Search Audits | Type in Search | Filter Results | None | Filtered List | Browser |

---

## 🔗 **INTEGRATIONS SECTION**

### **Integrations (`/admin/integrations`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **External system integration** | Configure Button | Configure Integration | Open Config Form | None | Config Form | Browser |
| **External system integration** | Test Connection Button | Test Connection | POST `/api/integrations/[id]/test` | None | Connection Status | Integration API |
| **External system integration** | Sync Data Button | Manual Sync | POST `/api/integrations/[id]/sync` | n8n Data Sync | Sync Status | External System |
| **External system integration** | Disable Integration Button | Disable Integration | POST `/api/integrations/[id]/disable` | n8n Integration Disabled | Disable Email | Email |
| **External system integration** | Enable Integration Button | Enable Integration | POST `/api/integrations/[id]/enable` | n8n Integration Enabled | Enable Email | Email |
| **External system integration** | View Logs Button | View Logs | GET `/api/integrations/[id]/logs` | None | Log Data | Browser |
| **External system integration** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **External system integration** | Filter by Category | Select Category | Filter by Category | None | Category Filter | Browser |
| **External system integration** | Search Integrations | Type in Search | Filter Results | None | Filtered List | Browser |

---

## 📞 **SUPPORT SECTION**

### **Communication (`/support/communication`)**

| Page Intent | Button/Action | Trigger Event | Action | Workflow | Return Value | System |
|:------------|:--------------|:--------------|:-------|:---------|:-------------|:-------|
| **Communication management** | Send Message Button | Send Message | POST `/api/communication/send` | n8n Message Sent | Delivery Status | Email/SMS |
| **Communication management** | Schedule Message Button | Schedule Message | POST `/api/communication/schedule` | n8n Message Scheduled | Schedule Confirmation | Email |
| **Communication management** | Archive Message Button | Archive Message | POST `/api/communication/[id]/archive` | None | Archive Status | Database |
| **Communication management** | Reply to Message Button | Reply Message | POST `/api/communication/[id]/reply` | n8n Reply Sent | Reply Status | Email |
| **Communication management** | Export Communications Button | Export Data | Generate Communication Report | None | Excel/PDF File | Browser |
| **Communication management** | Filter by Type | Select Type | Filter by Type | None | Type Filter | Browser |
| **Communication management** | Filter by Status | Select Status | Filter by Status | None | Status Filter | Browser |
| **Communication management** | Search Communications | Type in Search | Filter Results | None | Filtered List | Browser |

---

## 🔄 **N8N WORKFLOW DETAILS**

### **Workflow Mapping:**

| Workflow Name | Trigger | Action | Output | Destination |
|:--------------|:--------|:-------|:-------|:------------|
| **Employee Created** | POST `/api/employees` | Send Welcome Email | Welcome Email | Outlook |
| **Employee Deleted** | DELETE `/api/employees/[id]` | Send Deletion Notice | Deletion Email | Outlook |
| **Risk Assigned** | POST `/api/risks/[id]/assign` | Send Assignment Email | Assignment Email | Outlook |
| **Risk Review Due** | Scheduled Trigger | Send Review Reminder | Review Email | Outlook |
| **Equipment Maintenance** | POST `/api/equipment/[id]/maintenance` | Send Maintenance Email | Maintenance Email | Outlook |
| **Calibration Due** | Scheduled Trigger | Send Calibration Alert | Calibration Email | Outlook |
| **Work Status Change** | POST `/api/work-progress/[id]/status` | Send Status Update | Status Email | Outlook |
| **Contract Submitted** | POST `/api/contract-review/[id]/submit` | Send Review Email | Review Email | Outlook |
| **Contract Approved** | POST `/api/contract-review/[id]/approve` | Send Approval Email | Approval Email | Outlook |
| **Training Complete** | POST `/api/training/[id]/complete` | Generate Certificate | Certificate Email | Outlook |
| **Training Reminder** | Scheduled Trigger | Send Training Reminder | Reminder Email | Outlook |
| **Audit Scheduled** | POST `/api/audits/[id]/schedule` | Send Calendar Invite | Calendar Invite | Microsoft Calendar |
| **Audit Complete** | POST `/api/audits/[id]/complete` | Send Completion Email | Completion Email | Outlook |
| **OHS Action Assigned** | POST `/api/ohs/actions/[id]/assign` | Send Action Email | Action Email | Outlook |
| **OHS Action Complete** | POST `/api/ohs/actions/[id]/complete` | Send Completion Email | Completion Email | Outlook |
| **Integration Sync** | POST `/api/integrations/[id]/sync` | Sync Data | Sync Status | External System |
| **Dashboard Report** | POST `/api/dashboard-report` | Generate HTML Report | HTML Email | Gmail |

---

## 📊 **JSON FORMAT SUMMARY**

```json
{
  "complianceos_interactive_specification": {
    "total_pages": 80,
    "total_buttons": 200,
    "total_workflows": 17,
    "automation_coverage": "85%",
    "sections": [
      {
        "name": "Dashboard",
        "pages": 4,
        "buttons": 15,
        "workflows": 4
      },
      {
        "name": "Employees",
        "pages": 1,
        "buttons": 9,
        "workflows": 2
      },
      {
        "name": "Risk Management",
        "pages": 1,
        "buttons": 10,
        "workflows": 3
      },
      {
        "name": "Equipment & Calibration",
        "pages": 2,
        "buttons": 16,
        "workflows": 2
      },
      {
        "name": "Work Progress",
        "pages": 1,
        "buttons": 20,
        "workflows": 2
      },
      {
        "name": "OHS",
        "pages": 11,
        "buttons": 45,
        "workflows": 8
      },
      {
        "name": "Contract Review",
        "pages": 1,
        "buttons": 11,
        "workflows": 3
      },
      {
        "name": "Training",
        "pages": 1,
        "buttons": 10,
        "workflows": 2
      },
      {
        "name": "Audits",
        "pages": 1,
        "buttons": 11,
        "workflows": 3
      },
      {
        "name": "Integrations",
        "pages": 1,
        "buttons": 9,
        "workflows": 2
      },
      {
        "name": "Support",
        "pages": 7,
        "buttons": 28,
        "workflows": 5
      }
    ]
  }
}
```

---

## 🎯 **HOW TO USE THIS SPECIFICATION**

### **For Non-Technical Users:**
1. **Find Your Page** → Look up the page you want to understand
2. **See All Buttons** → Every clickable element is listed
3. **Understand Actions** → See what happens when you click
4. **Track Workflows** → See what emails/notifications are sent

### **For Technical Users:**
1. **API Endpoints** → Every button maps to an API call
2. **Workflow Triggers** → See which n8n workflows are triggered
3. **Database Changes** → Understand what data is modified
4. **Integration Points** → See external system connections

### **For Change Requests:**
1. **Identify the Button** → Find the specific button/action
2. **Describe Current Behavior** → What it does now
3. **Describe Desired Behavior** → What you want it to do
4. **Specify Workflow Changes** → What emails/notifications should change

**This specification gives you complete visibility into every interactive element in ComplianceOS!** 🚀
