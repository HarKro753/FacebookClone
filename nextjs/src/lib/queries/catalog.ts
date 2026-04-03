import { dbAll, dbGet } from '@/lib/db';

export interface House { id: number; name: string; }
export interface Course { id: number; code: string; title: string; professor?: string | null; }

export function getAllHouses() {
  return dbAll<House>('SELECT id, name FROM houses ORDER BY name');
}

export function getAllCourses() {
  return dbAll<Course>('SELECT id, code, title FROM courses ORDER BY code');
}

export function getUserCourseIds(userId: number) {
  return dbAll<{ course_id: number }>('SELECT course_id FROM user_courses WHERE user_id = ?', userId)
    .map(r => r.course_id);
}

export function getUserCourses(userId: number) {
  return dbAll<Course>(
    'SELECT c.* FROM courses c JOIN user_courses uc ON c.id = uc.course_id WHERE uc.user_id = ? ORDER BY c.code',
    userId
  );
}

export function getHouseName(id: number) {
  const row = dbGet<{ name: string }>('SELECT name FROM houses WHERE id = ?', id);
  return row?.name ?? null;
}

export function getCourseInfo(id: number) {
  return dbGet<{ code: string; title: string }>('SELECT code, title FROM courses WHERE id = ?', id);
}
