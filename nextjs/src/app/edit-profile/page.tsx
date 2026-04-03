import { requireLogin } from '@/lib/auth';
import { dbAll, dbGet } from '@/lib/db';
import { updateProfileAction } from '@/actions/profile';

interface House { id: number; name: string; }
interface Course { id: number; code: string; title: string; }
interface UserRow {
  id: number; first_name: string; last_name: string; sex: string | null; birthday: string | null;
  phone: string | null; relationship_status: string | null; interested_in: string | null;
  political_views: string | null; house_id: number | null; class_year: number | null;
  concentration: string | null; interests: string | null; favorite_music: string | null;
  favorite_movies: string | null; favorite_books: string | null; favorite_quotes: string | null;
  about_me: string | null; house_name: string | null;
}
interface CourseIdRow { course_id: number; }

export default async function EditProfilePage() {
  const me = await requireLogin();
  const houses = dbAll<House>('SELECT id, name FROM houses ORDER BY name');
  const allCourses = dbAll<Course>('SELECT id, code, title FROM courses ORDER BY code');
  const userCourseIds = dbAll<CourseIdRow>('SELECT course_id FROM user_courses WHERE user_id = ?', me.id).map(r => r.course_id);

  // Reload full user data
  const user = dbGet<UserRow>(
    'SELECT u.*, h.name AS house_name FROM users u LEFT JOIN houses h ON u.house_id = h.id WHERE u.id = ?',
    me.id
  )!;

  const statuses = ['Single', 'In a Relationship', 'Engaged', 'Married', "It's Complicated"];

  return (
    <div className="edit-section" style={{ width: 600, margin: '0 auto' }}>
      <h2>Edit My Profile</h2>

      <form action={updateProfileAction}>
        <h2>Basic Information</h2>
        <table className="form-table">
          <tbody>
            <tr><td className="label">First Name:</td><td><input type="text" name="first_name" defaultValue={user.first_name} /></td></tr>
            <tr><td className="label">Last Name:</td><td><input type="text" name="last_name" defaultValue={user.last_name} /></td></tr>
            <tr>
              <td className="label">Sex:</td>
              <td>
                <select name="sex" defaultValue={user.sex || ''}>
                  <option value="">-- Select --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </td>
            </tr>
            <tr><td className="label">Birthday:</td><td><input type="text" name="birthday" defaultValue={user.birthday || ''} placeholder="YYYY-MM-DD" /></td></tr>
            <tr><td className="label">Phone:</td><td><input type="text" name="phone" defaultValue={user.phone || ''} /></td></tr>
            <tr>
              <td className="label">Class Year:</td>
              <td>
                <select name="class_year" defaultValue={user.class_year?.toString() || ''}>
                  <option value="">-- Select --</option>
                  {[2007, 2006, 2005, 2004].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </td>
            </tr>
            <tr>
              <td className="label">House/Dorm:</td>
              <td>
                <select name="house_id" defaultValue={user.house_id?.toString() || ''}>
                  <option value="">-- Select --</option>
                  {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </td>
            </tr>
            <tr><td className="label">Concentration:</td><td><input type="text" name="concentration" defaultValue={user.concentration || ''} /></td></tr>
          </tbody>
        </table>

        <h2>Relationship</h2>
        <table className="form-table">
          <tbody>
            <tr>
              <td className="label">Status:</td>
              <td>
                <select name="relationship_status" defaultValue={user.relationship_status || ''}>
                  <option value="">-- Select --</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
            <tr>
              <td className="label">Interested In:</td>
              <td>
                <select name="interested_in" defaultValue={user.interested_in || ''}>
                  <option value="">-- Select --</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Both">Both</option>
                </select>
              </td>
            </tr>
            <tr><td className="label">Political Views:</td><td><input type="text" name="political_views" defaultValue={user.political_views || ''} /></td></tr>
          </tbody>
        </table>

        <h2>Personal</h2>
        <table className="form-table">
          <tbody>
            <tr><td className="label">Interests:</td><td><textarea name="interests" defaultValue={user.interests || ''} /></td></tr>
            <tr><td className="label">Favorite Music:</td><td><textarea name="favorite_music" defaultValue={user.favorite_music || ''} /></td></tr>
            <tr><td className="label">Favorite Movies:</td><td><textarea name="favorite_movies" defaultValue={user.favorite_movies || ''} /></td></tr>
            <tr><td className="label">Favorite Books:</td><td><textarea name="favorite_books" defaultValue={user.favorite_books || ''} /></td></tr>
            <tr><td className="label">Favorite Quotes:</td><td><textarea name="favorite_quotes" defaultValue={user.favorite_quotes || ''} /></td></tr>
            <tr><td className="label">About Me:</td><td><textarea name="about_me" defaultValue={user.about_me || ''} /></td></tr>
          </tbody>
        </table>

        <h2>Courses</h2>
        <p>Hold Ctrl/Cmd to select multiple courses.</p>
        <select name="courses" multiple size={10} style={{ width: 400 }} defaultValue={userCourseIds.map(String)}>
          {allCourses.map(c => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>

        <br /><br />
        <input type="submit" value="Save Changes" className="btn-primary" />
      </form>
    </div>
  );
}
