import { readForm, flashRedirect, redirectTo } from '@/lib/http';
import { parseBookingDate, toISODate } from '@/lib/rooms';

// POST /rooms/check-availability - booking widget submit
export async function POST(request) {
  const { checkIn, checkOut, adults, children, infants } = await readForm(request);
  const guests = (parseInt(adults) || 0) + (parseInt(children) || 0) + (parseInt(infants) || 0);
  if (!checkIn || !checkOut || guests <= 0) return flashRedirect(request, '/rooms', 'error', 'Please fill in all required fields');

  const checkInDate = parseBookingDate(checkIn);
  const checkOutDate = parseBookingDate(checkOut);
  if (!checkInDate || !checkOutDate) return flashRedirect(request, '/rooms', 'error', 'Invalid date format. Please select valid dates.');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkInDate < today) return flashRedirect(request, '/rooms', 'error', 'Check-in date cannot be in the past');
  if (checkOutDate <= checkInDate) return flashRedirect(request, '/rooms', 'error', 'Check-out date must be after check-in date');

  const params = new URLSearchParams({
    checkIn: toISODate(checkInDate),
    checkOut: toISODate(checkOutDate),
    adults: String(parseInt(adults) || 0),
    children: String(parseInt(children) || 0),
    infants: String(parseInt(infants) || 0),
  });
  return redirectTo(request, `/rooms/availability?${params}`);
}

// Old links pointed here with GET
export function GET(request) {
  return redirectTo(request, '/rooms');
}
