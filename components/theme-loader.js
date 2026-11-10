'use client';

// Loads the original jQuery theme scripts once, *after* React has hydrated the
// page, so jQuery plugins (owl carousel, datepicker, magnific popup...) never
// race React for the DOM. Pages link with plain <a> tags, so every page view is
// a fresh load and the theme initialises exactly as it did on the Express site.

import { SITE_SCRIPTS } from './theme-scripts';
export { SITE_SCRIPTS };

// The spinner never stays longer than this, even if a script is slow or fails
const LOADER_MAX_MS = 2500;
const hideLoader = () => document.querySelectorAll('.page-loader').forEach((el) => el.classList.add('loaded'));

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
        // An image fallback runs once, so a missing fallback image can't loop forever
        if (type === 'error') {
          if (el.dataset.fmErrorHandled) return;
          el.dataset.fmErrorHandled = '1';
        }
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
    const cap = setTimeout(hideLoader, LOADER_MAX_MS);
    // Insert them all at once: async=false scripts download in parallel but run in order.
    window[key] = Promise.all(list.map(loadScript)).then(() => {
      // main.js has now set up the carousels and widgets: reveal the page right away
      // (the theme itself waits for every image to finish plus one second).
      clearTimeout(cap);
      requestAnimationFrame(hideLoader);
    });
  }
  return window[key];
}
