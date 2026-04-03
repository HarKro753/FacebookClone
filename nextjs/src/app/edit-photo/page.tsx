import { requireLogin } from '@/lib/auth';
import { uploadPhotoAction } from '@/actions/profile';
import { photoUrl } from '@/lib/utils';

export default async function EditPhotoPage() {
  const user = await requireLogin();
  return (
    <div className="edit-section" style={{ width: 400, margin: '0 auto' }}>
      <h2>Change Profile Photo</h2>

      <p>Current photo:</p>
      <p><img src={photoUrl(user.photo)} alt="" style={{ width: 150, border: '1px solid #999' }} /></p>

      <form action={uploadPhotoAction} encType="multipart/form-data">
        <p><input type="file" name="photo" accept="image/jpeg,image/png,image/gif" /></p>
        <p style={{ color: '#666' }}>Maximum file size: 2MB. JPEG, PNG, or GIF.</p>
        <p><input type="submit" value="Upload Photo" className="btn-primary" /></p>
      </form>
    </div>
  );
}
