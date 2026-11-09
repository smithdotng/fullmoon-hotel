import { reservationAction, freeRoom } from '@/lib/reservation-actions';

export const POST = reservationAction(async ({ reservation, body, user }) => {
  reservation.status = 'cancelled';
  reservation.actualCheckOut = new Date();
  reservation.checkedOutBy = user.username;
  reservation.earlyCheckoutReason = body.reason;
  reservation.refundAmount = parseFloat(body.refundAmount) || 0;
  if (reservation.refundAmount > 0) reservation.paymentStatus = 'refunded';
  await reservation.save();
  if (reservation.room) await freeRoom(reservation.room._id);
  return { message: `Early check-out processed for Room ${reservation.room?.roomNumber || ''}` };
});
