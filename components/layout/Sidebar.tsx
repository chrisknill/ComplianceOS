'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  AlertTriangle,
  Wrench,
  Calendar,
  ClipboardList,
  User,
  Settings,
  Shield,
  AlertOctagon,
  FileWarning,
  CheckSquare,
  ClipboardCheck,
  FileCheck,
  Users,
  Activity,
  Siren,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Network,
  ClipboardEdit,
  FileSignature,
  Heart,
  Recycle,
  Building2,
  Globe,
  MapPin,
  FileCheck as PolicyIcon,
  UserCheck,
  Scale,
  AlertCircle as RiskIcon,
  Leaf,
  HardHat,
  Lightbulb,
  RotateCcw,
  BookOpen,
  MessageSquare,
  Server,
  Gauge,
  Factory,
  Workflow,
  FileCode,
  Package,
  Users2,
  Zap,
  Trash2,
  BarChart3,
  Eye,
  ShieldCheck,
  Scale as ComplianceIcon,
  ClipboardList as ReviewIcon,
  AlertTriangle as NCIcon,
  AlertCircle as IncidentIcon,
  TrendingUp as ImprovementIcon,
  BookOpen as LessonsIcon,
  RotateCcw as CITrackerIcon,
  Scale as LegalIcon,
  AlertTriangle as RiskRegisterIcon,
  Target as ObjectivesIcon,
  Server as AssetsIcon,
  Users as SuppliersIcon,
  GraduationCap as TrainingIcon,
  FileText as DocumentsIcon,
  CheckSquare as ActionsIcon,
  UserCog,
  Plug,
  Palette,
  FileText as LogsIcon,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dashboard Section
const dashboardNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Overview', href: '/dashboard/overview', icon: BarChart3 },
  { name: 'Quick Add', href: '/dashboard/quick-add', icon: Zap },
  { name: 'KPIs', href: '/dashboard/kpi', icon: TrendingUp },
]

// Governance Section
const governanceNavigation = [
  { name: 'System Map', href: '/management-system-map', icon: Network },
  { name: 'Context', href: '/governance/context', icon: Building2 },
  { name: 'Interested Parties', href: '/governance/interested-parties', icon: Users },
  { name: 'Scope', href: '/governance/scope', icon: MapPin },
  { name: 'Policies', href: '/governance/policies', icon: PolicyIcon },
  { name: 'Roles', href: '/governance/roles', icon: UserCheck },
  { name: 'Compliance Register', href: '/governance/compliance-register', icon: ComplianceIcon },
]

// Planning Section
const planningNavigation = [
  { name: 'Risk Assessments', href: '/risk', icon: AlertTriangle },
  { name: 'Business Risk', href: '/planning/business-risk', icon: RiskIcon },
  { name: 'Env Aspects', href: '/planning/env-aspects-impacts', icon: Leaf },
  { name: 'OHS Hazards', href: '/planning/ohs-hazards-risks', icon: HardHat },
  { name: 'Objectives', href: '/planning/objectives', icon: ObjectivesIcon },
  { name: 'Change Management', href: '/planning/change-management', icon: RotateCcw },
]

// Support Section
const supportNavigation = [
  { name: 'Documentation', href: '/documentation', icon: FileText },
  { name: 'Training', href: '/training', icon: GraduationCap },
  { name: 'Communication', href: '/support/communication', icon: MessageSquare },
  { name: 'Infrastructure', href: '/support/infrastructure', icon: Server },
  { name: 'Equipment', href: '/equipment', icon: Wrench },
  { name: 'Calibration', href: '/calibration', icon: Calendar },
  { name: 'Suppliers', href: '/support/suppliers', icon: Users2 },
]

// Operations Section
const operationsNavigation = [
  { name: 'Process Map', href: '/operations/process-map', icon: Workflow },
  { name: 'Design & Development', href: '/operations/design-development', icon: Lightbulb },
  { name: 'Production Control', href: '/operations/production-control', icon: Factory },
  { name: 'Contractor Management', href: '/operations/contractor-management', icon: Users },
  { name: 'Contract Review', href: '/contract-review', icon: FileSignature },
  { name: 'Emergency Prep', href: '/operations/emergency-preparedness', icon: Siren },
  { name: 'Waste Management', href: '/waste-management', icon: Recycle },
]

// Performance Section
const performanceNavigation = [
  { name: 'Customer Satisfaction', href: '/customer-satisfaction', icon: Heart },
  { name: 'Audits & Inspections', href: '/audits', icon: ClipboardCheck },
  { name: 'Management Review', href: '/management-review', icon: ClipboardEdit },
  { name: 'Env Monitoring', href: '/performance/env-monitoring', icon: Eye },
  { name: 'OHS Performance', href: '/performance/ohs-performance', icon: ShieldCheck },
  { name: 'Compliance Evaluation', href: '/performance/compliance-evaluation', icon: Scale },
]

