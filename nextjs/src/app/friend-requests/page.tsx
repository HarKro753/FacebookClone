import { requireLogin } from '@/lib/auth';
import { getDetailedPendingRequests } from '@/lib/queries/social';
import { photoUrl, timeAgo } from '@/lib/utils';
import { friendAction } from '@/actions/friend';
import Link from 'next/link';

export default async function FriendRequestsPage() {
  const me = await requireLogin();
  const requests = getDetailedPendingRequests(me.id);

  return (
    <div className="bg-white border border-fb-light p-4 mb-4">
      <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">Friend Requests ({requests.length})</h2>

      {requests.length > 0 ? requests.map(req => (
        <div className="overflow-hidden py-2 border-b border-fb-bg" key={req.requester_id}>
          <img src={photoUrl(req.photo)} alt="" className="float-left w-[50px] h-[50px] border border-[#999] mr-2.5" />
          <div className="float-left">
            <div>
              <Link href={`/profile/${req.requester_id}`}><b>{req.first_name} {req.last_name}</b></Link>
              {req.house_name && ` — ${req.house_name}`}
              {req.class_year && ` '${String(req.class_year).slice(-2)}`}
            </div>
            <div className="mt-1">
              <form action={friendAction} className="inline">
                <input type="hidden" name="user_id" value={req.requester_id} />
                <input type="hidden" name="action" value="accept" />
                <input type="hidden" name="redirect" value="/friend-requests" />
                <input type="submit" value="Confirm" />
              </form>{' '}
              <form action={friendAction} className="inline">
                <input type="hidden" name="user_id" value={req.requester_id} />
                <input type="hidden" name="action" value="reject" />
                <input type="hidden" name="redirect" value="/friend-requests" />
                <input type="submit" value="Reject" />
              </form>
            </div>
            <div className="text-fb-muted text-[10px] mt-[3px]">
              Sent {timeAgo(req.created_at)}
            </div>
          </div>
        </div>
      )) : (
        <p>No pending friend requests.</p>
      )}
    </div>
  );
}
