import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@complianceos.com';
  const password = 'admin123';
  
  // Check if user exists
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
    console.log('✅ Admin user already exists!');
    console.log('');
    console.log('===========================================');
    console.log('  Email:    admin@complianceos.com');
    console.log('  Password: admin123');
    console.log('===========================================');
  } else {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        jobTitle: 'System Administrator',
        department: 'IT',
        status: 'ACTIVE'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('===========================================');
    console.log('  Email:    admin@complianceos.com');
    console.log('  Password: admin123');
    console.log('===========================================');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

