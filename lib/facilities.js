// Facilities shown on /facilities (as in the original controller). The three
// bookable ones carry the hourly price used for facility bookings.
export const BOOKABLE_FACILITY_DATA = {
  'Spa & Wellness Center': {
    name: 'Spa & Wellness Center', type: 'wellness', description: 'Luxurious treatments for relaxation and rejuvenation',
    image: '/assets/images/facility-spa.jpg', capacity: 20, operatingHours: '9:00 AM - 9:00 PM', pricePerHour: 50,
    requiresGuests: true, maxGuests: 10, bookable: true,
  },
  'Business Center': {
    name: 'Business Center', type: 'business', description: 'Fully equipped business facilities and meeting rooms',
    image: '/assets/images/facility-business.jpg', capacity: 50, operatingHours: '24/7', pricePerHour: 30,
    requiresGuests: false, maxGuests: 1, bookable: true,
  },
  'Event Spaces': {
    name: 'Event Spaces', type: 'business', description: 'Elegant venues for conferences and special events',
    image: '/assets/images/facility-event.jpg', capacity: 200, operatingHours: 'Custom', pricePerHour: 100,
    requiresGuests: true, maxGuests: 200, bookable: true,
  },
};

export const BOOKABLE_FACILITIES = Object.keys(BOOKABLE_FACILITY_DATA);

export const ALL_FACILITIES = [
  { name: 'Main Restaurant', type: 'dining', description: 'Fine dining experience with international cuisine', image: '/assets/images/restaurant-main.jpg', capacity: 100, operatingHours: '6:00 AM - 11:00 PM', bookable: false },
  { name: 'Fitness Center', type: 'wellness', description: 'State-of-the-art gym equipment and training area', image: '/assets/images/facility-gym.jpg', capacity: 30, operatingHours: '24/7', bookable: false },
  { name: 'Swimming Pool', type: 'recreation', description: 'Outdoor swimming pool with lounge area', image: '/assets/images/facility-pool.jpg', capacity: 40, operatingHours: '7:00 AM - 10:00 PM', bookable: false },
  ...Object.values(BOOKABLE_FACILITY_DATA),
];
