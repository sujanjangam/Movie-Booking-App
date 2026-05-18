import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Tenant from './models/Tenant.js';

dotenv.config();

const createQAAccounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find or create a test tenant
    let testTenant = await Tenant.findOne({ domain: 'qa-test' });
    
    if (!testTenant) {
      testTenant = await Tenant.create({
        name: 'QA Test Cinema',
        domain: 'qa-test',
        contactEmail: 'qa@test.com'
      });
      console.log('✅ Created QA Test Tenant:', testTenant.name);
    } else {
      console.log('✅ Using existing QA Test Tenant:', testTenant.name);
    }

    // QA Test Accounts
    const qaAccounts = [
      {
        name: 'Super Admin',
        email: 'superadmin@test.com',
        password: 'super123',
        role: 'SUPER_ADMIN',
        tenantId: null // Super admin has no tenant
      },
      {
        name: 'Tenant Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'TENANT_ADMIN',
        tenantId: testTenant._id
      },
      {
        name: 'QA Tester',
        email: 'qa@test.com',
        password: 'qa123',
        role: 'QA_ADMIN',
        tenantId: testTenant._id
      },
      {
        name: 'Test User',
        email: 'user@test.com',
        password: 'user123',
        role: 'USER',
        tenantId: testTenant._id
      }
    ];

    console.log('\n📝 Creating QA Test Accounts...\n');

    for (const account of qaAccounts) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: account.email });
      
      if (existingUser) {
        console.log(`⚠️  User already exists: ${account.email}`);
        continue;
      }

      // Create new user
      const user = await User.create(account);
      console.log(`✅ Created: ${account.role} - ${account.email}`);
    }

    console.log('\n🎉 QA Accounts Setup Complete!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 TEST CREDENTIALS FOR QA/TESTING:');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('🔴 SUPER ADMIN (Platform Owner)');
    console.log('   Email: superadmin@test.com');
    console.log('   Password: super123');
    console.log('   Access: Create tenants, view all data\n');
    
    console.log('🟠 TENANT ADMIN (Cinema Manager)');
    console.log('   Email: admin@test.com');
    console.log('   Password: admin123');
    console.log('   Access: Manage movies, theatres, shows\n');
    
    console.log('🟡 QA ADMIN (Quality Assurance)');
    console.log('   Email: qa@test.com');
    console.log('   Password: qa123');
    console.log('   Access: Testing and validation\n');
    
    console.log('🟢 USER (Customer)');
    console.log('   Email: user@test.com');
    console.log('   Password: user123');
    console.log('   Access: Browse movies, book tickets\n');
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('🏢 Tenant: QA Test Cinema (qa-test)');
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createQAAccounts();
