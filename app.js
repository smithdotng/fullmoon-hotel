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

// =============================================================================
// STATIC FILE SERVING - UPDATED FOR CORRECT PATHS
// =============================================================================

// Create required directories if they don't exist
const requiredDirs = [
  'public',
  'public/assets',
  'public/assets/images',
  'public/css',
  'public/js',
  'public/uploads',
  'public/uploads/rooms'
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve assets with correct path
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'hotel-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Flash messages
app.use(flash());

// Request logging middleware - ENHANCED TO SHOW STATIC FILE REQUESTS
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Log if it's a static file request
  if (req.url.match(/\.(jpg|jpeg|png|gif|ico|css|js)$/)) {
    const filePath = path.join(__dirname, 'public', req.url);
    const exists = fs.existsSync(filePath);
    console.log(`   Static file: ${exists ? '✅ Found' : '❌ Not found'}`);
  }
  
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
// FIX FOR MISSING IMAGES
// =============================================================================

// Check for missing essential images and create placeholders if needed
const essentialImages = [
  'testimonial-bg.jpg',
  'room-premiere.jpg',
  'room-deluxe.jpg',
  'room-executive.jpg',
  'room-penthouse-single.jpg',
  'room-penthouse-double.jpg',
  'room-default.jpg',
  'slide-beach.jpg',
  'slide-lobby.jpg',
  'slide-coffee.jpg',
  'poolside-bar-night.jpg'
];

essentialImages.forEach(imageName => {
  const imagePath = path.join(__dirname, 'public/assets/images', imageName);
  if (!fs.existsSync(imagePath)) {
    console.log(`⚠️  Missing essential image: ${imageName}`);
    // You could create a placeholder image here or download it
  }
});

// =============================================================================
// CORE APPLICATION ROUTES (DEFINE THESE FIRST)
// =============================================================================

// Add request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST') {
    console.log('POST body:', req.body);
  }
  next();
});

// Home route - UPDATED WITH IMAGE FALLBACKS
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
    let rooms = await Room.find({ })
      .sort({ price: 1 })  // 1 = ascending (least to most expensive)
      .limit(6);
    
    console.log(`Found ${rooms.length} rooms for homepage, sorted by price`);
    
    // Process room images to ensure they have proper paths
    rooms = rooms.map(room => {
      const roomObj = room.toObject ? room.toObject() : room;
      
      // Check if room has images
      if (!roomObj.images || !Array.isArray(roomObj.images) || roomObj.images.length === 0) {
        console.log(`Room ${roomObj.type} has no images, adding fallback`);
        
        // Add fallback image based on room type
        let fallbackImage = '/assets/images/room-default.jpg';
        if (roomObj.type && roomObj.type.includes('Premiere')) {
          fallbackImage = '/assets/images/room-premiere.jpg';
        } else if (roomObj.type && roomObj.type.includes('Deluxe')) {
          fallbackImage = '/assets/images/room-deluxe.jpg';
        } else if (roomObj.type && roomObj.type.includes('Executive')) {
          fallbackImage = '/assets/images/room-executive.jpg';
        } else if (roomObj.type && roomObj.type.includes('Penthouse Single')) {
          fallbackImage = '/assets/images/room-penthouse-single.jpg';
        } else if (roomObj.type && roomObj.type.includes('Penthouse Double')) {
          fallbackImage = '/assets/images/room-penthouse-double.jpg';
        }
        
        roomObj.images = [fallbackImage];
      } else {
        // Process existing images to ensure they have correct paths
        roomObj.images = roomObj.images.map(img => {
          if (!img) return '/assets/images/room-default.jpg';
          
          // If it's already a full URL or starts with /, keep it
          if (img.startsWith('http') || img.startsWith('/')) {
            return img;
          }
          
          // If it's a filename, assume it's in uploads/rooms
          return '/uploads/rooms/' + img;
        });
      }
      
      return roomObj;
    });
    
    res.render('index', { 
      title: 'Full Moon Hotels - Luxury Accommodation in Owerri',
      rooms 
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    
    // Provide fallback rooms if database fails
    const fallbackRooms = [
      {
        _id: 'fallback-1',
        type: 'Premiere Room',
        description: 'Panoramic city view, high floor',
        price: 55000,
        images: ['/assets/images/room-premiere.jpg'],
        amenities: ['Free WiFi', 'Smart TV', 'Mini Bar']
      },
      {
        _id: 'fallback-2',
        type: 'Deluxe Room',
        description: 'Separate lounge and dining set',
        price: 65000,
        images: ['/assets/images/room-deluxe.jpg'],
        amenities: ['Free WiFi', 'Smart TV', 'Mini Bar', 'Work Desk']
      },
      {
        _id: 'fallback-3',
        type: 'Executive Room',
        description: 'Spacious work area with city views',
        price: 85000,
        images: ['/assets/images/room-executive.jpg'],
        amenities: ['Free WiFi', 'Smart TV', 'Mini Bar', 'Executive Desk']
      }
    ];
    
    res.render('index', { 
      title: 'Full Moon Hotels - Luxury Accommodation in Owerri',
      rooms: fallbackRooms 
    });
  }
});

