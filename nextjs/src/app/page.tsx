import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { loginAction } from '@/actions/auth';
import Link from 'next/link';

export default async function LandingPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect('/home');

  const params = await searchParams;

  async function handleLogin(formData: FormData) {
    'use server';
    const result = await loginAction(formData);
    if (result?.error) {
      redirect(`/?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className="overflow-hidden mt-5">
      <div className="float-left w-[380px]">
        <h1 className="text-base text-fb-blue mb-2.5">Welcome to Thefacebook</h1>
        <p className="my-1 leading-relaxed">Thefacebook is an online directory that connects people through social networks at colleges.</p>
        <p className="my-1 leading-relaxed">We have opened up Thefacebook for popular consumption at <b>Harvard University</b>.</p>
        <p className="my-1 leading-relaxed">You can use Thefacebook to:</p>
        <ul className="my-1 ml-5 leading-relaxed">
          <li>Search for people at your school</li>
          <li>Find out who are in your classes</li>
          <li>Look up your friends&apos; friends</li>
          <li>See a visualization of your social network</li>
        </ul>

        <h2 className="text-[13px] text-fb-blue mt-4 mb-1">To get started, you need a <b>harvard.edu</b> or <b>gmail.com</b> email address.</h2>
        <p className="my-1"><Link href="/register"><b>&raquo; Register now</b></Link></p>
      </div>
      <div className="float-right w-[340px]">
        <div className="bg-white border border-fb-light p-4 mb-4">
          <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">Login</h2>
          {params.error && <p className="text-[#cc0000] text-[11px] my-[3px]">{params.error}</p>}
          <form action={handleLogin}>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1">Email:</td>
                  <td className="px-1 py-1"><input type="text" name="email" /></td>
                </tr>
                <tr>
                  <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1">Password:</td>
                  <td className="px-1 py-1"><input type="password" name="password" /></td>
                </tr>
                <tr>
                  <td className="px-1 py-1">&nbsp;</td>
                  <td className="px-1 py-1"><input type="submit" value="Login" className="bg-fb-blue text-white border-fb-dark font-bold hover:bg-fb-hover" /></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}
