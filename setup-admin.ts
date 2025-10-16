import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@complianceos.com';
  const password = 'password123';
  
  console.log('Setting up admin user...');
  
  // Delete existing user if exists
  try {
    await prisma.user.deleteMany({
      where: { email }
    });
    console.log('✓ Cleared existing admin user');
  } catch (e) {
    console.log('No existing user to clear');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('✓ Password hashed');
  
  // Create user
  const user = await prisma.user.create({
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
  
  console.log('✓ User created with ID:', user.id);
  console.log('');
  console.log('===========================================');
  console.log('  🔐 COMPLIANCEOS LOGIN');
  console.log('===========================================');
  console.log('  Email:    admin@complianceos.com');
  console.log('  Password: password123');
  console.log('===========================================');
  console.log('');
  console.log('URL: http://localhost:3000/signin');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

