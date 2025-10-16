# ComplianceOS - ISO 9001/14001/45001 Management System

A comprehensive, cost-effective integrated QHSE (Quality, Health, Safety, Environment) compliance management system built with Next.js, designed for easy deployment on Azure infrastructure.

**Now with ISO 45001:2018 Occupational Health & Safety Support!**

## 🎯 Features

### QMS/EMS (ISO 9001/14001)
- **Dashboard**: Real-time compliance metrics and KPIs
- **Documentation Management**: Policies, procedures, work instructions, and registers
- **Training Matrix**: RAG-status tracking for employee training compliance
- **Risk Assessment**: Interactive 5×5 risk matrix with filtering
- **Equipment Management**: Asset tracking and maintenance scheduling
- **Calibration Tracking**: Equipment calibration schedules and certificates
- **Compliance Registers**: Incidents, nonconformities, legal obligations, and environmental aspects

### OH&S (ISO 45001:2018) - NEW
- **OH&S Dashboard**: Safety metrics, TRIR, LTIFR, near-miss ratios
- **Hazards Register**: Pre/post-control risk assessment with hierarchy of controls
- **Incidents & Near-Misses**: Incident reporting, investigation, and root cause analysis
- **Actions (CAPA)**: Corrective and preventive action tracking
- **Audits & Inspections**: OH&S system audits and workplace inspections
- **Permits to Work**: Hot work, confined space, work at height, LOTO, etc.
- **Contractor Management**: Pre-qualification, inductions, safety ratings
- **OH&S Competence**: Role-based PPE requirements and authorizations
- **Health Surveillance**: Exposure monitoring and medical fitness tracking
- **Emergency Preparedness**: Drill scheduling and effectiveness evaluation
- **OH&S KPIs**: TRIR, LTIFR, DART calculations with trending

### General
- **Objectives & Programs**: Strategic objectives with progress tracking
- **User Profiles**: Individual training history and competencies
- **Settings**: Configurable thresholds and notifications

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd ComplianceOS

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with demo data
npm run prisma:seed

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Default Login Credentials

```
Email: admin@complianceos.com
Password: password123
```

## 📦 Database Setup

The application uses SQLite for simplicity and cost-effectiveness. The database file (`app.db`) is created automatically when you run migrations.

### Seed Data Includes:

**QMS/EMS:**
- 6 users (1 admin + 5 staff)
- 10 documents (policies, procedures, work instructions, registers)
- 8 training courses
- 48 training records with varied RAG statuses
- 12 risk assessments across the 5×5 matrix
- 10 equipment items with calibration schedules
- 12 register entries (incidents, nonconformities, compliance obligations, etc.)

**OH&S (NEW):**
- 2 OH&S hazards (with pre/post-control risk scores)
- 2 incidents (near-miss and injury)
- 2 corrective actions
- 1 month of safety metrics (TRIR, LTIFR data)

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with demo data
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run setup        # Complete setup (generate + migrate + seed)
```

## ☁️ Azure Deployment Guide

### Option 1: Azure App Service (Recommended for Low Cost)

**Estimated Cost**: ~$13-55/month (Basic B1 tier)

#### Step 1: Prepare for Deployment

1. Update `.env.local` for production:
```bash
DATABASE_URL="file:./app.db"
NEXTAUTH_URL="https://your-app-name.azurewebsites.net"
NEXTAUTH_SECRET="your-secure-random-secret-here"
```

2. Build the application:
```bash
npm run build
```

#### Step 2: Deploy to Azure App Service

**Using Azure CLI:**

```bash
# Login to Azure
az login

# Create resource group
az group create --name ComplianceOS-RG --location eastus

# Create App Service plan (Basic B1 for low cost)
az appservice plan create \
  --name ComplianceOS-Plan \
  --resource-group ComplianceOS-RG \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group ComplianceOS-RG \
  --plan ComplianceOS-Plan \
  --name your-app-name \
  --runtime "NODE:18-lts"

# Configure environment variables
az webapp config appsettings set \
  --resource-group ComplianceOS-RG \
  --name your-app-name \
  --settings \
    DATABASE_URL="file:./app.db" \
    NEXTAUTH_URL="https://your-app-name.azurewebsites.net" \
    NEXTAUTH_SECRET="your-secure-secret"

# Deploy from local git
az webapp deployment source config-local-git \
  --name your-app-name \
  --resource-group ComplianceOS-RG

