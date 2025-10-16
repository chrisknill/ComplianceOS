// Company configuration and document numbering

export interface CompanyConfig {
  name: string
  acronym: string
  sicCode?: string
  industry?: string
}

// Get company config (can be stored in database later)
export function getCompanyConfig(): CompanyConfig {
  return {
    name: 'ComplianceOS Demo',
    acronym: 'COS',
    sicCode: '3599', // Manufacturing
    industry: 'Manufacturing',
  }
}

// Document numbering system
export function generateDocumentNumber(
  type: 'POLICY' | 'PROCEDURE' | 'WORK_INSTRUCTION' | 'REGISTER',
  sequence: number,
  category: 'QUALITY' | 'HSE' | 'ENVIRONMENTAL' = 'QUALITY'
): string {
  const config = getCompanyConfig()
  const typePrefix = {
    POLICY: 'POL',
    PROCEDURE: 'PROC',
    WORK_INSTRUCTION: 'WI',
    REGISTER: 'REG',
  }[type]
  
  const categoryPrefix = {
    QUALITY: 'Q',
    HSE: 'H',
    ENVIRONMENTAL: 'E',
  }[category]
  
  const paddedSeq = String(sequence).padStart(3, '0')
  
  // Format: COS-Q-POL-001
  return `${config.acronym}-${categoryPrefix}-${typePrefix}-${paddedSeq}`
}

// Risk assessment suggestions based on SIC code
export function getSuggestedRiskAssessments(sicCode: string): Array<{
  title: string
  category: string
  likelihood: number
  severity: number
  controls: string[]
}> {
  // Manufacturing hazards (SIC 3000-3999)
  if (sicCode.startsWith('3')) {
    return [
      {
        title: 'Machine guarding inadequacy',
        category: 'Machinery',
        likelihood: 3,
        severity: 4,
        controls: ['Fixed guards', 'Interlocks', 'Training', 'Lockout/tagout'],
      },
      {
        title: 'Slips, trips, and falls',
        category: 'Workplace',
        likelihood: 4,
        severity: 3,
        controls: ['Housekeeping', 'Floor maintenance', 'Signage', 'Lighting'],
      },
      {
        title: 'Manual handling injuries',
        category: 'Ergonomic',
        likelihood: 3,
        severity: 3,
        controls: ['Mechanical aids', 'Team lifts', 'Training', 'Job rotation'],
      },
      {
        title: 'Noise exposure',
        category: 'Occupational Health',
        likelihood: 4,
        severity: 3,
        controls: ['Engineering controls', 'PPE', 'Hearing tests', 'Job rotation'],
      },
      {
        title: 'Chemical exposure',
        category: 'Occupational Health',
        likelihood: 2,
        severity: 4,
        controls: ['Substitution', 'Ventilation', 'PPE', 'SDS available'],
      },
    ]
  }
  
  // Default generic workplace hazards
  return [
    {
      title: 'Workplace violence',
      category: 'Security',
      likelihood: 2,
      severity: 4,
      controls: ['Security procedures', 'Training', 'Incident reporting'],
    },
    {
      title: 'Fire hazards',
      category: 'Emergency',
      likelihood: 2,
      severity: 5,
      controls: ['Fire detection', 'Extinguishers', 'Drills', 'Evacuation plan'],
    },
  ]
}

