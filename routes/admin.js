// routes/admin.js - FULLY FIXED & COMPLETE (NO PART MISSING)

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Blog = require('../models/Blog');
const multer = require('multer');
const path = require('path');
const Reservation = require('../models/Reservation');
const FacilityBooking = require('../models/FacilityBooking');
const Facility = require('../models/Facility'); // ← THIS WAS MISSING


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'public/uploads/';
    if (file.fieldname === 'featuredImage') {
      uploadPath += 'blog/';
    } else if (file.fieldname === 'image') {
      uploadPath += 'facilities/';
    } else {
      uploadPath += 'rooms/';
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ========================
// ADMIN MIDDLEWARE
// ========================

const isAdmin = (req, res, next) => {
  if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'super-admin')) {
    next();
  } else {
    req.flash('error', 'Please login as administrator to access this page');
    res.redirect('/login');
  }
};

const canManageUsers = (req, res, next) => {
  if (req.session.user && (req.session.user.role === 'super-admin' || req.session.user.canCreateUsers === true)) {
    next();
  } else {
    req.flash('error', 'You do not have permission to perform this action');
    res.redirect('/admin');
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'super-admin') {
    next();
  } else {
    req.flash('error', 'Super-admin access required for this action');
    res.redirect('/admin');
  }
};

// ========================
// ADMIN DASHBOARD
// ========================

// ========================
// ADMIN DASHBOARD - FIXED WITH SUBSCRIBER VARIABLES
// ========================

// ========================
// ADMIN DASHBOARD - FIXED
// ========================

router.get('/', isAdmin, async (req, res) => {
  try {
    const roomCount = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ available: true });
    
    const blogCount = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ published: true });
    const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);
    
    const facilityBookings = await FacilityBooking.countDocuments();
    const confirmedFacilityBookings = await FacilityBooking.countDocuments({ status: 'confirmed' });
    
    const revenueResult = await FacilityBooking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const facilityRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    const recentFacilityBookings = await FacilityBooking.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const popularFacilities = await FacilityBooking.aggregate([
      { $group: { 
          _id: '$facilityName', 
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);
    
    let reservationStats = null;
    let recentReservations = [];
    let subscriberCount = 0;
    let recentSubscribers = [];
    
    try {
      reservationStats = {
        total: await Reservation.countDocuments(),
        pending: await Reservation.countDocuments({ status: 'pending' }),
        confirmed: await Reservation.countDocuments({ status: 'confirmed' }),
        cancelled: await Reservation.countDocuments({ status: 'cancelled' }),
        unpaid: await Reservation.countDocuments({ paymentStatus: 'unpaid' }),
        paid: await Reservation.countDocuments({ paymentStatus: 'paid' })
      };

      // Get subscriber stats safely
      try {
        // Check if Subscriber model exists
        if (mongoose.models.Subscriber) {
          const SubscriberModel = mongoose.models.Subscriber;
          subscriberCount = await SubscriberModel.countDocuments({ isActive: true });
          
          const recentSubscriberDocs = await SubscriberModel.find({ isActive: true })
            .sort({ subscribedAt: -1 })
            .limit(5)
            .select('email subscribedAt');
          
          recentSubscribers = recentSubscriberDocs.map(sub => sub.email);
        } else {
           console.log('Subscriber model not found in mongoose models');
            // Try alternative approach
            try {
                // Get subscriber count from your routes/subscribe.js helper function
                const { getSubscriberStats } = require('./subscribe');
                const stats = await getSubscriberStats();
                subscriberCount = stats.total;
                recentSubscribers = stats.recent.map(sub => sub.email);
            } catch (helperError) {
                console.log('Could not get subscriber stats from helper:', helperError.message);
                // Use fallback values
                subscriberCount = 0;
                recentSubscribers = [];
            }
        }
    } catch (subscriberError) {
        console.log('Error loading subscribers:', subscriberError.message);
        subscriberCount = 0;
        recentSubscribers = [];
    }
      
      recentReservations = await Reservation.find()
        .populate('room', 'roomNumber type')
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (reservationError) {
      console.error('Error loading reservation data:', reservationError);
    }
    
    res.render('admin/dashboard', { 
      title: 'Admin Dashboard',
      roomCount, availableRooms,
      blogCount, publishedBlogs, recentBlogs,
      facilityBookings, confirmedFacilityBookings, facilityRevenue,
      recentFacilityBookings, popularFacilities,
      reservationStats, recentReservations,
      subscriberCount,
      recentSubscribers,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Server Error',
      error: 'Failed to load dashboard' 
    });
  }
});

// ========================
// USER MANAGEMENT
// ========================

router.get('/users', isAdmin, canManageUsers, async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().sort({ createdAt: -1 });
    
    res.render('admin/users', {
      title: 'Manage Admin Users',
      users,
      currentUser: req.session.user,
      currentUserId: req.session.user._id,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error('Error loading users:', error);
    req.flash('error', 'Failed to load users');
    res.redirect('/admin');
  }
});

router.get('/users/add', canManageUsers, (req, res) => {
  res.render('admin/user-form', {
    title: 'Add New Admin User',
    currentUser: req.session.user,
    layout: 'layout-admin'
  });
});

router.post('/users', canManageUsers, async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;
    
    if (!username || !email || !password) {
      req.flash('error', 'All fields are required');
      return res.redirect('/admin/users/add');
    }
    
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/admin/users/add');
    }
    
    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters');
      return res.redirect('/admin/users/add');
    }
    
    const User = require('../models/User');
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      req.flash('error', 'User with this email or username already exists');
      return res.redirect('/admin/users/add');
    }
    
    const userRole = req.session.user.role === 'super-admin' ? (role || 'admin') : 'admin';
    const canCreateUsers = req.session.user.role === 'super-admin' && (req.body.canCreateUsers === 'true');
    
    const user = new User({
      username, email, password, role: userRole, canCreateUsers, isActive: true
    });
    
    await user.save();
    req.flash('success', `Admin user ${username} created successfully`);
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error creating user:', error);
    req.flash('error', 'Failed to create user');
    res.redirect('/admin/users/add');
  }
});

