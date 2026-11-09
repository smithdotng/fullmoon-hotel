import dbConnect, { isValidId } from '@/lib/db';
import FacilityBooking from '@/lib/models/FacilityBooking';
import { guardAdmin } from '@/lib/auth';
import { flashRedirect } from '@/lib/http';

export async function POST(request, { params }) {
  const { response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const { id } = await params;
  try {
    if (isValidId(id)) {
      await dbConnect();
      await FacilityBooking.findByIdAndDelete(id);
    }
    return flashRedirect(request, '/admin/facilities', 'success', 'Facility booking deleted successfully');
  } catch (error) {
    console.error(error);
    return flashRedirect(request, '/admin/facilities', 'error', 'Failed to delete facility booking');
  }
}