# Push code
git remote add azure <deployment-url-from-previous-command>
git push azure main
```

**Using Azure Portal:**

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Web App**
3. Configure:
   - **Runtime**: Node 18 LTS
   - **Region**: Choose nearest to your users
   - **Pricing**: Basic B1 (or Free F1 for testing)
4. In **Configuration** → **Application Settings**, add:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
5. Deploy via:
   - GitHub Actions (recommended)
   - Azure DevOps
   - FTP/Local Git
   - VS Code Azure extension

#### Step 3: Database Persistence

For SQLite on Azure App Service, mount persistent storage:

```bash
az webapp config storage-account add \
  --resource-group ComplianceOS-RG \
  --name your-app-name \
  --custom-id prismadb \
  --storage-type AzureFiles \
  --share-name complianceos-data \
  --account-name yourstorageaccount \
  --mount-path /home/site/wwwroot/prisma \
  --access-key "your-storage-key"
```

**Alternative**: Use Azure SQL Database for production (adds ~$5-15/month for Basic tier)

### Option 2: Azure Container Instances (Serverless)

**Estimated Cost**: ~$10-30/month (pay-per-use)

```bash
# Build Docker image
docker build -t complianceos .

# Push to Azure Container Registry
az acr create --resource-group ComplianceOS-RG --name complianceosacr --sku Basic
az acr build --registry complianceosacr --image complianceos:latest .

# Deploy container
az container create \
  --resource-group ComplianceOS-RG \
  --name complianceos-container \
  --image complianceosacr.azurecr.io/complianceos:latest \
  --dns-name-label complianceos \
  --ports 3000 \
  --environment-variables \
    DATABASE_URL="file:./app.db" \
    NEXTAUTH_SECRET="your-secret"
```

### Option 3: Azure Static Web Apps + API (Lowest Cost)

**Estimated Cost**: Free tier available, ~$9/month for Standard

This option requires splitting the app into static frontend + serverless API functions.

### Cost Optimization Tips

1. **Use Free Tier for Development**: Azure offers free tiers for testing
2. **Auto-scaling**: Configure to scale down during off-hours
3. **SQLite vs Azure SQL**: SQLite is free, Azure SQL adds $5-15/month minimum
4. **CDN**: Use Azure CDN for static assets (optional, adds ~$0.08/GB)
5. **Monitoring**: Use Application Insights free tier (1GB/month free)

### Recommended Production Setup (Budget: ~$20-30/month)

- **App Service**: Basic B1 tier (~$13/month)
- **Azure Files**: For SQLite persistence (~$0.06/GB/month)
- **Application Insights**: Free tier (1GB included)
- **Azure CDN**: Optional (~$0.08/GB)

## 🔐 Security Considerations

- Change default passwords immediately
- Use strong `NEXTAUTH_SECRET` in production
- Enable HTTPS (automatic on Azure App Service)
- Configure CORS appropriately
- Implement role-based access control (RBAC)
- Regular backups of SQLite database
- Consider Azure SQL Database for multi-user production environments

## 📊 ISO Coverage

### ISO 9001:2015 Clauses (Quality Management)

- 4: Context of the Organization
- 5: Leadership (Policies)
- 6.1: Risk & Opportunities
- 7.1: Resources (Equipment, Infrastructure)
- 7.2: Competence (Training)
- 7.5: Documented Information
- 8: Operation
- 9.1: Monitoring & Measurement
- 9.2: Internal Audit
- 10.2: Nonconformity & Corrective Action

### ISO 14001:2015 Clauses

- 5.2: Environmental Policy
- 6.1.2: Environmental Aspects
- 6.1.3: Compliance Obligations
- 7: Support (Training, Documentation)
- 8.1: Operational Planning & Control
- 9: Performance Evaluation
- 10: Improvement

## 🛠️ Customization

### Adding New Document Types

Edit `prisma/schema.prisma`:

```prisma
enum DocType {
  POLICY
  PROCEDURE
  WORK_INSTRUCTION
  REGISTER
  YOUR_NEW_TYPE  // Add here
}
```

Then run:
```bash
npm run prisma:migrate
```

### Modifying RAG Thresholds

Edit `lib/rag.ts` to adjust the default configuration:

```typescript
const defaultConfig: RAGConfig = {
  amberThreshold: 30,  // Change to your preference
  redThreshold: 0,
}
```

### Custom Branding

- Update `components/layout/Sidebar.tsx` for logo/name
- Modify `app/globals.css` for color scheme
- Edit `tailwind.config.ts` for theme customization

## 📝 License

This project is provided as-is for demonstration and educational purposes.

## 🤝 Support

For issues, questions, or contributions, please refer to the project repository.

---

**Built with ❤️ for ISO compliance management**

