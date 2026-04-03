'use client';

import { useEffect, useState } from 'react';

export default function FlashMessage() {
  const [flash, setFlash] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    // Read flash cookie
    const match = document.cookie.match(/(?:^|;\s*)fb_flash=([^;]*)/);
    if (match) {
      try {
        const value = decodeURIComponent(match[1]);
        setFlash(JSON.parse(value));
      } catch { /* ignore */ }
      // Clear the cookie
      document.cookie = 'fb_flash=; path=/; max-age=0';
    }
  }, []);

  if (!flash) return null;
  return (
    <div className={`flash flash-${flash.type}`}>{flash.message}</div>
  );
}