router.post('/users/delete/:id', canManageUsers, async (req, res) => {
  try {
    const User = require('../models/User');
    if (req.params.id === req.session.user._id.toString()) {
      req.flash('error', 'You cannot delete your own account');
      return res.redirect('/admin/users');
    }
    
    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'User deleted successfully');
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    req.flash('error', 'Failed to delete user');
    res.redirect('/admin/users');
  }
});

// ========================
// ROOMS, BLOG, FACILITIES, RESERVATIONS, PROFILE
// ========================

router.get('/rooms', canManageUsers, async (req, res) => {
  try {
    const rooms = await Room.find().sort({ type: 1 });
    res.render('admin/rooms', { title: 'Manage Rooms', rooms, layout: 'layout-admin' });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Server Error', error: 'Failed to load rooms' });
  }
});

router.get('/rooms/add', canManageUsers, (req, res) => {
  res.render('admin/room-form', { title: 'Add New Room', room: null, layout: 'layout-admin' });
});

router.post('/rooms', canManageUsers, upload.array('images', 5), async (req, res) => {
  try {
    const { roomNumber, type, price, description, amenities } = req.body;
    const roomData = {
      roomNumber, type, price: parseFloat(price), description,
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : []
    };
    if (req.files && req.files.length > 0) {
      roomData.images = req.files.map(file => `/uploads/rooms/${file.filename}`);
    }
    const room = new Room(roomData);
    await room.save();
    req.flash('success', 'Room created successfully');
    res.redirect('/admin/rooms');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to create room: ' + error.message);
    res.redirect('/admin/rooms/add');
  }
});

router.get('/rooms/edit/:id', canManageUsers, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      req.flash('error', 'Room not found');
      return res.redirect('/admin/rooms');
    }
    res.render('admin/room-form', { title: 'Edit Room', room, layout: 'layout-admin' });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load room');
    res.redirect('/admin/rooms');
  }
});

