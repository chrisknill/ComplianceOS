import { NextRequest, NextResponse } from 'next/server'
import { executeCursorCommand, getCursorCommandHelp } from '@/lib/cursor-commands'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (!body.command) {
      return NextResponse.json({ 
        error: 'Missing command parameter',
        help: getCursorCommandHelp()
      }, { status: 400 })
    }

    console.log('Executing Cursor command:', body.command)
    
    const result = await executeCursorCommand(body.command)
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('Cursor command execution error:', error)
    return NextResponse.json({ 
      success: false,
      message: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
      help: getCursorCommandHelp()
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Cursor Command API - Use POST with command parameter',
    help: getCursorCommandHelp(),
    examples: [
      {
        command: 'nc "Safety Issue" "Fix safety guard" "High" "john@company.com" "John Doe"',
        description: 'Create non-conformance case'
      },
      {
        command: 'risk "COSHH Assessment" "Complete bay 3 assessment" "High" "jane@company.com" "Jane Smith"',
        description: 'Create risk assessment'
      },
      {
        command: 'training "Fire Safety" "Complete fire safety course" "Medium" "mike@company.com" "Mike Johnson"',
        description: 'Create training assignment'
      },
      {
        command: 'review "Policy Review" "Review quality policy" "Medium" "sarah@company.com" "Sarah Wilson"',
        description: 'Create document review'
      },
      {
        command: 'action "Audit Checklist" "Complete audit checklist" "High" "auditor@company.com" "Auditor Name" "HSE/Audit"',
        description: 'Create custom action'
      }
    ]
  })
}
