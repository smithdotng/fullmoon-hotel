import dbConnect from '@/lib/db';
import Facility from '@/lib/models/Facility';
import { guardAdmin } from '@/lib/auth';
import { flashRedirect } from '@/lib/http';

const SAMPLE = [
  { name: 'Main Restaurant', type: 'dining', description: 'Fine dining experience...', shortDescription: 'Fine dining with international cuisine', capacity: 100, operatingHours: '6:00 AM - 11:00 PM', pricePerHour: 0, bookable: false, featured: true, amenities: ['Fine Dining', 'International Cuisine', 'Wine Selection', 'Vegetarian Options'], location: 'Ground Floor, Main Building', image: '/assets/images/restaurant-main.jpg' },
  { name: 'Spa & Wellness Center', type: 'wellness', description: 'Luxurious treatments...', shortDescription: 'Luxurious treatments for relaxation', capacity: 20, operatingHours: '9:00 AM - 9:00 PM', pricePerHour: 50, bookable: true, requiresGuests: true, maxGuests: 10, featured: true, amenities: ['Massage', 'Facials', 'Sauna', 'Steam Room', 'Jacuzzi'], location: 'First Floor, West Wing', image: '/assets/images/facility-spa.jpg' },
  { name: 'Business Center', type: 'business', description: 'Fully equipped business facilities...', shortDescription: 'Professional business facilities', capacity: 50, operatingHours: '24/7', pricePerHour: 30, bookable: true, featured: false, amenities: ['High-Speed WiFi', 'Printing', 'Conference Rooms', 'Video Conferencing'], location: 'Ground Floor, Business Wing', image: '/assets/images/facility-business.jpg' },
];

// GET /admin/facilities-config/sample - replace facilities with sample data (link on the dashboard)
export async function GET(request) {
  const { response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  try {
    await dbConnect();
    await Facility.deleteMany({});
    await Facility.insertMany(SAMPLE);
    return flashRedirect(request, '/admin/facilities-config', 'success', 'Sample facilities added successfully');
  } catch (error) {
    console.error('Error adding sample facilities:', error);
    return flashRedirect(request, '/admin/facilities-config', 'error', 'Failed to add sample facilities');
  }
}
