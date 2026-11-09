// Development helper: insert one sample room per class (skips room numbers that exist).
//   node scripts/seed-sample-rooms.mjs
import './_env.mjs';
import mongoose from 'mongoose';
import Room from '../lib/models/Room.js';

const sampleRooms = [
  { roomNumber: '201', type: 'Premiere Room', category: 'premiere', price: 55000, description: 'Panoramic city view, high floor with elegant decor', amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Work Desk', 'City View'], images: ['/assets/images/room-premiere.jpg'] },
  { roomNumber: '301', type: 'Deluxe Room', category: 'deluxe', price: 65000, description: 'Separate lounge and dining set with premium furnishings', amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Separate Lounge', 'Dining Area'], images: ['/assets/images/room-deluxe.jpg'] },
  { roomNumber: '401', type: 'Executive Room', category: 'executive', price: 80000, description: 'Art deco-style room with premium amenities and workspace', amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Executive Desk', 'Premium Toiletries'], images: ['/assets/images/room-executive.jpg'] },
  { roomNumber: '501', type: 'Penthouse Single Suite', category: 'penthouse-single', price: 140000, description: 'Luxury suite with panoramic views and premium amenities', amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Separate Living Room', 'Premium Bathroom'], images: ['/assets/images/room-penthouse-single.jpg'] },
  { roomNumber: '502', type: 'Penthouse Double Suite', category: 'penthouse-double', price: 200000, description: 'Ultimate luxury with two bedrooms and spacious living area', amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Two Bedrooms', 'Spacious Lounge', 'Dining Area'], images: ['/assets/images/room-penthouse-double.jpg'] },
];

try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullmoonhotel');
  let added = 0;
  for (const room of sampleRooms) {
    if (await Room.exists({ roomNumber: room.roomNumber })) continue;
    await Room.create(room);
    added++;
  }
  console.log(`Inserted ${added} sample room(s).`);
} catch (error) {
  console.error('Error seeding rooms:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
