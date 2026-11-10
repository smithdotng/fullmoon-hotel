import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

const DEV_SECRET = 'fullmoon-dev-only-session-secret-change-me-2024!!';

export const sessionOptions = {
  password: process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32 ? process.env.SESSION_SECRET : DEV_SECRET,
  cookieName: 'fm_session',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false',
    maxAge: 60 * 60 * 12, // 12 hours
  },
};

if (process.env.NODE_ENV === 'production' && sessionOptions.password === DEV_SECRET) {
  console.warn('⚠️  SESSION_SECRET is not set (or shorter than 32 characters). Set it in .env before going live.');
}

export async function getSession() {
  return getIronSession(await cookies(), sessionOptions);
}

// Logged-in staff user ({ _id, username, email, role, canCreateUsers }) or null
export async function getCurrentUser() {
  const session = await getSession();
  return session.user || null;
}
