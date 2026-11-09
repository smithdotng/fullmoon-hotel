import dbConnect from '@/lib/db';
import Room from '@/lib/models/Room';
import { guardAdmin } from '@/lib/auth';
import { readForm, flashRedirect } from '@/lib/http';
import { roomData } from '@/lib/admin-forms';
import { saveImages } from '@/lib/uploads';

export async function POST(request) {
  const { response } = await guardAdmin(request, { manage: true });
  if (response) return response;
  const body = await readForm(request);
  if (!body.roomNumber || !body.type || !body.category || !body.price) {
    return flashRedirect(request, '/admin/rooms/add', 'error', 'Room Number, Type, Category, and Price are required');
  }
  try {
    await dbConnect();
    const data = roomData(body);
    const images = await saveImages(body.__formData, 'images', 'rooms');
    if (images.length) data.images = images;
    await new Room(data).save();
    return flashRedirect(request, '/admin/rooms', 'success', 'Room created successfully');
  } catch (error) {
    console.error('Error creating room:', error);
    return flashRedirect(request, '/admin/rooms/add', 'error', 'Failed to create room: ' + error.message);
  }
}
