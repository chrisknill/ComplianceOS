import { Shell } from '@/components/layout/Shell'
import { Target, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function ObjectivesPage() {
  // In production, fetch from API
  const objectives = [
    {
      id: '1',
      title: 'Reduce TRIR by 25%',
      category: 'INCIDENT_REDUCTION',
      target: 'TRIR ≤ 2.0',
      baseline: '2.67',
      current: '2.4',
      progress: 40,
      dueDate: '2025-12-31',
      status: 'IN_PROGRESS',
      owner: 'OH&S Manager',
    },
    {
      id: '2',
      title: 'Achieve 100% Safety Training Completion',
      category: 'TRAINING',
      target: '100% compliance',
      baseline: '85%',
      current: '94%',
      progress: 75,
      dueDate: '2025-11-30',
      status: 'IN_PROGRESS',
      owner: 'Training Manager',
    },
    {
      id: '3',
      title: 'Zero Lost-Time Injuries',
      category: 'INCIDENT_REDUCTION',
      target: '0 LTIs',
      baseline: '3 LTIs/year',
      current: '0 YTD',
      progress: 100,
      dueDate: '2025-12-31',
      status: 'IN_PROGRESS',
      owner: 'Operations Manager',
    },
    {
      id: '4',
      title: 'Improve Near-Miss Reporting 50%',
      category: 'CULTURE',
      target: '150 near-misses',
      baseline: '100/year',
      current: '125 YTD',
      progress: 65,
      dueDate: '2025-12-31',
      status: 'IN_PROGRESS',
      owner: 'All Supervisors',
    },
    {
      id: '5',
      title: 'ISO 45001 Certification',
      category: 'COMPLIANCE',
      target: 'Achieve certification',
      baseline: 'Gap assessment complete',
      current: 'Stage 1 passed',
      progress: 80,
      dueDate: '2026-03-31',
      status: 'IN_PROGRESS',
      owner: 'QMS Manager',
    },
  ]

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Objectives & Programs</h1>
            <p className="text-slate-600 mt-1">Strategic objectives aligned with ISO 9001/14001/45001</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Objectives</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{objectives.length}</p>
              </div>
              <Target className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">On Track</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {objectives.filter(o => o.progress >= 50).length}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-slate-600">Avg. Progress</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {Math.round(objectives.reduce((sum, o) => sum + o.progress, 0) / objectives.length)}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-slate-600">Achieved</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {objectives.filter(o => o.status === 'ACHIEVED').length}
            </p>
          </div>
        </div>

        {/* Objectives List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Strategic Objectives</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {objectives.map((objective) => (
              <div key={objective.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{objective.title}</h3>
                      <Badge variant="outline">{objective.category.replace('_', ' ')}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase">Target</p>
                        <p className="text-sm font-medium text-slate-900 mt-1">{objective.target}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase">Baseline</p>
                        <p className="text-sm text-slate-600 mt-1">{objective.baseline}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase">Current</p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">{objective.current}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase">Owner</p>
                        <p className="text-sm text-slate-600 mt-1">{objective.owner}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-500 uppercase">Progress</p>
                        <p className="text-sm font-semibold text-slate-900">{objective.progress}%</p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            objective.progress >= 75 ? 'bg-emerald-500' :
                            objective.progress >= 50 ? 'bg-blue-500' :
                            objective.progress >= 25 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${objective.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ISO Alignment */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-slate-900 mb-3">ISO Alignment</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-700">ISO 9001:6.2</span>
              <span className="text-slate-600"> - Quality Objectives</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">ISO 14001:6.2</span>
              <span className="text-slate-600"> - Environmental Objectives</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">ISO 45001:6.2</span>
              <span className="text-slate-600"> - OH&S Objectives</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

