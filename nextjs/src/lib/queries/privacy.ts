import { dbGet, dbRun } from '@/lib/db';

export interface PrivacySettings { [key: string]: string; }

export function getPrivacySettings(userId: number) {
  return dbGet<PrivacySettings>('SELECT * FROM privacy_settings WHERE user_id = ?', userId);
}

export function ensurePrivacySettings(userId: number) {
  let settings = getPrivacySettings(userId);
  if (!settings) {
    dbRun('INSERT INTO privacy_settings (user_id) VALUES (?)', userId);
    settings = getPrivacySettings(userId)!;
  }
  return settings;
}
