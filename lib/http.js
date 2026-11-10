import { NextResponse } from 'next/server';
import { setFlash } from './flash';

// 303 so the browser follows a POST with a GET, like res.redirect() did in Express
export function redirectTo(request, path) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

export async function flashRedirect(request, path, type, message) {
  if (message) await setFlash(type, message);
  return redirectTo(request, path);
}

// Read a POSTed form as a plain object (last value wins, like body-parser)
export async function readForm(request) {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try {
      return await request.json();
    } catch {
      return {};
    }
  }
  if (!ct.includes('multipart/form-data') && !ct.includes('application/x-www-form-urlencoded')) return {};
  const fd = await request.formData();
  const body = {};
  for (const [key, value] of fd.entries()) {
    if (typeof value === 'string') body[key] = value;
  }
  body.__formData = fd;
  return body;
}
