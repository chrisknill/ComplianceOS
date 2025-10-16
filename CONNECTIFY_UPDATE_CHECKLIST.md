# ✅ Connectify Update Checklist

## Quick Reference for Updating Connectify with ComplianceOS Features

---

## 🎯 Quick Start (Do This First!)

### **1. Copy Essential Files (15 minutes)**

```bash
# Navigate to ComplianceOS
cd /Users/chrisknill/Documents/ComplianceConnect/ComplianceOS

# Copy to Connectify (update path as needed)
CONNECTIFY_PATH="/path/to/your/connectify"

# UI Components
cp components/ui/tabs.tsx $CONNECTIFY_PATH/components/ui/
cp components/ui/badge.tsx $CONNECTIFY_PATH/components/ui/
cp components/ui/button.tsx $CONNECTIFY_PATH/components/ui/
cp components/ui/dialog.tsx $CONNECTIFY_PATH/components/ui/
cp components/ui/input.tsx $CONNECTIFY_PATH/components/ui/
cp components/ui/select.tsx $CONNECTIFY_PATH/components/ui/
cp components/ui/textarea.tsx $CONNECTIFY_PATH/components/ui/
cp components/ui/view-toggle.tsx $CONNECTIFY_PATH/components/ui/

# Utilities
cp lib/utils.ts $CONNECTIFY_PATH/lib/
cp lib/export.ts $CONNECTIFY_PATH/lib/
cp lib/pdf.ts $CONNECTIFY_PATH/lib/

# RAG Status
mkdir -p $CONNECTIFY_PATH/components/rag
cp components/rag/StatusBadge.tsx $CONNECTIFY_PATH/components/rag/
```

### **2. Install Dependencies (5 minutes)**

```bash
cd $CONNECTIFY_PATH

npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-label @radix-ui/react-slot
npm install lucide-react jspdf jspdf-autotable papaparse
npm install class-variance-authority clsx tailwind-merge
npm install @types/papaparse --save-dev
```

### **3. Test Basic Setup (5 minutes)**

Create a test page to verify components work:
```typescript
// app/test/page.tsx
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Component Test</h1>
      <Button>Test Button</Button>
      <Badge>Test Badge</Badge>
    </div>
  )
}
```

---

## 📋 Feature Implementation Checklist

### **Board View (Kanban)**

For each page you want to add board view:

- [ ] **Update ViewMode type**
  ```typescript
  type ViewMode = 'list' | 'grid' | 'board'
  ```

- [ ] **Add Board button to view switcher**
  ```typescript
  <button onClick={() => setViewMode('board')}>Board</button>
  ```

- [ ] **Implement board JSX**
  - Copy from: `app/nonconformance/page.tsx` (lines 922-1167)
  - Adjust status columns for your data
  - Update colors and labels

- [ ] **Test board view**
  - Cards render correctly
  - Click opens detail view
  - Filters work
  - Counts are accurate

---

### **Calendar View**

For date-based pages:

- [ ] **Add calendar state**
  ```typescript
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  ```

- [ ] **Copy calendar helper functions**
  - From: `app/nonconformance/page.tsx` (lines 147-175)
  - `getRecordsForDate()`
  - `getDaysInMonth()`
  - `navigateCalendar()`

- [ ] **Implement calendar JSX**
  - Copy from: `app/nonconformance/page.tsx` (lines 720-920)
  - Update to use your data
  - Make items clickable

- [ ] **Test calendar**
  - All 3 views work (day/week/month)
  - Navigation works
  - Items are clickable
  - Today is highlighted

---

### **Dashboard View**

For any page:

- [ ] **Calculate statistics**
  ```typescript
  const stats = {
    total: data.length,
    open: data.filter(d => d.status === 'OPEN').length,
    // ... more stats
  }
  ```

- [ ] **Create summary cards**
  - Copy from: `app/nonconformance/page.tsx` (lines 212-264)
  - Update icons and colors
  - Update labels and values

- [ ] **Add breakdown sections**
  - Status breakdown
  - Type/category breakdown
  - Action items/alerts

- [ ] **Test dashboard**
  - Stats calculate correctly
  - Cards are clickable (if applicable)
  - Responsive layout

---

### **Filtering & Sorting**

For all list/table pages:

- [ ] **Add filter state**
  ```typescript
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  ```

- [ ] **Implement filter logic**
  ```typescript
  const filtered = data
    .filter(item => /* search logic */)
    .filter(item => /* status logic */)
    .sort((a, b) => /* sort logic */)
  ```

- [ ] **Add filter UI**
  - Search input
  - Status dropdown
  - Type/category dropdown
  - Active filter badges with clear buttons

