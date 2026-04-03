'use server';

import { redirect } from 'next/navigation';
import { requireLogin, setFlash } from '@/lib/auth';
import { dbGet, dbRun } from '@/lib/db';

interface UserRow { id: number; first_name: string; last_name: string; }
interface IdRow { id: number; }

export async function friendAction(formData: FormData) {
  const me = await requireLogin();
  const otherId = parseInt(formData.get('user_id') as string || '0');
  const action = formData.get('action') as string || '';
  const redirectTo = formData.get('redirect') as string || `/profile/${otherId}`;

  if (!otherId || otherId === me.id) redirect('/home');

  const other = dbGet<UserRow>('SELECT id, first_name, last_name FROM users WHERE id = ?', otherId);
  if (!other) {
    await setFlash('error', 'User not found.');
    redirect('/home');
  }

  switch (action) {
    case 'add': {
      const existing = dbGet<IdRow>(
        'SELECT id FROM friends WHERE (requester_id = ? AND requested_id = ?) OR (requester_id = ? AND requested_id = ?)',
        me.id, otherId, otherId, me.id
      );
      if (!existing) {
        dbRun("INSERT INTO friends (requester_id, requested_id, status) VALUES (?, ?, 'pending')", me.id, otherId);
        await setFlash('success', `Friend request sent to ${other.first_name}.`);
      }
      break;
    }
    case 'accept':
      dbRun("UPDATE friends SET status = 'accepted' WHERE requester_id = ? AND requested_id = ? AND status = 'pending'", otherId, me.id);
      await setFlash('success', `You are now friends with ${other.first_name}.`);
      break;
    case 'reject':
      dbRun("UPDATE friends SET status = 'rejected' WHERE requester_id = ? AND requested_id = ? AND status = 'pending'", otherId, me.id);
      await setFlash('info', 'Friend request rejected.');
      break;
    case 'remove':
      dbRun('DELETE FROM friends WHERE (requester_id = ? AND requested_id = ?) OR (requester_id = ? AND requested_id = ?)', me.id, otherId, otherId, me.id);
      await setFlash('info', 'Removed from friends.');
      break;
  }

  redirect(redirectTo);
}
