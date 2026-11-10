import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { guardAdmin } from '@/lib/auth';
import { readForm, flashRedirect } from '@/lib/http';

export async function POST(request) {
  const { user: me, response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const { username, email, password, confirmPassword, role, canCreateUsers } = await readForm(request);
  const back = '/admin/users/add';
  if (!username || !email || !password) return flashRedirect(request, back, 'error', 'All fields are required');
  if (password !== confirmPassword) return flashRedirect(request, back, 'error', 'Passwords do not match');
  if (password.length < 6) return flashRedirect(request, back, 'error', 'Password must be at least 6 characters');
  try {
    await dbConnect();
    if (await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] })) {
      return flashRedirect(request, back, 'error', 'User with this email or username already exists');
    }
    const isSuper = me.role === 'super-admin';
    // Only a super-admin can hand out roles or the user-management permission
    const newRole = isSuper && ['admin', 'super-admin'].includes(role) ? role : 'admin';
    await new User({ username, email, password, role: newRole, canCreateUsers: isSuper && canCreateUsers === 'true', isActive: true }).save();
    return flashRedirect(request, '/admin/users', 'success', `Admin user ${username} created successfully`);
  } catch (error) {
    console.error('Error creating user:', error);
    return flashRedirect(request, back, 'error', 'Failed to create user');
  }
}
