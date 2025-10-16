# ISO 45001 Implementation - Complete Guide

## ✅ COMPLETED SO FAR

### 1. Database Schema Extended ✓
- Added 11 new models for OH&S management
- OHSHazard, Incident, Investigation, Action, OHSAudit
- Permit, Contractor, OHSCompetence, HealthSurveillance
- EmergencyDrill, OHSObjective, OHSMetric

### 2. Navigation Updated ✓
- Added OH&S section to sidebar
- 11 new routes organized under `/ohs/*`
- Objectives page added to bottom navigation
- ISO 45001:2018 added to footer

## 🚀 QUICK DEPLOYMENT STEPS

### Step 1: Run Database Migration

```bash
cd /Users/chrisknill/Documents/ComplianceConnect/ComplianceOS
export DATABASE_URL="file:./app.db"
npx prisma migrate dev --name add_iso_45001
```

### Step 2: Install & Start

The application structure is ready. All pages follow the same pattern as existing pages.

## 📋 REMAINING IMPLEMENTATION (Template Provided)

All OH&S pages follow this structure:

1. **OH&S Dashboard** (`/ohs/dashboard`)
   - Key metrics: Open incidents, active permits, overdue actions
   - TRIR/LTIFR trending
   - Recent hazards and incidents
   - Upcoming audits and drills

2. **Hazards Register** (`/ohs/hazards`)
   - 5×5 risk matrix (pre & post-control)
   - Hierarchy of controls tracking
   - Residual risk assessment
   - Review date management

3. **Incidents** (`/ohs/incidents`)
   - Incident reporting form
   - Investigation workflow
   - Root cause analysis (5-Why, Fishbone)
   - Linked corrective actions

4. **Actions (CAPA)** (`/ohs/actions`)
   - Corrective/Preventive/Containment/Improvement
   - Action tracking with due dates
   - Effectiveness review
   - Linked to incidents/audits

5. **Audits & Inspections** (`/ohs/audits-inspections`)
   - OH&S audits, workplace inspections, behavioral safety
   - Findings categorization (NC, observations, opportunities)
   - Action items
   - Schedule management

6. **Permits to Work** (`/ohs/permits`)
   - Hot work, confined space, work at height, LOTO, etc.
   - Authorization workflow
   - Hazard identification
   - Expiry tracking

7. **Contractors** (`/ohs/contractors`)
   - Pre-qualification tracking
   - Induction status
   - Safety rating (1-5)
   - Permit and incident counts

8. **OH&S Competence** (`/ohs/competence`)
   - Role-based PPE requirements
   - Training requirements
   - Medical fitness tracking
   - Authorizations (forklift, crane, etc.)

9. **Health Surveillance** (`/ohs/health-surveillance`)
   - Exposure monitoring (noise, dust, fumes, etc.)
   - Test schedule tracking
   - Results management
   - Work restrictions

10. **Emergency Preparedness** (`/ohs/emergency`)
    - Drill scheduling and tracking
    - Effectiveness evaluation
    - Improvement actions
    - Multiple emergency types

11. **OH&S KPIs** (`/ohs/kpis`)
    - TRIR calculation: (Recordable incidents × 200,000) / Total hours
    - LTIFR calculation: (Lost time injuries × 1,000,000) / Total hours
    - DART rate
    - Near-miss ratio
    - Trend analysis

12. **Objectives & Programs** (`/objectives`)
    - Strategic OH&S objectives
    - Action programs
    - Progress tracking
    - Target vs. actual

## 🔧 API Routes Structure

All API routes follow the same pattern as existing routes:

```
app/api/
  ohs/
    hazards/route.ts        → GET, POST OHSHazard
    incidents/route.ts      → GET, POST Incident
    investigations/route.ts → GET, POST Investigation
    actions/route.ts        → GET, POST Action
    audits/route.ts         → GET, POST OHSAudit
    permits/route.ts        → GET, POST Permit
    contractors/route.ts    → GET, POST Contractor
    competence/route.ts     → GET, POST OHSCompetence
    health/route.ts         → GET, POST HealthSurveillance
    emergency/route.ts      → GET, POST EmergencyDrill
    metrics/route.ts        → GET, POST OHSMetric
  objectives/route.ts       → GET, POST OHSObjective
```

## 📊 ISO 45001 Clause Mapping

Add to `lib/iso.ts`:

```typescript
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
  '6.1.3': 'Determining Legal and Other Requirements',
  '6.2': 'OH&S Objectives and Planning',
  '7': 'Support',
  '7.2': 'Competence',
  '7.3': 'Awareness',
  '7.4': 'Communication',
  '7.5': 'Documented Information',
  '8': 'Operation',
  '8.1': 'Operational Planning and Control',
  '8.1.1': 'General',
  '8.1.2': 'Eliminating Hazards and Reducing OH&S Risks',
  '8.1.3': 'Management of Change',
  '8.1.4': 'Procurement',
  '8.2': 'Emergency Preparedness and Response',
  '9': 'Performance Evaluation',
  '9.1': 'Monitoring, Measurement, Analysis',
  '9.1.1': 'General',
  '9.1.2': 'Evaluation of Compliance',
  '9.2': 'Internal Audit',
  '9.3': 'Management Review',
  '10': 'Improvement',
  '10.1': 'General',
  '10.2': 'Incident, Nonconformity and Corrective Action',
  '10.3': 'Continual Improvement',
}
```

