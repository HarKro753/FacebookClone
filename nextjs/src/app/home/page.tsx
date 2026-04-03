import { requireLogin } from '@/lib/auth';
import { dbAll } from '@/lib/db';
import { friendCount, pendingRequestCount, photoUrl, timeAgo } from '@/lib/utils';
import { pokeAction } from '@/actions/poke';
import { friendAction } from '@/actions/friend';
import Link from 'next/link';

interface PokeRow { poker_id: number; first_name: string; last_name: string; }
interface RequestRow { requester_id: number; first_name: string; last_name: string; photo: string; created_at: string; }
interface WallPostRow { author_id: number; first_name: string; last_name: string; body: string; created_at: string; }
interface FriendRow { id: number; first_name: string; last_name: string; photo: string; }

export default async function HomePage() {
  const user = await requireLogin();
  const pokes = dbAll<PokeRow>(
    `SELECT p.*, u.first_name, u.last_name FROM pokes p
     JOIN users u ON p.poker_id = u.id
     WHERE p.poked_id = ? AND p.seen = 0
     ORDER BY p.created_at DESC`,
    user.id
  );

  const requests = dbAll<RequestRow>(
    `SELECT f.*, u.first_name, u.last_name, u.photo FROM friends f
     JOIN users u ON f.requester_id = u.id
     WHERE f.requested_id = ? AND f.status = 'pending'
     ORDER BY f.created_at DESC LIMIT 5`,
    user.id
  );

  const wallPosts = dbAll<WallPostRow>(
    `SELECT w.*, u.first_name, u.last_name FROM wall_posts w
     JOIN users u ON w.author_id = u.id
     WHERE w.profile_id = ?
     ORDER BY w.created_at DESC LIMIT 10`,
    user.id
  );

  const numFriends = friendCount(user.id);
  const pendingCount = pendingRequestCount(user.id);

  const friendsList = dbAll<FriendRow>(
    `SELECT u.id, u.first_name, u.last_name, u.photo FROM users u
     JOIN friends f ON ((f.requester_id = u.id AND f.requested_id = ?) OR (f.requested_id = u.id AND f.requester_id = ?))
     WHERE f.status = 'accepted'
     ORDER BY RANDOM() LIMIT 9`,
    user.id, user.id
  );

  return (
    <>
      <div id="home-left">
        {pokes.length > 0 && (
          <div className="home-section">
            <h3>Pokes</h3>
            <div className="home-section-content">
              {pokes.map((poke) => (
                <div className="poke-item" key={poke.poker_id}>
                  <Link href={`/profile/${poke.poker_id}`}>{poke.first_name} {poke.last_name}</Link> poked you.{' '}
                  <form action={pokeAction} style={{ display: 'inline' }}>

                    <input type="hidden" name="user_id" value={poke.poker_id} />
                    <input type="submit" value="Poke Back" />
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length > 0 && (
          <div className="home-section">
            <h3>Friend Requests</h3>
            <div className="home-section-content">
              {requests.map((req) => (
                <div className="request-item" key={req.requester_id}>
                  <img src={photoUrl(req.photo)} alt="" />
                  <div className="request-info">
                    <Link href={`/profile/${req.requester_id}`}>{req.first_name} {req.last_name}</Link>
                    <div className="request-actions">
                      <form action={friendAction} style={{ display: 'inline' }}>
    
                        <input type="hidden" name="user_id" value={req.requester_id} />
                        <input type="hidden" name="action" value="accept" />
                        <input type="submit" value="Confirm" />
                      </form>{' '}
                      <form action={friendAction} style={{ display: 'inline' }}>
    
                        <input type="hidden" name="user_id" value={req.requester_id} />
                        <input type="hidden" name="action" value="reject" />
                        <input type="submit" value="Reject" />
                      </form>
                    </div>
                  </div>
                </div>
              ))}
              {pendingCount > 5 && <p><Link href="/friend-requests">See all requests</Link></p>}
            </div>
          </div>
        )}

        <div className="home-section">
          <h3>My Wall</h3>
          <div className="home-section-content">
            {wallPosts.length > 0 ? wallPosts.map((post, i) => (
              <div className="wall-post" key={i}>
                <span className="wall-author"><Link href={`/profile/${post.author_id}`}>{post.first_name} {post.last_name}</Link></span>{' '}
                <span className="wall-time">{timeAgo(post.created_at)}</span>
                <div className="wall-body" dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, '<br/>') }} />
              </div>
            )) : <p>No wall posts yet.</p>}
          </div>
        </div>
      </div>

      <div id="home-right">
        <div className="home-section">
          <h3>My Profile</h3>
          <div className="home-section-content" style={{ textAlign: 'center' }}>
            <Link href={`/profile/${user.id}`}>
              <img src={photoUrl(user.photo)} alt="" style={{ width: 100, border: '1px solid #999' }} />
            </Link>
            <p style={{ marginTop: 5 }}><b>{user.first_name} {user.last_name}</b></p>
            <p><Link href="/edit-profile">Edit My Profile</Link></p>
            <p><Link href="/edit-photo">Change Photo</Link></p>
          </div>
        </div>

        <div className="home-section">
          <h3>My Friends ({numFriends})</h3>
          <div className="home-section-content">
            {friendsList.length > 0 ? (
              <>
                <div className="friend-grid">
                  {friendsList.map((friend) => (
                    <div className="friend-card" key={friend.id} style={{ width: 65, margin: 3 }}>
                      <Link href={`/profile/${friend.id}`}>
                        <img src={photoUrl(friend.photo)} alt="" style={{ width: 50, height: 50 }} />
                      </Link>
                      <div className="friend-name" style={{ fontSize: 10 }}>
                        <Link href={`/profile/${friend.id}`}>{friend.first_name}</Link>
                      </div>
                    </div>
                  ))}
                </div>
                <p><Link href="/friends">See All Friends</Link></p>
              </>
            ) : (
              <p>You haven&apos;t added any friends yet. <Link href="/search">Find people</Link>.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ clear: 'both' }} />
    </>
  );
}
