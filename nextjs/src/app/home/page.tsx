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
      <div className="float-left w-[500px]">
        {pokes.length > 0 && (
          <div className="bg-white border border-fb-light mb-2.5">
            <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">Pokes</h3>
            <div className="p-2.5">
              {pokes.map((poke) => (
                <div className="py-1 border-b border-fb-bg last:border-b-0" key={poke.poker_id}>
                  <Link href={`/profile/${poke.poker_id}`}>{poke.first_name} {poke.last_name}</Link> poked you.{' '}
                  <form action={pokeAction} className="inline">
                    <input type="hidden" name="user_id" value={poke.poker_id} />
                    <input type="submit" value="Poke Back" />
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length > 0 && (
          <div className="bg-white border border-fb-light mb-2.5">
            <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">Friend Requests</h3>
            <div className="p-2.5">
              {requests.map((req) => (
                <div className="overflow-hidden py-2 border-b border-fb-bg" key={req.requester_id}>
                  <img src={photoUrl(req.photo)} alt="" className="float-left w-[50px] h-[50px] border border-[#999] mr-2.5" />
                  <div className="float-left">
                    <Link href={`/profile/${req.requester_id}`}>{req.first_name} {req.last_name}</Link>
                    <div className="mt-1">
                      <form action={friendAction} className="inline">
                        <input type="hidden" name="user_id" value={req.requester_id} />
                        <input type="hidden" name="action" value="accept" />
                        <input type="submit" value="Confirm" />
                      </form>{' '}
                      <form action={friendAction} className="inline">
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

        <div className="bg-white border border-fb-light mb-2.5">
          <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">My Wall</h3>
          <div className="p-2.5">
            {wallPosts.length > 0 ? wallPosts.map((post, i) => (
              <div className="py-2 border-b border-fb-bg last:border-b-0" key={i}>
                <span className="font-bold"><Link href={`/profile/${post.author_id}`}>{post.first_name} {post.last_name}</Link></span>{' '}
                <span className="text-fb-muted text-[10px]">{timeAgo(post.created_at)}</span>
                <div className="mt-[3px]" dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, '<br/>') }} />
              </div>
            )) : <p>No wall posts yet.</p>}
          </div>
        </div>
      </div>

      <div className="float-right w-[240px]">
        <div className="bg-white border border-fb-light mb-2.5">
          <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">My Profile</h3>
          <div className="p-2.5 text-center">
            <Link href={`/profile/${user.id}`}>
              <img src={photoUrl(user.photo)} alt="" className="w-[100px] border border-[#999]" />
            </Link>
            <p className="mt-1"><b>{user.first_name} {user.last_name}</b></p>
            <p><Link href="/edit-profile">Edit My Profile</Link></p>
            <p><Link href="/edit-photo">Change Photo</Link></p>
          </div>
        </div>

        <div className="bg-white border border-fb-light mb-2.5">
          <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">My Friends ({numFriends})</h3>
          <div className="p-2.5">
            {friendsList.length > 0 ? (
              <>
                <div className="overflow-hidden">
                  {friendsList.map((friend) => (
                    <div className="float-left w-[65px] m-[3px] text-center" key={friend.id}>
                      <Link href={`/profile/${friend.id}`}>
                        <img src={photoUrl(friend.photo)} alt="" className="w-[50px] h-[50px]" />
                      </Link>
                      <div className="text-[10px]">
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

      <div className="clear-both" />
    </>
  );
}
