const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Blog = require('../models/Blog');
const multer = require('multer');
const path = require('path');

const FacilityBooking = require('../models/FacilityBooking');

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

// Simple admin middleware (for testing)
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    req.flash('error', 'Please login as administrator');
    res.redirect('/login');
  }
};

// GET /admin - Admin dashboard
router.get('/', isAdmin, async (req, res) => {
  try {
    // Room statistics
    const roomCount = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ available: true });
    
    // Blog statistics
    const blogCount = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ published: true });
    const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);
    
    // Facility booking statistics
    const FacilityBooking = require('../models/FacilityBooking');
    const facilityBookings = await FacilityBooking.countDocuments();
    const confirmedFacilityBookings = await FacilityBooking.countDocuments({ status: 'confirmed' });
    
    // Revenue calculation
    const revenueResult = await FacilityBooking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const facilityRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Recent facility bookings
    const recentFacilityBookings = await FacilityBooking.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Popular facilities
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
    
    res.render('admin/dashboard', { 
      title: 'Admin Dashboard',
      // Room stats
      roomCount,
      availableRooms,
      // Blog stats
      blogCount,
      publishedBlogs,
      recentBlogs,
      // Facility stats
      facilityBookings,
      confirmedFacilityBookings,
      facilityRevenue,
      recentFacilityBookings,
      popularFacilities,
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

// GET /admin/rooms - Room management
router.get('/rooms', isAdmin, async (req, res) => {
  try {
    const rooms = await Room.find().sort({ type: 1 });
    res.render('admin/rooms', { 
      title: 'Manage Rooms',
      rooms,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Server Error',
      error: 'Failed to load rooms' 
    });
  }
});

// GET /admin/rooms/add - Add room form
router.get('/rooms/add', isAdmin, (req, res) => {
  res.render('admin/room-form', { 
    title: 'Add New Room',
    room: null,
    layout: 'layout-admin'
  });
});

// POST /admin/rooms - Create new room
router.post('/rooms', isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { roomNumber, type, price, description, amenities } = req.body;
    
    const roomData = {
      roomNumber,
      type,
      price: parseFloat(price),
      description,
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : []
    };

    // Handle uploaded images
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

// GET /admin/rooms/edit/:id - Edit room form
router.get('/rooms/edit/:id', isAdmin, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      req.flash('error', 'Room not found');
      return res.redirect('/admin/rooms');
    }
    
    res.render('admin/room-form', { 
      title: 'Edit Room',
      room,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load room');
    res.redirect('/admin/rooms');
  }
});

// POST /admin/rooms/update/:id - Update room
router.post('/rooms/update/:id', isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { roomNumber, type, price, description, amenities } = req.body;
    
    const updateData = {
      roomNumber,
      type,
      price: parseFloat(price),
      description,
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : []
    };

    // Handle uploaded images
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

// POST /admin/rooms/delete/:id - Delete room
router.post('/rooms/delete/:id', isAdmin, async (req, res) => {
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

// Blog Routes

// GET /admin/blog - Blog management
router.get('/blog', isAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('admin/blog', { 
      title: 'Manage Blog',
      blogs,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load blog posts');
    res.redirect('/admin');
  }
});

// GET /admin/blog/add - Add blog form
router.get('/blog/add', isAdmin, (req, res) => {
  res.render('admin/blog-form', { 
    title: 'Add New Blog Post',
    blog: null,
    layout: 'layout-admin'
  });
});

// POST /admin/blog - Create new blog post
router.post('/blog', isAdmin, upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, published, featured, metaTitle, metaDescription } = req.body;
    
    const blogData = {
      title,
      excerpt,
      content,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      published: published === 'true',
      featured: featured === 'true',
      metaTitle,
      metaDescription
    };

    // Handle uploaded featured image
    if (req.file) {
      blogData.featuredImage = `/uploads/blog/${req.file.filename}`;
    }

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

// GET /admin/blog/edit/:id - Edit blog form
router.get('/blog/edit/:id', isAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      req.flash('error', 'Blog post not found');
      return res.redirect('/admin/blog');
    }
    
    res.render('admin/blog-form', { 
      title: 'Edit Blog Post',
      blog,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load blog post');
    res.redirect('/admin/blog');
  }
});

// POST /admin/blog/update/:id - Update blog post
router.post('/blog/update/:id', isAdmin, upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, published, featured, metaTitle, metaDescription } = req.body;
    
    const updateData = {
      title,
      excerpt,
      content,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      published: published === 'true',
      featured: featured === 'true',
      metaTitle,
      metaDescription
    };

    // Handle uploaded featured image
    if (req.file) {
      updateData.featuredImage = `/uploads/blog/${req.file.filename}`;
    }

    await Blog.findByIdAndUpdate(req.params.id, updateData);
    
    req.flash('success', 'Blog post updated successfully');
    res.redirect('/admin/blog');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update blog post: ' + error.message);
    res.redirect(`/admin/blog/edit/${req.params.id}`);
  }
});

// POST /admin/blog/delete/:id - Delete blog post
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

// Facilities Management Routes

// GET /admin/facilities - Facilities management
router.get('/facilities', isAdmin, async (req, res) => {
  try {
    const facilities = await FacilityBooking.find()
      .populate('user', 'name email')
      .sort({ bookingDate: -1, bookingTime: -1 });
    
    res.render('admin/facilities', { 
      title: 'Manage Facility Bookings',
      facilities,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load facility bookings');
    res.redirect('/admin');
  }
});

// GET /admin/facilities/stats - Facility booking statistics
router.get('/facilities/stats', isAdmin, async (req, res) => {
  try {
    const totalBookings = await FacilityBooking.countDocuments();
    const confirmedBookings = await FacilityBooking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await FacilityBooking.countDocuments({ status: 'cancelled' });
    const completedBookings = await FacilityBooking.countDocuments({ status: 'completed' });
    
    // Revenue calculation
    const revenueResult = await FacilityBooking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Popular facilities
    const popularFacilities = await FacilityBooking.aggregate([
      { $group: { 
          _id: '$facilityName', 
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.render('admin/facility-stats', { 
      title: 'Facility Booking Statistics',
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      totalRevenue,
      popularFacilities,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load facility statistics');
    res.redirect('/admin');
  }
});

// POST /admin/facilities/update-status/:id - Update booking status
router.post('/facilities/update-status/:id', isAdmin, async (req, res) => {
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

// POST /admin/facilities/delete/:id - Delete facility booking
router.post('/facilities/delete/:id', isAdmin, async (req, res) => {
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

// GET /admin/facilities/calendar - Booking calendar view
router.get('/facilities/calendar', isAdmin, async (req, res) => {
  try {
    const bookings = await FacilityBooking.find({ status: 'confirmed' })
      .select('facilityName bookingDate bookingTime duration')
      .sort({ bookingDate: 1, bookingTime: 1 });
    
    res.render('admin/facility-calendar', { 
      title: 'Facility Booking Calendar',
      bookings,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load booking calendar');
    res.redirect('/admin');
  }
});

// Facilities Configuration Routes

// GET /admin/facilities-config - Facilities management
router.get('/facilities-config', isAdmin, async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ type: 1, name: 1 });
    
    res.render('admin/facilities-config', { 
      title: 'Manage Facilities',
      facilities,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load facilities');
    res.redirect('/admin');
  }
});

// GET /admin/facilities-config/add - Add facility form
router.get('/facilities-config/add', isAdmin, (req, res) => {
  res.render('admin/facility-form', { 
    title: 'Add New Facility',
    facility: null,
    layout: 'layout-admin'
  });
});

// POST /admin/facilities-config - Create new facility
router.post('/facilities-config', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      shortDescription,
      capacity,
      operatingHours,
      pricePerHour,
      requiresGuests,
      maxGuests,
      bookable,
      featured,
      available,
      amenities,
      location,
      contactPhone,
      contactEmail,
      rules
    } = req.body;

    const facilityData = {
      name,
      type,
      description,
      shortDescription,
      capacity: parseInt(capacity),
      operatingHours,
      pricePerHour: parseFloat(pricePerHour) || 0,
      requiresGuests: requiresGuests === 'true',
      maxGuests: parseInt(maxGuests) || 1,
      bookable: bookable === 'true',
      featured: featured === 'true',
      available: available === 'true',
      location,
      contactInfo: {
        phone: contactPhone,
        email: contactEmail
      }
    };

    // Handle amenities
    if (amenities) {
      facilityData.amenities = amenities.split(',').map(a => a.trim()).filter(a => a);
    }

    // Handle rules
    if (rules) {
      facilityData.rules = rules.split(',').map(r => r.trim()).filter(r => r);
    }

    // Handle uploaded image
    if (req.file) {
      facilityData.image = `/uploads/facilities/${req.file.filename}`;
    }

    const facility = new Facility(facilityData);
    await facility.save();
    
    req.flash('success', 'Facility created successfully');
    res.redirect('/admin/facilities-config');
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      req.flash('error', 'A facility with this name already exists');
    } else {
      req.flash('error', 'Failed to create facility: ' + error.message);
    }
    res.redirect('/admin/facilities-config/add');
  }
});

// GET /admin/facilities-config/edit/:id - Edit facility form
router.get('/facilities-config/edit/:id', isAdmin, async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      req.flash('error', 'Facility not found');
      return res.redirect('/admin/facilities-config');
    }
    
    res.render('admin/facility-form', { 
      title: 'Edit Facility',
      facility,
      layout: 'layout-admin'
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load facility');
    res.redirect('/admin/facilities-config');
  }
});

// POST /admin/facilities-config/update/:id - Update facility
router.post('/facilities-config/update/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      shortDescription,
      capacity,
      operatingHours,
      pricePerHour,
      requiresGuests,
      maxGuests,
      bookable,
      featured,
      available,
      amenities,
      location,
      contactPhone,
      contactEmail,
      rules
    } = req.body;

    const updateData = {
      name,
      type,
      description,
      shortDescription,
      capacity: parseInt(capacity),
      operatingHours,
      pricePerHour: parseFloat(pricePerHour) || 0,
      requiresGuests: requiresGuests === 'true',
      maxGuests: parseInt(maxGuests) || 1,
      bookable: bookable === 'true',
      featured: featured === 'true',
      available: available === 'true',
      location,
      contactInfo: {
        phone: contactPhone,
        email: contactEmail
      }
    };

    // Handle amenities
    if (amenities) {
      updateData.amenities = amenities.split(',').map(a => a.trim()).filter(a => a);
    }

    // Handle rules
    if (rules) {
      updateData.rules = rules.split(',').map(r => r.trim()).filter(r => r);
    }

    // Handle uploaded image
    if (req.file) {
      updateData.image = `/uploads/facilities/${req.file.filename}`;
    }

    await Facility.findByIdAndUpdate(req.params.id, updateData);
    
    req.flash('success', 'Facility updated successfully');
    res.redirect('/admin/facilities-config');
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      req.flash('error', 'A facility with this name already exists');
    } else {
      req.flash('error', 'Failed to update facility: ' + error.message);
    }
    res.redirect(`/admin/facilities-config/edit/${req.params.id}`);
  }
});

// POST /admin/facilities-config/delete/:id - Delete facility
router.post('/facilities-config/delete/:id', isAdmin, async (req, res) => {
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

// POST /admin/facilities-config/toggle-status/:id - Toggle facility status
router.post('/facilities-config/toggle-status/:id', isAdmin, async (req, res) => {
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

// GET /admin/facilities-config/sample - Add sample facilities
router.get('/facilities-config/sample', isAdmin, async (req, res) => {
  try {
    const sampleFacilities = [
      {
        name: 'Main Restaurant',
        type: 'dining',
        description: 'Fine dining experience with international cuisine prepared by our expert chefs. Enjoy a romantic dinner or family gathering in our elegant restaurant.',
        shortDescription: 'Fine dining with international cuisine',
        capacity: 100,
        operatingHours: '6:00 AM - 11:00 PM',
        pricePerHour: 0,
        bookable: false,
        featured: true,
        amenities: ['Fine Dining', 'International Cuisine', 'Wine Selection', 'Vegetarian Options'],
        location: 'Ground Floor, Main Building',
        image: '/assets/images/restaurant-main.jpg'
      },
      {
        name: 'Spa & Wellness Center',
        type: 'wellness',
        description: 'Luxurious treatments for relaxation and rejuvenation. Our professional therapists offer massages, facials, and body treatments.',
        shortDescription: 'Luxurious treatments for relaxation',
        capacity: 20,
        operatingHours: '9:00 AM - 9:00 PM',
        pricePerHour: 50,
        bookable: true,
        requiresGuests: true,
        maxGuests: 10,
        featured: true,
        amenities: ['Massage', 'Facials', 'Sauna', 'Steam Room', 'Jacuzzi'],
        location: 'First Floor, West Wing',
        image: '/assets/images/facility-spa.jpg'
      },
      {
        name: 'Business Center',
        type: 'business',
        description: 'Fully equipped business facilities and meeting rooms with high-speed internet, printing services, and professional support.',
        shortDescription: 'Professional business facilities',
        capacity: 50,
        operatingHours: '24/7',
        pricePerHour: 30,
        bookable: true,
        featured: false,
        amenities: ['High-Speed WiFi', 'Printing', 'Conference Rooms', 'Video Conferencing'],
        location: 'Ground Floor, Business Wing',
        image: '/assets/images/facility-business.jpg'
      }
    ];

    // Clear existing facilities and insert new ones
    await Facility.deleteMany({});
    const result = await Facility.insertMany(sampleFacilities);
    
    req.flash('success', 'Sample facilities added successfully');
    res.redirect('/admin/facilities-config');
  } catch (error) {
    console.error('Error adding sample facilities:', error);
    req.flash('error', 'Failed to add sample facilities');
    res.redirect('/admin/facilities-config');
  }
});

module.exports = router;