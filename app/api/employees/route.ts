import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const employees = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      jobTitle: true,
      department: true,
      managerId: true,
      phone: true,
      startDate: true,
      status: true,
      location: true,
      groups: true,
      createdAt: true,
    },
  })

  return NextResponse.json(employees)
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { email, password, name, jobTitle, department, managerId, phone, startDate, location, status, role, groups } = body

    // Hash password
    const hashedPassword = await hash(password, 10)

    const employee = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        jobTitle,
        department,
        managerId: managerId || null,
        phone,
        startDate: startDate ? new Date(startDate) : null,
        location,
        status,
        role,
        groups: groups ? JSON.stringify(groups) : null,
      },
    })

    // Return without password
    const { password: _, ...employeeWithoutPassword } = employee
    return NextResponse.json(employeeWithoutPassword)
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}

