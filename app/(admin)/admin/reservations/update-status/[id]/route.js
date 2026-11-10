import { reservationAction, freeRoom } from '@/lib/reservation-actions';

const VALID = ['pending', 'confirmed', 'cancelled', 'checked-in', 'completed'];

export const POST = reservationAction(async ({ reservation, body, user, Room }) => {
  const { status } = body;
  if (!VALID.includes(status)) return { type: 'error', message: 'Invalid status' };
  const oldStatus = reservation.status;
  reservation.status = status;
  if (status === 'checked-in' && oldStatus !== 'checked-in') {
    reservation.actualCheckIn = new Date();
    reservation.checkedInBy = user.username;
    if (reservation.room) await Room.findByIdAndUpdate(reservation.room._id, { available: false, currentOccupancy: reservation.guests || 1 });
  } else if ((status === 'cancelled' || status === 'completed') && oldStatus === 'checked-in' && reservation.room) {
    await freeRoom(reservation.room._id);
  }
  await reservation.save();
  return { message: `Reservation status updated from ${oldStatus} to ${status}` };
});
