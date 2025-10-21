#!/usr/bin/env node

/**
 * Cursor Action CLI Tool
 * Execute n8n actions directly from Cursor terminal
 * 
 * Usage:
 * node cursor-action.js nc "Title" "Description" "Priority" "Email" "Name"
 * node cursor-action.js risk "Title" "Description" "Priority" "Email" "Name"
 * node cursor-action.js training "Title" "Description" "Priority" "Email" "Name"
 * node cursor-action.js review "Title" "Description" "Priority" "Email" "Name"
 * node cursor-action.js action "Title" "Description" "Priority" "Email" "Name" "Source"
 */

const API_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function executeCommand(command: string) {
  try {
    const response = await fetch(`${API_URL}/api/cursor-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Action created successfully!')
      console.log(`Action ID: ${result.actionId}`)
      console.log(`Message: ${result.message}`)
      if (result.webhookResponse) {
        console.log('Webhook Response:', result.webhookResponse)
      }
    } else {
      console.log('❌ Action creation failed!')
      console.log(`Error: ${result.message}`)
      if (result.help) {
        console.log('\nHelp:')
        console.log(result.help)
      }
    }
  } catch (error) {
    console.error('❌ Error executing command:', error)
  }
}

function showHelp() {
  console.log(`
🚀 Cursor Action CLI - n8n Integration Tool

USAGE:
  node cursor-action.js <command> "param1" "param2" ...

COMMANDS:
  nc, nonconformance    Create non-conformance case
  risk, coshh, hazard   Create risk assessment
  training, course      Create training assignment  
  review, policy       Create document review
  action, task         Create custom action

EXAMPLES:
  node cursor-action.js nc "Safety Issue" "Fix safety guard" "High" "john@company.com" "John Doe"
  node cursor-action.js risk "COSHH Assessment" "Complete bay 3" "High" "jane@company.com" "Jane Smith"
  node cursor-action.js training "Fire Safety" "Complete course" "Medium" "mike@company.com" "Mike Johnson"
  node cursor-action.js review "Policy Review" "Review quality policy" "Medium" "sarah@company.com" "Sarah Wilson"
  node cursor-action.js action "Audit Checklist" "Complete checklist" "High" "auditor@company.com" "Auditor" "HSE/Audit"

PRIORITY OPTIONS: Low, Medium, High, Critical
CASE TYPES: NC, CC, SNC, OFI
SEVERITY: LOW, MEDIUM, HIGH, CRITICAL

All actions are automatically sent to your n8n webhook!
`)
}

// Main execution
const args = process.argv.slice(2)

if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
  showHelp()
  process.exit(0)
}

const command = args.join(' ')
executeCommand(command)
