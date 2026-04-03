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
    <div className="bg-fb-blue border-b border-fb-dark py-[5px]">
      <div className="w-[760px] mx-auto overflow-hidden">
        <div className="float-left">
          <Link href="/home" className="text-white text-base font-bold font-serif tracking-tight no-underline hover:no-underline">[ thefacebook ]</Link>
        </div>
        {currentUser && (
          <>
            <div className="float-left ml-5 pt-1">
              <Link href="/home" className="text-[#d8dfea] text-[11px] hover:text-white">home</Link>{' | '}
              <Link href={`/profile/${currentUser.id}`} className="text-[#d8dfea] text-[11px] hover:text-white">my profile</Link>{' | '}
              <Link href="/friends" className="text-[#d8dfea] text-[11px] hover:text-white">my friends</Link>{' | '}
              <Link href="/edit-profile" className="text-[#d8dfea] text-[11px] hover:text-white">edit</Link>{' | '}
              <Link href="/privacy" className="text-[#d8dfea] text-[11px] hover:text-white">privacy</Link>{' | '}
              <Link href="/browse" className="text-[#d8dfea] text-[11px] hover:text-white">browse</Link>{' | '}
              <Link href="/about" className="text-[#d8dfea] text-[11px] hover:text-white">about</Link>{' | '}
              <form action="/api/logout" method="POST" className="inline">
                <button type="submit" className="bg-transparent border-none text-[#d8dfea] cursor-pointer font-[inherit] text-[11px] p-0 hover:text-white hover:bg-transparent">logout</button>
              </form>
            </div>
            <div className="float-right pt-0.5">
              <form action="/search" method="get">
                <input type="text" name="q" placeholder="Search for people" size={18} className="text-[11px] px-1 py-0.5 border border-fb-dark" />
                <input type="submit" value="Search" className="text-[11px] px-2 py-0.5 bg-fb-light border border-[#999] cursor-pointer" />
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
