import dbConnect, { isValidId } from '@/lib/db';
import Facility from '@/lib/models/Facility';
import { guardAdmin } from '@/lib/auth';
import { flashRedirect } from '@/lib/http';

export async function POST(request, { params }) {
  const { response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const { id } = await params;
  try {
    if (isValidId(id)) {
      await dbConnect();
      await Facility.findByIdAndDelete(id);
    }
    return flashRedirect(request, '/admin/facilities-config', 'success', 'Facility deleted successfully');
  } catch (error) {
    console.error(error);
    return flashRedirect(request, '/admin/facilities-config', 'error', 'Failed to delete facility');
  }
}
