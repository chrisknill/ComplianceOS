# ComplianceOS n8n Workflow Quick Reference
## Direct Links to All Workflows

---

## 🚀 **ACTIVE WORKFLOWS**

### **Dashboard Report Generator**
- **URL**: https://chrisknill.app.n8n.cloud/workflow/fNekUoSHQEtyfNNQ
- **ID**: `fNekUoSHQEtyfNNQ`
- **Status**: ✅ Active
- **Purpose**: Generates HTML dashboard reports and emails them
- **Trigger**: POST to `/api/dashboard-report`

---

## 📋 **PENDING WORKFLOWS** (To Be Created)

### **Employee Management**
- **Employee Created**: `[ID]` - Send Welcome Email
- **Employee Deleted**: `[ID]` - Send Deletion Notice

### **Risk Management**
- **Risk Assigned**: `[ID]` - Send Assignment Email
- **Risk Review Due**: `[ID]` - Send Review Reminder

### **Equipment & Calibration**
- **Equipment Maintenance**: `[ID]` - Send Maintenance Email
- **Calibration Due**: `[ID]` - Send Calibration Alert

### **Work Progress**
- **Work Status Change**: `[ID]` - Send Status Update

### **Contract Review**
- **Contract Submitted**: `[ID]` - Send Review Email
- **Contract Approved**: `[ID]` - Send Approval Email

### **Training**
- **Training Complete**: `[ID]` - Generate Certificate
- **Training Reminder**: `[ID]` - Send Training Reminder

### **Audits**
- **Audit Scheduled**: `[ID]` - Send Calendar Invite
- **Audit Complete**: `[ID]` - Send Completion Email

### **OHS (Occupational Health & Safety)**
- **OHS Action Assigned**: `[ID]` - Send Action Email
- **OHS Action Complete**: `[ID]` - Send Completion Email

### **Integrations**
- **Integration Sync**: `[ID]` - Sync Data

---

## 🔧 **HOW TO CREATE NEW WORKFLOWS**

### **Using n8n MCP (Recommended)**
1. Use the MCP tools in Cursor to create workflows directly
2. Copy the workflow ID from the created workflow
3. Update the Excel file with the new workflow URL and ID
4. Run `./sync.sh` to update the markdown

### **Manual Creation**
1. Go to https://chrisknill.app.n8n.cloud
2. Create new workflow
3. Copy the workflow ID from the URL
4. Update Excel file with: `https://chrisknill.app.n8n.cloud/workflow/[ID]`

---

## 📊 **WORKFLOW STATUS TRACKING**

| Workflow | Status | Priority | Notes |
|:---------|:-------|:---------|:------|
| Dashboard Report | ✅ Active | High | Working perfectly |
| Employee Created | ⏳ Pending | High | Needed for onboarding |
| Risk Assigned | ⏳ Pending | High | Critical for compliance |
| Equipment Maintenance | ⏳ Pending | Medium | Preventive maintenance |
| Contract Submitted | ⏳ Pending | High | Legal compliance |
| Training Complete | ⏳ Pending | Medium | Certification tracking |
| Audit Scheduled | ⏳ Pending | High | Compliance requirement |

---

## 🎯 **NEXT STEPS**

1. **Create Employee Created workflow** - High priority
2. **Create Risk Assigned workflow** - High priority  
3. **Create Contract Submitted workflow** - High priority
4. **Update Excel file** with new workflow IDs
5. **Run sync script** to update documentation

---

## 🔗 **QUICK ACCESS**

- **n8n Dashboard**: https://chrisknill.app.n8n.cloud
- **Active Workflow**: https://chrisknill.app.n8n.cloud/workflow/fNekUoSHQEtyfNNQ
- **Excel File**: [COMPLIANCEOS_SPECIFICATION.xlsx](./COMPLIANCEOS_SPECIFICATION.xlsx)
- **Full Documentation**: [COMPLIANCEOS_COMPLETE_SPECIFICATION.md](./COMPLIANCEOS_COMPLETE_SPECIFICATION.md)

---

**Last Updated**: 2025-10-23 17:18:13
