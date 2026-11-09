'use client';
import { useEffect } from 'react';
import { themeReady } from './theme-loader';

export default function ThemeScripts({ kind = 'site' }) {
  useEffect(() => {
    themeReady(kind);
  }, [kind]);
  return null;
}