router.post('/rooms/update/:id', canManageUsers, upload.array('images', 5), async (req, res) => {
  try {
    const { roomNumber, type, price, description, amenities } = req.body;
    const updateData = {
      roomNumber, type, price: parseFloat(price), description,
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : []
    };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/rooms/${file.filename}`);
      updateData.$push = { images: { $each: newImages } };
    }
    await Room.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Room updated successfully');
    res.redirect('/admin/rooms');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update room: ' + error.message);
    res.redirect(`/admin/rooms/edit/${req.params.id}`);
  }
});

router.post('/rooms/delete/:id', canManageUsers, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    req.flash('success', 'Room deleted successfully');
    res.redirect('/admin/rooms');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to delete room');
    res.redirect('/admin/rooms');
  }
});

// Blog Routes (unchanged)
router.get('/blog', isAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('admin/blog', { title: 'Manage Blog', blogs, layout: 'layout-admin' });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load blog posts');
    res.redirect('/admin');
  }
});

router.get('/blog/add', isAdmin, (req, res) => {
  res.render('admin/blog-form', { title: 'Add New Blog Post', blog: null, layout: 'layout-admin' });
});

router.post('/blog', isAdmin, upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, published, featured, metaTitle, metaDescription } = req.body;
    const blogData = {
      title, excerpt, content, category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      published: published === 'true',
      featured: featured === 'true',
      metaTitle, metaDescription
    };
    if (req.file) blogData.featuredImage = `/uploads/blog/${req.file.filename}`;
    const blog = new Blog(blogData);
    await blog.save();
    req.flash('success', 'Blog post created successfully');
    res.redirect('/admin/blog');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to create blog post: ' + error.message);
    res.redirect('/admin/blog/add');
  }
});

router.get('/blog/edit/:id', isAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      req.flash('error', 'Blog post not found');
      return res.redirect('/admin/blog');
    }
    res.render('admin/blog-form', { title: 'Edit Blog Post', blog, layout: 'layout-admin' });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load blog post');
    res.redirect('/admin/blog');
  }
});

router.post('/blog/update/:id', isAdmin, upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, published, featured, metaTitle, metaDescription } = req.body;
    const updateData = {
      title, excerpt, content, category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      published: published === 'true',
      featured: featured === 'true',
      metaTitle, metaDescription
    };
    if (req.file) updateData.featuredImage = `/uploads/blog/${req.file.filename}`;
    await Blog.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Blog post updated successfully');
    res.redirect('/admin/blog');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update blog post: ' + error.message);
    res.redirect(`/admin/blog/edit/${req.params.id}`);
  }
});

router.post('/blog/delete/:id', isAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    req.flash('success', 'Blog post deleted successfully');
    res.redirect('/admin/blog');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to delete blog post');
    res.redirect('/admin/blog');
  }
});

// Facilities & Facility Config (ALL FIXED)
router.get('/facilities', canManageUsers, async (req, res) => {
  try {
    const facilities = await FacilityBooking.find()
      .populate('user', 'name email')
      .sort({ bookingDate: -1, bookingTime: -1 });
    res.render('admin/facilities', { title: 'Manage Facility Bookings', facilities, layout: 'layout-admin' });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load facility bookings');
    res.redirect('/admin');
  }
});

router.get('/facilities/stats', canManageUsers, async (req, res) => {
  try {
    const totalBookings = await FacilityBooking.countDocuments();
    const confirmedBookings = await FacilityBooking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await FacilityBooking.countDocuments({ status: 'cancelled' });
    const completedBookings = await FacilityBooking.countDocuments({ status: 'completed' });
    
    const revenueResult = await FacilityBooking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    const popularFacilities = await FacilityBooking.aggregate([
      { $group: { _id: '$facilityName', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.render('admin/facility-stats', { 
      title: 'Facility Booking Statistics',
      totalBookings, confirmedBookings, cancelledBookings, completedBookings,
      totalRevenue, popularFacilities,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load facility statistics');
    res.redirect('/admin');
  }
});

router.post('/facilities/update-status/:id', canManageUsers, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      req.flash('error', 'Invalid status');
      return res.redirect('/admin/facilities');
    }
    await FacilityBooking.findByIdAndUpdate(req.params.id, { status });
    req.flash('success', `Booking status updated to ${status}`);
    res.redirect('/admin/facilities');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update booking status');
    res.redirect('/admin/facilities');
  }
});

router.post('/facilities/delete/:id', canManageUsers, async (req, res) => {
  try {
    await FacilityBooking.findByIdAndDelete(req.params.id);
    req.flash('success', 'Facility booking deleted successfully');
    res.redirect('/admin/facilities');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to delete facility booking');
    res.redirect('/admin/facilities');
  }
});

router.get('/facilities/calendar', canManageUsers, async (req, res) => {
  try {
    const bookings = await FacilityBooking.find({ status: 'confirmed' })
      .select('facilityName bookingDate bookingTime duration')
      .sort({ bookingDate: 1, bookingTime: 1 });
    res.render('admin/facility-calendar', { title: 'Facility Booking Calendar', bookings, layout: 'layout-admin' });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load booking calendar');
    res.redirect('/admin');
  }
});

// Facility Configuration (NOW WORKS!)
router.get('/facilities-config', canManageUsers, async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ type: 1, name: 1 });
    res.render('admin/facilities-config', { title: 'Manage Facilities', facilities, layout: 'layout-admin' });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load facilities');
    res.redirect('/admin');
  }
});

router.get('/facilities-config/add', canManageUsers, (req, res) => {
  res.render('admin/facility-form', { title: 'Add New Facility', facility: null, layout: 'layout-admin' });
});

router.post('/facilities-config', canManageUsers, upload.single('image'), async (req, res) => {
  try {
    const { name, type, description, shortDescription, capacity, operatingHours, pricePerHour, requiresGuests, maxGuests, bookable, featured, available, amenities, location, contactPhone, contactEmail, rules } = req.body;

    const facilityData = {
      name, type, description, shortDescription,
      capacity: parseInt(capacity), operatingHours,
      pricePerHour: parseFloat(pricePerHour) || 0,
      requiresGuests: requiresGuests === 'true',
      maxGuests: parseInt(maxGuests) || 1,
      bookable: bookable === 'true',
      featured: featured === 'true',
      available: available === 'true',
      location,
      contactInfo: { phone: contactPhone, email: contactEmail }
    };

    if (amenities) facilityData.amenities = amenities.split(',').map(a => a.trim()).filter(a => a);
    if (rules) facilityData.rules = rules.split(',').map(r => r.trim()).filter(r => r);
    if (req.file) facilityData.image = `/uploads/facilities/${req.file.filename}`;

    const facility = new Facility(facilityData);
    await facility.save();
    req.flash('success', 'Facility created successfully');
    res.redirect('/admin/facilities-config');
  } catch (error) {
    console.error(error);
    req.flash('error', error.code === 11000 ? 'A facility with this name already exists' : 'Failed to create facility: ' + error.message);
    res.redirect('/admin/facilities-config/add');
  }
});

router.get('/facilities-config/edit/:id', canManageUsers, async (req, res) => { // ← FIXED: was canManageUser
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      req.flash('error', 'Facility not found');
      return res.redirect('/admin/facilities-config');
    }
    res.render('admin/facility-form', { title: 'Edit Facility', facility, layout: 'layout-admin' });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load facility');
    res.redirect('/admin/facilities-config');
  }
});

router.post('/facilities-config/update/:id', canManageUsers, upload.single('image'), async (req, res) => {
  try {
    const { name, type, description, shortDescription, capacity, operatingHours, pricePerHour, requiresGuests, maxGuests, bookable, featured, available, amenities, location, contactPhone, contactEmail, rules } = req.body;

    const updateData = {
      name, type, description, shortDescription,
      capacity: parseInt(capacity), operatingHours,
      pricePerHour: parseFloat(pricePerHour) || 0,
      requiresGuests: requiresGuests === 'true',
      maxGuests: parseInt(maxGuests) || 1,
      bookable: bookable === 'true',
      featured: featured === 'true',
      available: available === 'true',
      location,
      contactInfo: { phone: contactPhone, email: contactEmail }
    };

    if (amenities) updateData.amenities = amenities.split(',').map(a => a.trim()).filter(a => a);
    if (rules) updateData.rules = rules.split(',').map(r => r.trim()).filter(r => r);
    if (req.file) updateData.image = `/uploads/facilities/${req.file.filename}`;

    await Facility.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Facility updated successfully');
    res.redirect('/admin/facilities-config');
  } catch (error) {
    console.error(error);
    req.flash('error', error.code === 11000 ? 'A facility with this name already exists' : 'Failed to update facility: ' + error.message);
    res.redirect(`/admin/facilities-config/edit/${req.params.id}`);
  }
});

router.post('/facilities-config/delete/:id', canManageUsers, async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);
    req.flash('success', 'Facility deleted successfully');
    res.redirect('/admin/facilities-config');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to delete facility');
    res.redirect('/admin/facilities-config');
  }
});

router.post('/facilities-config/toggle-status/:id', canManageUsers, async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      req.flash('error', 'Facility not found');
      return res.redirect('/admin/facilities-config');
    }
    facility.available = !facility.available;
    await facility.save();
    const status = facility.available ? 'activated' : 'deactivated';
    req.flash('success', `Facility ${status} successfully`);
    res.redirect('/admin/facilities-config');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update facility status');
    res.redirect('/admin/facilities-config');
  }
});

router.get('/facilities-config/sample', canManageUsers, async (req, res) => {
  try {
    const sampleFacilities = [
      { name: 'Main Restaurant', type: 'dining', description: 'Fine dining experience...', shortDescription: 'Fine dining with international cuisine', capacity: 100, operatingHours: '6:00 AM - 11:00 PM', pricePerHour: 0, bookable: false, featured: true, amenities: ['Fine Dining', 'International Cuisine', 'Wine Selection', 'Vegetarian Options'], location: 'Ground Floor, Main Building', image: '/assets/images/restaurant-main.jpg' },
      { name: 'Spa & Wellness Center', type: 'wellness', description: 'Luxurious treatments...', shortDescription: 'Luxurious treatments for relaxation', capacity: 20, operatingHours: '9:00 AM - 9:00 PM', pricePerHour: 50, bookable: true, requiresGuests: true, maxGuests: 10, featured: true, amenities: ['Massage', 'Facials', 'Sauna', 'Steam Room', 'Jacuzzi'], location: 'First Floor, West Wing', image: '/assets/images/facility-spa.jpg' },
      { name: 'Business Center', type: 'business', description: 'Fully equipped business facilities...', shortDescription: 'Professional business facilities', capacity: 50, operatingHours: '24/7', pricePerHour: 30, bookable: true, featured: false, amenities: ['High-Speed WiFi', 'Printing', 'Conference Rooms', 'Video Conferencing'], location: 'Ground Floor, Business Wing', image: '/assets/images/facility-business.jpg' }
    ];

    await Facility.deleteMany({});
    await Facility.insertMany(sampleFacilities);
    req.flash('success', 'Sample facilities added successfully');
    res.redirect('/admin/facilities-config');
  } catch (error) {
    console.error('Error adding sample facilities:', error);
    req.flash('error', 'Failed to add sample facilities');
    res.redirect('/admin/facilities-config');
  }
});

 // ========================
// ENHANCED RESERVATIONS MANAGEMENT
// ========================

router.get('/reservations', isAdmin, async (req, res) => { 
  try {
    const { status, payment, date, search, roomNumber } = req.query;
    
    // Build query
    let query = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Payment filter
    if (payment && payment !== 'all') {
      query.paymentStatus = payment;
    }
    
    // Date filter (check-in date)
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.checkInDate = { $gte: startDate, $lt: endDate };
    }
    
    // Room number filter
    if (roomNumber) {
      // Find room by number first
      const Room = require('../models/Room');
      const room = await Room.findOne({ roomNumber: { $regex: roomNumber, $options: 'i' } });
      if (room) {
        query.room = room._id;
      } else {
        // If no room found, return empty results
        query.room = null;
      }
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { guestName: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } },
        { guestPhone: { $regex: search, $options: 'i' } },
        { confirmationCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    const Reservation = require('../models/Reservation');
    const reservations = await Reservation.find(query)
      .populate('room', 'roomNumber type price')
      .sort({ createdAt: -1 });
    
    // Fetch today's check-ins and check-outs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysCheckIns = await Reservation.find({
      checkInDate: { $gte: today, $lt: tomorrow },
      status: 'confirmed'
    }).populate('room', 'roomNumber type');
    
    const todaysCheckOuts = await Reservation.find({
      checkOutDate: { $gte: today, $lt: tomorrow },
      status: 'confirmed'
    }).populate('room', 'roomNumber type');
    
    // Fetch upcoming arrivals (next 7 days)
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingArrivals = await Reservation.find({
      checkInDate: { $gte: tomorrow, $lt: nextWeek },
      status: 'confirmed'
    }).populate('room', 'roomNumber type').sort({ checkInDate: 1 });
    
    // Calculate statistics
    const stats = {
      total: await Reservation.countDocuments(),
      pending: await Reservation.countDocuments({ status: 'pending' }),
      confirmed: await Reservation.countDocuments({ status: 'confirmed' }),
      cancelled: await Reservation.countDocuments({ status: 'cancelled' }),
      checkedIn: await Reservation.countDocuments({ status: 'checked-in' }),
      completed: await Reservation.countDocuments({ status: 'completed' }),
      unpaid: await Reservation.countDocuments({ paymentStatus: 'unpaid' }),
      paid: await Reservation.countDocuments({ paymentStatus: 'paid' }),
      partiallyPaid: await Reservation.countDocuments({ paymentStatus: 'partially-paid' })
    };
    
    // Occupancy statistics for current day
    const occupiedRooms = await Reservation.countDocuments({
      status: 'checked-in',
      checkInDate: { $lte: today },
      checkOutDate: { $gt: today }
    });
    
    const RoomModel = require('../models/Room');
    const totalRooms = await RoomModel.countDocuments({ available: true });
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    
    res.render('admin/reservations', {
      title: 'Manage Room Reservations',
      reservations,
      todaysCheckIns,
      todaysCheckOuts,
      upcomingArrivals,
      stats,
      occupancyRate,
      occupiedRooms,
      totalRooms,
      query: req.query,
      messages: req.flash(),
      user: req.session.user,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error('Error loading reservations:', error);
    req.flash('error', 'Failed to load reservations');
    res.redirect('/admin');
  }
});

router.get('/reservations/:id', isAdmin, async (req, res) => {
  try {
    const Reservation = require('../models/Reservation');
    const reservation = await Reservation.findById(req.params.id)
      .populate('room', 'roomNumber type price amenities images')
      .populate('user', 'name email phone');
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    res.render('admin/reservation-details', {
      title: 'Reservation Details',
      reservation,
      messages: req.flash(),
      user: req.session.user,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error('Error loading reservation details:', error);
    req.flash('error', 'Failed to load reservation details');
    res.redirect('/admin/reservations');
  }
});

// Check-in functionality - UPDATED FOR EXISTING MODEL
router.post('/reservations/checkin/:id', isAdmin, canManageUsers, async (req, res) => {
  try {
    const Reservation = require('../models/Reservation');
    const Room = require('../models/Room');
    
    const reservation = await Reservation.findById(req.params.id)
      .populate('room', 'roomNumber type price available');
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    // Check if already checked in
    if (reservation.status === 'checked-in') {
      req.flash('warning', 'Guest is already checked in');
      return res.redirect(`/admin/reservations/${req.params.id}`);
    }
    
    // Check if room is available
    if (!reservation.room) {
      req.flash('error', 'No room assigned to this reservation');
      return res.redirect(`/admin/reservations/${req.params.id}`);
    }
    
    // Check if room is currently available
    if (!reservation.room.available) {
      const conflictingReservation = await Reservation.findOne({
        room: reservation.room._id,
        status: 'checked-in',
        _id: { $ne: reservation._id }
      });
      
      if (conflictingReservation) {
        req.flash('error', `Room ${reservation.room.roomNumber} is currently occupied`);
        return res.redirect(`/admin/reservations/${req.params.id}`);
      }
    }
    
    // Update reservation with check-in details
    const updateData = {
      status: 'checked-in',
      actualCheckIn: new Date(),
      checkedInBy: req.session.user.username
    };
    
    // Add check-in time from form if provided
    if (req.body.checkInTime) {
      updateData.actualCheckIn = new Date(req.body.checkInTime);
    }
    
    await Reservation.findByIdAndUpdate(req.params.id, updateData);
    
    // Update room status
    await Room.findByIdAndUpdate(reservation.room._id, { 
      available: false,
      currentOccupancy: reservation.guests || 1
    });
    
    req.flash('success', `Guest checked in successfully to Room ${reservation.room.roomNumber}`);
    res.redirect(`/admin/reservations/${req.params.id}`);
  } catch (error) {
    console.error('Error during check-in:', error);
    req.flash('error', 'Failed to check in guest: ' + error.message);
    res.redirect(`/admin/reservations/${req.params.id}`);
  }
});

// Check-out functionality
router.post('/reservations/checkout/:id', isAdmin, canManageUsers, async (req, res) => {
  try {
    const Reservation = require('../models/Reservation');
    const Room = require('../models/Room');
    
    const reservation = await Reservation.findById(req.params.id)
      .populate('room', 'roomNumber');
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    // Check if not checked in
    if (reservation.status !== 'checked-in') {
      req.flash('warning', 'Guest is not checked in');
      return res.redirect(`/admin/reservations/${req.params.id}`);
    }
    
    // Calculate extended stay if any
    const actualCheckOut = new Date();
    const plannedCheckOut = new Date(reservation.checkOutDate);
    let extraNights = 0;
    
    if (actualCheckOut > plannedCheckOut) {
      const diffTime = Math.abs(actualCheckOut - plannedCheckOut);
      extraNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Calculate extra charges
      const extraCharges = extraNights * reservation.roomPrice;
      reservation.extraCharges = extraCharges;
      reservation.totalAmount += extraCharges;
    }
    
    // Update reservation status
    reservation.status = 'completed';
    reservation.actualCheckOut = actualCheckOut;
    reservation.checkedOutBy = req.session.user.username;
    reservation.extraNights = extraNights;
    
    await reservation.save();
    
    // Update room status
    await Room.findByIdAndUpdate(reservation.room._id, { 
      available: true,
      currentOccupancy: 0,
      lastCleaned: new Date()
    });
    
    // Generate invoice
    reservation.invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await reservation.save();
    
    req.flash('success', `Guest checked out successfully from Room ${reservation.room.roomNumber}`);
    res.redirect(`/admin/reservations/${req.params.id}`);
  } catch (error) {
    console.error('Error during check-out:', error);
    req.flash('error', 'Failed to check out guest');
    res.redirect(`/admin/reservations/${req.params.id}`);
  }
});

// Early check-out
router.post('/reservations/early-checkout/:id', isAdmin, canManageUsers, async (req, res) => {
  try {
    const { reason, refundAmount } = req.body;
    const Reservation = require('../models/Reservation');
    const Room = require('../models/Room');
    
    const reservation = await Reservation.findById(req.params.id)
      .populate('room', 'roomNumber');
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    // Update reservation
    reservation.status = 'completed';
    reservation.actualCheckOut = new Date();
    reservation.checkedOutBy = req.session.user.username;
    reservation.earlyCheckoutReason = reason;
    reservation.refundAmount = parseFloat(refundAmount) || 0;
    reservation.status = 'cancelled';
    
    // If there's a refund, update payment status
    if (reservation.refundAmount > 0) {
      reservation.paymentStatus = 'refunded';
    }
    
    await reservation.save();
    
    // Update room status
    await Room.findByIdAndUpdate(reservation.room._id, { 
      available: true,
      currentOccupancy: 0
    });
    
    req.flash('success', `Early check-out processed for Room ${reservation.room.roomNumber}`);
    res.redirect(`/admin/reservations/${req.params.id}`);
  } catch (error) {
    console.error('Error during early check-out:', error);
    req.flash('error', 'Failed to process early check-out');
    res.redirect(`/admin/reservations/${req.params.id}`);
  }
});

// Cancel reservation
router.post('/reservations/cancel/:id', isAdmin, canManageUsers, async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const Reservation = require('../models/Reservation');
    
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    // Update reservation
    reservation.status = 'cancelled';
    reservation.cancellationReason = cancellationReason;
    reservation.cancelledBy = req.session.user.username;
    reservation.cancelledAt = new Date();
    
    // If guest was checked in, make room available
    if (reservation.status === 'checked-in') {
      const Room = require('../models/Room');
      await Room.findByIdAndUpdate(reservation.room, { 
        available: true,
        currentOccupancy: 0
      });
    }
    
    await reservation.save();
    
    req.flash('success', 'Reservation cancelled successfully');
    res.redirect(`/admin/reservations/${req.params.id}`);
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    req.flash('error', 'Failed to cancel reservation');
    res.redirect(`/admin/reservations/${req.params.id}`);
  }
});

// Update reservation status
router.post('/reservations/update-status/:id', isAdmin, canManageUsers, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'checked-in', 'completed'];
    
    if (!validStatuses.includes(status)) {
      req.flash('error', 'Invalid status');
      return res.redirect(`/admin/reservations/${req.params.id}`);
    }
    
    const Reservation = require('../models/Reservation');
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    const oldStatus = reservation.status;
    reservation.status = status;
    
    // Handle room availability based on status change
    if (status === 'checked-in' && oldStatus !== 'checked-in') {
      reservation.actualCheckIn = new Date();
      reservation.checkedInBy = req.session.user.username;
      
      const Room = require('../models/Room');
      await Room.findByIdAndUpdate(reservation.room, { 
        available: false,
        currentOccupancy: reservation.numberOfGuests
      });
    } else if ((status === 'cancelled' || status === 'completed') && oldStatus === 'checked-in') {
      const Room = require('../models/Room');
      await Room.findByIdAndUpdate(reservation.room, { 
        available: true,
        currentOccupancy: 0
      });
    }
    
    await reservation.save();
    
    req.flash('success', `Reservation status updated from ${oldStatus} to ${status}`);
    res.redirect(`/admin/reservations/${req.params.id}`);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    req.flash('error', 'Failed to update reservation status');
    res.redirect(`/admin/reservations/${req.params.id}`);
  }
});

// Confirm payment
router.post('/reservations/confirm-payment/:id', isAdmin, canManageUsers, async (req, res) => {
  try {
    const { paymentMethod, transactionId, paymentAmount } = req.body;
    
    const Reservation = require('../models/Reservation');
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    // Update payment details
    reservation.paymentStatus = 'paid';
    reservation.paymentMethod = paymentMethod || 'manual';
    reservation.transactionId = transactionId || `MANUAL-${Date.now()}`;
    reservation.paidAmount = parseFloat(paymentAmount) || reservation.totalAmount;
    reservation.paymentConfirmedBy = req.session.user.username;
    reservation.paymentConfirmedAt = new Date();
    
    // If payment is confirmed, also confirm reservation if pending
    if (reservation.status === 'pending') {
      reservation.status = 'confirmed';
    }
    
    await reservation.save();
    
    req.flash('success', `Payment confirmed for ₦${reservation.paidAmount.toLocaleString()}`);
    res.redirect(`/admin/reservations/${req.params.id}`);
  } catch (error) {
    console.error('Error confirming payment:', error);
    req.flash('error', 'Failed to confirm payment');
    res.redirect(`/admin/reservations/${req.params.id}`);
  }
});

// Delete reservation
router.post('/reservations/delete/:id', isAdmin, canManageUsers, async (req, res) => {
  try {
    const Reservation = require('../models/Reservation');
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    // If guest is checked in, free the room first
    if (reservation.status === 'checked-in') {
      const Room = require('../models/Room');
      await Room.findByIdAndUpdate(reservation.room, { 
        available: true,
        currentOccupancy: 0
      });
    }
    
    await Reservation.findByIdAndDelete(req.params.id);
    
    req.flash('success', 'Reservation deleted successfully');
    res.redirect('/admin/reservations');
  } catch (error) {
    console.error('Error deleting reservation:', error);
    req.flash('error', 'Failed to delete reservation');
    res.redirect(`/admin/reservations/${req.params.id}`);
  }
});

// Occupancy report
router.get('/reservations/occupancy-report', isAdmin, canManageUsers, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();
    end.setDate(end.getDate() + 30); // Default to next 30 days
    
    const Reservation = require('../models/Reservation');
    const Room = require('../models/Room');
    
    // Get all reservations within date range
    const reservations = await Reservation.find({
      $or: [
        { checkInDate: { $lte: end, $gte: start } },
        { checkOutDate: { $lte: end, $gte: start } },
        { 
          checkInDate: { $lte: start },
          checkOutDate: { $gte: end }
        }
      ]
    }).populate('room', 'roomNumber type');
    
    // Get all rooms
    const allRooms = await Room.find({ available: true }).sort('roomNumber');
    
    // Calculate daily occupancy
    const dailyOccupancy = {};
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const occupiedRooms = reservations.filter(res => {
        const checkIn = new Date(res.checkInDate);
        const checkOut = new Date(res.checkOutDate);
        return checkIn <= currentDate && checkOut > currentDate && 
               ['confirmed', 'checked-in'].includes(res.status);
      }).length;
      
      dailyOccupancy[dateStr] = {
        date: new Date(currentDate),
        occupied: occupiedRooms,
        total: allRooms.length,
        rate: allRooms.length > 0 ? Math.round((occupiedRooms / allRooms.length) * 100) : 0
      };
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.render('admin/occupancy-report', {
      title: 'Occupancy Report',
      dailyOccupancy,
      startDate: start,
      endDate: end,
      allRooms,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error('Error generating occupancy report:', error);
    req.flash('error', 'Failed to generate occupancy report');
    res.redirect('/admin/reservations');
  }
});

// Room assignment
router.post('/reservations/assign-room/:id', isAdmin, canManageUsers, async (req, res) => {
  try {
    const { roomId } = req.body;
    
    if (!roomId) {
      req.flash('error', 'Please select a room');
      return res.redirect(`/admin/reservations/${req.params.id}`);
    }
    
    const Reservation = require('../models/Reservation');
    const Room = require('../models/Room');
    
    // Check if new room is available
    const room = await Room.findById(roomId);
    if (!room || !room.available) {
      req.flash('error', 'Selected room is not available');
      return res.redirect(`/admin/reservations/${req.params.id}`);
    }
    
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    // Free old room if it was assigned
    if (reservation.room && reservation.status === 'checked-in') {
      await Room.findByIdAndUpdate(reservation.room, { 
        available: true,
        currentOccupancy: 0
      });
    }
    
    // Assign new room
    const oldRoomId = reservation.room;
    reservation.room = roomId;
    
    // Update room status if guest is checked in
    if (reservation.status === 'checked-in') {
      await Room.findByIdAndUpdate(roomId, { 
        available: false,
        currentOccupancy: reservation.numberOfGuests
      });
    }
    
    await reservation.save();
    
    req.flash('success', `Room assigned: ${room.roomNumber} (${room.type})`);
    res.redirect(`/admin/reservations/${req.params.id}`);
  } catch (error) {
    console.error('Error assigning room:', error);
    req.flash('error', 'Failed to assign room');
    res.redirect(`/admin/reservations/${req.params.id}`);
  }
});

// Generate invoice PDF
router.get('/reservations/invoice/:id', isAdmin, canManageUsers, async (req, res) => {
  try {
    const Reservation = require('../models/Reservation');
    const reservation = await Reservation.findById(req.params.id)
      .populate('room', 'roomNumber type price')
      .populate('user', 'name email phone address');
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/admin/reservations');
    }
    
    // Generate invoice number if not exists
    if (!reservation.invoiceNumber) {
      reservation.invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await reservation.save();
    }
    
    res.render('admin/invoice', {
      title: `Invoice #${reservation.invoiceNumber}`,
      reservation,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    req.flash('error', 'Failed to generate invoice');
    res.redirect(`/admin/reservations/${req.params.id}`);
  }
});


