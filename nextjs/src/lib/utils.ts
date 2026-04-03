import { dbGet } from './db';

export function timeAgo(datetime: string): string {
  const time = new Date(datetime + 'Z').getTime();
  const diff = Math.floor((Date.now() - time) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return `${m} minute${m > 1 ? 's' : ''} ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h} hour${h > 1 ? 's' : ''} ago`;
  }
  if (diff < 604800) {
    const d = Math.floor(diff / 86400);
    return `${d} day${d > 1 ? 's' : ''} ago`;
  }

  const date = new Date(datetime + 'Z');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function photoUrl(photo: string | null): string {
  if (!photo || photo === 'default_photo.jpg') {
    return '/images/default_photo.jpg';
  }
  return '/images/uploads/' + photo;
}

interface FriendRow {
  id: number;
}

export function isFriend(userId1: number, userId2: number): boolean {
  if (userId1 === userId2) return true;
  const row = dbGet<FriendRow>(
    `SELECT id FROM friends WHERE status = 'accepted' AND
     ((requester_id = ? AND requested_id = ?) OR (requester_id = ? AND requested_id = ?))`,
    userId1, userId2, userId2, userId1
  );
  return !!row;
}

interface FriendStatusRow {
  requester_id: number;
  status: string;
}

export function friendshipStatus(userId: number, otherId: number): string | null {
  if (userId === otherId) return 'self';
  const row = dbGet<FriendStatusRow>(
    `SELECT requester_id, status FROM friends WHERE
     (requester_id = ? AND requested_id = ?) OR (requester_id = ? AND requested_id = ?)`,
    userId, otherId, otherId, userId
  );
  if (!row) return null;
  if (row.status === 'accepted') return 'accepted';
  if (row.status === 'rejected') return 'rejected';
  if (row.status === 'pending') {
    return row.requester_id === userId ? 'pending_sent' : 'pending_received';
  }
  return null;
}

interface PrivacyRow {
  [key: string]: string;
}

export function canView(profileUserId: number, viewerId: number, field: string): boolean {
  if (profileUserId === viewerId) return true;

  const settings = dbGet<PrivacyRow>(
    `SELECT * FROM privacy_settings WHERE user_id = ?`,
    profileUserId
  );

  if (!settings) {
    return isFriend(profileUserId, viewerId);
  }

  let column = 'show_' + field;
  if (field === 'wall_posts' || field === 'pokes') {
    column = 'allow_' + field;
  }

  const visibility = settings[column];
  if (!visibility) return isFriend(profileUserId, viewerId);
  if (visibility === 'everyone') return true;
  if (visibility === 'nobody') return false;
  if (visibility === 'friends') return isFriend(profileUserId, viewerId);

  return false;
}

interface CountRow {
  cnt: number;
}

export function friendCount(userId: number): number {
  const row = dbGet<CountRow>(
    `SELECT COUNT(*) AS cnt FROM friends WHERE status = 'accepted' AND (requester_id = ? OR requested_id = ?)`,
    userId, userId
  );
  return row ? row.cnt : 0;
}

export function pendingRequestCount(userId: number): number {
  const row = dbGet<CountRow>(
    `SELECT COUNT(*) AS cnt FROM friends WHERE status = 'pending' AND requested_id = ?`,
    userId
  );
  return row ? row.cnt : 0;
}

export function unseenPokeCount(userId: number): number {
  const row = dbGet<CountRow>(
    `SELECT COUNT(*) AS cnt FROM pokes WHERE poked_id = ? AND seen = 0`,
    userId
  );
  return row ? row.cnt : 0;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'Z');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}
