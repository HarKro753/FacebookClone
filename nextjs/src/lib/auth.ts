import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { dbGet, dbRun } from './db';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'thefacebook-2004-secret-key-change-in-production';
const COOKIE_NAME = 'fb_session';
const FLASH_COOKIE = 'fb_flash';

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  sex: string | null;
  birthday: string | null;
  phone: string | null;
  photo: string;
  relationship_status: string | null;
  interested_in: string | null;
  interests: string | null;
  favorite_music: string | null;
  favorite_movies: string | null;
  favorite_books: string | null;
  favorite_quotes: string | null;
  about_me: string | null;
  house_id: number | null;
  house_name: string | null;
  class_year: number | null;
  concentration: string | null;
  political_views: string | null;
  created_at: string;
  updated_at: string;
}

function signToken(userId: number): string {
  const payload = `${userId}.${Date.now()}`;
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

function verifyToken(token: string): number | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payload = `${parts[0]}.${parts[1]}`;
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(parts[2]))) return null;
  return parseInt(parts[0], 10);
}

export async function getCurrentUser(): Promise<UserRow | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session) return null;
  const userId = verifyToken(session.value);
  if (!userId) return null;
  const user = dbGet<UserRow>(
    `SELECT u.*, h.name AS house_name FROM users u LEFT JOIN houses h ON u.house_id = h.id WHERE u.id = ?`,
    userId
  );
  return user || null;
}

export async function requireLogin(): Promise<UserRow> {
  const user = await getCurrentUser();
  if (!user) redirect('/');
  return user;
}

export async function loginUser(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, signToken(userId), {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 86400,
  });
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(FLASH_COOKIE);
}

export async function setFlash(type: string, message: string) {
  const cookieStore = await cookies();
  cookieStore.set(FLASH_COOKIE, JSON.stringify({ type, message }), {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60,
  });
}

export async function getFlash(): Promise<{ type: string; message: string } | null> {
  const cookieStore = await cookies();
  const flash = cookieStore.get(FLASH_COOKIE);
  if (!flash) return null;
  try {
    return JSON.parse(flash.value);
  } catch {
    return null;
  }
}

// Next.js Server Actions have built-in CSRF protection,
// so we don't need a custom CSRF token system.

// Email validation pattern (harvard.edu and gmail.com)
export const ALLOWED_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@(([a-zA-Z0-9.-]+\.)?harvard\.edu|gmail\.com)$/i;
