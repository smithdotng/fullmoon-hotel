import Reservation from '@/lib/models/Reservation';
import { reservationAction, freeRoom } from '@/lib/reservation-actions';

export const POST = reservationAction(async ({ reservation }) => {
  if (reservation.status === 'checked-in' && reservation.room) await freeRoom(reservation.room._id);
  await Reservation.findByIdAndDelete(reservation._id);
  return { message: 'Reservation deleted successfully', redirect: '/admin/reservations' };
});
