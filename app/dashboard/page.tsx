import { Shell } from '@/components/layout/Shell'
import { prisma } from '@/lib/prisma'
import { getRiskRAG, getDocumentRAG, getTrainingRAG, getCalibrationRAG } from '@/lib/rag'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'
import { AlertTriangle, FileText, GraduationCap, Wrench, AlertCircle } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData() {
  const [risks, documents, trainingRecords, calibrations, nonconformities] = await Promise.all([
    prisma.risk.findMany({ where: { status: 'OPEN' } }),
    prisma.document.findMany({ where: { status: 'APPROVED' } }),
    prisma.trainingRecord.findMany({ include: { user: true, course: true } }),
    prisma.calibration.findMany({ include: { equipment: true } }),
    prisma.registerEntry.findMany({ where: { type: 'NONCONFORMITY', status: 'OPEN' } }),
  ])

  // Calculate risk RAG counts
  const riskRAG = { green: 0, amber: 0, red: 0 }
  risks.forEach((risk) => {
    const score = risk.likelihood * risk.severity
    const rag = getRiskRAG(score)
    riskRAG[rag]++
  })

  // Documents due for review
  const docsDue = documents.filter((doc) => {
    if (!doc.nextReview) return false
    const rag = getDocumentRAG(doc.nextReview)
    return rag === 'amber' || rag === 'red'
  })

  // Training due/overdue
  const trainingDue = trainingRecords.filter((record) => {
    const rag = getTrainingRAG(record.status, record.dueDate, record.completed)
    return rag === 'amber' || rag === 'red'
  })

  // Calibrations due
  const calibrationsDue = calibrations.filter((cal) => {
    const rag = getCalibrationRAG(cal.dueDate, cal.performedOn)
    return rag === 'amber' || rag === 'red'
  })

  return {
    riskRAG,
    docsDue: docsDue.slice(0, 5),
    trainingDue: trainingDue.slice(0, 5),
    calibrationsDue: calibrationsDue.slice(0, 5),
    nonconformities,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Compliance overview and key metrics</p>
        </div>

        {/* Key Metrics - Clickable Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/risk" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Open Risks</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {data.riskRAG.green + data.riskRAG.amber + data.riskRAG.red}
                </p>
              </div>
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
            <div className="flex gap-2 mt-4">
              <StatusBadge status="green" label={`${data.riskRAG.green} Low`} />
              <StatusBadge status="amber" label={`${data.riskRAG.amber} Med`} />
              <StatusBadge status="red" label={`${data.riskRAG.red} High`} />
            </div>
          </Link>

          <Link href="/documentation" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Docs Due Review</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{data.docsDue.length}</p>
              </div>
              <FileText className="h-10 w-10 text-blue-500" />
            </div>
            <p className="text-sm text-slate-500 mt-4">Next 30 days</p>
          </Link>

          <Link href="/training" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Training Due</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{data.trainingDue.length}</p>
              </div>
              <GraduationCap className="h-10 w-10 text-emerald-500" />
            </div>
            <p className="text-sm text-slate-500 mt-4">Requires attention</p>
          </Link>

          <Link href="/calibration" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Calibrations Due</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{data.calibrationsDue.length}</p>
              </div>
              <Wrench className="h-10 w-10 text-purple-500" />
            </div>
            <p className="text-sm text-slate-500 mt-4">Next 30 days</p>
          </Link>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documents Due */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Documents Due for Review</h2>
            </div>
            <div className="p-6">
              {data.docsDue.length === 0 ? (
                <p className="text-slate-500 text-sm">No documents due for review</p>
              ) : (
                <div className="space-y-4">
                  {data.docsDue.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{doc.title}</p>
                        <p className="text-sm text-slate-500">{doc.code} • v{doc.version}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">{formatDate(doc.nextReview)}</p>
                        <StatusBadge status={getDocumentRAG(doc.nextReview)} className="mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Training Due */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Training Due/Overdue</h2>
            </div>
            <div className="p-6">
              {data.trainingDue.length === 0 ? (
                <p className="text-slate-500 text-sm">All training up to date</p>
              ) : (
                <div className="space-y-4">
                  {data.trainingDue.map((record) => (
                    <div key={record.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{record.user.name}</p>
                        <p className="text-sm text-slate-500">{record.course.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">{formatDate(record.dueDate)}</p>
                        <StatusBadge
                          status={getTrainingRAG(record.status, record.dueDate, record.completed)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calibrations Due */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Calibrations</h2>
            </div>
            <div className="p-6">
              {data.calibrationsDue.length === 0 ? (
                <p className="text-slate-500 text-sm">No calibrations due</p>
              ) : (
                <div className="space-y-4">
                  {data.calibrationsDue.map((cal) => (
                    <div key={cal.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{cal.equipment.name}</p>
                        <p className="text-sm text-slate-500">{cal.equipment.assetTag}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">{formatDate(cal.dueDate)}</p>
                        <StatusBadge
                          status={getCalibrationRAG(cal.dueDate, cal.performedOn)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Open Nonconformities */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Open Nonconformities</h2>
            </div>
            <div className="p-6">
              {data.nonconformities.length === 0 ? (
                <p className="text-slate-500 text-sm">No open nonconformities</p>
              ) : (
                <div className="space-y-4">
                  {data.nonconformities.map((ncr) => (
                    <div key={ncr.id} className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-rose-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{ncr.title}</p>
                        <p className="text-sm text-slate-500">{ncr.details}</p>
                        <p className="text-xs text-slate-400 mt-1">Owner: {ncr.owner}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

