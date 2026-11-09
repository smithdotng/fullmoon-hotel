import { redirect } from 'next/navigation';
import { getCurrentUser } from './session';
import { setFlash } from './flash';
import { redirectTo } from './http';

export const isAdminUser = (u) => !!u && (u.role === 'admin' || u.role === 'super-admin');
export const canManageUsers = (u) => !!u && (u.role === 'super-admin' || u.canCreateUsers === true);
export const isSuperAdmin = (u) => !!u && u.role === 'super-admin';

// For pages: redirect away when the visitor lacks the permission.
// (Flash cookies can't be set while rendering, so the reason travels in the URL.)
export async function requireAdminPage() {
  const user = await getCurrentUser();
  if (!isAdminUser(user)) redirect('/login?denied=admin');
  return user;
}

export async function requireManagerPage() {
  const user = await requireAdminPage();
  if (!canManageUsers(user)) redirect('/admin?denied=manage');
  return user;
}

// For route handlers: returns { user } or { response } to send back.
export async function guardAdmin(request, { manage = false } = {}) {
  const user = await getCurrentUser();
  if (!isAdminUser(user)) {
    await setFlash('error', 'Please login as administrator to access this page');
    return { response: redirectTo(request, '/login') };
  }
  if (manage && !canManageUsers(user)) {
    await setFlash('error', 'You do not have permission to perform this action');
    return { response: redirectTo(request, '/admin') };
  }
  return { user };
}
