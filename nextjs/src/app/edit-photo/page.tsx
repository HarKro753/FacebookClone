import { requireLogin } from '@/lib/auth';
import { uploadPhotoAction } from '@/actions/profile';
import { photoUrl } from '@/lib/utils';

export default async function EditPhotoPage() {
  const user = await requireLogin();
  return (
    <div className="bg-white border border-fb-light p-4 mb-2.5 w-[400px] mx-auto">
      <h2 className="text-[13px] text-fb-blue mb-2.5 border-b border-fb-light pb-1">Change Profile Photo</h2>

      <p>Current photo:</p>
      <p><img src={photoUrl(user.photo)} alt="" className="w-[150px] border border-[#999]" /></p>

      <form action={uploadPhotoAction} encType="multipart/form-data">
        <p><input type="file" name="photo" accept="image/jpeg,image/png,image/gif" /></p>
        <p className="text-[#666]">Maximum file size: 2MB. JPEG, PNG, or GIF.</p>
        <p><input type="submit" value="Upload Photo" className="bg-fb-blue text-white border-fb-dark font-bold hover:bg-fb-hover" /></p>
      </form>
    </div>
  );
}
