import { reservationAction, freeRoom } from '@/lib/reservation-actions';

export const POST = reservationAction(async ({ reservation, user }) => {
  if (reservation.status !== 'checked-in') return { type: 'warning', message: 'Guest is not checked in' };
  const actualCheckOut = new Date();
  let extraNights = 0;
  // Late departure: charge the extra nights at the booked rate
  if (actualCheckOut > reservation.checkOut) {
    extraNights = Math.ceil((actualCheckOut - reservation.checkOut) / (1000 * 60 * 60 * 24));
    const extraCharges = extraNights * reservation.roomRate;
    reservation.extraCharges = extraCharges;
    reservation.totalAmount += extraCharges;
  }
  reservation.status = 'completed';
  reservation.actualCheckOut = actualCheckOut;
  reservation.checkedOutBy = user.username;
  reservation.extraNights = extraNights;
  reservation.invoiceNumber = reservation.invoiceNumber || `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  await reservation.save();
  if (reservation.room) await freeRoom(reservation.room._id);
  return { message: `Guest checked out successfully from Room ${reservation.room?.roomNumber || ''}` };
});
