const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');
require('dotenv').config();

const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// =============================================================================
// DATABASE CONFIGURATION
// =============================================================================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullmoonhotel', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'hotel-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Flash messages
app.use(flash());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// =============================================================================
// VIEW ENGINE SETUP
// =============================================================================

app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =============================================================================
// GLOBAL VARIABLES MIDDLEWARE
// =============================================================================

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.messages = req.flash();
  next();
});

// =============================================================================
// FILE UPLOAD DIRECTORIES SETUP
// =============================================================================

const uploadDirs = [
  'public/uploads/rooms',
  'public/uploads/blog',
  'public/uploads/menu',
  'public/uploads/facilities',
  'public/uploads/proofs'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// =============================================================================
// CORE APPLICATION ROUTES (DEFINE THESE FIRST)
// =============================================================================

// Add this before your route imports
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST') {
    console.log('POST body:', req.body);
  }
  next();
});

// Home route - MUST be defined before other routes that might conflict
app.get('/', async (req, res) => {
  try {
    const Room = require('./models/Room');
    
    if (!Room) {
      console.error('Room model not loaded');
      return res.render('index', { 
        title: 'Full Moon Hotels - Luxury Accommodation in Owerri',
        rooms: [] 
      });
    }

    // Fetch rooms sorted by price (least to most expensive)
    const rooms = await Room.find({ available: true })
      .sort({ price: 1 })  // 1 = ascending (least to most expensive)
      .limit(6);
    
    console.log(`Found ${rooms.length} rooms for homepage, sorted by price`);
    
    res.render('index', { 
      title: 'Full Moon Hotels - Luxury Accommodation in Owerri',
      rooms 
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.render('index', { 
      title: 'Full Moon Hotels - Luxury Accommodation in Owerri',
      rooms: [] 
    });
  }
});



app.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register - Full Moon Hotels'
  });
});

app.get('/logout', (req, res) => {
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

// Favicon routes
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

app.get('/favicon-32x32.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon-32x32.png'));
});

app.get('/favicon-16x16.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon-16x16.png'));
});

app.get('/apple-touch-icon.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'apple-touch-icon.png'));
});

// Guest reservation route
app.get('/reservations/guest/:id', async (req, res) => {
  try {
    console.log('=== GUEST RESERVATION ROUTE HIT ===');
    console.log('Reservation ID:', req.params.id);
    
    const Reservation = require('./models/Reservation');
    const mongoose = require('mongoose');
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid reservation ID format');
      return res.status(404).render('error', { 
        title: 'Booking Not Found',
        error: 'The requested booking was not found.' 
      });
    }

    const reservation = await Reservation.findById(req.params.id).populate('room');
    console.log('Reservation found:', reservation ? 'Yes' : 'No');
    
    if (!reservation) {
      console.log('Reservation not found in database');
      return res.status(404).render('error', { 
        title: 'Booking Not Found',
        error: 'The requested booking was not found.' 
      });
    }

    console.log('Rendering guest-reservation template...');
    res.render('rooms/guest-reservation', {
      title: 'Your Booking - Full Moon Hotels',
      reservation
    });

  } catch (error) {
    console.error('Guest reservation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).render('error', { 
      title: 'Server Error',
      error: 'Something went wrong! Please try again later.' 
    });
  }
});

// =============================================================================
// ROUTE IMPORTS & MOUNTING (DEFINE AFTER CORE ROUTES)
// =============================================================================

// Import routes with error handling
try {
  // Import route files
  const authRoutes = require('./routes/auth');
  const aboutRoutes = require('./routes/about');
  const galleryRoutes = require('./routes/gallery');
  const roomRoutes = require('./routes/rooms');
  const adminRoutes = require('./routes/admin');
  const blogRoutes = require('./routes/blog');
  const facilitiesRoutes = require('./routes/facilities');
  const contactRoutes = require('./routes/contact');
  const laundryRoutes = require('./routes/laundry');
  const gymRoutes = require('./routes/gym');
  
  // Mount routes - IMPORTANT: Mount admin routes AFTER auth routes
  app.use('/', authRoutes); // This handles POST /login
  app.use('/about', aboutRoutes);
  app.use('/gallery', galleryRoutes);
  app.use('/rooms', roomRoutes);
  app.use('/admin', adminRoutes); // This handles GET /admin
  app.use('/blog', blogRoutes);
  app.use('/facilities', facilitiesRoutes);
  app.use('/contact', contactRoutes);
  app.use('/laundry', laundryRoutes);
  app.use('/gym', gymRoutes);
  
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.log('⚠️ Some routes not loaded, continuing with basic routes...');
  console.error('Route loading error:', error);
}

