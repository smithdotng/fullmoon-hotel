// Google reCAPTCHA for public forms.
//
//   RECAPTCHA_SITE_KEY     public site key (rendered into the page)
//   RECAPTCHA_SECRET_KEY   secret key (server only)
//   RECAPTCHA_VERSION      "v3" (default, invisible, score-based) or "v2" (the "I'm not a robot" checkbox)
//   RECAPTCHA_MIN_SCORE    v3 only: lowest score accepted, 0.0–1.0 (default 0.5)
//
// The keys must match the type chosen when the site was registered at
// https://www.google.com/recaptcha/admin — a v2 key will not work as v3 or the other way round.

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export function recaptchaConfig() {
  const siteKey = (process.env.RECAPTCHA_SITE_KEY || '').trim();
  const secretKey = (process.env.RECAPTCHA_SECRET_KEY || '').trim();
  const version = (process.env.RECAPTCHA_VERSION || 'v3').trim().toLowerCase() === 'v2' ? 'v2' : 'v3';
  const minScore = Number.parseFloat(process.env.RECAPTCHA_MIN_SCORE);
  return {
    siteKey,
    secretKey,
    version,
    minScore: Number.isFinite(minScore) ? minScore : 0.5,
    enabled: Boolean(siteKey && secretKey),
  };
}

// What the page needs to render the widget (never includes the secret)
export function recaptchaClientConfig() {
  const { siteKey, version, enabled } = recaptchaConfig();
  return enabled ? { siteKey, version } : null;
}

export function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '').trim() || undefined;
}

// Returns { ok: true } or { ok: false, reason } where reason is 'missing' | 'failed' | 'error'.
export async function verifyRecaptcha(token, { action, ip } = {}) {
  const config = recaptchaConfig();
  if (!config.enabled) {
    if (config.siteKey || config.secretKey) {
      console.error('reCAPTCHA is half-configured: set both RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY.');
      return { ok: false, reason: 'error' };
    }
    console.warn('⚠️  reCAPTCHA keys not set: the contact form is not protected. Set RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY.');
    return { ok: true, skipped: true };
  }
  if (!token || typeof token !== 'string') return { ok: false, reason: 'missing' };

  let result;
  try {
    const body = new URLSearchParams({ secret: config.secretKey, response: token });
    if (ip) body.set('remoteip', ip);
    const res = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(8000), cache: 'no-store' });
    result = await res.json();
  } catch (error) {
    console.error('reCAPTCHA verification request failed:', error.message);
    return { ok: false, reason: 'error' };
  }

  if (!result.success) {
    console.warn('reCAPTCHA rejected:', result['error-codes']);
    return { ok: false, reason: 'failed' };
  }
  if (config.version === 'v3') {
    if (action && result.action !== action) {
      console.warn(`reCAPTCHA action mismatch: expected ${action}, got ${result.action}`);
      return { ok: false, reason: 'failed' };
    }
    if (typeof result.score === 'number' && result.score < config.minScore) {
      console.warn(`reCAPTCHA score ${result.score} below ${config.minScore}`);
      return { ok: false, reason: 'failed' };
    }
  }
  return { ok: true, score: result.score };
}
