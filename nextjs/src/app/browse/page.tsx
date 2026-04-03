import { requireLogin } from '@/lib/auth';
import { dbAll, dbGet } from '@/lib/db';
import { photoUrl } from '@/lib/utils';
import BrowseSelect from '@/components/BrowseSelect';
import Link from 'next/link';

interface House { id: number; name: string; }
interface CourseRow { id: number; code: string; title: string; }
interface UserRow {
  id: number; first_name: string; last_name: string; photo: string;
  class_year: number | null; concentration: string | null; house_name: string | null;
}
interface NameRow { name: string; }
interface CourseInfo { code: string; title: string; }

export default async function BrowsePage({ searchParams }: { searchParams: Promise<{ house_id?: string; year?: string; course_id?: string }> }) {
  await requireLogin();
  const params = await searchParams;

  const houses = dbAll<House>('SELECT id, name FROM houses ORDER BY name');
  const courses = dbAll<CourseRow>('SELECT id, code, title FROM courses ORDER BY code');
  const years = [2004, 2005, 2006, 2007];

  const filterHouse = params.house_id ? parseInt(params.house_id) : 0;
  const filterYear = params.year ? parseInt(params.year) : 0;
  const filterCourse = params.course_id ? parseInt(params.course_id) : 0;

  let results: UserRow[] = [];
  let filterLabel = '';

  if (filterHouse) {
    const house = dbGet<NameRow>('SELECT name FROM houses WHERE id = ?', filterHouse);
    filterLabel = house ? house.name : 'Unknown House';
    results = dbAll<UserRow>(
      `SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
       FROM users u LEFT JOIN houses h ON u.house_id = h.id
       WHERE u.house_id = ? ORDER BY u.last_name, u.first_name LIMIT 100`,
      filterHouse
    );
  } else if (filterYear) {
    filterLabel = `Class of ${filterYear}`;
    results = dbAll<UserRow>(
      `SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
       FROM users u LEFT JOIN houses h ON u.house_id = h.id
       WHERE u.class_year = ? ORDER BY u.last_name, u.first_name LIMIT 100`,
      filterYear
    );
  } else if (filterCourse) {
    const course = dbGet<CourseInfo>('SELECT code, title FROM courses WHERE id = ?', filterCourse);
    filterLabel = course ? `${course.code} — ${course.title}` : 'Unknown Course';
    results = dbAll<UserRow>(
      `SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
       FROM users u LEFT JOIN houses h ON u.house_id = h.id
       JOIN user_courses uc ON uc.user_id = u.id
       WHERE uc.course_id = ? ORDER BY u.last_name, u.first_name LIMIT 100`,
      filterCourse
    );
  }

  return (
    <>
      <div className="form-box">
        <h2>Browse</h2>
        <div className="browse-filters">
          <BrowseSelect name="house_id" label="House" defaultValue={filterHouse ? String(filterHouse) : ''}>
            <option value="">-- All Houses --</option>
            {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </BrowseSelect>

          <BrowseSelect name="year" label="Year" defaultValue={filterYear ? String(filterYear) : ''}>
            <option value="">-- All Years --</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </BrowseSelect>

          <BrowseSelect name="course_id" label="Course" defaultValue={filterCourse ? String(filterCourse) : ''}>
            <option value="">-- All Courses --</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
          </BrowseSelect>
        </div>
      </div>

      {filterLabel ? (
        <div className="form-box">
          <h2>{filterLabel} ({results.length} people)</h2>
          {results.length > 0 ? results.map(user => (
            <div className="user-row" key={user.id}>
              <img src={photoUrl(user.photo)} alt="" />
              <div className="user-info">
                <div className="user-name">
                  <Link href={`/profile/${user.id}`}>{user.first_name} {user.last_name}</Link>
                </div>
                <div className="user-details">
                  {[
                    user.class_year ? `Class of ${user.class_year}` : null,
                    user.house_name,
                    user.concentration,
                  ].filter(Boolean).join(' \u00B7 ')}
                </div>
              </div>
            </div>
          )) : <p>No people found with this filter.</p>}
        </div>
      ) : (!filterHouse && !filterYear && !filterCourse) && (
        <div className="form-box">
          <p>Select a house, year, or course above to browse people.</p>
        </div>
      )}
    </>
  );
}
