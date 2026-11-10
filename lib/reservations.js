import dbConnect, { isValidId } from './db';
import Reservation from './models/Reservation';

// Reservation with its room, as plain objects with real Date values (for server rendering)
export async function getReservationForGuest(id) {
  if (!isValidId(id)) return null;
  await dbConnect();
  const reservation = await Reservation.findById(id).populate('room').lean();
  if (!reservation) return null;
  reservation._id = String(reservation._id);
  if (reservation.user) reservation.user = String(reservation.user);
  if (reservation.room) reservation.room._id = String(reservation.room._id);
  if (!reservation.room) {
    // Room was deleted after booking - keep the page usable
    reservation.room = { _id: '', type: 'Room', images: [], price: reservation.roomRate, roomNumber: '' };
  }
  return reservation;
}
