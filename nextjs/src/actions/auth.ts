'use server';

import { redirect } from 'next/navigation';
import { compareSync, hashSync } from 'bcryptjs';
import { dbGet, dbRun } from '@/lib/db';
import { loginUser, setFlash, ALLOWED_EMAIL_PATTERN } from '@/lib/auth';

interface UserRow {
  id: number;
  password_hash: string;
}

interface IdRow {
  id: number;
}

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string || '').trim();
  const password = formData.get('password') as string || '';

  if (!email || !password) {
    return { error: 'Please enter your email and password.' };
  }

  const user = dbGet<UserRow>('SELECT id, password_hash FROM users WHERE email = ?', email);
  if (user && compareSync(password, user.password_hash)) {
    await loginUser(user.id);
    redirect('/home');
  }

  return { error: 'Incorrect email or password.' };
}

export async function registerAction(formData: FormData) {
  const first_name = (formData.get('first_name') as string || '').trim();
  const last_name = (formData.get('last_name') as string || '').trim();
  const email = (formData.get('email') as string || '').trim();
  const password = formData.get('password') as string || '';
  const password_confirm = formData.get('password_confirm') as string || '';
  const sex = formData.get('sex') as string || '';
  const class_year = formData.get('class_year') as string || '';
  const house_id = formData.get('house_id') as string || '';

  const errors: string[] = [];

  if (!first_name) errors.push('First name is required.');
  if (!last_name) errors.push('Last name is required.');

  if (!email) {
    errors.push('Email is required.');
  } else if (!ALLOWED_EMAIL_PATTERN.test(email)) {
    errors.push('You must use a valid harvard.edu or gmail.com email address.');
  } else {
    const existing = dbGet<IdRow>('SELECT id FROM users WHERE email = ?', email);
    if (existing) errors.push('An account with this email already exists.');
  }

  if (!password) {
    errors.push('Password is required.');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }

  if (password !== password_confirm) {
    errors.push('Passwords do not match.');
  }

  if (errors.length > 0) {
    return { errors, fields: { first_name, last_name, email, sex, class_year, house_id } };
  }

  const hash = hashSync(password, 10);
  const houseIdNum = house_id ? parseInt(house_id) : null;
  const classYearNum = class_year ? parseInt(class_year) : null;
  const sexVal = sex || null;

  const result = dbRun(
    `INSERT INTO users (email, password_hash, first_name, last_name, sex, house_id, class_year) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    email, hash, first_name, last_name, sexVal, houseIdNum, classYearNum
  );

  const userId = Number(result.lastInsertRowid);
  dbRun('INSERT INTO privacy_settings (user_id) VALUES (?)', userId);

  await loginUser(userId);
  await setFlash('success', 'Welcome to Thefacebook! Start by editing your profile.');
  redirect('/edit-profile');
}

