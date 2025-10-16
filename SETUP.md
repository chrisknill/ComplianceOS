# Quick Setup Guide

## 1. Install Dependencies

```bash
cd ComplianceOS
npm install
```

## 2. Set Up Environment

Create `.env.local` file (or copy from `.env.example`):

```bash
DATABASE_URL="file:./app.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

## 3. Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create database schema
npm run prisma:migrate

# Seed database with demo data
npm run prisma:seed
```

Or run all at once:

```bash
npm run setup
```

## 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Login

Use these demo credentials:

- **Email**: `admin@complianceos.com`
- **Password**: `password123`

## Troubleshooting

### Database Issues

If you encounter database errors:

```bash
# Delete existing database
rm prisma/app.db

# Recreate
npm run prisma:migrate
npm run prisma:seed
```

### Port Already in Use

If port 3000 is busy:

```bash
# Use different port
PORT=3001 npm run dev
```

### TypeScript Errors

```bash
# Regenerate types
npm run prisma:generate
```

## Next Steps

1. Explore the dashboard at `/dashboard`
2. Check out the training matrix at `/training`
3. View the risk assessment matrix at `/risk`
4. Review documentation at `/documentation`
5. Customize settings at `/settings`

## Production Deployment

See `README.md` for detailed Azure deployment instructions.

