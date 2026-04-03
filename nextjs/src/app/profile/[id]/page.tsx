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
    <div id="profile">
      <div id="profile-left">
        <div id="profile-photo">
          <img src={photoUrl(profile.photo)} alt={profile.first_name} />
        </div>

        {isOwn ? (
          <div className="profile-actions">
            <Link href="/edit-profile">Edit My Profile</Link><br />
            <Link href="/edit-photo">Change Photo</Link>
          </div>
        ) : (
          <div className="profile-actions">
            {(fStatus === null || fStatus === 'rejected') && (
              <form action={friendAction}>

                <input type="hidden" name="user_id" value={profileId} />
                <input type="hidden" name="action" value="add" />
                <input type="submit" value="Add as Friend" />
              </form>
            )}
            {fStatus === 'pending_sent' && <p>Friend request sent.</p>}
            {fStatus === 'pending_received' && (
              <form action={friendAction} style={{ display: 'inline' }}>

                <input type="hidden" name="user_id" value={profileId} />
                <input type="hidden" name="action" value="accept" />
                <input type="submit" value="Confirm Friend" />
              </form>
            )}
            {fStatus === 'accepted' && (
              <form action={friendAction}>

                <input type="hidden" name="user_id" value={profileId} />
                <input type="hidden" name="action" value="remove" />
                <input type="submit" value="Remove Friend" />
              </form>
            )}

            {canPoke && (
              <form action={pokeAction} style={{ marginTop: 5 }}>

                <input type="hidden" name="user_id" value={profileId} />
                <input type="submit" value="Poke!" />
              </form>
            )}
          </div>
        )}

        {profileFriends.length > 0 && (
          <div className="profile-section" style={{ marginTop: 10 }}>
            <h3>{profile.first_name}&apos;s Friends ({numFriends})</h3>
            <div className="profile-section-content">
              <div className="friend-grid">
                {profileFriends.map((friend) => (
                  <div className="friend-card" key={friend.id} style={{ width: 75, margin: 3 }}>
                    <Link href={`/profile/${friend.id}`}>
                      <img src={photoUrl(friend.photo)} alt="" style={{ width: 55, height: 55 }} />
                    </Link>
                    <div className="friend-name" style={{ fontSize: 10 }}>
                      <Link href={`/profile/${friend.id}`}>{friend.first_name}</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div id="profile-right">
        <div id="profile-info">
          <h1>{profile.first_name} {profile.last_name}</h1>
          {profile.house_name && <p>{profile.house_name}</p>}
          {profile.class_year && <p>Class of {profile.class_year}</p>}
          {profile.concentration && <p>{profile.concentration}</p>}
          <p>Member since {formatDate(profile.created_at)}</p>
        </div>

        {/* Contact Info */}
        <div className="profile-section">
          <h3>Contact Information</h3>
          <div className="profile-section-content">
            <table className="info-table">
              <tbody>
                {showEmail && profile.email && (
                  <tr><td className="info-label">Email:</td><td>{profile.email}</td></tr>
                )}
                {showPhone && profile.phone && (
                  <tr><td className="info-label">Phone:</td><td>{profile.phone}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Personal Info */}
        {showInterests && (
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-section-content">
              <table className="info-table">
                <tbody>
                  {profile.sex && <tr><td className="info-label">Sex:</td><td>{profile.sex}</td></tr>}
                  {showBirthday && profile.birthday && (
                    <tr><td className="info-label">Birthday:</td><td>{formatDate(profile.birthday)}</td></tr>
                  )}
                  {profile.relationship_status && <tr><td className="info-label">Relationship Status:</td><td>{profile.relationship_status}</td></tr>}
                  {profile.interested_in && <tr><td className="info-label">Interested In:</td><td>{profile.interested_in}</td></tr>}
                  {profile.political_views && <tr><td className="info-label">Political Views:</td><td>{profile.political_views}</td></tr>}
                  {profile.interests && <tr><td className="info-label">Interests:</td><td dangerouslySetInnerHTML={{ __html: profile.interests.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.favorite_music && <tr><td className="info-label">Favorite Music:</td><td dangerouslySetInnerHTML={{ __html: profile.favorite_music.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.favorite_movies && <tr><td className="info-label">Favorite Movies:</td><td dangerouslySetInnerHTML={{ __html: profile.favorite_movies.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.favorite_books && <tr><td className="info-label">Favorite Books:</td><td dangerouslySetInnerHTML={{ __html: profile.favorite_books.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.favorite_quotes && <tr><td className="info-label">Favorite Quotes:</td><td dangerouslySetInnerHTML={{ __html: profile.favorite_quotes.replace(/\n/g, '<br/>') }} /></tr>}
                  {profile.about_me && <tr><td className="info-label">About Me:</td><td dangerouslySetInnerHTML={{ __html: profile.about_me.replace(/\n/g, '<br/>') }} /></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses */}
        {courses.length > 0 && (
          <div className="profile-section">
            <h3>Courses</h3>
            <div className="profile-section-content">
              {courses.map((course) => (
                <div className="course-item" key={course.id}>
                  <Link href={`/browse?course_id=${course.id}`}>{course.code}</Link>
                  {' — '}{course.title}
                  {course.professor && ` (${course.professor})`}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The Wall */}
        <div className="profile-section">
          <h3>The Wall</h3>
          <div className="profile-section-content">
            {canPost && (
              <div className="wall-form">
                <form action={postWallAction}>

                  <input type="hidden" name="profile_id" value={profileId} />
                  <textarea name="body" placeholder={`Write on ${isOwn ? 'your' : profile.first_name + "'s"} wall...`} /><br />
                  <input type="submit" value="Post" />
                </form>
              </div>
            )}

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
    </div>
  );
}
