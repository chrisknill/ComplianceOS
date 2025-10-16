# 📁 Files to Copy from ComplianceOS to Connectify

## 🎯 Essential Files (Copy These First)

### **UI Components** (Required)
```
components/ui/badge.tsx
components/ui/button.tsx
components/ui/dialog.tsx
components/ui/input.tsx
components/ui/label.tsx
components/ui/select.tsx
components/ui/tabs.tsx
components/ui/textarea.tsx
components/ui/view-toggle.tsx
```

### **Utilities** (Required)
```
lib/utils.ts          # Core utilities (cn, formatDate, etc.)
lib/export.ts         # CSV export functionality
lib/pdf.ts            # PDF export functionality
```

### **RAG Status** (Recommended)
```
components/rag/StatusBadge.tsx    # Red/Amber/Green status indicators
lib/rag.ts                         # RAG calculation logic
```

---

## 🎨 Layout Components (Optional but Recommended)

```
components/layout/Shell.tsx        # Page wrapper
components/layout/Sidebar.tsx      # Navigation sidebar
components/layout/Topbar.tsx       # Top navigation bar
```

---

## 📋 Form Components (Copy as Needed)

### **Approval System:**
```
components/forms/ApprovalWorkflow.tsx
```

### **Example Forms** (Use as Templates):
```
components/forms/NCIntakeForm.tsx      # Smart form with conditional fields
components/forms/NCDetailView.tsx      # Detail view with 5 tabs
components/forms/ActionForm.tsx        # Simple CRUD form
components/forms/DocumentForm.tsx      # Document management form
```

---

## 🗄️ Database Schema Patterns

### **From:** `prisma/schema.prisma`

#### **Audit Trail Pattern:**
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  entityId    String
  eventType   String
  description String
  userId      String
  userName    String?
  metadata    String?
  createdAt   DateTime @default(now())
}
```

#### **Approval Pattern:**
```prisma
model Approval {
  id          String   @id @default(cuid())
  entityId    String
  level       Int
  approverRole String
  approverName String?
  status      String   @default("PENDING")
  comments    String?
  signedAt    DateTime?
  createdAt   DateTime @default(now())
}
```

#### **Versioning Pattern:**
```prisma
model Version {
  id          String   @id @default(cuid())
  entityId    String
  version     String
  changes     String?
  changedBy   String
  approvedBy  String?
  approvedAt  DateTime?
  createdAt   DateTime @default(now())
}
```

---

## 📚 Reference Pages (Study These)

### **Best Examples of Each Feature:**

#### **Board View:**
- `app/nonconformance/page.tsx` (5-column workflow)
- `app/ohs/actions/page.tsx` (5-column with approval)
- `app/documentation/page.tsx` (4-column approval workflow)

#### **Calendar View:**
- `app/nonconformance/page.tsx` (day/week/month with clickable items)
- `app/ohs/audits-inspections/page.tsx` (advanced calendar with scheduling)

#### **Dashboard View:**
- `app/nonconformance/page.tsx` (comprehensive stats and alerts)
- `app/ohs/incidents/page.tsx` (KPI-focused dashboard)
- `app/ohs/hazards/page.tsx` (risk-focused dashboard)

#### **Filtering & Sorting:**
- `app/nonconformance/page.tsx` (multi-filter with badges)
- `app/documentation/page.tsx` (advanced table sorting)

#### **Detail View with Tabs:**
- `components/forms/NCDetailView.tsx` (5 tabs, comprehensive)

---

## 🔧 Configuration Files

### **Tailwind Config:**
```
tailwind.config.ts    # Color scheme, animations, etc.
```

### **TypeScript Config:**
```
tsconfig.json         # Path aliases, compiler options
```

### **Next.js Config:**
```
next.config.js        # Next.js configuration
```

---

## 📦 NPM Packages Required

### **Copy this to your package.json or install individually:**

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "jspdf": "^3.0.3",
    "jspdf-autotable": "^5.0.2",
    "lucide-react": "^0.400.0",
    "papaparse": "^5.4.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@types/papaparse": "^5.3.14"
  }
}
```

**Install command:**
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-tooltip class-variance-authority clsx jspdf jspdf-autotable lucide-react papaparse tailwind-merge
npm install -D @types/papaparse
```

---

## 🎯 Copy Commands (macOS/Linux)

### **Quick Copy Script:**

```bash
#!/bin/bash

# Set paths
COMPLIANCE_OS="/Users/chrisknill/Documents/ComplianceConnect/ComplianceOS"
CONNECTIFY="/path/to/your/connectify"  # UPDATE THIS!

# Create directories if they don't exist
mkdir -p $CONNECTIFY/components/ui
mkdir -p $CONNECTIFY/components/rag
mkdir -p $CONNECTIFY/components/layout
mkdir -p $CONNECTIFY/lib

