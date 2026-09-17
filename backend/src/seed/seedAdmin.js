import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.js';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });
if (!process.env.MONGODB_URI) {
  // Try loading from backend/.env if run from root
  dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });
}

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/it_saathi';
    console.log(`Connecting to database for seeding: ${uri}`);
    await mongoose.connect(uri);

    const adminEmail = 'admin@itsaathi.in';

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log(`ℹ️ Admin user already exists with email: ${adminEmail}`);
      process.exit(0);
    }

    // Create seed admin
    await User.create({
      name: 'IT SAATHI Admin',
      email: adminEmail,
      password: 'ChangeMe@2026', // Hashed automatically by schema's pre-save hook
      phone: '8006033345',
      role: 'admin',
      forcePasswordChange: true, // Forces password change on first login for security
    });

    console.log('✅ Admin user seeded successfully!');
    console.log('-----------------------------------------');
    console.log('Default Credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log('Password: ChangeMe@2026 (Force Password Change Active)');
    console.log('-----------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding admin failed: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
