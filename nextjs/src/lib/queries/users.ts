import { dbAll, dbGet } from '@/lib/db';

export interface UserProfile {
  id: number; email: string; first_name: string; last_name: string;
  sex: string | null; birthday: string | null; phone: string | null; photo: string;
  relationship_status: string | null; interested_in: string | null; interests: string | null;
  favorite_music: string | null; favorite_movies: string | null; favorite_books: string | null;
  favorite_quotes: string | null; about_me: string | null; political_views: string | null;
  house_name: string | null; class_year: number | null; concentration: string | null; created_at: string;
}

export interface UserEditData {
  id: number; first_name: string; last_name: string; sex: string | null; birthday: string | null;
  phone: string | null; relationship_status: string | null; interested_in: string | null;
  political_views: string | null; house_id: number | null; class_year: number | null;
  concentration: string | null; interests: string | null; favorite_music: string | null;
  favorite_movies: string | null; favorite_books: string | null; favorite_quotes: string | null;
  about_me: string | null; house_name: string | null;
}

export interface UserRow {
  id: number; first_name: string; last_name: string; photo: string;
  class_year: number | null; concentration: string | null; house_name: string | null;
}

export function getUserProfile(id: number) {
  return dbGet<UserProfile>(
    'SELECT u.*, h.name AS house_name FROM users u LEFT JOIN houses h ON u.house_id = h.id WHERE u.id = ?',
    id
  );
}

export function getUserEditData(id: number) {
  return dbGet<UserEditData>(
    'SELECT u.*, h.name AS house_name FROM users u LEFT JOIN houses h ON u.house_id = h.id WHERE u.id = ?',
    id
  );
}

export function searchUsers(query: string) {
  const like = `%${query}%`;
  return dbAll<UserRow>(
    `SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
     FROM users u LEFT JOIN houses h ON u.house_id = h.id
     WHERE u.first_name LIKE ? OR u.last_name LIKE ? OR (u.first_name || ' ' || u.last_name) LIKE ?
     ORDER BY u.last_name, u.first_name LIMIT 50`,
    like, like, like
  );
}

export function browseByHouse(houseId: number) {
  return dbAll<UserRow>(
    `SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
     FROM users u LEFT JOIN houses h ON u.house_id = h.id
     WHERE u.house_id = ? ORDER BY u.last_name, u.first_name LIMIT 100`,
    houseId
  );
}

export function browseByYear(year: number) {
  return dbAll<UserRow>(
    `SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
     FROM users u LEFT JOIN houses h ON u.house_id = h.id
     WHERE u.class_year = ? ORDER BY u.last_name, u.first_name LIMIT 100`,
    year
  );
}

export function browseByCourse(courseId: number) {
  return dbAll<UserRow>(
    `SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
     FROM users u LEFT JOIN houses h ON u.house_id = h.id
     JOIN user_courses uc ON uc.user_id = u.id
     WHERE uc.course_id = ? ORDER BY u.last_name, u.first_name LIMIT 100`,
    courseId
  );
}
