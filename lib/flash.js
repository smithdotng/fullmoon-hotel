import { cookies } from 'next/headers';

// One-shot messages carried across a redirect (replaces connect-flash).
// The cookie is readable by the browser so the <Flash> component can clear it
// once the message has been shown.
const FLASH_COOKIE = 'fm_flash';
const FORM_COOKIE = 'fm_form';

// Each request sets at most one message, so a new message replaces any old one
// that was never displayed.
export async function setFlash(type, message) {
  const store = await cookies();
  store.set(FLASH_COOKIE, JSON.stringify({ [type]: [message] }), { path: '/', sameSite: 'lax', maxAge: 60 });
}

export async function readFlash() {
  const store = await cookies();
  try {
    return JSON.parse(store.get(FLASH_COOKIE)?.value || '{}');
  } catch {
    return {};
  }
}

// Remember submitted form values so a form can be refilled after a failed submit
export async function setFormData(data) {
  const store = await cookies();
  const safe = {};
  for (const [k, v] of Object.entries(data || {})) if (typeof v === 'string') safe[k] = v.slice(0, 2000);
  store.set(FORM_COOKIE, JSON.stringify(safe), { path: '/', sameSite: 'lax', maxAge: 60 });
}

export async function readFormData() {
  const store = await cookies();
  try {
    return JSON.parse(store.get(FORM_COOKIE)?.value || '{}');
  } catch {
    return {};
  }
}

export const FLASH_COOKIE_NAMES = [FLASH_COOKIE, FORM_COOKIE];