// ========================
// SUBSCRIBER MANAGEMENT
// ========================

router.get('/subscribers', isAdmin, async (req, res) => {
  try {
    // Try multiple approaches to get Subscriber model
    let SubscriberModel;
    
    if (mongoose.models.Subscriber) {
      SubscriberModel = mongoose.models.Subscriber;
    } else {
      // Try to get from routes/subscribe.js
      const { Subscriber } = require('./subscribe');
      SubscriberModel = Subscriber || mongoose.model('Subscriber');
    }
    
    if (!SubscriberModel) {
      req.flash('error', 'Subscriber model not available');
      return res.redirect('/admin');
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const subscribers = await SubscriberModel.find({})
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await SubscriberModel.countDocuments({});
    const activeCount = await SubscriberModel.countDocuments({ isActive: true });
    const inactiveCount = await SubscriberModel.countDocuments({ isActive: false });
    
    res.render('admin/subscribers', {
      title: 'Newsletter Subscribers',
      subscribers,
      subscriberCount: total,
      activeCount,
      inactiveCount,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error('Error loading subscribers:', error);
    req.flash('error', 'Failed to load subscribers');
    res.redirect('/admin');
  }
});

// ========================
// FINAL EXPORT
// ========================

console.log('Admin routes loaded successfully!');
module.exports = router;