- [ ] **Add sortable table headers**
  ```typescript
  <th onClick={() => handleSort('fieldName')} className="cursor-pointer">
    <div className="flex items-center gap-2">
      Column Name
      <SortIcon field="fieldName" />
    </div>
  </th>
  ```

- [ ] **Test filtering**
  - Search works
  - Filters combine correctly
  - Sorting works
  - Clear buttons work

---

### **Export Functionality**

For all data pages:

- [ ] **Add export button**
  ```typescript
  <Button variant="outline" onClick={handleExportCSV}>
    <Download className="h-4 w-4 mr-2" />
    CSV
  </Button>
  ```

- [ ] **Implement CSV export**
  ```typescript
  const handleExportCSV = () => {
    const csv = convertToCSV(data.map(item => ({
      'Column 1': item.field1,
      'Column 2': item.field2,
    })))
    downloadFile(csv, `export-${Date.now()}.csv`, 'text/csv')
  }
  ```

- [ ] **Implement PDF export (optional)**
  ```typescript
  import { exportTableToPDF } from '@/lib/pdf'
  
  const handleExportPDF = () => {
    exportTableToPDF('Title', headers, rows, 'filename.pdf')
  }
  ```

- [ ] **Test export**
  - CSV downloads correctly
  - Data is formatted properly
  - PDF renders correctly (if implemented)

---

### **Detail View with Tabs**

For complex entities:

- [ ] **Create detail component**
  ```typescript
  // components/forms/YourEntityDetailView.tsx
  // Copy structure from: components/forms/NCDetailView.tsx
  ```

- [ ] **Define tabs**
  - Details tab (main information)
  - Related items tab (actions, comments, etc.)
  - History tab (audit trail)
  - Additional tabs as needed

- [ ] **Create API route for single item**
  ```typescript
  // app/api/your-entity/[id]/route.ts
  export async function GET(req, { params }) {
    const item = await prisma.yourEntity.findUnique({
      where: { id: params.id },
      include: { relatedItems: true }
    })
    return NextResponse.json(item)
  }
  ```

- [ ] **Make items clickable**
  ```typescript
  onClick={() => {
    setSelectedId(item.id)
    setShowDetailView(true)
  }}
  ```

- [ ] **Test detail view**
  - Opens correctly
  - All tabs work
  - Data loads
  - Edit functionality works

---

## 🎨 UI Component Checklist

### **Radix UI Components Needed:**

- [ ] `@radix-ui/react-dialog` - Modals/dialogs
- [ ] `@radix-ui/react-tabs` - Tab navigation
- [ ] `@radix-ui/react-select` - Dropdowns
- [ ] `@radix-ui/react-label` - Form labels
- [ ] `@radix-ui/react-slot` - Composition
- [ ] `@radix-ui/react-switch` - Toggle switches (optional)
- [ ] `@radix-ui/react-tooltip` - Tooltips (optional)

### **Icon Library:**

- [ ] `lucide-react` - Modern icon set
  - Common icons: Plus, Download, Search, Filter, ArrowUpDown, Calendar, etc.

### **Styling:**

- [ ] `tailwindcss` - Utility CSS
- [ ] `tailwind-merge` - Merge Tailwind classes
- [ ] `class-variance-authority` - Component variants
- [ ] `clsx` - Conditional classes

---

## 🗄️ Database Migration Checklist

### **If Using Prisma:**

- [ ] **Review schema patterns**
  - Audit logs
  - Approvals
  - Versioning
  - Relationships

- [ ] **Update your schema**
  ```prisma
  // Add new models or fields as needed
  ```

- [ ] **Generate and migrate**
  ```bash
  npx prisma generate
  npx prisma migrate dev --name add_new_features
  ```

- [ ] **Update seed data**
  ```bash
  npx prisma db seed
  ```

### **If Using Different ORM:**

- [ ] Adapt Prisma patterns to your ORM
- [ ] Create equivalent migrations
- [ ] Update seed scripts

---

## 🧪 Testing Checklist

### **For Each Updated Page:**

#### **Functional Testing:**
- [ ] All view modes work
- [ ] Filters work correctly
- [ ] Sorting works correctly
- [ ] Export works
- [ ] Forms submit correctly
- [ ] Detail views open
- [ ] Edit functionality works
- [ ] Delete functionality works

#### **UI/UX Testing:**
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1920px)
- [ ] Hover states work
- [ ] Loading states show
- [ ] Error states show
- [ ] Empty states show

#### **Accessibility Testing:**
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Alt text on images
- [ ] ARIA labels present

