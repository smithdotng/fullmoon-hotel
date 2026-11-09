import { requireManagerPage } from '@/lib/auth';
import RoomForm from '@/components/admin/RoomForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Add New Room' };

export default async function AddRoomPage() {
  await requireManagerPage();
  return <RoomForm room={null} />;
}
