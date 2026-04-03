'use server';

import { redirect } from 'next/navigation';
import { requireLogin, setFlash } from '@/lib/auth';
import { dbGet, dbRun } from '@/lib/db';

export async function updatePrivacyAction(formData: FormData) {
  const me = await requireLogin();
  const fields = ['show_email', 'show_phone', 'show_birthday', 'show_courses', 'show_interests', 'show_wall', 'allow_wall_posts', 'allow_pokes'];
  const allowed = ['everyone', 'friends', 'nobody'];

  const sets: string[] = [];
  const params: (string | number)[] = [];

  for (const field of fields) {
    let val = formData.get(field) as string || 'friends';
    if (!allowed.includes(val)) val = 'friends';
    sets.push(`${field} = ?`);
    params.push(val);
  }

  params.push(me.id);

  // Ensure row exists
  const existing = dbGet('SELECT user_id FROM privacy_settings WHERE user_id = ?', me.id);
  if (!existing) {
    dbRun('INSERT INTO privacy_settings (user_id) VALUES (?)', me.id);
  }

  dbRun(`UPDATE privacy_settings SET ${sets.join(', ')} WHERE user_id = ?`, ...params);
  await setFlash('success', 'Privacy settings updated.');
  redirect('/privacy');
}
