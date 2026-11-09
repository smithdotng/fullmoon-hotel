import { redirect } from 'next/navigation';
import { requireManagerPage } from '@/lib/auth';
import dbConnect, { isValidId, plain } from '@/lib/db';
import Room from '@/lib/models/Room';
import RoomForm from '@/components/admin/RoomForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit Room' };

export default async function EditRoomPage({ params }) {
  await requireManagerPage();
  const { id } = await params;
  if (!isValidId(id)) redirect('/admin/rooms');
  await dbConnect();
  const room = plain(await Room.findById(id).lean());
  if (!room) redirect('/admin/rooms');
  return <RoomForm room={room} />;
}
