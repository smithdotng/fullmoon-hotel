import { reservationAction, freeRoom } from '@/lib/reservation-actions';

export const POST = reservationAction(async ({ reservation, body, user }) => {
  const wasCheckedIn = reservation.status === 'checked-in';
  reservation.status = 'cancelled';
  reservation.cancellationReason = body.cancellationReason;
  reservation.cancelledBy = user.username;
  reservation.cancelledAt = new Date();
  await reservation.save();
  if (wasCheckedIn && reservation.room) await freeRoom(reservation.room._id);
  return { message: 'Reservation cancelled successfully' };
});
