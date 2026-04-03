import Link from 'next/link';

export default function Footer() {
  return (
    <div id="footer">
      <p>a Mark Zuckerberg production</p>
      <p><Link href="/about">About</Link> | <Link href="/privacy">Privacy</Link></p>
      <p>&copy; 2004 thefacebook</p>
    </div>
  );
}
