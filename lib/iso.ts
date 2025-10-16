export interface ISOClause {
  standard: '9001' | '14001' | '45001'
  clause: string
  title: string
}

export const ISO_9001_CLAUSES: Record<string, string> = {
  '4': 'Context of the Organization',
  '5': 'Leadership',
  '5.2': 'Policy',
  '5.3': 'Organizational Roles',
  '6': 'Planning',
  '6.1': 'Actions to Address Risks and Opportunities',
  '7': 'Support',
  '7.1': 'Resources',
  '7.1.3': 'Infrastructure',
  '7.1.4': 'Environment for Operation',
  '7.1.5': 'Monitoring and Measuring Resources',
  '7.2': 'Competence',
  '7.5': 'Documented Information',
  '8': 'Operation',
  '8.1': 'Operational Planning and Control',
  '8.2.1': 'Customer Communication',
  '8.4': 'Control of Externally Provided Processes',
  '8.5': 'Production and Service Provision',
  '9': 'Performance Evaluation',
  '9.1': 'Monitoring, Measurement, Analysis and Evaluation',
  '9.2': 'Internal Audit',
  '9.3': 'Management Review',
  '10': 'Improvement',
  '10.2': 'Nonconformity and Corrective Action',
}

export const ISO_14001_CLAUSES: Record<string, string> = {
  '4': 'Context of the Organization',
  '5': 'Leadership',
  '5.2': 'Environmental Policy',
  '5.3': 'Organizational Roles',
  '6': 'Planning',
  '6.1': 'Actions to Address Risks and Opportunities',
  '6.1.1': 'General',
  '6.1.2': 'Environmental Aspects',
  '6.1.3': 'Compliance Obligations',
  '6.1.4': 'Planning Action',
  '7': 'Support',
  '7.5': 'Documented Information',
  '8': 'Operation',
  '8.1': 'Operational Planning and Control',
  '9': 'Performance Evaluation',
  '9.1': 'Monitoring, Measurement, Analysis and Evaluation',
  '9.2': 'Internal Audit',
  '10': 'Improvement',
  '10.2': 'Nonconformity and Corrective Action',
}

export const ISO_45001_CLAUSES: Record<string, string> = {
  '4': 'Context of the Organization',
  '5': 'Leadership and Worker Participation',
  '5.1': 'Leadership and Commitment',
  '5.2': 'OH&S Policy',
  '5.3': 'Organizational Roles',
  '5.4': 'Consultation and Participation',
  '6': 'Planning',
  '6.1': 'Actions to Address Risks and Opportunities',
  '6.1.1': 'General',
  '6.1.2': 'Hazard Identification',
  '6.1.2.1': 'Hazard Identification Process',
  '6.1.3': 'Legal and Other Requirements',
  '6.2': 'OH&S Objectives and Planning',
  '7': 'Support',
  '7.2': 'Competence',
  '7.3': 'Awareness',
  '7.4': 'Communication',
  '7.5': 'Documented Information',
  '8': 'Operation',
  '8.1': 'Operational Planning and Control',
  '8.1.2': 'Eliminating Hazards and Reducing OH&S Risks',
  '8.1.3': 'Management of Change',
  '8.1.4': 'Procurement',
  '8.2': 'Emergency Preparedness and Response',
  '9': 'Performance Evaluation',
  '9.1': 'Monitoring, Measurement, Analysis and Evaluation',
  '9.1.2': 'Evaluation of Compliance',
  '9.2': 'Internal Audit',
  '9.3': 'Management Review',
  '10': 'Improvement',
  '10.1': 'General',
  '10.2': 'Incident, Nonconformity and Corrective Action',
  '10.3': 'Continual Improvement',
}

export function parseISOClause(ref: string): ISOClause | null {
  const match = ref.match(/^(9001|14001|45001):(.+)$/)
  if (!match) return null
  
  const [, standard, clause] = match
  const clauses = standard === '9001' ? ISO_9001_CLAUSES : standard === '14001' ? ISO_14001_CLAUSES : ISO_45001_CLAUSES
  const title = clauses[clause] || 'Unknown'
  
  return {
    standard: standard as '9001' | '14001' | '45001',
    clause,
    title,
  }
}

export function getISOClauses(refs: string | string[]): ISOClause[] {
  const refArray = typeof refs === 'string' ? JSON.parse(refs) : refs
  return refArray.map(parseISOClause).filter((c): c is ISOClause => c !== null)
}

