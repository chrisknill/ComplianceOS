import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Fetch all the data we need for the dashboard
    const [
      employees,
      risks,
      equipment,
      calibrations,
      nonconformances,
      audits,
      trainings
    ] = await Promise.all([
      prisma.employee.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          position: true,
          department: true,
          status: true
        }
      }),
      prisma.riskAssessment.findMany({
        select: {
          id: true,
          title: true,
          level: true,
          status: true,
          description: true
        }
      }),
      prisma.equipment.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          description: true
        }
      }),
      prisma.calibration.findMany({
        select: {
          id: true,
          equipmentName: true,
          calibrationDate: true,
          nextDueDate: true,
          status: true
        }
      }),
      prisma.nonConformance.findMany({
        select: {
          id: true,
          title: true,
          priority: true,
          status: true,
          description: true
        }
      }),
      prisma.audit.findMany({
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          auditDate: true
        }
      }),
      prisma.training.findMany({
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          completionDate: true
        }
      })
    ])

    // Calculate statistics
    const stats = {
      totalEmployees: employees.length,
      totalRisks: risks.length,
      totalEquipment: equipment.length,
      totalCalibrations: calibrations.length,
      totalNonConformances: nonconformances.length,
      totalAudits: audits.length,
      totalTrainings: trainings.length,
      activeEmployees: employees.filter(emp => emp.status === 'active').length,
      highRiskItems: risks.filter(risk => risk.level === 'high').length,
      overdueCalibrations: calibrations.filter(cal => 
        cal.nextDueDate && new Date(cal.nextDueDate) < new Date()
      ).length,
      openNonConformances: nonconformances.filter(nc => nc.status === 'open').length
    }

    // Generate KPIs
    const kpis = {
      employeeRetentionRate: stats.activeEmployees > 0 ? 
        Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0,
      riskMitigationRate: stats.totalRisks > 0 ? 
        Math.round(((stats.totalRisks - stats.highRiskItems) / stats.totalRisks) * 100) : 0,
      calibrationComplianceRate: stats.totalCalibrations > 0 ? 
        Math.round(((stats.totalCalibrations - stats.overdueCalibrations) / stats.totalCalibrations) * 100) : 0,
      ncResolutionRate: stats.totalNonConformances > 0 ? 
        Math.round(((stats.totalNonConformances - stats.openNonConformances) / stats.totalNonConformances) * 100) : 0
    }

    // Generate recent activities (last 10 items from each category)
    const recentActivities = [
      ...employees.slice(0, 3).map(emp => ({
        title: `Employee: ${emp.firstName} ${emp.lastName}`,
        type: 'Employee',
        date: new Date().toISOString().split('T')[0],
        description: `${emp.position} in ${emp.department}`
      })),
      ...risks.slice(0, 3).map(risk => ({
        title: risk.title,
        type: 'Risk Assessment',
        date: new Date().toISOString().split('T')[0],
        description: `Level: ${risk.level}, Status: ${risk.status}`
      })),
      ...equipment.slice(0, 2).map(eq => ({
        title: eq.name,
        type: 'Equipment',
        date: new Date().toISOString().split('T')[0],
        description: `${eq.type} - Status: ${eq.status}`
      })),
      ...nonconformances.slice(0, 2).map(nc => ({
        title: nc.title,
        type: 'Non-Conformance',
        date: new Date().toISOString().split('T')[0],
        description: `Priority: ${nc.priority}, Status: ${nc.status}`
      }))
    ].slice(0, 10)

    // Generate alerts for urgent items
    const alerts = [
      ...(stats.overdueCalibrations > 0 ? [{
        title: `${stats.overdueCalibrations} Overdue Calibrations`,
        priority: 'high',
        status: 'urgent',
        description: 'Equipment calibrations are overdue and require immediate attention'
      }] : []),
      ...(stats.highRiskItems > 0 ? [{
        title: `${stats.highRiskItems} High Risk Items`,
        priority: 'high',
        status: 'active',
        description: 'High-risk assessments need immediate review and mitigation'
      }] : []),
      ...(stats.openNonConformances > 0 ? [{
        title: `${stats.openNonConformances} Open Non-Conformances`,
        priority: 'medium',
        status: 'active',
        description: 'Non-conformances require resolution'
      }] : [])
    ]

    const dashboardData = {
      stats,
      kpis,
      recentActivities,
      alerts,
      lastUpdated: new Date().toISOString(),
      generatedBy: 'ComplianceOS Dashboard API'
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    
    return NextResponse.json({
      error: 'Failed to fetch dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error',
      stats: {
        totalEmployees: 0,
        totalRisks: 0,
        totalEquipment: 0,
        totalCalibrations: 0,
        totalNonConformances: 0
      },
      kpis: {},
      recentActivities: [],
      alerts: [],
      lastUpdated: new Date().toISOString()
    }, { status: 500 })
  }
}
