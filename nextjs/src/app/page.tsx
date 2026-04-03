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
    <div id="landing">
      <div id="landing-left">
        <h1>Welcome to Thefacebook</h1>
        <p>Thefacebook is an online directory that connects people through social networks at colleges.</p>
        <p>We have opened up Thefacebook for popular consumption at <b>Harvard University</b>.</p>
        <p>You can use Thefacebook to:</p>
        <ul>
          <li>Search for people at your school</li>
          <li>Find out who are in your classes</li>
          <li>Look up your friends&apos; friends</li>
          <li>See a visualization of your social network</li>
        </ul>

        <h2>To get started, you need a <b>harvard.edu</b> or <b>gmail.com</b> email address.</h2>
        <p><Link href="/register"><b>&raquo; Register now</b></Link></p>
      </div>
      <div id="landing-right">
        <div className="form-box">
          <h2>Login</h2>
          {params.error && <p className="error">{params.error}</p>}
          <form action={handleLogin}>
            <table className="form-table">
              <tbody>
                <tr>
                  <td className="label">Email:</td>
                  <td><input type="text" name="email" /></td>
                </tr>
                <tr>
                  <td className="label">Password:</td>
                  <td><input type="password" name="password" /></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td><input type="submit" value="Login" className="btn-primary" /></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}