#### **Performance Testing:**
- [ ] Page loads < 2 seconds
- [ ] Filtering is instant
- [ ] Sorting is instant
- [ ] Large datasets (1000+ items) perform well
- [ ] No memory leaks

---

## 🚨 Troubleshooting

### **Common Issues:**

#### **"Module not found" errors**
```bash
# Make sure all dependencies are installed
npm install
# Regenerate if using Prisma
npx prisma generate
```

#### **TypeScript errors**
```typescript
// Update interfaces to match your data
interface YourType {
  // Add missing fields
}
```

#### **Styling issues**
```bash
# Make sure Tailwind is configured
# Check tailwind.config.ts includes all paths
content: [
  './app/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
]
```

#### **API errors**
```typescript
// Check API routes are in correct location
// Verify Prisma client is generated
// Check database connection
```

---

## 📊 Progress Tracking

### **Week 1: Foundation**
- [ ] Day 1: Copy UI components
- [ ] Day 2: Install dependencies and test
- [ ] Day 3: Copy layout components
- [ ] Day 4: Copy utilities (export, etc.)
- [ ] Day 5: Test foundation on one page

### **Week 2: Views**
- [ ] Day 1: Add dashboard view to main page
- [ ] Day 2: Add board view to main page
- [ ] Day 3: Add list/grid toggle to 3 pages
- [ ] Day 4: Add calendar view to 1 page
- [ ] Day 5: Test all views

### **Week 3: Features**
- [ ] Day 1: Add filtering to all pages
- [ ] Day 2: Add sorting to all tables
- [ ] Day 3: Add export to all pages
- [ ] Day 4: Implement detail views
- [ ] Day 5: Test all features

### **Week 4: Polish**
- [ ] Day 1: Fix bugs
- [ ] Day 2: Improve performance
- [ ] Day 3: Accessibility audit
- [ ] Day 4: User testing
- [ ] Day 5: Deploy

---

## 🎉 Completion Criteria

### **Minimum Viable Update:**
- ✅ 3+ pages with board view
- ✅ Export on all data pages
- ✅ Basic filtering on all pages
- ✅ Consistent UI components

### **Standard Update:**
- ✅ All workflow pages have board view
- ✅ All pages have dashboard view
- ✅ Advanced filtering and sorting
- ✅ Detail views with tabs
- ✅ Export (CSV + PDF)

### **Complete Update:**
- ✅ All features from ComplianceOS
- ✅ Custom adaptations for Connectify
- ✅ Performance optimized
- ✅ Fully tested
- ✅ Documented

---

## 📞 Quick Commands Reference

### **Copy Files:**
```bash
# Copy entire component directory
cp -r /path/to/ComplianceOS/components/ui/* /path/to/Connectify/components/ui/

# Copy specific file
cp /path/to/ComplianceOS/lib/export.ts /path/to/Connectify/lib/
```

### **Install Packages:**
```bash
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select
npm install lucide-react jspdf jspdf-autotable papaparse
```

### **Database:**
```bash
npx prisma generate
npx prisma migrate dev --name update_schema
npx prisma db seed
```

### **Development:**
```bash
npm run dev
```

---

## 🎯 Priority Matrix

### **High Priority (Do First):**
1. Copy UI components
2. Add board view to top 3 pages
3. Add export functionality
4. Add basic filtering

### **Medium Priority (Do Second):**
1. Add dashboard views
2. Add calendar views (if applicable)
3. Implement detail views
4. Add advanced filtering

### **Low Priority (Nice to Have):**
1. Approval workflows
2. Audit trails
3. Advanced animations
4. Drag-and-drop

---

## ✅ Daily Checklist Template

### **Each Day:**
- [ ] Morning: Review what to accomplish
- [ ] Copy/implement 1-2 features
- [ ] Test thoroughly
- [ ] Commit changes
- [ ] Document any issues
- [ ] Evening: Plan next day

### **Each Week:**
- [ ] Review progress
- [ ] Demo to stakeholders
- [ ] Gather feedback
- [ ] Adjust plan as needed
- [ ] Deploy to staging

---

## 🎉 Success Indicators

You're making good progress when:

✅ No console errors  
✅ All views render correctly  
✅ Users can navigate easily  
✅ Data loads quickly  
✅ Exports work  
✅ Mobile responsive  
✅ Stakeholders are happy  

---

## 📝 Notes Section

Use this space to track your specific migration notes:

```
Date: ___________
Page Updated: ___________
Issues Encountered: ___________
Time Taken: ___________
Notes: ___________
```

---

**Remember:** Migrate incrementally, test thoroughly, and don't hesitate to adapt patterns to fit Connectify's specific needs!

Good luck! 🚀

