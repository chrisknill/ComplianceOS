# Kanban Board View Implementation Status

## ✅ Pages with Board View

### 1. **Non-Conformance & Improvements** ✅ COMPLETE
- **Columns**: Open → Under Investigation → In Progress → Pending Verification → Closed
- **Features**: Color-coded left borders by case type (OFI/NC/CC/SNC), severity badges, clickable cards
- **Location**: `/app/nonconformance/page.tsx`

### 2. **Actions (CAPA)** ✅ COMPLETE
- **Columns**: Open → In Progress → Blocked → Pending Approval → Completed
- **Features**: Action type badges, RAG status indicators, owner/due date display
- **Location**: `/app/ohs/actions/page.tsx`

---

## 📋 Pages That Would Benefit from Board View

### High Priority

#### 3. **OH&S Incidents & Near-Misses**
- **Suggested Columns**: Open → Under Investigation → Actions In Progress → Pending Verification → Closed
- **Location**: `/app/ohs/incidents/page.tsx`
- **Status**: Has Dashboard/List/Grid - needs Board

#### 4. **OH&S Hazards Register**
- **Suggested Columns**: Open → Treated → Under Review → Closed
- **Location**: `/app/ohs/hazards/page.tsx`
- **Status**: Has Dashboard/List/Grid - needs Board

#### 5. **Permits to Work**
- **Suggested Columns**: Pending → Approved → Active → Expired → Cancelled
- **Location**: `/app/ohs/permits/page.tsx`
- **Status**: Has List view - needs Board

### Medium Priority

#### 6. **Audits & Inspections**
- **Suggested Columns**: Scheduled → In Progress → Report Draft → Under Review → Closed
- **Location**: `/app/ohs/audits-inspections/page.tsx`
- **Status**: Has Calendar/List - Board would complement calendar view

#### 7. **Documents**
- **Suggested Columns**: Draft → Under Review → Pending Approval → Approved → Archived
- **Location**: `/app/documentation/page.tsx`
- **Status**: Has List/Grid - Board would show approval workflow

### Lower Priority (Status-based workflows less critical)

8. **Training** - Mostly record-based, less workflow-oriented
9. **Equipment** - Asset management, not workflow-based
10. **Calibration** - Schedule-based, not workflow-based
11. **Registers** - Record keeping, not workflow-based
12. **Risk Assessments** - Has categories, but less workflow-oriented

---

## 🎨 Board View Design Pattern

### Standard Implementation

```typescript
type ViewMode = 'dashboard' | 'list' | 'grid' | 'board'

// View Switcher
<button onClick={() => setViewMode('board')}>Board</button>

// Board Structure
{viewMode === 'board' && (
  <div className="overflow-x-auto">
    <div className="flex gap-4 min-w-max pb-4">
      {/* Column 1 */}
      <div className="flex-shrink-0 w-80">
        <div className="bg-slate-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3>Column Name</h3>
            <Badge>{count}</Badge>
          </div>
          <div className="space-y-3">
            {/* Cards */}
          </div>
        </div>
      </div>
      {/* More columns... */}
    </div>
  </div>
)}
```

### Card Design Pattern

```typescript
<div
  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-{color}"
  onClick={() => handleClick(item)}
>
  <div className="flex items-start justify-between mb-2">
    <Badge>{type}</Badge>
    <StatusBadge status={rag} />
  </div>
  <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">
    {title}
  </h4>
  <div className="flex items-center justify-between text-xs text-slate-600">
    <span>{owner}</span>
    <span>{dueDate}</span>
  </div>
</div>
```

### Color Coding

- **Left Border Colors** indicate status/priority:
  - Gray (`border-slate-400`): Open/New
  - Blue (`border-blue-500`): In Progress
  - Amber (`border-amber-500`): Pending/Warning
  - Rose (`border-rose-500`): Blocked/Critical
  - Emerald (`border-emerald-500`): Completed/Closed

- **Opacity**: Completed items use `opacity-75` to de-emphasize

---

## 🚀 Next Steps

### To Add Board View to Remaining Pages:

1. **Update ViewMode type**: Add `'board'` to the union type
2. **Add Board button**: In the view switcher
3. **Implement Board JSX**: After grid view, before forms
4. **Define Columns**: Based on status field values
5. **Map Items**: Filter by status and render cards
6. **Test**: Ensure clicking cards opens detail/edit views

### Estimated Time per Page:
- Simple (single status field): ~15 minutes
- Complex (multiple states/approvals): ~30 minutes

---

## 💡 Benefits of Board View

1. **Visual Workflow**: See items moving through stages
2. **Bottleneck Identification**: Spot columns with too many items
3. **Team Coordination**: Understand what's in progress
4. **Quick Status**: At-a-glance view of workflow health
5. **Drag-and-Drop Ready**: Structure supports future DnD enhancement

---

## 📊 Current Implementation Stats

- **Total Pages with Views**: 15+
- **Pages with Board View**: 2 ✅
- **High Priority Remaining**: 5
- **Medium Priority Remaining**: 2
- **Coverage**: ~13% complete for high-value pages

---

## 🎯 Recommended Implementation Order

1. ✅ Non-Conformance (DONE)
2. ✅ Actions/CAPA (DONE)
3. **OH&S Incidents** - High value, clear workflow
4. **Permits to Work** - Critical safety workflow
5. **Documents** - Approval workflow visibility
6. **Audits & Inspections** - Complements calendar
7. **OH&S Hazards** - Risk management workflow

---

## 🔧 Technical Notes

- All board views use horizontal scrolling for multiple columns
- Cards are 320px wide (`w-80`)
- Minimum 4px gap between columns
- Each column has count badge
- Cards show minimal info (type, title, owner, date)
- Click anywhere on card to open detail view
- Responsive: scrolls horizontally on smaller screens

