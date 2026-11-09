'use client';

// Loads the original jQuery theme scripts once, *after* React has hydrated the
// page, so jQuery plugins (owl carousel, datepicker, magnific popup...) never
// race React for the DOM. Pages link with plain <a> tags, so every page view is
// a fresh load and the theme initialises exactly as it did on the Express site.

export const SITE_SCRIPTS = [
  '/js/jquery.min.js',
  '/js/jquery-ui.js',
  '/js/jquery.bootstrap.js',
  '/js/jquery.magnific-popup.js',
  '/js/jquery.owl.carousel.js',
  '/js/main.js',
];

export const ADMIN_SCRIPTS = ['https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'];

function loadScript(src) {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = resolve;
    s.onerror = () => {
      console.error('Failed to load', src);
      resolve();
    };
    document.body.appendChild(s);
  });
}

// Inline handlers (onclick="return confirm(...)") can't be React props, so the
// converted markup keeps them as data-onclick / data-onsubmit / data-onchange
// and this delegator runs them with the same semantics (return false cancels).
function installInlineHandlerShim() {
  if (window.__fmInlineShim) return;
  window.__fmInlineShim = true;
  for (const type of ['click', 'submit', 'change', 'input', 'keyup', 'error']) {
    document.addEventListener(
      type,
      (event) => {
        const attr = `data-on${type}`;
        const el = event.target instanceof Element ? event.target.closest(`[${attr}]`) : null;
        if (!el) return;
        try {
          const result = new Function('event', el.getAttribute(attr)).call(el, event);
          if (result === false) {
            event.preventDefault();
            event.stopPropagation();
          }
        } catch (err) {
          console.error(err);
        }
      },
      true
    );
  }
}

const loadedLibs = new Map();
// Extra per-page libraries (e.g. DataTables on the reservations page), loaded once each
export function loadLibs(libs = []) {
  return libs.reduce((chain, src) => {
    if (!loadedLibs.has(src)) loadedLibs.set(src, chain.then(() => loadScript(src)));
    return loadedLibs.get(src);
  }, Promise.resolve());
}

export function themeReady(kind = 'site') {
  if (typeof window === 'undefined') return Promise.resolve();
  installInlineHandlerShim();
  const key = `__fmReady_${kind}`;
  if (!window[key]) {
    const list = kind === 'admin' ? ADMIN_SCRIPTS : SITE_SCRIPTS;
    window[key] = (async () => {
      for (const src of list) await loadScript(src);
      // main.js hides the loader on window "load", which has usually fired by now
      setTimeout(() => document.querySelectorAll('.page-loader').forEach((el) => el.classList.add('loaded')), 400);
    })();
  }
  return window[key];
}
