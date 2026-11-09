import dbConnect, { isValidId } from '@/lib/db';
import Room from '@/lib/models/Room';
import { guardAdmin } from '@/lib/auth';
import { readForm, flashRedirect } from '@/lib/http';
import { roomData } from '@/lib/admin-forms';
import { saveImages } from '@/lib/uploads';

export async function POST(request, { params }) {
  const { response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const { id } = await params;
  if (!isValidId(id)) return flashRedirect(request, '/admin/rooms', 'error', 'Room not found');
  const body = await readForm(request);
  try {
    await dbConnect();
    const update = roomData(body);
    const images = await saveImages(body.__formData, 'images', 'rooms');
    if (images.length) update.$push = { images: { $each: images } };
    await Room.findByIdAndUpdate(id, update, { runValidators: true });
    return flashRedirect(request, '/admin/rooms', 'success', 'Room updated successfully');
  } catch (error) {
    console.error('Error updating room:', error);
    return flashRedirect(request, `/admin/rooms/edit/${id}`, 'error', 'Failed to update room: ' + error.message);
  }
}