// Improvement Section
const improvementNavigation = [
  { name: 'Dashboard', href: '/nonconformance?tab=DASHBOARD', icon: LayoutDashboard },
  { name: 'All Cases', href: '/nonconformance?tab=ALL', icon: AlertCircle },
  { name: 'Non-Conformance', href: '/nonconformance?tab=NC', icon: NCIcon },
  { name: 'OFI', href: '/nonconformance?tab=OFI', icon: ImprovementIcon },
  { name: 'Incidents', href: '/nonconformance?tab=CC', icon: IncidentIcon },
  { name: 'Lessons Learned', href: '/nonconformance?tab=SNC', icon: LessonsIcon },
  { name: 'CI Tracker', href: '/nonconformance?tab=CI', icon: CITrackerIcon },
]

// Admin Section
const adminNavigation = [
  { name: 'Users', href: '/admin/users', icon: UserCog },
  { name: 'Integrations', href: '/admin/integrations', icon: Plug },
  { name: 'Branding', href: '/admin/branding', icon: Palette },
  { name: 'Logs', href: '/admin/logs', icon: LogsIcon },
]

const ohsNavigation = [
  { name: 'OH&S Dashboard', href: '/ohs/dashboard', icon: Shield },
  { name: 'Hazards Register', href: '/ohs/hazards', icon: AlertOctagon },
  { name: 'Incidents', href: '/ohs/incidents', icon: FileWarning },
  { name: 'Actions (CAPA)', href: '/ohs/actions', icon: CheckSquare },
  { name: 'Audits & Inspections', href: '/ohs/audits-inspections', icon: ClipboardCheck },
  { name: 'Permits to Work', href: '/ohs/permits', icon: FileCheck },
  { name: 'Contractors', href: '/ohs/contractors', icon: Users },
  { name: 'OH&S Competence', href: '/ohs/competence', icon: GraduationCap },
  { name: 'Health Surveillance', href: '/ohs/health-surveillance', icon: Activity },
  { name: 'Emergency Prep', href: '/ohs/emergency', icon: Siren },
  { name: 'OH&S KPIs', href: '/ohs/kpis', icon: TrendingUp },
]

const bottomNavigation = [
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Objectives', href: '/objectives', icon: ObjectivesIcon },
  { name: 'Subscription', href: '/subscription', icon: CreditCard },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  
  // State for collapsed sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    dashboard: false,
    governance: false,
    planning: false,
    support: false,
    operations: false,
    performance: false,
    improvement: false,
    ohs: false,
    admin: false,
  })

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0">
      {/* Header section above sidebar */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6">
        <div className="text-white">
          <h1 className="text-xl font-bold">ComplianceOS</h1>
          <p className="text-xs text-slate-400">ISO Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
        {/* Dashboard Section */}
        <div>
          <button
            onClick={() => toggleSection('dashboard')}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
          >
            Dashboard
            {collapsedSections.dashboard ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.dashboard && (
            <div className="space-y-1 mt-2">
              {dashboardNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Governance Section */}
        <div>
          <button
            onClick={() => toggleSection('governance')}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
          >
            Governance
            {collapsedSections.governance ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.governance && (
            <div className="space-y-1 mt-2">
              {governanceNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Planning Section */}
        <div>
          <button
            onClick={() => toggleSection('planning')}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
          >
            Planning
            {collapsedSections.planning ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.planning && (
            <div className="space-y-1 mt-2">
              {planningNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Support Section */}
        <div>
          <button
            onClick={() => toggleSection('support')}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
          >
            Support
            {collapsedSections.support ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.support && (
            <div className="space-y-1 mt-2">
              {supportNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Operations Section */}
        <div>
          <button
            onClick={() => toggleSection('operations')}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
          >
            Operations
            {collapsedSections.operations ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.operations && (
            <div className="space-y-1 mt-2">
              {operationsNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Performance Section */}
        <div>
          <button
            onClick={() => toggleSection('performance')}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
          >
            Performance
            {collapsedSections.performance ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.performance && (
            <div className="space-y-1 mt-2">
              {performanceNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Improvement Section */}
        <div>
          <button
            onClick={() => toggleSection('improvement')}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
          >
            Improvement
            {collapsedSections.improvement ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.improvement && (
            <div className="space-y-1 mt-2">
              {improvementNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* OH&S Section */}
        <div>
          <button
            onClick={() => toggleSection('ohs')}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
          >
            OH&S (ISO 45001)
            {collapsedSections.ohs ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.ohs && (
            <div className="space-y-1 mt-2">
              {ohsNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Admin Section */}
        <div>
          <button
            onClick={() => toggleSection('admin')}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
          >
            Administration
            {collapsedSections.admin ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.admin && (
            <div className="space-y-1 mt-2">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-4">
          <div className="space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <p>ISO 9001:2015</p>
        <p>ISO 14001:2015</p>
        <p>ISO 45001:2018</p>
      </div>
    </div>
  )
}

