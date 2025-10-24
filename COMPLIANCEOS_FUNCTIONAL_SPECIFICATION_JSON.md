# ComplianceOS Functional Specification - JSON Format
## Clear, Structured Data for Easy Understanding

---

## 🏠 **DASHBOARD SECTION**

```json
{
  "section": "Dashboard",
  "description": "Main dashboard and overview pages",
  "pages": [
    {
      "name": "Dashboard Main",
      "url": "/dashboard",
      "what_it_shows": "Overview of all compliance metrics",
      "what_you_can_do": "Click tiles to go to specific areas",
      "what_happens_automatically": "Refreshes data every 5 minutes",
      "data_flow": "User clicks tile → Goes to specific page → Loads relevant data → Shows information",
      "automation_triggers": [
        {
          "trigger": "Quick Add Form Submit",
          "action": "Creates record",
          "result": "Sends email notification"
        }
      ]
    },
    {
      "name": "Dashboard Overview",
      "url": "/dashboard/overview",
      "what_it_shows": "Detailed metrics and charts",
      "what_you_can_do": "View trends and statistics",
      "what_happens_automatically": "Updates when data changes",
      "data_flow": "Data changes → Metrics calculation → Chart updates → Display refresh",
      "automation_triggers": []
    },
    {
      "name": "Dashboard KPI",
      "url": "/dashboard/kpi",
      "what_it_shows": "Key performance indicators",
      "what_you_can_do": "Track performance over time",
      "what_happens_automatically": "Calculates KPIs automatically",
      "data_flow": "Performance data → KPI calculation → Trend analysis → Display update",
      "automation_triggers": []
    },
    {
      "name": "Dashboard Quick Add",
      "url": "/dashboard/quick-add",
      "what_it_shows": "Quick forms to add new records",
      "what_you_can_do": "Add employees, risks, equipment quickly",
      "what_happens_automatically": "Creates records and sends notifications",
      "data_flow": "Form submission → Data validation → Record creation → Notification sending",
      "automation_triggers": [
        {
          "trigger": "Form Submit",
          "action": "Creates new record",
          "result": "Sends confirmation email"
        }
      ]
    }
  ]
}
```

---

## 👥 **EMPLOYEES SECTION**

```json
{
  "section": "Employees",
  "description": "Employee management and organizational structure",
  "pages": [
    {
      "name": "Employees Main",
      "url": "/employees",
      "what_it_shows": "List of all employees with org chart",
      "what_you_can_do": "Add/edit employees, view org structure",
      "what_happens_automatically": "Syncs with Microsoft Graph",
      "data_flow": "Employee data → Org chart display → Manager relationships → Department structure",
      "automation_triggers": [
        {
          "trigger": "Employee Added",
          "action": "Syncs to Microsoft Graph",
          "result": "Updates org chart"
        },
        {
          "trigger": "Manager Change",
          "action": "Updates reporting structure",
          "result": "Notifies affected employees"
        }
      ]
    }
  ]
}
```

---

## ⚠️ **RISK MANAGEMENT SECTION**

```json
{
  "section": "Risk Management",
  "description": "Risk assessment and management",
  "pages": [
    {
      "name": "Risk Management",
      "url": "/risk",
      "what_it_shows": "List of all risks and assessments",
      "what_you_can_do": "Add/edit risks, assign actions",
      "what_happens_automatically": "Sends risk alerts to managers",
      "data_flow": "Risk data → Risk assessment → Action assignment → Progress tracking",
      "automation_triggers": [
        {
          "trigger": "High Risk Created",
          "action": "Sends email alert",
          "result": "Assigns to manager"
        },
        {
          "trigger": "Risk Review Due",
          "action": "Sends reminder",
          "result": "Updates status"
        }
      ]
    }
  ]
}
```

---

## 🔧 **EQUIPMENT & CALIBRATION SECTION**

