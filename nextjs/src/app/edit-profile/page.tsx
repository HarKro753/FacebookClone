import { requireLogin } from '@/lib/auth';
import { getUserEditData } from '@/lib/queries/users';
import { getAllHouses, getAllCourses, getUserCourseIds } from '@/lib/queries/catalog';
import { updateProfileAction } from '@/actions/profile';

export default async function EditProfilePage() {
  const me = await requireLogin();
  const houses = getAllHouses();
  const allCourses = getAllCourses();
  const userCourseIds = getUserCourseIds(me.id);
  const user = getUserEditData(me.id)!;

  const statuses = ['Single', 'In a Relationship', 'Engaged', 'Married', "It's Complicated"];

  return (
    <div className="bg-white border border-fb-light p-4 mb-2.5 w-[600px] mx-auto">
      <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">Edit My Profile</h2>

      <form action={updateProfileAction}>
        <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">Basic Information</h2>
        <table className="w-full">
          <tbody>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">First Name:</td><td className="px-1 py-1 align-top"><input type="text" name="first_name" defaultValue={user.first_name} /></td></tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Last Name:</td><td className="px-1 py-1 align-top"><input type="text" name="last_name" defaultValue={user.last_name} /></td></tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Sex:</td>
              <td className="px-1 py-1 align-top">
                <select name="sex" defaultValue={user.sex || ''}>
                  <option value="">-- Select --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </td>
            </tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Birthday:</td><td className="px-1 py-1 align-top"><input type="text" name="birthday" defaultValue={user.birthday || ''} placeholder="YYYY-MM-DD" /></td></tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Phone:</td><td className="px-1 py-1 align-top"><input type="text" name="phone" defaultValue={user.phone || ''} /></td></tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Class Year:</td>
              <td className="px-1 py-1 align-top">
                <select name="class_year" defaultValue={user.class_year?.toString() || ''}>
                  <option value="">-- Select --</option>
                  {[2007, 2006, 2005, 2004].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </td>
            </tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">House/Dorm:</td>
              <td className="px-1 py-1 align-top">
                <select name="house_id" defaultValue={user.house_id?.toString() || ''}>
                  <option value="">-- Select --</option>
                  {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </td>
            </tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Concentration:</td><td className="px-1 py-1 align-top"><input type="text" name="concentration" defaultValue={user.concentration || ''} /></td></tr>
          </tbody>
        </table>

        <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1 mt-4">Relationship</h2>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Status:</td>
              <td className="px-1 py-1 align-top">
                <select name="relationship_status" defaultValue={user.relationship_status || ''}>
                  <option value="">-- Select --</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Interested In:</td>
              <td className="px-1 py-1 align-top">
                <select name="interested_in" defaultValue={user.interested_in || ''}>
                  <option value="">-- Select --</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Both">Both</option>
                </select>
              </td>
            </tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Political Views:</td><td className="px-1 py-1 align-top"><input type="text" name="political_views" defaultValue={user.political_views || ''} /></td></tr>
          </tbody>
        </table>

        <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1 mt-4">Personal</h2>
        <table className="w-full">
          <tbody>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Interests:</td><td className="px-1 py-1 align-top"><textarea name="interests" defaultValue={user.interests || ''} /></td></tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Favorite Music:</td><td className="px-1 py-1 align-top"><textarea name="favorite_music" defaultValue={user.favorite_music || ''} /></td></tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Favorite Movies:</td><td className="px-1 py-1 align-top"><textarea name="favorite_movies" defaultValue={user.favorite_movies || ''} /></td></tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Favorite Books:</td><td className="px-1 py-1 align-top"><textarea name="favorite_books" defaultValue={user.favorite_books || ''} /></td></tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Favorite Quotes:</td><td className="px-1 py-1 align-top"><textarea name="favorite_quotes" defaultValue={user.favorite_quotes || ''} /></td></tr>
            <tr><td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">About Me:</td><td className="px-1 py-1 align-top"><textarea name="about_me" defaultValue={user.about_me || ''} /></td></tr>
          </tbody>
        </table>

        <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1 mt-4">Courses</h2>
        <p>Hold Ctrl/Cmd to select multiple courses.</p>
        <select name="courses" multiple size={10} className="w-[400px]" defaultValue={userCourseIds.map(String)}>
          {allCourses.map(c => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>

        <br /><br />
        <input type="submit" value="Save Changes" className="bg-fb-blue text-white border-fb-dark font-bold hover:bg-fb-hover" />
      </form>
    </div>
  );
}
