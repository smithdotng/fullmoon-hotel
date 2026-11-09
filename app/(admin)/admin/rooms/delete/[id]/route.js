import dbConnect, { isValidId } from '@/lib/db';
import Room from '@/lib/models/Room';
import { guardAdmin } from '@/lib/auth';
import { flashRedirect } from '@/lib/http';

export async function POST(request, { params }) {
  const { response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const { id } = await params;
  try {
    if (isValidId(id)) {
      await dbConnect();
      await Room.findByIdAndDelete(id);
    }
    return flashRedirect(request, '/admin/rooms', 'success', 'Room deleted successfully');
  } catch (error) {
    console.error(error);
    return flashRedirect(request, '/admin/rooms', 'error', 'Failed to delete room');
  }
}
