'use server';

import { redirect } from 'next/navigation';
import { requireLogin, setFlash } from '@/lib/auth';
import { dbGet, dbRun } from '@/lib/db';
import { canView } from '@/lib/utils';

interface UserRow { id: number; first_name: string; }
interface IdRow { id: number; }

export async function pokeAction(formData: FormData) {
  const me = await requireLogin();
  const otherId = parseInt(formData.get('user_id') as string || '0');
  if (!otherId || otherId === me.id) redirect('/home');

  const other = dbGet<UserRow>('SELECT id, first_name FROM users WHERE id = ?', otherId);
  if (!other) {
    await setFlash('error', 'User not found.');
    redirect('/home');
  }

  if (!canView(otherId, me.id, 'pokes')) {
    await setFlash('error', 'You cannot poke this person.');
    redirect(`/profile/${otherId}`);
  }

  // Mark any existing poke from them as seen
  dbRun('UPDATE pokes SET seen = 1 WHERE poker_id = ? AND poked_id = ?', otherId, me.id);

  // Upsert poke
  const existing = dbGet<IdRow>('SELECT id FROM pokes WHERE poker_id = ? AND poked_id = ?', me.id, otherId);
  if (existing) {
    dbRun("UPDATE pokes SET seen = 0, created_at = datetime('now') WHERE poker_id = ? AND poked_id = ?", me.id, otherId);
  } else {
    dbRun('INSERT INTO pokes (poker_id, poked_id) VALUES (?, ?)', me.id, otherId);
  }

  await setFlash('success', `You poked ${other.first_name}!`);
  redirect(`/profile/${otherId}`);
}
