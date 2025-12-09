const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullmoon-hotels');
    
    console.log('Connected to MongoDB');
    
    // Check if super-admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super-admin' });
    
    if (existingSuperAdmin) {
      console.log('Super-admin already exists:', existingSuperAdmin.username);
      process.exit(0);
    }
    
    // Create super-admin
    const superAdmin = new User({
      username: 'hugodomnique',
      email: 'hugo@found.ng',
      password: 'Admin@123', // Change this to a strong password
      role: 'super-admin',
      canCreateUsers: true,
      isActive: true
    });
    
    await superAdmin.save();
    
    console.log('=========================================');
    console.log('SUPER-ADMIN CREATED SUCCESSFULLY!');
    console.log('=========================================');
    console.log('Username: superadmin');
    console.log('Email: fullmoon@shed.ng');
    console.log('Password: Admin@123');
    console.log('Role: super-admin');
    console.log('=========================================');
    console.log('IMPORTANT: Change this password immediately!');
    console.log('=========================================');
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error creating super-admin:', error);
    process.exit(1);
  }
}

createSuperAdmin();