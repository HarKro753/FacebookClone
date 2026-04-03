'use server';

import { redirect } from 'next/navigation';
import { requireLogin, setFlash } from '@/lib/auth';
import { dbGet, dbRun } from '@/lib/db';
import { canView } from '@/lib/utils';

interface IdRow { id: number; }

export async function postWallAction(formData: FormData) {
  const me = await requireLogin();
  const profileId = parseInt(formData.get('profile_id') as string || '0');
  const body = (formData.get('body') as string || '').trim();

  if (!profileId || !body) {
    await setFlash('error', 'Please write something.');
    redirect(`/profile/${profileId}`);
  }

  const profile = dbGet<IdRow>('SELECT id FROM users WHERE id = ?', profileId);
  if (!profile) {
    await setFlash('error', 'User not found.');
    redirect('/home');
  }

  const isOwn = me.id === profileId;
  if (!isOwn && !canView(profileId, me.id, 'wall_posts')) {
    await setFlash('error', 'You cannot post on this wall.');
    redirect(`/profile/${profileId}`);
  }

  dbRun('INSERT INTO wall_posts (profile_id, author_id, body) VALUES (?, ?, ?)', profileId, me.id, body);
  await setFlash('success', 'Wall post added.');
  redirect(`/profile/${profileId}`);
}
