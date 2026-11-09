import dbConnect, { isValidId } from '@/lib/db';
import { readForm, flashRedirect, redirectTo } from '@/lib/http';
import { parseBookingDate, toISODate, canBookRoom } from '@/lib/rooms';

// POST /rooms/book/:id - "Book Now" on the availability page
export async function POST(request, { params }) {
  const { id } = await params;
  if (!isValidId(id)) return flashRedirect(request, '/rooms', 'error', 'Invalid room ID');

  const body = await readForm(request);
  let guests;
  if (body.guests) guests = parseInt(body.guests, 10);
  else if (body.adults) guests = (parseInt(body.adults) || 0) + (parseInt(body.children) || 0) + (parseInt(body.infants) || 0);
  else return flashRedirect(request, '/rooms', 'error', 'Please provide guest information');

  if (!body.checkIn || !body.checkOut || !(guests > 0)) return flashRedirect(request, '/rooms', 'error', 'Please fill in all required fields');

  const checkInDate = parseBookingDate(body.checkIn);
  const checkOutDate = parseBookingDate(body.checkOut);
  if (!checkInDate || !checkOutDate) return flashRedirect(request, '/rooms', 'error', 'Invalid date format');

  try {
    await dbConnect();
    const check = await canBookRoom(id, checkInDate, checkOutDate);
    if (!check.canBook) {
      const msg = check.reason === 'Room is not available' ? 'Sorry, this room is not available for booking' : check.reason;
      return flashRedirect(request, '/rooms', 'error', msg);
    }
    const q = new URLSearchParams({ roomId: id, checkIn: toISODate(checkInDate), checkOut: toISODate(checkOutDate), guests: String(guests) });
    return redirectTo(request, `/rooms/booking-confirmation?${q}`);
  } catch (error) {
    console.error('Booking error:', error);
    return flashRedirect(request, '/rooms', 'error', 'Failed to process booking. Please try again.');
  }
}
