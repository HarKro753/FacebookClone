import { requireLogin } from '@/lib/auth';
import { getUnseenPokes, getPendingRequests, getWallPosts, getRandomFriends } from '@/lib/queries/social';
import { friendCount, pendingRequestCount, photoUrl, timeAgo } from '@/lib/utils';
import { pokeAction } from '@/actions/poke';
import { friendAction } from '@/actions/friend';
import Link from 'next/link';

export default async function HomePage() {
  const user = await requireLogin();
  const pokes = getUnseenPokes(user.id);
  const requests = getPendingRequests(user.id, 5);
  const wallPosts = getWallPosts(user.id, 10);
  const numFriends = friendCount(user.id);
  const pendingCount = pendingRequestCount(user.id);
  const friendsList = getRandomFriends(user.id, 9);

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
