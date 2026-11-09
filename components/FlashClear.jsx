'use client';
import { useEffect } from 'react';

// Flash messages are read on the server while rendering; clear them once shown.
export default function FlashClear() {
  useEffect(() => {
    document.cookie = 'fm_flash=; Max-Age=0; path=/';
    document.cookie = 'fm_form=; Max-Age=0; path=/';
  }, []);
  return null;
}
