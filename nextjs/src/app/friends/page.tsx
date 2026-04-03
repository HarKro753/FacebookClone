import { requireLogin } from '@/lib/auth';
import { dbAll } from '@/lib/db';
import { pendingRequestCount, photoUrl } from '@/lib/utils';
import Link from 'next/link';

interface FriendRow {
  id: number; first_name: string; last_name: string; photo: string;
  concentration: string | null; class_year: number | null; house_name: string | null;
}

export default async function FriendsPage() {
  const me = await requireLogin();

  const friends = dbAll<FriendRow>(
    `SELECT u.id, u.first_name, u.last_name, u.photo, u.concentration, u.class_year, h.name AS house_name
     FROM users u
     LEFT JOIN houses h ON u.house_id = h.id
     JOIN friends f ON ((f.requester_id = u.id AND f.requested_id = ?) OR (f.requested_id = u.id AND f.requester_id = ?))
     WHERE f.status = 'accepted'
     ORDER BY u.last_name, u.first_name`,
    me.id, me.id
  );

  const pendingCount = pendingRequestCount(me.id);

  return (
    <div className="form-box">
      <h2>My Friends ({friends.length})</h2>

      {pendingCount > 0 && (
        <p style={{ marginBottom: 10 }}>
          <Link href="/friend-requests"><b>{pendingCount} pending friend request{pendingCount > 1 ? 's' : ''}</b></Link>
        </p>
      )}

      {friends.length > 0 ? (
        <div className="friend-grid">
          {friends.map(friend => (
            <div className="friend-card" key={friend.id}>
              <Link href={`/profile/${friend.id}`}>
                <img src={photoUrl(friend.photo)} alt="" />
              </Link>
              <div className="friend-name">
                <Link href={`/profile/${friend.id}`}>{friend.first_name} {friend.last_name}</Link>
              </div>
              {friend.house_name && (
                <div style={{ fontSize: 10, color: '#666' }}>{friend.house_name}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You don&apos;t have any friends yet. <Link href="/search">Find people</Link> to connect with.</p>
      )}
    </div>
  );
}
