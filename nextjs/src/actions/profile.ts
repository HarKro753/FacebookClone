'use server';

import { redirect } from 'next/navigation';
import { requireLogin, setFlash } from '@/lib/auth';
import { dbRun } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function updateProfileAction(formData: FormData) {
  const me = await requireLogin();
  const first_name = (formData.get('first_name') as string || '').trim();
  const last_name = (formData.get('last_name') as string || '').trim();
  const sex = formData.get('sex') as string || null;
  let birthday = formData.get('birthday') as string || null;
  const phone = (formData.get('phone') as string || '').trim() || null;
  const relationship_status = formData.get('relationship_status') as string || null;
  const interested_in = formData.get('interested_in') as string || null;
  const political_views = (formData.get('political_views') as string || '').trim() || null;
  const house_id = formData.get('house_id') ? parseInt(formData.get('house_id') as string) : null;
  const class_year = formData.get('class_year') ? parseInt(formData.get('class_year') as string) : null;
  const concentration = (formData.get('concentration') as string || '').trim() || null;
  const interests = (formData.get('interests') as string || '').trim() || null;
  const favorite_music = (formData.get('favorite_music') as string || '').trim() || null;
  const favorite_movies = (formData.get('favorite_movies') as string || '').trim() || null;
  const favorite_books = (formData.get('favorite_books') as string || '').trim() || null;
  const favorite_quotes = (formData.get('favorite_quotes') as string || '').trim() || null;
  const about_me = (formData.get('about_me') as string || '').trim() || null;

  const errors: string[] = [];
  if (!first_name) errors.push('First name is required.');
  if (!last_name) errors.push('Last name is required.');

  if (birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    birthday = null;
  }

  if (errors.length > 0) {
    await setFlash('error', errors.join(' '));
    redirect('/edit-profile');
  }

  dbRun(
    `UPDATE users SET first_name=?, last_name=?, sex=?, birthday=?, phone=?,
     relationship_status=?, interested_in=?, political_views=?,
     house_id=?, class_year=?, concentration=?,
     interests=?, favorite_music=?, favorite_movies=?,
     favorite_books=?, favorite_quotes=?, about_me=?
     WHERE id=?`,
    first_name, last_name, sex, birthday, phone,
    relationship_status, interested_in, political_views,
    house_id, class_year, concentration,
    interests, favorite_music, favorite_movies,
    favorite_books, favorite_quotes, about_me,
    me.id
  );

  // Update courses
  dbRun('DELETE FROM user_courses WHERE user_id = ?', me.id);
  const courseIds = formData.getAll('courses');
  for (const cid of courseIds) {
    const id = parseInt(cid as string);
    if (id > 0) {
      dbRun('INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)', me.id, id);
    }
  }

  await setFlash('success', 'Profile updated successfully.');
  redirect(`/profile/${me.id}`);
}

export async function uploadPhotoAction(formData: FormData) {
  const me = await requireLogin();
  const photo = formData.get('photo') as File;
  if (!photo || photo.size === 0) {
    await setFlash('error', 'Please select a photo to upload.');
    redirect('/edit-photo');
  }

  const allowed = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowed.includes(photo.type)) {
    await setFlash('error', 'Only JPEG, PNG, and GIF images are allowed.');
    redirect('/edit-photo');
  }

  const maxSize = 2 * 1024 * 1024;
  if (photo.size > maxSize) {
    await setFlash('error', 'Photo must be under 2MB.');
    redirect('/edit-photo');
  }

  const extMap: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif' };
  const ext = extMap[photo.type];
  const filename = `user_${me.id}_${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const buffer = Buffer.from(await photo.arrayBuffer());
  fs.writeFileSync(path.join(uploadDir, filename), buffer);

  // Delete old photo if not default
  if (me.photo && me.photo !== 'default_photo.jpg') {
    const oldPath = path.join(uploadDir, me.photo);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  dbRun('UPDATE users SET photo = ? WHERE id = ?', filename, me.id);
  await setFlash('success', 'Profile photo updated.');
  redirect(`/profile/${me.id}`);
}
