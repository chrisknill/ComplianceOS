import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@admin.com';
  const password = 'password';
  
  console.log('Creating fresh admin user...');
  console.log('Email:', email);
  console.log('Password:', password);
  
  // Delete existing user if exists
  try {
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'admin@admin.com' },
          { email: 'admin@complianceos.com' }
        ]
      }
    });
    console.log('✓ Cleared existing admin users');
  } catch (e) {
    console.log('No existing users to clear');
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
  console.log('  🔐 LOGIN CREDENTIALS');
  console.log('===========================================');
  console.log('  Email:    admin@admin.com');
  console.log('  Password: password');
  console.log('===========================================');
  console.log('');
  console.log('Go to: http://localhost:3000/signin');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

