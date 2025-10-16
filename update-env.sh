#!/bin/bash
cat > .env.local << 'EOF'
DATABASE_URL="file:/Users/chrisknill/Documents/ComplianceOS/prisma/app.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="complianceos-secret-key-change-in-production"
EOF
echo "✅ .env.local updated with new paths"
cat .env.local

