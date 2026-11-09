import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { getSession } from '@/lib/session';
import { readForm, flashRedirect } from '@/lib/http';

// POST /api/auth/login - staff login form on /login
export async function POST(request) {
  const { username, password } = await readForm(request);
  if (!username || !password) return flashRedirect(request, '/login', 'error', 'Please enter both username/email and password');

  try {
    await dbConnect();
    const login = String(username).trim();
    let user = await User.findOne({ $or: [{ username: login }, { email: login.toLowerCase() }] });

    // Development convenience kept from the Express app: the first login as
    // superadmin / Admin@123 creates that account. Never in production.
    if (!user && process.env.NODE_ENV !== 'production') {
      if ((login === 'superadmin' || login === 'superadmin@fullmoonhotels.com') && password === 'Admin@123') {
        user = await new User({
          username: 'superadmin',
          email: 'superadmin@fullmoonhotels.com',
          password: 'Admin@123',
          role: 'super-admin',
          canCreateUsers: true,
          isActive: true,
        }).save();
      }
    }

    const invalid = 'Invalid credentials. Please check your username/email and password.';
    if (!user) return flashRedirect(request, '/login', 'error', invalid);
    if (!user.isActive) return flashRedirect(request, '/login', 'error', 'Your account has been deactivated. Please contact an administrator.');
    if (user.role !== 'admin' && user.role !== 'super-admin') {
      return flashRedirect(request, '/login', 'error', 'Admin access required. Please contact an administrator.');
    }
    if (!(await user.comparePassword(password))) return flashRedirect(request, '/login', 'error', invalid);

    const session = await getSession();
    session.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      canCreateUsers: user.canCreateUsers || false,
    };
    await session.save();
    return flashRedirect(request, '/admin', 'success', `Welcome back, ${user.username}!`);
  } catch (error) {
    console.error('Login error:', error);
    return flashRedirect(request, '/login', 'error', 'Login failed. Please try again.');
  }
}
