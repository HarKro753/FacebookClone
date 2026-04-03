import Link from 'next/link';

export default function Footer() {
  return (
    <div className="w-[760px] mx-auto my-5 py-2.5 border-t border-[#ccc] text-center text-fb-muted text-[10px]">
      <p className="my-[3px]">a Mark Zuckerberg production</p>
      <p className="my-[3px]"><Link href="/about" className="text-fb-muted">About</Link> | <Link href="/privacy" className="text-fb-muted">Privacy</Link></p>
      <p className="my-[3px]">&copy; 2004 thefacebook</p>
    </div>
  );
}
