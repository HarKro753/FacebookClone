'use client';

import { useEffect, useState } from 'react';

const flashStyles: Record<string, string> = {
  success: 'bg-fb-success-bg border-fb-success-border text-fb-success-text',
  error: 'bg-fb-error-bg border-fb-error-border text-fb-error-text',
  info: 'bg-fb-info-bg border-fb-info-border text-fb-info-text',
};

export default function FlashMessage() {
  const [flash, setFlash] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)fb_flash=([^;]*)/);
    if (match) {
      try {
        const value = decodeURIComponent(match[1]);
        setFlash(JSON.parse(value));
      } catch { /* ignore */ }
      document.cookie = 'fb_flash=; path=/; max-age=0';
    }
  }, []);

  if (!flash) return null;
  return (
    <div className={`px-3 py-2 mb-2.5 border ${flashStyles[flash.type] || ''}`}>
      {flash.message}
    </div>
  );
}
