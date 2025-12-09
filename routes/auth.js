const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /login
router.get('/login', (req, res) => {
  // If already logged in, redirect to appropriate page
  if (req.session.user) {
    return res.redirect('/admin');
  }
  
  res.render('auth/login', { 
    title: 'Login - Full Moon Hotels',
    messages: req.flash()
  });
});

// POST /login - UPDATED AND FIXED
router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Full request body:', req.body);
    
    // Accept both username and email fields (your form sends username)
    const { username, password } = req.body;
    
    console.log('Login credentials:', { username, password });
    
    // Validate input
    if (!username || !password) {
      console.log('Missing fields');
      req.flash('error', 'Please enter both username/email and password');
      return res.redirect('/login');
    }
    
    // Check if user exists in database
    console.log('Looking for user in database...');
    
    // Try to find user by username or email
    let user = await User.findOne({
      $or: [
        { username: username },
        { email: username }  // Also check if they entered email in username field
      ]
    });
    
    console.log('User found:', user ? `Yes - ${user.username} (${user.email})` : 'No');
    
    // If no user found, create a default super-admin (for development only)
    if (!user) {
      console.log('No user found. Checking if we should create default admin...');
      
      // For development: create default super-admin
      if (process.env.NODE_ENV !== 'production') {
        console.log('Creating default super-admin for development...');
        
        // Create super-admin if username/password matches
        if (username === 'superadmin' || username === 'superadmin@fullmoonhotels.com') {
          if (password === 'Admin@123') {
            user = new User({
              username: 'superadmin',
              email: 'superadmin@fullmoonhotels.com',
              password: 'Admin@123',
              role: 'super-admin',
              canCreateUsers: true,
              isActive: true
            });
            
            await user.save();
            console.log('Default super-admin created successfully');
          }
        }
      }
      
      // If still no user (or password didn't match), show error
      if (!user) {
        console.log('Invalid credentials or user not found');
        req.flash('error', 'Invalid credentials. Please check your username/email and password.');
        return res.redirect('/login');
      }
    }
    
    // Check if user is active
    if (!user.isActive) {
      console.log('User account is inactive:', user.username);
      req.flash('error', 'Your account has been deactivated. Please contact an administrator.');
      return res.redirect('/login');
    }
    
    // Check if user has admin privileges
    if (user.role !== 'admin' && user.role !== 'super-admin') {
      console.log('User does not have admin privileges:', user.username, user.role);
      req.flash('error', 'Admin access required. Please contact an administrator.');
      return res.redirect('/login');
    }
    
    // Check password
    console.log('Checking password for user:', user.username);
    const isMatch = await user.comparePassword(password);
    
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', user.username);
      req.flash('error', 'Invalid credentials. Please check your username/email and password.');
      return res.redirect('/login');
    }
    
    // Login successful - set session
    req.session.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      canCreateUsers: user.canCreateUsers || false
    };
    
    req.session.isLoggedIn = true;
    
    console.log(`✅ Login successful: ${user.username} (${user.role})`);
    
    // Set a success message
    req.flash('success', `Welcome back, ${user.username}!`);
    
    // Redirect to admin dashboard
    res.redirect('/admin');
    
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Error stack:', error.stack);
    req.flash('error', 'Login failed. Please try again.');
    res.redirect('/login');
  }
});

// GET /register - ONLY FOR TESTING/DEVELOPMENT
router.get('/register', (req, res) => {
  // In production, you might want to disable this or make it admin-only
  res.render('auth/register', { 
    title: 'Register - Full Moon Hotels',
    messages: req.flash()
  });
});

// POST /register - ONLY FOR TESTING/DEVELOPMENT
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      req.flash('error', 'All fields are required');
      return res.redirect('/register');
    }
    
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/register');
    }
    
    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters');
      return res.redirect('/register');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      req.flash('error', 'User with this email or username already exists');
      return res.redirect('/register');
    }
    
    // For development/testing - create as admin
    const user = new User({
      username,
      email,
      password,
      role: 'admin',
      canCreateUsers: false,
      isActive: true
    });
    
    await user.save();
    
    console.log(`New user registered: ${username} (${email})`);
    
    req.flash('success', 'Registration successful! You can now login.');
    res.redirect('/login');
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      req.flash('error', 'User with this email or username already exists');
    } else {
      req.flash('error', 'Registration failed. Please try again.');
    }
    
    res.redirect('/register');
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  if (req.session.user) {
    console.log(`User logged out: ${req.session.user.username}`);
  }
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;