```json
{
  "section": "Equipment & Calibration",
  "description": "Equipment management and calibration tracking",
  "pages": [
    {
      "name": "Equipment",
      "url": "/equipment",
      "what_it_shows": "List of all equipment",
      "what_you_can_do": "Add/edit equipment, track maintenance",
      "what_happens_automatically": "Sends maintenance reminders",
      "data_flow": "Equipment data → Maintenance schedule → Calibration tracking → Compliance reporting",
      "automation_triggers": [
        {
          "trigger": "Maintenance Required",
          "action": "Assigns to technician",
          "result": "Creates work order"
        }
      ]
    },
    {
      "name": "Calibration",
      "url": "/calibration",
      "what_it_shows": "Calibration schedule and records",
      "what_you_can_do": "Schedule calibrations, record results",
      "what_happens_automatically": "Sends calibration due alerts",
      "data_flow": "Calibration schedule → Due date tracking → Alert generation → Technician notification",
      "automation_triggers": [
        {
          "trigger": "Calibration Due",
          "action": "Sends reminder email",
          "result": "Updates schedule"
        }
      ]
    }
  ]
}
```

---

## 📊 **WORK PROGRESS SECTION**

```json
{
  "section": "Work Progress",
  "description": "Work item tracking with multiple view modes",
  "pages": [
    {
      "name": "Work Progress",
      "url": "/work-progress",
      "what_it_shows": "Work items in multiple views (List, Grid, Board, Calendar)",
      "what_you_can_do": "Track work progress, change status",
      "what_happens_automatically": "Sends progress updates",
      "data_flow": "Work item → Status tracking → Progress updates → Completion reporting",
      "view_modes": [
        {
          "mode": "List",
          "description": "Traditional table view with all details"
        },
        {
          "mode": "Grid",
          "description": "Card-based layout for visual scanning"
        },
        {
          "mode": "Board",
          "description": "Kanban-style columns by status"
        },
        {
          "mode": "Calendar",
          "description": "Time-based visualization with daily/weekly/monthly/yearly views"
        }
      ],
      "automation_triggers": [
        {
          "trigger": "Status Change",
          "action": "Sends update email",
          "result": "Updates dashboard"
        },
        {
          "trigger": "Work Complete",
          "action": "Sends completion notification",
          "result": "Updates metrics"
        }
      ]
    }
  ]
}
```

---

## 🛡️ **OHS (OCCUPATIONAL HEALTH & SAFETY) SECTION**

