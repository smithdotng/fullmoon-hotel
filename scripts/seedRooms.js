const mongoose = require('mongoose');
const Room = require('../models/Room');
require('dotenv').config();

const sampleRooms = [
  {
    roomNumber: '101',
    type: 'Annex Room',
    price: 50000,
    description: 'Comfortable and well-appointed room with modern amenities',
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Work Desk'],
    images: ['/assets/images/room-annex.jpg']
  },
  {
    roomNumber: '201',
    type: 'Premiere Room',
    price: 55000,
    description: 'Panoramic city view, high floor with elegant decor',
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Work Desk', 'City View'],
    images: ['/assets/images/room-premiere.jpg']
  },
  {
    roomNumber: '301',
    type: 'Deluxe Room',
    price: 65000,
    description: 'Separate lounge and dining set with premium furnishings',
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Separate Lounge', 'Dining Area'],
    images: ['/assets/images/room-deluxe.jpg']
  },
  {
    roomNumber: '401',
    type: 'Executive Room',
    price: 80000,
    description: 'Art deco-style room with premium amenities and workspace',
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Executive Desk', 'Premium Toiletries'],
    images: ['/assets/images/room-executive.jpg']
  },
  {
    roomNumber: '501',
    type: 'Penthouse Single Suite',
    price: 140000,
    description: 'Luxury suite with panoramic views and premium amenities',
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Separate Living Room', 'Premium Bathroom'],
    images: ['/assets/images/room-penthouse-single.jpg']
  },
  {
    roomNumber: '502',
    type: 'Penthouse Double Suite',
    price: 200000,
    description: 'Ultimate luxury with two bedrooms and spacious living area',
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Two Bedrooms', 'Spacious Lounge', 'Dining Area'],
    images: ['/assets/images/room-penthouse-double.jpg']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullmoonhotel', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('Cleared existing rooms');

    // Insert sample rooms
    await Room.insertMany(sampleRooms);
    console.log('Sample rooms inserted successfully');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();