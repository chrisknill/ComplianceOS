import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportTableToPDF(
  title: string,
  headers: string[],
  data: any[][],
  filename: string
) {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(18)
  doc.text(title, 14, 20)
  
  // Add metadata
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)
  doc.text('ComplianceOS - ISO 9001/14001/45001 Management System', 14, 36)
  
  // Add table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 45,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255 }, // slate-900
    alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
  })
  
  // Save PDF
  doc.save(filename)
}

export function exportDocumentsToPDF(documents: any[]) {
  const headers = ['Title', 'Code', 'Type', 'Version', 'Status', 'Owner', 'Next Review']
  const data = documents.map(d => [
    d.title,
    d.code || '-',
    d.type.replace('_', ' '),
    d.version,
    d.status,
    d.owner || '-',
    d.nextReview ? new Date(d.nextReview).toLocaleDateString() : '-',
  ])
  
  exportTableToPDF(
    'Document Register',
    headers,
    data,
    `document-register-${new Date().toISOString().split('T')[0]}.pdf`
  )
}

export function exportHazardsToPDF(hazards: any[]) {
  const headers = ['Title', 'Area', 'Pre-Control', 'Residual', 'Owner', 'Status']
  const data = hazards.map(h => [
    h.title,
    h.area || '-',
    `${h.likelihood}×${h.severity}=${h.likelihood * h.severity}`,
    h.residualL && h.residualS ? `${h.residualL}×${h.residualS}=${h.residualL * h.residualS}` : '-',
    h.owner || '-',
    h.status,
  ])
  
  exportTableToPDF(
    'OH&S Hazard Register',
    headers,
    data,
    `hazards-register-${new Date().toISOString().split('T')[0]}.pdf`
  )
}

export function exportIncidentsToPDF(incidents: any[]) {
  const headers = ['Ref', 'Type', 'Date', 'Location', 'Severity', 'Status']
  const data = incidents.map(i => [
    i.ref || i.id.slice(0, 8),
    i.type.replace('_', ' '),
    new Date(i.date).toLocaleDateString(),
    i.location || '-',
    i.severityType.replace('_', ' '),
    i.status.replace('_', ' '),
  ])
  
  exportTableToPDF(
    'Incident Register',
    headers,
    data,
    `incidents-${new Date().toISOString().split('T')[0]}.pdf`
  )
}

export function exportActionsToPDF(actions: any[]) {
  const headers = ['Type', 'Title', 'Owner', 'Due Date', 'Status']
  const data = actions.map(a => [
    a.type,
    a.title,
    a.owner || '-',
    a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '-',
    a.status.replace('_', ' '),
  ])
  
  exportTableToPDF(
    'Corrective & Preventive Actions (CAPA)',
    headers,
    data,
    `actions-${new Date().toISOString().split('T')[0]}.pdf`
  )
}

export function exportEquipmentToPDF(equipment: any[]) {
  const headers = ['Name', 'Asset Tag', 'Location', 'Status', 'Maint. Due']
  const data = equipment.map(e => [
    e.name,
    e.assetTag || '-',
    e.location || '-',
    e.status,
    e.maintDue ? new Date(e.maintDue).toLocaleDateString() : '-',
  ])
  
  exportTableToPDF(
    'Equipment Register',
    headers,
    data,
    `equipment-${new Date().toISOString().split('T')[0]}.pdf`
  )
}