## 🎯 KPI Calculations

Add to `lib/ohs.ts`:

```typescript
export function calculateTRIR(recordableIncidents: number, totalHours: number): number {
  return (recordableIncidents * 200000) / totalHours
}

export function calculateLTIFR(lostTimeInjuries: number, totalHours: number): number {
  return (lostTimeInjuries * 1000000) / totalHours
}

export function calculateDART(daysAwayRestrictedTransferred: number, totalHours: number): number {
  return (daysAwayRestrictedTransferred * 200000) / totalHours
}

export function getNearMissRatio(nearMisses: number, incidents: number): number {
  return incidents > 0 ? nearMisses / incidents : 0
}
```

## 🌱 Seed Data Template

Add to `prisma/seed.ts`:

### OH&S Hazards
- Slips, trips, falls
- Manual handling injuries
- Equipment hazards
- Chemical exposures
- Noise exposure
- Confined space entry

### Incidents
- Near misses (75%)
- First aid cases (15%)
- Medical treatment (7%)
- Lost time (2%)
- Serious injuries (1%)

### Actions (CAPA)
- Corrective actions from incidents
- Preventive actions from audits
- Improvement actions from objectives

### Permits
- Hot work permits
- Confined space entry
- Work at height
- LOTO procedures

### Contractors
- 5-10 contractors with varying safety ratings
- Mix of pre-qualified and pending
- Recent evaluations

### Audits
- Quarterly workplace inspections
- Annual OH&S audits
- Monthly behavioral safety observations

### Competence Records
- PPE requirements by role
- Training matrices
- Medical fitness tracking

### Health Surveillance
- Noise exposure monitoring
- Dust exposure
- Chemical monitoring
- Ergonomic assessments

### Emergency Drills
- Fire drills (quarterly)
- Evacuation drills
- Spill response
- First aid scenarios

### OH&S Metrics (Last 12 Months)
- Monthly hours worked
- Incident counts by type
- TRIR, LTIFR, DART calculations
- Trending data

### Objectives
- Reduce TRIR by 25%
- Achieve 100% safety training
- Zero lost-time injuries
- Improve near-miss reporting 50%

## 🎨 UI Components Needed

### OHSHazardCard
- Display hazard with pre/post-control risk scores
- Color-coded by residual risk
- Control hierarchy indicators

### IncidentForm
- Incident type selection
- Severity classification
- Person involvement
- Immediate actions
- Investigation trigger

### PermitWorkflow
- Multi-step authorization
- Hazard checklist
- Control measures
- Signature capture

### KPIWidget
- Metric display with trend
- Target vs. actual
- Visual indicators (arrows, colors)
- Period comparison

## 🔒 Permissions & Roles

Extend existing user roles:

- **OH&S Manager**: Full access to all OH&S modules
- **Supervisor**: View hazards, report incidents, issue permits
- **Worker**: Report hazards, submit near-misses, view own training
- **Contractor**: Limited access, view own permits

## 📱 Mobile Considerations

- Incident reporting via mobile
- Permit approvals
- Hazard photo uploads
- QR code permit verification

## 🔄 Integration Points

1. **Training Matrix**: Link to OH&S competence
2. **Risk Register**: Reference OH&S hazards
3. **Document Control**: Link OH&S procedures
4. **Audit Module**: Combine QMS/EMS/OH&S audits

## 📈 Reporting Requirements

### Monthly Reports
- Incident summary
- TRIR/LTIFR trends
- Action close-out rates
- Permit statistics

### Quarterly Reports
- Objective progress
- Audit findings summary
- Contractor performance
- Health surveillance compliance

### Annual Reports
- Management review input
- Year-over-year comparisons
- Certification audit prep
- Strategic planning

## ✅ Acceptance Criteria

1. All 11 OH&S pages functional
2. CRUD operations for all entities
3. KPI calculations accurate
4. Seed data realistic
5. ISO 45001 clause mapping complete
6. RAG status indicators consistent
7. Mobile-responsive design
8. API authentication enforced
9. Documentation updated
10. Zero TypeScript errors

## 🚀 DEPLOYMENT READY

Once pages are created following existing patterns:

1. Run migration: `npx prisma migrate dev --name add_iso_45001`
2. Seed OH&S data: `npx prisma db seed`
3. Test all routes
4. Deploy to Azure (same process as before)

**Estimated Monthly Cost Impact**: No change (~$20-30/month)
- SQLite handles additional tables efficiently
- No additional infrastructure needed

---

**Status**: Schema & Navigation Complete ✓
**Next**: Create pages following existing patterns
**Timeline**: 2-4 hours to complete all pages
**Complexity**: Low (template-based implementation)

