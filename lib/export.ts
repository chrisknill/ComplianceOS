// PDF and data export utilities

export function generatePDF(data: any, title: string): void {
  // Simple CSV export for now (PDF requires additional library)
  const csv = convertToCSV(data)
  downloadFile(csv, `${title}.csv`, 'text/csv')
}

export function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value).replace(/"/g, '""')
    }).map(v => `"${v}"`).join(',')
  )
  
  return [
    headers.join(','),
    ...rows
  ].join('\n')
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Generate auditor export pack
export interface AuditorPackData {
  documents: any[]
  risks: any[]
  training: any[]
  incidents: any[]
  actions: any[]
  audits: any[]
  objectives: any[]
}

export function generateAuditorPack(data: AuditorPackData): void {
  const pack = {
    exportDate: new Date().toISOString(),
    organization: 'ComplianceOS Demo',
    standards: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018'],
    ...data,
  }
  
  const json = JSON.stringify(pack, null, 2)
  downloadFile(json, `auditor-pack-${new Date().toISOString().split('T')[0]}.json`, 'application/json')
}

