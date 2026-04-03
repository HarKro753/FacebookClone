import Link from 'next/link';

interface HeaderProps {
  currentUser: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;
}

export default function Header({ currentUser }: HeaderProps) {
  return (
    <div id="header">
      <div id="header-inner">
        <div id="header-left">
          <Link href="/home" id="logo">[ thefacebook ]</Link>
        </div>
        {currentUser && (
          <>
            <div id="header-nav">
              <Link href="/home">home</Link>{' | '}
              <Link href={`/profile/${currentUser.id}`}>my profile</Link>{' | '}
              <Link href="/friends">my friends</Link>{' | '}
              <Link href="/edit-profile">edit</Link>{' | '}
              <Link href="/privacy">privacy</Link>{' | '}
              <Link href="/browse">browse</Link>{' | '}
              <Link href="/about">about</Link>{' | '}
              <form action="/api/logout" method="POST" style={{ display: 'inline' }}>
                <button type="submit" style={{
                  background: 'none', border: 'none', color: '#d8dfea',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: '11px', padding: 0,
                }}>logout</button>
              </form>
            </div>
            <div id="header-search">
              <form action="/search" method="get">
                <input type="text" name="q" placeholder="Search for people" size={18} />
                <input type="submit" value="Search" />
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
