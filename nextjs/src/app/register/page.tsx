import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { registerAction } from "@/actions/auth";
import { getAllHouses } from "@/lib/queries/catalog";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ errors?: string; fields?: string }>;
}) {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect("/home");

  const houses = getAllHouses();
  const params = await searchParams;

  let errors: string[] = [];
  let fields: Record<string, string> = {
    first_name: "",
    last_name: "",
    email: "",
    sex: "",
    class_year: "",
    house_id: "",
  };

  if (params.errors) {
    try {
      errors = JSON.parse(params.errors);
    } catch {
      /* ignore */
    }
  }
  if (params.fields) {
    try {
      fields = { ...fields, ...JSON.parse(params.fields) };
    } catch {
      /* ignore */
    }
  }

  async function handleRegister(formData: FormData) {
    "use server";
    const result = await registerAction(formData);
    if (result?.errors) {
      const f = result.fields || {};
      redirect(
        `/register?errors=${encodeURIComponent(JSON.stringify(result.errors))}&fields=${encodeURIComponent(JSON.stringify(f))}`,
      );
    }
  }

  return (
    <div className="form-box" style={{ width: 500, margin: "0 auto" }}>
      <h2>Create Your Account</h2>
      <p style={{ marginBottom: 10 }}>
        You must have a valid <b>harvard.edu</b> or <b>gmail.com</b> email
        address to register.
      </p>

      {errors.length > 0 && (
        <div className="flash flash-error">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <form action={handleRegister}>
        <table className="form-table">
          <tbody>
            <tr>
              <td className="label">First Name:</td>
              <td>
                <input
                  type="text"
                  name="first_name"
                  defaultValue={fields.first_name}
                />
              </td>
            </tr>
            <tr>
              <td className="label">Last Name:</td>
              <td>
                <input
                  type="text"
                  name="last_name"
                  defaultValue={fields.last_name}
                />
              </td>
            </tr>
            <tr>
              <td className="label">Email:</td>
              <td>
                <input type="text" name="email" defaultValue={fields.email} />
              </td>
            </tr>
            <tr>
              <td className="label">Password:</td>
              <td>
                <input type="password" name="password" />
              </td>
            </tr>
            <tr>
              <td className="label">Confirm Password:</td>
              <td>
                <input type="password" name="password_confirm" />
              </td>
            </tr>
            <tr>
              <td className="label">Sex:</td>
              <td>
                <select name="sex" defaultValue={fields.sex}>
                  <option value="">-- Select --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="label">Class Year:</td>
              <td>
                <select name="class_year" defaultValue={fields.class_year}>
                  <option value="">-- Select --</option>
                  {[2007, 2006, 2005, 2004].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="label">House/Dorm:</td>
              <td>
                <select name="house_id" defaultValue={fields.house_id}>
                  <option value="">-- Select --</option>
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>
                <input type="submit" value="Register" className="btn-primary" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
