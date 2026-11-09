import Reservation from '@/lib/models/Reservation';
import { reservationAction } from '@/lib/reservation-actions';

export const POST = reservationAction(async ({ reservation, body, user, Room }) => {
  if (reservation.status === 'checked-in') return { type: 'warning', message: 'Guest is already checked in' };
  if (!reservation.room) return { type: 'error', message: 'No room assigned to this reservation' };
  if (!reservation.room.available) {
    const conflict = await Reservation.findOne({ room: reservation.room._id, status: 'checked-in', _id: { $ne: reservation._id } });
    if (conflict) return { type: 'error', message: `Room ${reservation.room.roomNumber} is currently occupied` };
  }
  reservation.status = 'checked-in';
  reservation.actualCheckIn = body.checkInTime ? new Date(body.checkInTime) : new Date();
  reservation.checkedInBy = user.username;
  await reservation.save();
  await Room.findByIdAndUpdate(reservation.room._id, { available: false, currentOccupancy: reservation.guests || 1 });
  return { message: `Guest checked in successfully to Room ${reservation.room.roomNumber}` };
});
