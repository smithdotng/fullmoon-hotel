import dbConnect, { isValidId } from '@/lib/db';
import User from '@/lib/models/User';
import { guardAdmin } from '@/lib/auth';
import { flashRedirect } from '@/lib/http';

// The users list links here to activate/deactivate an account
export async function POST(request, { params }) {
  const { user: me, response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const { id } = await params;
  if (id === me._id) return flashRedirect(request, '/admin/users', 'error', 'You cannot deactivate your own account');
  try {
    await dbConnect();
    const user = isValidId(id) ? await User.findById(id) : null;
    if (!user) return flashRedirect(request, '/admin/users', 'error', 'User not found');
    user.isActive = !user.isActive;
    await user.save();
    return flashRedirect(request, '/admin/users', 'success', `User ${user.username} ${user.isActive ? 'activated' : 'deactivated'}`);
  } catch (error) {
    console.error(error);
    return flashRedirect(request, '/admin/users', 'error', 'Failed to update user');
  }
}
