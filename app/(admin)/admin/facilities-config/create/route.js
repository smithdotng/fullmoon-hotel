import dbConnect from '@/lib/db';
import Facility from '@/lib/models/Facility';
import { guardAdmin } from '@/lib/auth';
import { readForm, flashRedirect } from '@/lib/http';
import { facilityData } from '@/lib/admin-forms';
import { saveImages } from '@/lib/uploads';

export async function POST(request) {
  const { response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const body = await readForm(request);
  try {
    await dbConnect();
    const data = facilityData(body);
    const [image] = await saveImages(body.__formData, 'image', 'facilities', 1);
    if (image) data.image = image;
    await new Facility(data).save();
    return flashRedirect(request, '/admin/facilities-config', 'success', 'Facility created successfully');
  } catch (error) {
    console.error(error);
    const msg = error.code === 11000 ? 'A facility with this name already exists' : 'Failed to create facility: ' + error.message;
    return flashRedirect(request, '/admin/facilities-config/add', 'error', msg);
  }
}
