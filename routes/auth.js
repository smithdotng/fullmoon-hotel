const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /login
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple admin login for testing
    if (email === 'admin@fullmoon.com' && password === 'admin123') {
      req.session.user = {
        _id: 'admin',
        name: 'Administrator',
        email: 'admin@fullmoon.com',
        role: 'admin'
      };
      req.flash('success', 'Welcome back, Administrator!');
      return res.redirect('/admin');
    }
    
    // For now, redirect to admin if login fails (for testing)
    req.flash('error', 'Invalid credentials');
    res.redirect('/login');
  } catch (error) {
    req.flash('error', 'Login failed');
    res.redirect('/login');
  }
});

// GET /register
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/register');
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    req.flash('success', 'Registration successful! Please login.');
    res.redirect('/login');
  } catch (error) {
    req.flash('error', 'Registration failed');
    res.redirect('/register');
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;