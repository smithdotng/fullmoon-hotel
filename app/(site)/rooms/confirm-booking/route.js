import dbConnect, { isValidId } from '@/lib/db';
import Reservation from '@/lib/models/Reservation';
import { readForm, flashRedirect, redirectTo } from '@/lib/http';
import { canBookRoom, parseBookingDate, nightsBetween } from '@/lib/rooms';
import { sendReservationConfirmation } from '@/lib/email';

// POST /rooms/confirm-booking - guest details form on the booking confirmation page
export async function POST(request) {
  const body = await readForm(request);
  const { roomId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone } = body;
  const back = `/rooms/booking-confirmation?${new URLSearchParams({ roomId: roomId || '', checkIn: checkIn || '', checkOut: checkOut || '', guests: guests || '' })}`;

  const missing = Object.entries({ roomId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone })
    .filter(([, v]) => !v || !String(v).trim())
    .map(([k]) => k);
  if (missing.length) return flashRedirect(request, back, 'error', `Please fill in all required fields: ${missing.join(', ')}`);
  if (!isValidId(roomId)) return flashRedirect(request, '/rooms', 'error', 'Invalid room ID format');

  const checkInDate = parseBookingDate(checkIn);
  const checkOutDate = parseBookingDate(checkOut);
  if (!checkInDate || !checkOutDate) return flashRedirect(request, back, 'error', 'Invalid date format. Please select valid dates.');

  try {
    await dbConnect();
    const check = await canBookRoom(roomId, checkInDate, checkOutDate);
    if (!check.canBook) {
      const msg =
        check.reason === 'Room not found'
          ? 'Room no longer available'
          : check.reason === 'Room is not available'
            ? 'Sorry, this room is not available for booking'
            : check.reason;
      return flashRedirect(request, '/rooms', 'error', msg);
    }
    const room = check.room;
    const nights = nightsBetween(checkInDate, checkOutDate);
    if (nights <= 0) return flashRedirect(request, back, 'error', 'Check-out date must be after check-in date');

    const reservation = new Reservation({
      room: room._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: parseInt(guests),
      roomRate: room.price,
      nights,
      totalAmount: room.price * nights,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: `Reservation created. Class room booking (${room.type}). Awaiting payment confirmation.`,
    });
    await reservation.save();

    // Send the confirmation in the background so the guest isn't kept waiting on the mail server
    Reservation.findById(reservation._id)
      .populate('room')
      .then((r) => sendReservationConfirmation(r))
      .then(() => console.log(`✅ Confirmation email sent to ${reservation.guestEmail}`))
      .catch((err) => console.error(`❌ Failed to send confirmation email to ${reservation.guestEmail}:`, err.message));

    return flashRedirect(
      request,
      `/rooms/guest-reservation/${reservation._id}`,
      'success',
      `Reservation received! Your confirmation number is ${reservation.confirmationCode}. A confirmation email is on its way to ${reservation.guestEmail}.`
    );
  } catch (error) {
    console.error('Confirm booking error:', error);
    const msg =
      error.name === 'ValidationError'
        ? `Validation error: ${Object.values(error.errors).map((e) => e.message).join(', ')}`
        : `Booking failed: ${error.message}`;
    return flashRedirect(request, back, 'error', msg);
  }
}
