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
    <div className="form-box" style={{ width: 550, margin: '0 auto' }}>
      <h2>Privacy Settings</h2>
      <p style={{ marginBottom: 10 }}>Control who can see your information.</p>

      <form action={updatePrivacyAction}>
        <table className="privacy-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Who Can See</th>
            </tr>
          </thead>
          <tbody>
            {fieldsConfig.map(([field, label]) => (
              <tr key={field}>
                <td>{label}</td>
                <td>
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
        <input type="submit" value="Save Settings" className="btn-primary" />
      </form>
    </div>
  );
}
