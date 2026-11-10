import { requireManagerPage } from '@/lib/auth';
import FacilityForm from '@/components/admin/FacilityForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Add New Facility' };

export default async function AddFacilityPage() {
  await requireManagerPage();
  return <FacilityForm facility={null} />;
}
