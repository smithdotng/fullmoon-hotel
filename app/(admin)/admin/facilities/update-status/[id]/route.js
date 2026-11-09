import dbConnect, { isValidId } from '@/lib/db';
import FacilityBooking from '@/lib/models/FacilityBooking';
import { guardAdmin } from '@/lib/auth';
import { readForm, flashRedirect } from '@/lib/http';

export async function POST(request, { params }) {
  const { response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const { id } = await params;
  const { status } = await readForm(request);
  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return flashRedirect(request, '/admin/facilities', 'error', 'Invalid status');
  }
  try {
    if (isValidId(id)) {
      await dbConnect();
      await FacilityBooking.findByIdAndUpdate(id, { status });
    }
    return flashRedirect(request, '/admin/facilities', 'success', `Booking status updated to ${status}`);
  } catch (error) {
    console.error(error);
    return flashRedirect(request, '/admin/facilities', 'error', 'Failed to update booking status');
  }
}
