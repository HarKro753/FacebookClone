import { requireLogin } from '@/lib/auth';
import { dbAll } from '@/lib/db';
import { photoUrl } from '@/lib/utils';
import Link from 'next/link';

interface UserRow {
  id: number; first_name: string; last_name: string; photo: string;
  class_year: number | null; concentration: string | null; house_name: string | null;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireLogin();
  const params = await searchParams;
  const query = (params.q || '').trim();
  let results: UserRow[] = [];

  if (query && query.length >= 2) {
    const like = `%${query}%`;
    results = dbAll<UserRow>(
      `SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
       FROM users u
       LEFT JOIN houses h ON u.house_id = h.id
       WHERE u.first_name LIKE ? OR u.last_name LIKE ? OR (u.first_name || ' ' || u.last_name) LIKE ?
       ORDER BY u.last_name, u.first_name
       LIMIT 50`,
      like, like, like
    );
  }

  return (
    <>
      <div className="form-box">
        <h2>Search for People</h2>
        <form method="get" action="/search">
          <input type="text" name="q" defaultValue={query} size={40} placeholder="Enter a name..." />
          <input type="submit" value="Search" />
        </form>
      </div>

      {query && (
        <div className="form-box">
          <h2>Results for &quot;{query}&quot; ({results.length})</h2>
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
          )) : (
            <p>No results found. Try a different search.</p>
          )}
        </div>
      )}
    </>
  );
}
