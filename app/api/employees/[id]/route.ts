import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

// PUT - Update employee
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, jobTitle, department, managerId, phone, startDate, location, status, role, password } = body

    const data: any = {
      name,
      jobTitle,
      department,
      managerId: managerId || null,
      phone,
      startDate: startDate ? new Date(startDate) : null,
      location,
      status,
      role,
    }

    // Only update password if provided
    if (password) {
      data.password = await hash(password, 10)
    }

    const employee = await prisma.user.update({
      where: { id: params.id },
      data,
    })

    const { password: _, ...employeeWithoutPassword } = employee
    return NextResponse.json(employeeWithoutPassword)
  } catch (error) {
    console.error('Error updating employee:', error)
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

// DELETE - Delete employee
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}

