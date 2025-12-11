// updateRoomCategories.js
const mongoose = require('mongoose');
const Room = require('./models/Room');

async function updateCategories() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/fullmoonhotels');
    
    console.log('Updating room categories...');
    
    // Update categories based on room type
    const updates = [
      // Premiere Room
      { 
        type: 'Premiere Room',
        updates: { category: 'premiere' }
      },
      // Deluxe Room
      { 
        type: 'Deluxe Room',
        updates: { category: 'deluxe' }
      },
      // Executive Room
      { 
        type: 'Executive Room',
        updates: { category: 'executive' }
      },
      // Penthouse Single Suite
      { 
        type: 'Penthouse Single Suite',
        updates: { category: 'penthouse-single' }
      },
      // Penthouse Double Suite
      { 
        type: 'Penthouse Double Suite',
        updates: { category: 'penthouse-double' }
      }
    ];
    
    let totalUpdated = 0;
    
    for (const update of updates) {
      const result = await Room.updateMany(
        { type: update.type },
        { $set: update.updates }
      );
      
      console.log(`Updated ${result.modifiedCount} ${update.type} rooms with category: ${update.updates.category}`);
      totalUpdated += result.modifiedCount;
    }
    
    console.log(`\nTotal rooms updated: ${totalUpdated}`);
    
    // Verify the updates
    console.log('\n=== VERIFICATION ===');
    const rooms = await Room.find({});
    rooms.forEach(room => {
      console.log(`${room.roomNumber}: ${room.type} -> category: "${room.category}"`);
    });
    
    // Check distinct categories
    const categories = await Room.distinct('category');
    console.log('\nAvailable categories:', categories);
    
    await mongoose.connection.close();
    console.log('\n✓ Done!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

updateCategories();