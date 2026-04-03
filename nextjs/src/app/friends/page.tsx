import { requireLogin } from '@/lib/auth';
import { getFriends } from '@/lib/queries/social';
import { pendingRequestCount, photoUrl } from '@/lib/utils';
import Link from 'next/link';

export default async function FriendsPage() {
  const me = await requireLogin();
  const friends = getFriends(me.id);
  const pendingCount = pendingRequestCount(me.id);

  return (
    <div className="bg-white border border-fb-light p-4 mb-4">
      <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">My Friends ({friends.length})</h2>

      {pendingCount > 0 && (
        <p className="mb-2.5">
          <Link href="/friend-requests"><b>{pendingCount} pending friend request{pendingCount > 1 ? 's' : ''}</b></Link>
        </p>
      )}

      {friends.length > 0 ? (
        <div className="overflow-hidden">
          {friends.map(friend => (
            <div className="float-left w-[120px] mx-2.5 my-1 mr-2.5 mb-2.5 text-center" key={friend.id}>
              <Link href={`/profile/${friend.id}`}>
                <img src={photoUrl(friend.photo)} alt="" className="w-[80px] h-[80px] border border-[#999]" />
              </Link>
              <div className="mt-[3px] text-[11px]">
                <Link href={`/profile/${friend.id}`}>{friend.first_name} {friend.last_name}</Link>
              </div>
              {friend.house_name && (
                <div className="text-[10px] text-[#666]">{friend.house_name}</div>
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
