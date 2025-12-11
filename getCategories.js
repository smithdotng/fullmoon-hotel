// getCategories.js
const mongoose = require('mongoose');
const Room = require('./models/Room');

async function getCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/fullmoonhotels');
    console.log('Connected to MongoDB\n');
    
    // METHOD 1: Get distinct categories
    console.log('=== METHOD 1: Distinct Categories ===');
    const distinctCategories = await Room.distinct('category');
    console.log('Distinct categories:', distinctCategories);
    console.log('Count:', distinctCategories.length);
    console.log('');
    
    // METHOD 2: Get categories with room counts
    console.log('=== METHOD 2: Categories with Room Counts ===');
    const roomsByCategory = await Room.aggregate([
      { $group: {
          _id: '$category',
          count: { $sum: 1 },
          availableCount: { 
            $sum: { $cond: [{ $eq: ['$available', true] }, 1, 0] }
          },
          rooms: { $push: '$roomNumber' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    roomsByCategory.forEach(cat => {
      console.log(`Category: "${cat._id}"`);
      console.log(`  Total rooms: ${cat.count}`);
      console.log(`  Available: ${cat.availableCount}`);
      console.log(`  Room numbers: ${cat.rooms.join(', ')}`);
      console.log('');
    });
    
    // METHOD 3: Get all rooms with their categories
    console.log('=== METHOD 3: All Rooms with Categories ===');
    const allRooms = await Room.find({}, 'roomNumber type category available price').sort('roomNumber');
    
    if (allRooms.length === 0) {
      console.log('No rooms found in database!');
    } else {
      console.log(`Found ${allRooms.length} total rooms:\n`);
      allRooms.forEach((room, index) => {
        console.log(`Room ${index + 1}:`);
        console.log(`  Number: ${room.roomNumber}`);
        console.log(`  Type: ${room.type}`);
        console.log(`  Category: "${room.category}"`);
        console.log(`  Available: ${room.available}`);
        console.log(`  Price: ₦${room.price}`);
        console.log('');
      });
    }
    
    // METHOD 4: Find undefined categories
    console.log('=== METHOD 4: Rooms with Undefined Categories ===');
    const undefinedCatRooms = await Room.find({ 
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: '' },
        { category: undefined }
      ]
    }, 'roomNumber type');
    
    if (undefinedCatRooms.length > 0) {
      console.log(`Found ${undefinedCatRooms.length} rooms with undefined/null categories:`);
      undefinedCatRooms.forEach(room => {
        console.log(`  - Room ${room.roomNumber}: ${room.type}`);
      });
    } else {
      console.log('All rooms have categories defined ✓');
    }
    
    // METHOD 5: Get available categories for website navigation
    console.log('\n=== METHOD 5: Website Categories (Available Rooms Only) ===');
    const availableCategories = await Room.distinct('category', { available: true });
    console.log('Categories with available rooms:', availableCategories);
    
    if (availableCategories.length > 0) {
      console.log('\nSuggested website navigation links:');
      availableCategories.forEach(cat => {
        console.log(`  - /rooms/category/${cat}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n⚠️ MongoDB is not running!');
      console.error('Start MongoDB with: mongod');
    }
  }
}

// Run the function
getCategories();