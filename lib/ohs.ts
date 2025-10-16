export function calculateTRIR(recordableIncidents: number, totalHours: number): number {
  if (!totalHours || totalHours <= 0) return 0
  return Number(((recordableIncidents * 200000) / totalHours).toFixed(2))
}

export function calculateLTIFR(lostTimeInjuries: number, totalHours: number): number {
  if (!totalHours || totalHours <= 0) return 0
  return Number(((lostTimeInjuries * 1000000) / totalHours).toFixed(2))
}

export function calculateDART(daysAwayRestrictedTransferred: number, totalHours: number): number {
  if (!totalHours || totalHours <= 0) return 0
  return Number(((daysAwayRestrictedTransferred * 200000) / totalHours).toFixed(2))
}

export function getNearMissRatio(nearMisses: number, incidents: number): number {
  if (!incidents || incidents <= 0) return 0
  return Number((nearMisses / incidents).toFixed(2))
}
