# ComplianceOS - Project Location & Structure

## 📍 **Official Project Location**

```
/Users/chrisknill/Documents/ComplianceOS/
```

This is the **ONE AND ONLY** ComplianceOS project we work on.

---

## 🗂️ **Folder Structure**

```
/Users/chrisknill/Documents/
├── ComplianceOS/              ← THIS IS THE MAIN PROJECT
│   ├── app/                   ← Next.js pages
│   ├── components/            ← React components
│   ├── lib/                   ← Utilities
│   ├── prisma/                ← Database
│   │   └── app.db            ← SQLite database
│   ├── .env.local            ← Environment variables
│   ├── package.json
│   └── ...
│
├── ComplianceConnect/         ← OLD FOLDER (ignore this)
│   └── ComplianceConnect/     ← Old Vite/Express app (not used)
│
└── WebApps/
    └── Connectify/            ← Separate Next.js project (future work)
```

---

## 🚀 **How to Start ComplianceOS**

```bash
cd /Users/chrisknill/Documents/ComplianceOS
npm run dev
```

**Access at:** http://localhost:3000

---

## 🔐 **Login Credentials**

```
Email:    admin@complianceos.com
Password: password123
```

---

## 📊 **What ComplianceOS Contains**

### **Core Modules:**
- ✅ Dashboard
- ✅ Documentation Management
- ✅ Training & LMS
- ✅ Risk Management
- ✅ Non-Conformances & Improvements
- ✅ Equipment & Calibration
- ✅ Registers
- ✅ Employees & HR
- ✅ Profile & Settings

### **OH&S Modules:**
- ✅ OH&S Dashboard
- ✅ Incidents
- ✅ Hazards
- ✅ Actions
- ✅ Permits to Work
- ✅ Contractors
- ✅ Audits & Inspections
- ✅ Competence Management
- ✅ Health Surveillance
- ✅ Emergency Drills
- ✅ KPIs

### **Features:**
- Multiple view modes (Dashboard, List, Grid, Calendar, Kanban Board)
- Advanced filtering and sorting
- Approval workflows
- Document version control
- Risk matrix
- Audit trails
- And much more!

---

## 🎯 **Database Location**

```
/Users/chrisknill/Documents/ComplianceOS/prisma/app.db
```

---

## 📝 **Important Notes**

1. **Always work from:** `/Users/chrisknill/Documents/ComplianceOS/`
2. **Ignore:** `/Users/chrisknill/Documents/ComplianceConnect/` (old folder)
3. **Connectify is separate:** `/Users/chrisknill/Documents/WebApps/Connectify/`

---

## 🔧 **Quick Commands**

```bash
# Start the server
cd /Users/chrisknill/Documents/ComplianceOS && npm run dev

# Open Prisma Studio (database viewer)
cd /Users/chrisknill/Documents/ComplianceOS && npx prisma studio

# Reset admin password
cd /Users/chrisknill/Documents/ComplianceOS && npx tsx setup-admin.ts

# View database
DATABASE_URL="file:/Users/chrisknill/Documents/ComplianceOS/prisma/app.db" npx prisma studio
```

---

## ✅ **Current Status**

- **Location:** ✅ Organized in `/Users/chrisknill/Documents/ComplianceOS/`
- **Server:** ✅ Running at http://localhost:3000
- **Database:** ✅ Connected and working
- **Login:** ✅ admin@complianceos.com / password123
- **All Features:** ✅ Working

---

**Last Updated:** October 14, 2025
**Project Status:** ✅ Production Ready