// =============================================================================
// DEBUG & UTILITY ROUTES
// =============================================================================

// Database debug route
app.get('/debug-db', async (req, res) => {
  try {
    console.log('=== DATABASE DEBUG INFO ===');
    
    const Room = require('./models/Room');
    const Blog = require('./models/Blog');
    const Reservation = require('./models/Reservation');
    
    console.log('Room model:', Room ? 'Loaded' : 'NOT LOADED');
    console.log('Blog model:', Blog ? 'Loaded' : 'NOT LOADED');
    console.log('Reservation model:', Reservation ? 'Loaded' : 'NOT LOADED');
    console.log('Mongoose connection state:', mongoose.connection.readyState);
    
    let roomCount = 0;
    let sampleRooms = [];
    
    if (Room) {
      roomCount = await Room.countDocuments();
      sampleRooms = await Room.find({}).limit(5);
      console.log('Total rooms in database:', roomCount);
      console.log('Sample rooms:', sampleRooms);
    }
    
    res.json({
      roomModelLoaded: !!Room,
      blogModelLoaded: !!Blog,
      reservationModelLoaded: !!Reservation,
      dbConnected: mongoose.connection.readyState === 1,
      roomCount: roomCount,
      sampleRooms: sampleRooms
    });
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ 
      error: error.message,
      dbConnected: mongoose.connection.readyState === 1
    });
  }
});

// Sample rooms route (for testing - remove in production)
app.get('/add-sample-rooms', async (req, res) => {
  try {
    const Room = require('./models/Room');
    
    if (!Room) {
      return res.status(500).json({ error: 'Room model not loaded' });
    }

    const sampleRooms = [
      {
        roomNumber: '101',
        type: 'Deluxe Room',
        price: 25000,
        description: 'Spacious deluxe room with city view',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
        available: true
      },
      {
        roomNumber: '102', 
        type: 'Executive Room',
        price: 35000,
        description: 'Luxurious executive suite',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'],
        available: true
      },
      {
        roomNumber: '201',
        type: 'Premiere Room',
        price: 45000,
        description: 'Premium room with balcony',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Coffee Maker'],
        available: true
      },
      {
        roomNumber: '301',
        type: 'Penthouse Suite',
        price: 75000,
        description: 'Luxurious penthouse with panoramic views',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Kitchenette'],
        available: true
      }
    ];

    // Clear existing rooms and insert new ones
    await Room.deleteMany({});
    const result = await Room.insertMany(sampleRooms);
    
    res.json({ 
      message: 'Sample rooms added successfully',
      roomsAdded: result.length,
      rooms: result 
    });
  } catch (error) {
    console.error('Error adding sample rooms:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route debug endpoint
app.get('/debug-routes', (req, res) => {
  const routes = [];
  
  function processMiddleware(middleware, prefix = '') {
    if (middleware.route) {
      // Regular route
      const route = middleware.route;
      routes.push({
        path: prefix + route.path,
        methods: Object.keys(route.methods),
        type: 'ROUTE'
      });
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      // Router middleware
      const routerPrefix = prefix;
      middleware.handle.stack.forEach(handler => {
        processMiddleware(handler, routerPrefix);
      });
    }
  }

  app._router.stack.forEach(middleware => {
    processMiddleware(middleware);
  });

  res.json({
    message: 'Registered Routes',
    totalRoutes: routes.length,
    routes: routes.sort((a, b) => a.path.localeCompare(b.path))
  });
});

// =============================================================================
// ERROR HANDLING MIDDLEWARE
// =============================================================================

// 404 Handler - MUST be last route
app.use((req, res) => {
  console.log('404 - Route not found:', req.url);
  res.status(404).render('error', { 
    title: 'Page Not Found',
    error: 'The page you are looking for does not exist.' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Global error handler:', err.stack);
  res.status(500).render('error', { 
    title: 'Server Error',
    error: 'Something went wrong! Please try again later.' 
  });
});

// =============================================================================
// SERVER STARTUP
// =============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\n✨ Full Moon Hotel server running successfully!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log('\n🔧 Debug routes available:');
  console.log(`   - Database check: http://localhost:${PORT}/debug-db`);
  console.log(`   - Route debug: http://localhost:${PORT}/debug-routes`);
  console.log(`   - Add sample rooms: http://localhost:${PORT}/add-sample-rooms`);
  console.log('\n🚀 Server ready to accept requests...\n');
});

// Export app for testing
module.exports = app;