```json
{
  "section": "OHS",
  "description": "Occupational health and safety management",
  "pages": [
    {
      "name": "OHS Dashboard",
      "url": "/ohs/dashboard",
      "what_it_shows": "Safety overview and quick access",
      "what_you_can_do": "Navigate to safety functions",
      "what_happens_automatically": "Updates safety metrics",
      "data_flow": "Safety data → Metric calculation → Dashboard update → Alert generation"
    },
    {
      "name": "OHS Actions",
      "url": "/ohs/actions",
      "what_it_shows": "Safety actions and tasks",
      "what_you_can_do": "Assign actions, track progress",
      "what_happens_automatically": "Sends action notifications",
      "data_flow": "Action creation → Assignment → Progress tracking → Completion notification",
      "automation_triggers": [
        {
          "trigger": "Action Assigned",
          "action": "Sends notification",
          "result": "Updates action status"
        }
      ]
    },
    {
      "name": "OHS Contractors",
      "url": "/ohs/contractors",
      "what_it_shows": "Contractor management",
      "what_you_can_do": "Manage contractor safety",
      "what_happens_automatically": "Sends safety requirements",
      "data_flow": "Contractor data → Safety requirements → Compliance tracking → Reporting"
    },
    {
      "name": "OHS Audits & Inspections",
      "url": "/ohs/audits-inspections",
      "what_it_shows": "Safety audits and inspections",
      "what_you_can_do": "Schedule safety audits",
      "what_happens_automatically": "Sends audit notifications",
      "data_flow": "Audit schedule → Notification → Execution → Findings → Corrective actions"
    },
    {
      "name": "OHS Competence",
      "url": "/ohs/competence",
      "what_it_shows": "Competency tracking",
      "what_you_can_do": "Track safety training",
      "what_happens_automatically": "Sends competency alerts",
      "data_flow": "Competency data → Training tracking → Certification → Renewal alerts"
    },
    {
      "name": "OHS Emergency",
      "url": "/ohs/emergency",
      "what_it_shows": "Emergency procedures",
      "what_you_can_do": "Manage emergency plans",
      "what_happens_automatically": "Sends emergency notifications",
      "data_flow": "Emergency plan → Procedure documentation → Training → Response protocols"
    },
    {
      "name": "OHS Hazards",
      "url": "/ohs/hazards",
      "what_it_shows": "Hazard identification",
      "what_you_can_do": "Identify and assess hazards",
      "what_happens_automatically": "Sends hazard alerts",
      "data_flow": "Hazard identification → Risk assessment → Control measures → Monitoring"
    },
    {
      "name": "OHS Health Surveillance",
      "url": "/ohs/health-surveillance",
      "what_it_shows": "Health surveillance records",
      "what_you_can_do": "Track health monitoring",
      "what_happens_automatically": "Sends health reminders",
      "data_flow": "Health data → Surveillance schedule → Monitoring → Record keeping"
    },
    {
      "name": "OHS Incidents",
      "url": "/ohs/incidents",
      "what_it_shows": "Incident reporting",
      "what_you_can_do": "Report and investigate incidents",
      "what_happens_automatically": "Sends incident notifications",
      "data_flow": "Incident report → Investigation → Root cause analysis → Corrective actions"
    },
    {
      "name": "OHS KPIs",
      "url": "/ohs/kpis",
      "what_it_shows": "Safety performance metrics",
      "what_you_can_do": "Track safety performance",
      "what_happens_automatically": "Updates safety metrics",
      "data_flow": "Performance data → KPI calculation → Trend analysis → Reporting"
    },
    {
      "name": "OHS Permits",
      "url": "/ohs/permits",
      "what_it_shows": "Work permits",
      "what_you_can_do": "Issue and track permits",
      "what_happens_automatically": "Sends permit notifications",
      "data_flow": "Permit request → Review → Approval → Issue → Monitoring"
    }
  ]
}
```

---

## 🔄 **HOW TO USE THIS JSON FORMAT**

### **For Non-Technical Users:**
1. **Find Your Section:** Look for the section name (e.g., "Dashboard", "Employees")
2. **Read Each Page:** Each page has clear descriptions of what it does
3. **Understand Automation:** See what happens automatically when you use each page
4. **Request Changes:** Use the structure to describe what you want changed

### **For Technical Users:**
1. **Parse the JSON:** Use this data to understand system architecture
2. **Implement Features:** Follow the data flow descriptions
3. **Create Automations:** Use the automation triggers to build n8n workflows
4. **Update Documentation:** Modify the JSON when making changes

### **Example Change Request Using JSON:**
```json
{
  "change_request": {
    "section": "Work Progress",
    "page": "Work Progress",
    "current_function": "Shows work items in list view",
    "desired_function": "Should also show work items in calendar view by due date",
    "reason": "Need to see work items scheduled for specific dates",
    "expected_outcome": "Users can see work items on calendar with due dates",
    "automation_needed": {
      "trigger": "Work item due date approaches",
      "action": "Send reminder email",
      "result": "Notify project manager"
    }
  }
}
```

---

## 📋 **BENEFITS OF JSON FORMAT**

✅ **Structured Data** → Easy to read and understand  
✅ **Clear Relationships** → See how pages connect  
✅ **Automation Mapping** → Understand what triggers what  
✅ **Change Tracking** → Easy to modify and version  
✅ **Technical Integration** → Can be used by systems  
✅ **Non-Technical Friendly** → Clear descriptions for everyone  

**This JSON format makes it much easier to understand and modify your ComplianceOS system!** 🚀