# Copy UI components
cp $COMPLIANCE_OS/components/ui/badge.tsx $CONNECTIFY/components/ui/
cp $COMPLIANCE_OS/components/ui/button.tsx $CONNECTIFY/components/ui/
cp $COMPLIANCE_OS/components/ui/dialog.tsx $CONNECTIFY/components/ui/
cp $COMPLIANCE_OS/components/ui/input.tsx $CONNECTIFY/components/ui/
cp $COMPLIANCE_OS/components/ui/label.tsx $CONNECTIFY/components/ui/
cp $COMPLIANCE_OS/components/ui/select.tsx $CONNECTIFY/components/ui/
cp $COMPLIANCE_OS/components/ui/tabs.tsx $CONNECTIFY/components/ui/
cp $COMPLIANCE_OS/components/ui/textarea.tsx $CONNECTIFY/components/ui/
cp $COMPLIANCE_OS/components/ui/view-toggle.tsx $CONNECTIFY/components/ui/

# Copy utilities
cp $COMPLIANCE_OS/lib/utils.ts $CONNECTIFY/lib/
cp $COMPLIANCE_OS/lib/export.ts $CONNECTIFY/lib/
cp $COMPLIANCE_OS/lib/pdf.ts $CONNECTIFY/lib/

# Copy RAG components
cp $COMPLIANCE_OS/components/rag/StatusBadge.tsx $CONNECTIFY/components/rag/

echo "✅ Core files copied!"
echo "Next steps:"
echo "1. cd $CONNECTIFY"
echo "2. npm install (see package list above)"
echo "3. Update import paths if needed"
echo "4. Test components"
```

**Save as:** `copy-to-connectify.sh`  
**Run:** `chmod +x copy-to-connectify.sh && ./copy-to-connectify.sh`

---

## 🎨 Style Guide

### **Colors We Use:**

```typescript
// Status Colors
'bg-emerald-500'  // Success/Completed/Green
'bg-amber-500'    // Warning/Pending/Amber
'bg-rose-500'     // Error/Blocked/Red
'bg-blue-500'     // Info/In Progress
'bg-slate-500'    // Neutral/Default

// Workflow Colors
'border-slate-400'   // Open/New
'border-blue-500'    // In Progress
'border-amber-500'   // Pending/Review
'border-rose-500'    // Blocked/Critical
'border-emerald-500' // Completed/Closed
```

### **Spacing:**
```typescript
'p-4'        // Card padding
'p-6'        // Section padding
'gap-4'      // Standard gap
'gap-6'      // Large gap
'space-y-6'  // Vertical spacing
'w-80'       // Column width (320px)
```

### **Typography:**
```typescript
'text-3xl font-bold'           // Page titles
'text-xl font-semibold'        // Section titles
'text-lg font-semibold'        // Subsection titles
'text-sm font-medium'          // Card titles
'text-sm text-slate-600'       // Body text
'text-xs text-slate-500'       // Helper text
```

---

## 🔍 Find & Replace Patterns

If your Connectify uses different naming:

### **Path Aliases:**
```typescript
// ComplianceOS uses:
import { Button } from '@/components/ui/button'

// If Connectify uses different alias:
// Find: @/components
// Replace: ~/components (or your alias)
```

### **Styling Classes:**
```typescript
// If you use different color scheme:
// Find: slate-
// Replace: gray- (or your neutral color)

// Find: emerald-
// Replace: green- (or your success color)
```

---

## 📊 Feature Comparison

| Feature | ComplianceOS | Copy to Connectify? |
|---------|--------------|---------------------|
| Board View | ✅ 5 pages | ⭐ High Priority |
| Calendar View | ✅ 2 pages | ⭐ If date-based |
| Dashboard View | ✅ All pages | ⭐ High Priority |
| Export (CSV) | ✅ All pages | ⭐ High Priority |
| Export (PDF) | ✅ All pages | ⚡ Medium Priority |
| Filtering | ✅ Advanced | ⭐ High Priority |
| Sorting | ✅ Multi-column | ⭐ High Priority |
| Detail Views | ✅ With tabs | ⚡ Medium Priority |
| Approval Workflow | ✅ Multi-level | 💡 If needed |
| Audit Trail | ✅ Complete | 💡 If needed |

---

## 🎉 You're Ready!

With these files and guides, you have everything you need to update Connectify with the advanced features from ComplianceOS.

**Start small, test often, and build incrementally!**

---

## 📞 Quick Help

**Stuck on something?**
1. Check the reference files in ComplianceOS
2. Review the MIGRATION_GUIDE_TO_CONNECTIFY.md
3. Look at similar implementations in ComplianceOS
4. Test in isolation before integrating

**Good luck! 🚀**

