import { requireLogin } from '@/lib/auth';
import { getFriends } from '@/lib/queries/social';
import { pendingRequestCount, photoUrl } from '@/lib/utils';
import Link from 'next/link';

export default async function FriendsPage() {
  const me = await requireLogin();
  const friends = getFriends(me.id);
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
