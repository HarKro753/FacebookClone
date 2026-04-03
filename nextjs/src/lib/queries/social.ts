import { dbAll } from '@/lib/db';

export interface PokeRow {
  poker_id: number; first_name: string; last_name: string;
}

export interface FriendRequestRow {
  requester_id: number; first_name: string; last_name: string;
  photo: string; created_at: string;
  class_year?: number | null; house_name?: string | null;
}

export interface WallPostRow {
  author_id: number; first_name: string; last_name: string;
  body: string; created_at: string;
}

export interface FriendRow {
  id: number; first_name: string; last_name: string; photo: string;
  concentration?: string | null; class_year?: number | null; house_name?: string | null;
}

export function getUnseenPokes(userId: number) {
  return dbAll<PokeRow>(
    `SELECT p.*, u.first_name, u.last_name FROM pokes p
     JOIN users u ON p.poker_id = u.id
     WHERE p.poked_id = ? AND p.seen = 0
     ORDER BY p.created_at DESC`,
    userId
  );
}

export function getPendingRequests(userId: number, limit?: number) {
  return dbAll<FriendRequestRow>(
    `SELECT f.*, u.first_name, u.last_name, u.photo FROM friends f
     JOIN users u ON f.requester_id = u.id
     WHERE f.requested_id = ? AND f.status = 'pending'
     ORDER BY f.created_at DESC${limit ? ` LIMIT ${limit}` : ''}`,
    userId
  );
}

export function getDetailedPendingRequests(userId: number) {
  return dbAll<FriendRequestRow>(
    `SELECT f.*, u.first_name, u.last_name, u.photo, u.class_year, h.name AS house_name
     FROM friends f
     JOIN users u ON f.requester_id = u.id
     LEFT JOIN houses h ON u.house_id = h.id
     WHERE f.requested_id = ? AND f.status = 'pending'
     ORDER BY f.created_at DESC`,
    userId
  );
}

export function getWallPosts(profileId: number, limit = 20) {
  return dbAll<WallPostRow>(
    `SELECT w.*, u.first_name, u.last_name FROM wall_posts w
     JOIN users u ON w.author_id = u.id
     WHERE w.profile_id = ?
     ORDER BY w.created_at DESC LIMIT ${limit}`,
    profileId
  );
}

export function getFriends(userId: number) {
  return dbAll<FriendRow>(
    `SELECT u.id, u.first_name, u.last_name, u.photo, u.concentration, u.class_year, h.name AS house_name
     FROM users u
     LEFT JOIN houses h ON u.house_id = h.id
     JOIN friends f ON ((f.requester_id = u.id AND f.requested_id = ?) OR (f.requested_id = u.id AND f.requester_id = ?))
     WHERE f.status = 'accepted'
     ORDER BY u.last_name, u.first_name`,
    userId, userId
  );
}

export function getRandomFriends(userId: number, limit = 6) {
  return dbAll<FriendRow>(
    `SELECT u.id, u.first_name, u.last_name, u.photo FROM users u
     JOIN friends f ON ((f.requester_id = u.id AND f.requested_id = ?) OR (f.requested_id = u.id AND f.requester_id = ?))
     WHERE f.status = 'accepted'
     ORDER BY RANDOM() LIMIT ${limit}`,
    userId, userId
  );
}
