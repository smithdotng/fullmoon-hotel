// debugCategories.js
const mongoose = require('mongoose');

// MongoDB connection string - update this with your actual connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fullmoonhotels';

async function debugCategories() {
  try {
    console.log('=== DEBUGGING DATABASE CONNECTION ===');
    
    // Check if mongoose is already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✓ Already connected to MongoDB');
    } else {
      console.log('Attempting to connect to MongoDB...');
      
      // Connect with timeout and better error handling
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000,
      });
      
      console.log('✓ Connected to MongoDB successfully');
    }
    
    // Import Room model
    const Room = require('./models/Room');
    
    // Check if Room model exists
    if (!Room) {
      console.error('✗ Room model not found');
      return;
    }
    
    // Simple query to see if we can access the collection
    console.log('\n=== BASIC DATABASE TEST ===');
    
    // Count total rooms
    const totalRooms = await Room.countDocuments({});
    console.log(`Total rooms in database: ${totalRooms}`);
    
    if (totalRooms === 0) {
      console.log('⚠️  Database appears to be empty');
      
      // Try to insert a test room
      console.log('\nCreating a test room...');
      const testRoom = new Room({
        roomNumber: 'TEST-001',
        type: 'Premiere Room',
        category: 'premiere',
        price: 55000,
        available: true
      });
      
      await testRoom.save();
      console.log('✓ Test room created');
      
      // Now try to query again
      const newTotal = await Room.countDocuments({});
      console.log(`Total rooms after test: ${newTotal}`);
    }
    
    // Get distinct categories
    console.log('\n=== FETCHING CATEGORIES ===');
    try {
      const categories = await Room.distinct('category');
      console.log(`Categories in database: ${categories.length}`);
      console.log('Categories:', categories);
    } catch (err) {
      console.error('Error fetching categories:', err.message);
    }
    
    // Get distinct types
    console.log('\n=== FETCHING ROOM TYPES ===');
    try {
      const types = await Room.distinct('type');
      console.log(`Room types in database: ${types.length}`);
      console.log('Types:', types);
    } catch (err) {
      console.error('Error fetching types:', err.message);
    }
    
    // Check for Premiere rooms specifically
    console.log('\n=== CHECKING PREMIERE ROOMS ===');
    const premiereRooms = await Room.find({ 
      $or: [
        { category: 'premiere' },
        { type: { $regex: 'premiere', $options: 'i' } }
      ] 
    });
    console.log(`Premiere rooms found: ${premiereRooms.length}`);
    
    if (premiereRooms.length > 0) {
      premiereRooms.forEach((room, index) => {
        console.log(`\nPremiere Room ${index + 1}:`);
        console.log(`  Room Number: ${room.roomNumber}`);
        console.log(`  Type: ${room.type}`);
        console.log(`  Category: ${room.category}`);
        console.log(`  Price: ₦${room.price}`);
        console.log(`  Available: ${room.available}`);
      });
    }
    
    // Check availability
    console.log('\n=== AVAILABILITY CHECK ===');
    const premiereAvailable = await Room.countDocuments({ 
      $or: [
        { category: 'premiere' },
        { type: { $regex: 'premiere', $options: 'i' } }
      ],
      available: true 
    });
    console.log(`Available Premiere rooms: ${premiereAvailable}`);
    
  } catch (error) {
    console.error('\n✗ ERROR:', error.message);
    console.error('Error details:', error);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n⚠️  MongoDB Connection Failed!');
      console.error('Possible issues:');
      console.error('1. MongoDB is not running on your machine');
      console.error('2. Connection string is incorrect');
      console.error('3. Firewall blocking port 27017');
      console.error('\nTo fix:');
      console.error('1. Start MongoDB: sudo service mongod start (Linux) or mongod (Windows)');
      console.error('2. Check if MongoDB is running: mongosh');
      console.error('3. Update your .env file with correct MONGODB_URI');
    }
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n✓ Database connection closed');
    }
    process.exit(0);
  }
}

// Run the debug function
debugCategories();