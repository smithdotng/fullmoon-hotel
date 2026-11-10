import dbConnect from '@/lib/db';
import FacilityBooking from '@/lib/models/FacilityBooking';
import { getCurrentUser } from '@/lib/session';
import { readForm, flashRedirect } from '@/lib/http';
import { BOOKABLE_FACILITY_DATA } from '@/lib/facilities';

// POST /facilities/book (logged-in users only, as before)
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return flashRedirect(request, '/login', 'error', 'Please login to book facilities');

  const { facilityName, bookingDate, bookingTime, duration, guests, specialRequests } = await readForm(request);
  if (!facilityName || !bookingDate || !bookingTime || !duration) {
    return flashRedirect(request, '/facilities', 'error', 'Please fill in all required fields');
  }
  const facility = BOOKABLE_FACILITY_DATA[facilityName];
  if (!facility || !facility.bookable) {
    return flashRedirect(request, '/facilities', 'error', 'Selected facility is not available for booking');
  }

  const hours = parseInt(duration);
  const totalAmount = facility.pricePerHour * hours;
  try {
    await dbConnect();
    // The Express version only showed a confirmation; bookings are now saved so they
    // appear under Admin -> Facility Bookings.
    await FacilityBooking.create({
      user: user._id,
      facilityName,
      bookingDate,
      bookingTime,
      duration: hours,
      guests: parseInt(guests) || 1,
      specialRequests,
      status: 'confirmed',
      totalAmount,
    });
    return flashRedirect(request, '/facilities', 'success', `Your ${facilityName} booking has been confirmed! Total: ₦${totalAmount}`);
  } catch (error) {
    console.error('Booking error:', error);
    return flashRedirect(request, '/facilities', 'error', 'Failed to process booking');
  }
}
