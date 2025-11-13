const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Blog = require('../models/Blog');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'public/uploads/';
    if (file.fieldname === 'featuredImage') {
      uploadPath += 'blog/';
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
    const roomCount = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ available: true });
    const blogCount = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ published: true });
    const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);
    
    res.render('admin/dashboard', { 
      title: 'Admin Dashboard',
      roomCount,
      availableRooms,
      blogCount,
      publishedBlogs,
      recentBlogs,
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

module.exports = router;