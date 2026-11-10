// Create the first super-admin account.
//   npm run create-admin -- <username> <email> <password>
// or set ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD in the environment.
import './_env.mjs';
import mongoose from 'mongoose';
import User from '../lib/models/User.js';

const [argUser, argEmail, argPass] = process.argv.slice(2);
const username = argUser || process.env.ADMIN_USERNAME;
const email = argEmail || process.env.ADMIN_EMAIL;
const password = argPass || process.env.ADMIN_PASSWORD;
if (!username || !email || !password || password.length < 8) {
  console.error('Usage: npm run create-admin -- <username> <email> <password>   (password: 8+ characters)');
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullmoonhotel');
  const existing = await User.findOne({ role: 'super-admin' });
  if (existing) {
    console.log('Super-admin already exists:', existing.username);
  } else {
    await new User({ username, email, password, role: 'super-admin', canCreateUsers: true, isActive: true }).save();
    console.log('=========================================');
    console.log('SUPER-ADMIN CREATED SUCCESSFULLY!');
    console.log(`Username: ${username}`);
    console.log(`Email:    ${email}`);
    console.log('=========================================');
  }
} catch (error) {
  console.error('Error creating super-admin:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
