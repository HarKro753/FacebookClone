import { requireLogin } from '@/lib/auth';
import { searchUsers } from '@/lib/queries/users';
import { photoUrl } from '@/lib/utils';
import Link from 'next/link';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireLogin();
  const params = await searchParams;
  const query = (params.q || '').trim();

  const results = (query && query.length >= 2) ? searchUsers(query) : [];

  return (
    <>
      <div className="bg-white border border-fb-light p-4 mb-4">
        <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">Search for People</h2>
        <form method="get" action="/search">
          <input type="text" name="q" defaultValue={query} size={40} placeholder="Enter a name..." />
          <input type="submit" value="Search" />
        </form>
      </div>

      {query && (
        <div className="bg-white border border-fb-light p-4 mb-4">
          <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">Results for &quot;{query}&quot; ({results.length})</h2>
          {results.length > 0 ? results.map(user => (
            <div className="overflow-hidden py-2 border-b border-fb-bg" key={user.id}>
              <img src={photoUrl(user.photo)} alt="" className="float-left w-[50px] h-[50px] border border-[#999] mr-2.5" />
              <div className="float-left">
                <div className="font-bold text-xs">
                  <Link href={`/profile/${user.id}`}>{user.first_name} {user.last_name}</Link>
                </div>
                <div className="text-[#666] mt-0.5">
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