// Privacy Policy Route
app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy', {
        title: 'Privacy Policy - Full Moon Hotels'
    });
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
  const subscribeRoutes = require('./routes/subscribe');
  
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
  app.use('/', subscribeRoutes); // This handles POST /subscribe
  
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.log('⚠️ Some routes not loaded, continuing with basic routes...');
  console.error('Route loading error:', error);
}

// =============================================================================
// DEBUG & UTILITY ROUTES
// =============================================================================

// Static file debug route
app.get('/debug-static', (req, res) => {
  const publicPath = path.join(__dirname, 'public');
  const assetsPath = path.join(__dirname, 'public/assets');
  const imagesPath = path.join(__dirname, 'public/assets/images');
  const uploadsPath = path.join(__dirname, 'public/uploads');
  const roomsUploadsPath = path.join(__dirname, 'public/uploads/rooms');
  
  const dirs = [
    { name: 'public', path: publicPath, exists: fs.existsSync(publicPath) },
    { name: 'assets', path: assetsPath, exists: fs.existsSync(assetsPath) },
    { name: 'images', path: imagesPath, exists: fs.existsSync(imagesPath) },
    { name: 'uploads', path: uploadsPath, exists: fs.existsSync(uploadsPath) },
    { name: 'uploads/rooms', path: roomsUploadsPath, exists: fs.existsSync(roomsUploadsPath) }
  ];
  
  // List files in images directory
  let imageFiles = [];
  if (fs.existsSync(imagesPath)) {
    imageFiles = fs.readdirSync(imagesPath);
  }
  
  // List files in uploads/rooms directory
  let roomImages = [];
  if (fs.existsSync(roomsUploadsPath)) {
    roomImages = fs.readdirSync(roomsUploadsPath);
  }
  
  res.json({
    directories: dirs.map(dir => ({
      name: dir.name,
      exists: dir.exists,
      path: dir.path
    })),
    imageFiles,
    roomImages,
    essentialImagesMissing: essentialImages.filter(img => !fs.existsSync(path.join(imagesPath, img)))
  });
});

// Database debug route
app.get('/debug-db', async (req, res) => {
  try {
    console.log('=== DATABASE DEBUG INFO ===');
    
    const Room = require('./models/Room');
    
    console.log('Room model:', Room ? 'Loaded' : 'NOT LOADED');
    console.log('Mongoose connection state:', mongoose.connection.readyState);
    
    let roomCount = 0;
    let sampleRooms = [];
    
    if (Room) {
      roomCount = await Room.countDocuments();
      sampleRooms = await Room.find({}).limit(5).lean();
      console.log('Total rooms in database:', roomCount);
      
      // Log room images for debugging
      sampleRooms.forEach((room, i) => {
        console.log(`Room ${i+1}: ${room.type}`);
        console.log(`  Images: ${room.images ? JSON.stringify(room.images) : 'None'}`);
        console.log(`  Price: ₦${room.price ? room.price.toLocaleString() : 'N/A'}`);
      });
    }
    
    res.json({
      roomModelLoaded: !!Room,
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

// Test route - add this before other app.use() calls
app.get('/test-route', (req, res) => {
    res.json({ message: 'Test route works!' });
});

app.get('/test-post', (req, res) => {
    res.json({ message: 'Test POST endpoint', method: 'GET' });
});

app.post('/test-post', (req, res) => {
    res.json({ message: 'Test POST endpoint', method: 'POST', body: req.body });
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

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n✨ Full Moon Hotel server running successfully!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log('\n🔧 Debug routes available:');
  console.log(`   - Static file debug: http://localhost:${PORT}/debug-static`);
  console.log(`   - Database check: http://localhost:${PORT}/debug-db`);
  console.log(`   - Route debug: http://localhost:${PORT}/debug-routes`);
  console.log('\n🚀 Server ready to accept requests...\n');
});

// Export app for testing
module.exports = app;