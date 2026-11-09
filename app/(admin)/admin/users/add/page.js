import { requireManagerPage } from '@/lib/auth';
import UserForm from '@/components/admin/UserForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Add New Admin User' };

export default async function AddUserPage() {
  const currentUser = await requireManagerPage();
  return <UserForm currentUser={currentUser} />;
}
