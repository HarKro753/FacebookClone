import { requireLogin } from '@/lib/auth';
import { getDetailedPendingRequests } from '@/lib/queries/social';
import { photoUrl, timeAgo } from '@/lib/utils';
import { friendAction } from '@/actions/friend';
import Link from 'next/link';

export default async function FriendRequestsPage() {
  const me = await requireLogin();
  const requests = getDetailedPendingRequests(me.id);

  return (
    <div className="form-box">
      <h2>Friend Requests ({requests.length})</h2>

      {requests.length > 0 ? requests.map(req => (
        <div className="request-item" key={req.requester_id}>
          <img src={photoUrl(req.photo)} alt="" />
          <div className="request-info">
            <div>
              <Link href={`/profile/${req.requester_id}`}><b>{req.first_name} {req.last_name}</b></Link>
              {req.house_name && ` — ${req.house_name}`}
              {req.class_year && ` '${String(req.class_year).slice(-2)}`}
            </div>
            <div className="request-actions">
              <form action={friendAction} style={{ display: 'inline' }}>

                <input type="hidden" name="user_id" value={req.requester_id} />
                <input type="hidden" name="action" value="accept" />
                <input type="hidden" name="redirect" value="/friend-requests" />
                <input type="submit" value="Confirm" />
              </form>{' '}
              <form action={friendAction} style={{ display: 'inline' }}>

                <input type="hidden" name="user_id" value={req.requester_id} />
                <input type="hidden" name="action" value="reject" />
                <input type="hidden" name="redirect" value="/friend-requests" />
                <input type="submit" value="Reject" />
              </form>
            </div>
            <div style={{ color: '#999', fontSize: 10, marginTop: 3 }}>
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
