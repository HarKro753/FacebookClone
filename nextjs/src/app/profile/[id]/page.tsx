import { requireLogin } from '@/lib/auth';
import { getUserProfile } from '@/lib/queries/users';
import { getUserCourses } from '@/lib/queries/catalog';
import { getWallPosts, getRandomFriends } from '@/lib/queries/social';
import { friendshipStatus, canView, friendCount, photoUrl, timeAgo, formatDate } from '@/lib/utils';
import { friendAction } from '@/actions/friend';
import { pokeAction } from '@/actions/poke';
import { postWallAction } from '@/actions/wall';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireLogin();
  const { id } = await params;
  const profileId = parseInt(id);

  const profile = getUserProfile(profileId);
  if (!profile) notFound();

  const isOwn = me.id === profileId;
  const fStatus = friendshipStatus(me.id, profileId);

  const courses = (isOwn || canView(profileId, me.id, 'courses'))
    ? getUserCourses(profileId) : [];

  const wallPosts = (isOwn || canView(profileId, me.id, 'wall'))
    ? getWallPosts(profileId) : [];

  const canPost = isOwn || canView(profileId, me.id, 'wall_posts');
  const numFriends = friendCount(profileId);
  const profileFriends = getRandomFriends(profileId);

  const showInterests = isOwn || canView(profileId, me.id, 'interests');
  const showEmail = isOwn || canView(profileId, me.id, 'email');
  const showPhone = isOwn || canView(profileId, me.id, 'phone');
  const showBirthday = isOwn || canView(profileId, me.id, 'birthday');
  const canPoke = canView(profileId, me.id, 'pokes');

  return (
    <div className="overflow-hidden">
      <div className="float-left w-[200px]">
        <div className="w-[200px] mb-2.5">
          <img src={photoUrl(profile.photo)} alt={profile.first_name} className="w-[200px] border border-[#999]" />
        </div>

        {isOwn ? (
          <div className="my-2.5">
            <Link href="/edit-profile">Edit My Profile</Link><br />
            <Link href="/edit-photo">Change Photo</Link>
          </div>
        ) : (
          <div className="my-2.5">
            {(fStatus === null || fStatus === 'rejected') && (
              <form action={friendAction} className="inline">
                <input type="hidden" name="user_id" value={profileId} />
                <input type="hidden" name="action" value="add" />
                <input type="submit" value="Add as Friend" className="text-[11px] px-2 py-0.5 my-0.5" />
              </form>
            )}
            {fStatus === 'pending_sent' && <p>Friend request sent.</p>}
            {fStatus === 'pending_received' && (
              <form action={friendAction} className="inline">
                <input type="hidden" name="user_id" value={profileId} />
                <input type="hidden" name="action" value="accept" />
                <input type="submit" value="Confirm Friend" className="text-[11px] px-2 py-0.5 my-0.5" />
              </form>
            )}
            {fStatus === 'accepted' && (
              <form action={friendAction} className="inline">
                <input type="hidden" name="user_id" value={profileId} />
                <input type="hidden" name="action" value="remove" />
                <input type="submit" value="Remove Friend" className="text-[11px] px-2 py-0.5 my-0.5" />
              </form>
            )}

            {canPoke && (
              <form action={pokeAction} className="mt-1">
                <input type="hidden" name="user_id" value={profileId} />
                <input type="submit" value="Poke!" />
              </form>
            )}
          </div>
        )}

        {profileFriends.length > 0 && (
          <div className="bg-white border border-fb-light mb-2.5 mt-2.5">
            <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">{profile.first_name}&apos;s Friends ({numFriends})</h3>
            <div className="p-2.5">
              <div className="overflow-hidden">
                {profileFriends.map((friend) => (
                  <div className="float-left w-[75px] m-[3px] text-center" key={friend.id}>
                    <Link href={`/profile/${friend.id}`}>
                      <img src={photoUrl(friend.photo)} alt="" className="w-[55px] h-[55px]" />
                    </Link>
                    <div className="text-[10px]">
                      <Link href={`/profile/${friend.id}`}>{friend.first_name}</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="float-right w-[540px]">
        <div className="bg-white border border-fb-light px-4 py-2.5 mb-2.5">
          <h1 className="text-base text-fb-blue mb-1">{profile.first_name} {profile.last_name}</h1>
          {profile.house_name && <p>{profile.house_name}</p>}
          {profile.class_year && <p>Class of {profile.class_year}</p>}
          {profile.concentration && <p>{profile.concentration}</p>}
          <p>Member since {formatDate(profile.created_at)}</p>
        </div>

        {/* Contact Info */}
        <div className="bg-white border border-fb-light mb-2.5">
          <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">Contact Information</h3>
          <div className="p-2.5">
            <table className="w-full">
              <tbody>
                {showEmail && profile.email && (
                  <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Email:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg">{profile.email}</td></tr>
                )}
                {showPhone && profile.phone && (
                  <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Phone:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg">{profile.phone}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Personal Info */}
        {showInterests && (
          <div className="bg-white border border-fb-light mb-2.5">
            <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">Personal Information</h3>
            <div className="p-2.5">
              <table className="w-full">
                <tbody>
                  {profile.sex && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Sex:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg">{profile.sex}</td></tr>}
                  {showBirthday && profile.birthday && (
                    <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Birthday:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg">{formatDate(profile.birthday)}</td></tr>
                  )}
                  {profile.relationship_status && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Relationship Status:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg">{profile.relationship_status}</td></tr>}
                  {profile.interested_in && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Interested In:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg">{profile.interested_in}</td></tr>}
                  {profile.political_views && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Political Views:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg">{profile.political_views}</td></tr>}
                  {profile.interests && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Interests:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg" dangerouslySetInnerHTML={{ __html: profile.interests.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.favorite_music && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Favorite Music:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg" dangerouslySetInnerHTML={{ __html: profile.favorite_music.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.favorite_movies && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Favorite Movies:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg" dangerouslySetInnerHTML={{ __html: profile.favorite_movies.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.favorite_books && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Favorite Books:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg" dangerouslySetInnerHTML={{ __html: profile.favorite_books.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.favorite_quotes && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">Favorite Quotes:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg" dangerouslySetInnerHTML={{ __html: profile.favorite_quotes.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.about_me && <tr><td className="w-[130px] font-bold text-fb-label px-1 py-[3px] align-top border-b border-fb-bg">About Me:</td><td className="px-1 py-[3px] align-top border-b border-fb-bg" dangerouslySetInnerHTML={{ __html: profile.about_me.replace(/\n/g, '<br/>') }} /></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses */}
        {courses.length > 0 && (
          <div className="bg-white border border-fb-light mb-2.5">
            <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">Courses</h3>
            <div className="p-2.5">
              {courses.map((course) => (
                <div className="py-[3px]" key={course.id}>
                  <Link href={`/browse?course_id=${course.id}`} className="font-bold">{course.code}</Link>
                  {' — '}{course.title}
                  {course.professor && ` (${course.professor})`}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The Wall */}
        <div className="bg-white border border-fb-light mb-2.5">
          <h3 className="text-xs text-fb-blue bg-fb-light px-2.5 py-1 m-0">The Wall</h3>
          <div className="p-2.5">
            {canPost && (
              <div className="mt-2.5">
                <form action={postWallAction}>
                  <input type="hidden" name="profile_id" value={profileId} />
                  <textarea name="body" placeholder={`Write on ${isOwn ? 'your' : profile.first_name + "'s"} wall...`} className="!w-[95%] !h-[50px]" /><br />
                  <input type="submit" value="Post" />
                </form>
              </div>
            )}

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
    </div>
  );
}
