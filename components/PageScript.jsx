'use client';
import { useEffect } from 'react';
import { themeReady, loadLibs } from './theme-loader';

// Runs a page's original inline <script> once the theme libraries are loaded.
// `src` loads a file from /public/js/pages (keeps top-level functions global, as
// the inline handlers expect); `code` runs an inline snippet.
export default function PageScript({ code, src, kind = 'site', libs }) {
  useEffect(() => {
    let cancelled = false;
    let el;
    themeReady(kind).then(() => loadLibs(libs)).then(() => {
      if (cancelled) return;
      if (src) {
        el = document.createElement('script');
        el.src = src;
        el.async = false;
        document.body.appendChild(el);
      } else if (code) {
        try {
          // eslint-disable-next-line no-new-func
          new Function(code)();
        } catch (err) {
          console.error('Page script error:', err);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code, src, kind, libs]);
  return null;
}
