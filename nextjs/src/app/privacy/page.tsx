import { requireLogin } from '@/lib/auth';
import { ensurePrivacySettings } from '@/lib/queries/privacy';
import { updatePrivacyAction } from '@/actions/privacy';

export default async function PrivacyPage() {
  const me = await requireLogin();
  const settings = ensurePrivacySettings(me.id);

  const fieldsConfig: [string, string][] = [
    ['show_email', 'Email Address'],
    ['show_phone', 'Phone Number'],
    ['show_birthday', 'Birthday'],
    ['show_courses', 'Courses'],
    ['show_interests', 'Personal Info & Interests'],
    ['show_wall', 'Wall (viewing)'],
    ['allow_wall_posts', 'Wall Posts (who can post)'],
    ['allow_pokes', 'Pokes (who can poke)'],
  ];

  return (
    <div className="bg-white border border-fb-light p-4 mb-4 w-[550px] mx-auto">
      <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">Privacy Settings</h2>
      <p className="mb-2.5">Control who can see your information.</p>

      <form action={updatePrivacyAction}>
        <table className="w-full bg-white border border-fb-light">
          <thead>
            <tr>
              <th className="bg-fb-light px-2.5 py-1 text-left text-xs text-fb-blue">Field</th>
              <th className="bg-fb-light px-2.5 py-1 text-left text-xs text-fb-blue">Who Can See</th>
            </tr>
          </thead>
          <tbody>
            {fieldsConfig.map(([field, label]) => (
              <tr key={field}>
                <td className="px-2.5 py-1 border-b border-fb-bg">{label}</td>
                <td className="px-2.5 py-1 border-b border-fb-bg">
                  <select name={field} defaultValue={settings[field] || 'friends'}>
                    <option value="everyone">Everyone</option>
                    <option value="friends">Friends Only</option>
                    <option value="nobody">No One</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <br />
        <input type="submit" value="Save Settings" className="bg-fb-blue text-white border-fb-dark font-bold hover:bg-fb-hover" />
      </form>
    </div>
  );
}
