import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@complianceos.com';
  const password = 'admin123';
  
  console.log('Checking for existing user...');
  
  // Check if user exists
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
    console.log('✅ User found! Resetting password...');
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password reset successfully!');
    console.log('');
    console.log('===========================================');
    console.log('  Email:    admin@complianceos.com');
    console.log('  Password: admin123');
    console.log('===========================================');
  } else {
    console.log('❌ User not found. Creating new user...');
    
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
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

