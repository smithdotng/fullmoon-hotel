import dbConnect, { isValidId } from '@/lib/db';
import FacilityBooking from '@/lib/models/FacilityBooking';
import { getCurrentUser } from '@/lib/session';
import { flashRedirect } from '@/lib/http';

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) return flashRedirect(request, '/login', 'error', 'Please login to book facilities');
  const { id } = await params;
  try {
    if (isValidId(id)) {
      await dbConnect();
      await FacilityBooking.updateOne({ _id: id, user: user._id }, { status: 'cancelled' });
    }
    return flashRedirect(request, '/facilities/my-bookings', 'success', 'Booking cancelled successfully');
  } catch (error) {
    console.error('Cancel error:', error);
    return flashRedirect(request, '/facilities/my-bookings', 'error', 'Failed to cancel booking');
  }
}
