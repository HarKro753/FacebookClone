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
    <div className="bg-white border border-fb-light p-4 mb-4 w-[500px] mx-auto">
      <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">Create Your Account</h2>
      <p className="mb-2.5">
        You must have a valid <b>harvard.edu</b> or <b>gmail.com</b> email
        address to register.
      </p>

      {errors.length > 0 && (
        <div className="px-3 py-2 mb-2.5 border bg-fb-error-bg border-fb-error-border text-fb-error-text">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <form action={handleRegister}>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">First Name:</td>
              <td className="px-1 py-1 align-top">
                <input type="text" name="first_name" defaultValue={fields.first_name} />
              </td>
            </tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Last Name:</td>
              <td className="px-1 py-1 align-top">
                <input type="text" name="last_name" defaultValue={fields.last_name} />
              </td>
            </tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Email:</td>
              <td className="px-1 py-1 align-top">
                <input type="text" name="email" defaultValue={fields.email} />
              </td>
            </tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Password:</td>
              <td className="px-1 py-1 align-top">
                <input type="password" name="password" />
              </td>
            </tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Confirm Password:</td>
              <td className="px-1 py-1 align-top">
                <input type="password" name="password_confirm" />
              </td>
            </tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Sex:</td>
              <td className="px-1 py-1 align-top">
                <select name="sex" defaultValue={fields.sex}>
                  <option value="">-- Select --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">Class Year:</td>
              <td className="px-1 py-1 align-top">
                <select name="class_year" defaultValue={fields.class_year}>
                  <option value="">-- Select --</option>
                  {[2007, 2006, 2005, 2004].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="text-right w-[130px] font-bold text-fb-label pt-1.5 px-1 py-1 align-top">House/Dorm:</td>
              <td className="px-1 py-1 align-top">
                <select name="house_id" defaultValue={fields.house_id}>
                  <option value="">-- Select --</option>
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-1 py-1">&nbsp;</td>
              <td className="px-1 py-1">
                <input type="submit" value="Register" className="bg-fb-blue text-white border-fb-dark font-bold hover:bg-fb-hover" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
