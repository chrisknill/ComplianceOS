import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Mock infrastructure data
  const infrastructure = [
    {
      id: '1',
      asset: 'Production Line A',
      type: 'Manufacturing',
      location: 'Plant Floor',
      status: 'Operational',
      nextMaintenance: '2025-02-15'
    },
    {
      id: '2',
      asset: 'HVAC System',
      type: 'Utilities',
      location: 'Building A',
      status: 'Operational',
      nextMaintenance: '2025-03-01'
    },
    {
      id: '3',
      asset: 'Fire Suppression System',
      type: 'Safety',
      location: 'All Buildings',
      status: 'Operational',
      nextMaintenance: '2025-04-10'
    },
    {
      id: '4',
      asset: 'Network Infrastructure',
      type: 'IT',
      location: 'Server Room',
      status: 'Operational',
      nextMaintenance: '2025-02-28'
    },
    {
      id: '5',
      asset: 'Compressed Air System',
      type: 'Utilities',
      location: 'Plant Floor',
      status: 'Operational',
      nextMaintenance: '2025-03-20'
    }
  ]

  return NextResponse.json(infrastructure)
}
