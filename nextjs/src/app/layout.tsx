import './globals.css';
import { getCurrentUser } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FlashMessage from '@/components/FlashMessage';

export const metadata = {
  title: '[ thefacebook ]',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body>
        <Header currentUser={currentUser} />
        <div id="content">
          <FlashMessage />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
