'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Target,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Network,
  ClipboardEdit,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Documentation', href: '/documentation', icon: FileText },
  { name: 'Training', href: '/training', icon: GraduationCap },
  { name: 'Risk Assessments', href: '/risk', icon: AlertTriangle },
  { name: 'NC & Improvements', href: '/nonconformance', icon: AlertCircle },
  { name: 'Equipment', href: '/equipment', icon: Wrench },
  { name: 'Calibration', href: '/calibration', icon: Calendar },
  { name: 'Registers', href: '/registers', icon: ClipboardList },
  { name: 'Management Review', href: '/management-review', icon: ClipboardEdit },
  { name: 'Management System Map', href: '/management-system-map', icon: Network },
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
  { name: 'Objectives', href: '/objectives', icon: Target },
  { name: 'Subscription', href: '/subscription', icon: CreditCard },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">ComplianceOS</h1>
        <p className="text-slate-400 text-sm mt-1">ISO Management</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {/* QMS/EMS Section */}
        <div>
          <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            QMS / EMS
          </h3>
          <div className="space-y-1">
            {navigation.map((item) => {
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

        {/* OH&S Section */}
        <div>
          <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            OH&S (ISO 45001)
          </h3>
          <div className="space-y-1">
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

