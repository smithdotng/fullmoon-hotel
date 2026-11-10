import dbConnect, { isValidId } from '@/lib/db';
import User from '@/lib/models/User';
import { guardAdmin } from '@/lib/auth';
import { flashRedirect } from '@/lib/http';

export async function POST(request, { params }) {
  const { user: me, response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const { id } = await params;
  if (id === me._id) return flashRedirect(request, '/admin/users', 'error', 'You cannot delete your own account');
  try {
    if (isValidId(id)) {
      await dbConnect();
      await User.findByIdAndDelete(id);
    }
    return flashRedirect(request, '/admin/users', 'success', 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    return flashRedirect(request, '/admin/users', 'error', 'Failed to delete user');
  }
}
