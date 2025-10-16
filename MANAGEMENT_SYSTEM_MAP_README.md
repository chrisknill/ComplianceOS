# Management System Map - ComplianceOS

## Overview

The Management System Map is a comprehensive, interactive visualization tool that shows how policies, procedures, work instructions, SOPs, risk assessments, forms, and records all connect within your organization's compliance framework. It provides a clear, hierarchical view of your management system with intelligent pathfinding and workflow guidance.

## Features

### 🗺️ Interactive Map Visualization
- **Node Types**: Policies, Procedures, Work Instructions, SOPs, Risk Assessments, Forms, Records, Training, External Standards
- **Visual Hierarchy**: Color-coded nodes with distinct shapes for each document type
- **Relationship Mapping**: Shows prerequisites, controls, evidence, and reference relationships
- **Critical Path Highlighting**: Emphasizes essential process flows with animated edges

### 🔍 Advanced Search & Filtering
- **Fuzzy Search**: Search across titles, codes, descriptions, tags, and ISO clauses
- **Multi-Filter Support**: Filter by document type, status, owner, location, ISO clause, and tags
- **Real-time Filtering**: Instant visual updates as you apply filters
- **Active Filter Display**: Clear visibility of applied filters with easy removal

### 🧙‍♂️ "What do I need?" Wizard
- **Role-Based Pathfinding**: Select your roles and get personalized compliance paths
- **Activity-Driven Guidance**: Specify what you're trying to accomplish
- **Location-Aware**: Filter paths based on your work location
- **Minimal Path Computation**: AI-powered algorithm finds the most efficient compliance path
- **Estimated Time**: Get realistic time estimates for completing your path

### 📋 Interactive Checklist
- **Generated Checklists**: Automatically create task lists from wizard results
- **Progress Tracking**: Mark items as complete with persistent storage
- **Export Functionality**: Export checklists as JSON for external use
- **Quick Access**: One-click document opening from checklist items

### 🔍 Document Inspector
- **Detailed Information**: View comprehensive document metadata
- **Next Steps Guidance**: See what documents to follow next
- **Relationship Visualization**: Understand upstream and downstream connections
- **Direct Access**: Open documents in SharePoint or download files
- **Issue Reporting**: Report problems or request updates

### 📊 Export & Print
- **Multiple Formats**: Export to PNG, SVG, or PDF
- **Print Optimization**: Specialized print layout for audits and onboarding
- **High Resolution**: Vector-based exports for crisp printing
- **Customizable Views**: Export current filtered view or full map

### ♿ Accessibility Features
- **Keyboard Navigation**: Full keyboard support for all interactions
- **ARIA Labels**: Screen reader compatible
- **High Contrast**: Support for high contrast themes
- **Focus Management**: Clear focus indicators and logical tab order

## Document Types & Visual Coding

### Node Shapes & Colors
- **🛡️ Policy**: Blue gradient, rounded rectangle with header band
- **⚙️ Procedure**: Green gradient, rectangle with corner fold
- **📋 Work Instruction**: Purple gradient, pill shape
- **✅ SOP**: Indigo gradient, rounded rectangle
- **⚠️ Risk Assessment**: Orange gradient, diamond shape
- **📄 Form**: Pink gradient, document sheet shape
- **📁 Record**: Teal gradient, folder shape
- **🎓 Training**: Yellow gradient, rounded rectangle
- **🔗 External Standard**: Gray gradient, hexagon shape

### Status Indicators
- **🟢 Green**: Approved and compliant
- **🟡 Amber**: Under review or pending approval
- **🔴 Red**: Issues or non-compliant
- **⚪ Draft**: In development
- **⚫ Archived**: No longer active

### Relationship Types
- **Critical Path**: Red, thick, animated edges
- **Reference**: Gray, thin edges
- **Prerequisites**: Dotted edges
- **Controls**: Solid edges
- **Evidence**: Dashed edges

## Data Structure

### MapNode Interface
```typescript
interface MapNode {
  id: string;                     // Unique identifier
  code?: string;                  // Document code (e.g., POL-001)
  title: string;                  // Document title
  type: DocType;                  // Document type
  description?: string;           // Brief description
  owner?: string;                 // Responsible person/role
  version?: string;               // Document version
  status?: "green" | "amber" | "red" | "draft" | "archived";
  nextReviewDate?: string;        // ISO date string
  isoClauses?: string[];          // Relevant ISO clauses
  location?: string[];            // Applicable locations
  roles?: string[];               // Responsible roles
  inputs?: string[];              // Required inputs
  outputs?: string[];             // Produced outputs
  risks?: string[];               // Linked risk IDs
  records?: string[];             // Linked record IDs
  tags?: string[];                // Searchable tags
  link?: {                        // Document access
    url?: string;                 // SharePoint/Confluence URL
    filePath?: string;            // Local file path
  };
  position?: { x: number; y: number }; // Visual position
}
```

### MapEdge Interface
```typescript
interface MapEdge {
  id: string;                     // Unique identifier
  source: string;                 // Source node ID
  target: string;                 // Target node ID
  relationship:                   // Relationship type
    | "prerequisite" 
    | "control" 
    | "evidence"
    | "outputToInput" 
    | "escalation" 
    | "reference";
  label?: string;                 // Edge label
  critical?: boolean;             // Critical path indicator
}
```

