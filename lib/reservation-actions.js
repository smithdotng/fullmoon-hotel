import dbConnect, { isValidId } from './db';
import Reservation from './models/Reservation';
import Room from './models/Room';
import { guardAdmin } from './auth';
import { readForm, flashRedirect } from './http';

// Shared wrapper for the reservation action endpoints: admin + user-manager only
// (as in the Express app), loads the reservation, runs the action, flashes the result.
export function reservationAction(action) {
  return async function POST(request, { params }) {
    const { user, response } = await guardAdmin(request, { manage: true });
    if (response) return response;
    const { id } = await params;
    const back = `/admin/reservations/${id}`;
    try {
      await dbConnect();
      const reservation = isValidId(id) ? await Reservation.findById(id).populate('room') : null;
      if (!reservation) return flashRedirect(request, '/admin/reservations', 'error', 'Reservation not found');
      const body = await readForm(request);
      const result = await action({ reservation, body, user, Room });
      return flashRedirect(request, result.redirect || back, result.type || 'success', result.message);
    } catch (error) {
      console.error('Reservation action error:', error);
      return flashRedirect(request, back, 'error', error.publicMessage || 'Action failed: ' + error.message);
    }
  };
}

export const freeRoom = (roomId) => Room.findByIdAndUpdate(roomId, { available: true, currentOccupancy: 0 });
