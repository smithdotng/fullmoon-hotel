import dbConnect, { isValidId } from '@/lib/db';
import Facility from '@/lib/models/Facility';
import { guardAdmin } from '@/lib/auth';
import { flashRedirect } from '@/lib/http';

export async function POST(request, { params }) {
  const { response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const { id } = await params;
  try {
    await dbConnect();
    const facility = isValidId(id) ? await Facility.findById(id) : null;
    if (!facility) return flashRedirect(request, '/admin/facilities-config', 'error', 'Facility not found');
    facility.available = !facility.available;
    await facility.save();
    return flashRedirect(request, '/admin/facilities-config', 'success', `Facility ${facility.available ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    console.error(error);
    return flashRedirect(request, '/admin/facilities-config', 'error', 'Failed to update facility status');
  }
}