## Usage Guide

### Getting Started
1. **Access the Map**: Navigate to `/management-system-map` in ComplianceOS
2. **Explore**: Click and drag to pan, scroll to zoom, click nodes to inspect
3. **Search**: Use the search bar to find specific documents
4. **Filter**: Apply filters to focus on specific document types or statuses

### Using the Wizard
1. **Open Wizard**: Click "What do I need?" button in the toolbar
2. **Select Roles**: Choose all roles that apply to you
3. **Define Activities**: Specify what you're trying to accomplish
4. **Choose Location**: Select your work location(s)
5. **Generate Path**: Click "Generate Path" to get your personalized compliance path
6. **Use Checklist**: Click "Use Checklist" to create an interactive task list

### Working with Checklists
1. **View Progress**: See completion percentage and remaining tasks
2. **Mark Complete**: Check off items as you complete them
3. **Open Documents**: Click "Open" buttons to access documents directly
4. **Export**: Export your checklist for external tracking
5. **Reset**: Reset progress if starting over

### Document Inspection
1. **Click Node**: Click any node to open the inspector drawer
2. **View Details**: See comprehensive document information
3. **Follow Path**: Use "Next Required Steps" to see what comes next
4. **Access Document**: Click "Open Source" to view the actual document
5. **Report Issues**: Use "Report an Issue" for problems or updates

### Keyboard Shortcuts
- **F**: Fit view to show all nodes
- **H**: Toggle path highlighting
- **/**: Focus search input
- **Escape**: Clear selection
- **Ctrl/Cmd + P**: Print layout

## Configuration

### Adding Documents
1. **Edit Data File**: Modify `/data/management-map.json`
2. **Add Nodes**: Create new MapNode objects with all required fields
3. **Add Edges**: Define relationships between nodes
4. **Set Positions**: Specify x,y coordinates for visual layout
5. **Restart Server**: Restart the development server to see changes

### SharePoint Integration
1. **Add Links**: Include SharePoint URLs in the `link.url` field
2. **Authentication**: Ensure proper authentication for SharePoint access
3. **Permissions**: Verify user permissions for document access
4. **Preview**: Links open in new tabs for SharePoint document viewing

### Custom Styling
1. **Node Colors**: Modify color schemes in `NodeCard.tsx`
2. **Edge Styles**: Customize edge appearance in `GraphContainer.tsx`
3. **Theme Support**: Add dark mode support in CSS variables
4. **Responsive Design**: Adjust layouts for different screen sizes

## Technical Architecture

### Components
- **GraphContainer**: Main React Flow visualization component
- **NodeCard**: Custom node renderer with type-specific styling
- **InspectorDrawer**: Document detail panel
- **WizardModal**: Interactive pathfinding wizard
- **ChecklistSidebar**: Task management interface
- **MapToolbar**: Search, filters, and actions
- **Legend**: Visual key for map elements
- **Breadcrumbs**: Navigation context

### State Management
- **Zustand Store**: Centralized state management for map data
- **Persistent Storage**: Saves user preferences and progress
- **Real-time Updates**: Reactive UI updates based on state changes

### Performance
- **Virtualization**: Efficient rendering of large node sets
- **Debounced Search**: Optimized search performance
- **Lazy Loading**: On-demand data loading for large maps
- **Memory Management**: Efficient cleanup of unused resources

## API Integration

### Data Sources
- **Static JSON**: Primary data source from `/data/management-map.json`
- **API Fallback**: Dynamic data from `/api/management-map` endpoint
- **Database Integration**: Future support for database-backed data

### SharePoint Integration
- **Graph API**: Microsoft Graph API for SharePoint document access
- **Authentication**: NextAuth.js integration for user authentication
- **Permissions**: Role-based access control for documents

## Troubleshooting

### Common Issues
1. **Nodes Not Loading**: Check data file format and server restart
2. **Search Not Working**: Verify search query format and data structure
3. **Links Not Opening**: Check SharePoint permissions and authentication
4. **Performance Issues**: Reduce node count or enable virtualization

### Debug Mode
1. **Console Logs**: Enable detailed logging in development mode
2. **React DevTools**: Use React DevTools for component inspection
3. **Network Tab**: Monitor API calls and data loading
4. **State Inspection**: Use Zustand DevTools for state debugging

## Future Enhancements

### Planned Features
- **Real-time Collaboration**: Multiple users editing simultaneously
- **Version Control**: Track document changes over time
- **Analytics**: Usage tracking and compliance metrics
- **Mobile Support**: Responsive design for mobile devices
- **Offline Mode**: Local caching for offline access
- **AI Integration**: Intelligent document recommendations
- **Workflow Automation**: Automated compliance workflows
- **Integration APIs**: Connect with external compliance tools

### Customization Options
- **Custom Node Types**: Add organization-specific document types
- **Branding**: Custom colors, logos, and themes
- **Localization**: Multi-language support
- **Custom Fields**: Organization-specific metadata fields
- **Advanced Filters**: Complex filtering and search capabilities

## Support

For technical support or feature requests:
1. **Documentation**: Check this README and inline code comments
2. **Issues**: Report bugs through the issue tracking system
3. **Feature Requests**: Submit enhancement requests
4. **Training**: Request training sessions for your team

## License

This Management System Map is part of ComplianceOS and follows the same licensing terms.
