export default function AboutPage() {
  return (
    <div className="bg-white border border-fb-light p-5 leading-relaxed w-[600px] mx-auto">
      <h1 className="text-base text-fb-blue mb-4">About Thefacebook</h1>

      <p>Thefacebook is an online directory that connects people through social networks at colleges.</p>

      <p>We have opened up Thefacebook for popular consumption at Harvard University.</p>

      <p>You can use Thefacebook to:</p>
      <ul className="my-2.5 ml-6 leading-loose">
        <li>Search for people at your school</li>
        <li>Find out who are in your classes</li>
        <li>Look up your friends&apos; friends</li>
        <li>See a visualization of your social network</li>
      </ul>

      <h2 className="text-[13px] text-fb-blue mt-4 mb-1">How It Works</h2>
      <p>Thefacebook allows you to create a profile with your photo, personal information, interests, and course schedule. You can then search for and connect with other Harvard students. You control who can see your information through privacy settings.</p>

      <h2 className="text-[13px] text-fb-blue mt-4 mb-1">Privacy</h2>
      <p>No personal information that you provide to Thefacebook will be available to any user of the Web Site who does not belong to at least one of the groups specified by you in your privacy settings.</p>

      <h2 className="text-[13px] text-fb-blue mt-4 mb-1">Contact</h2>
      <p>Thefacebook was built by a Harvard student. If you have any questions or comments, please contact us.</p>

      <p className="mt-5 text-fb-muted">&copy; 2004 Thefacebook</p>
    </div>
  );
}
