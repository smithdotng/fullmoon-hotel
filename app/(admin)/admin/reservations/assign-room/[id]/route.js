import { isValidId } from '@/lib/db';
import { reservationAction, freeRoom } from '@/lib/reservation-actions';

export const POST = reservationAction(async ({ reservation, body, Room }) => {
  if (!body.roomId || !isValidId(body.roomId)) return { type: 'error', message: 'Please select a room' };
  const room = await Room.findById(body.roomId);
  if (!room || !room.available) return { type: 'error', message: 'Selected room is not available' };
  if (reservation.room && reservation.status === 'checked-in') await freeRoom(reservation.room._id);
  reservation.room = room._id;
  if (reservation.status === 'checked-in') await Room.findByIdAndUpdate(room._id, { available: false, currentOccupancy: reservation.guests || 1 });
  await reservation.save();
  return { message: `Room assigned: ${room.roomNumber} (${room.type})` };
});
