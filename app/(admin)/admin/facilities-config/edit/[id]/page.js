import { redirect } from 'next/navigation';
import { requireManagerPage } from '@/lib/auth';
import dbConnect, { isValidId, plain } from '@/lib/db';
import Facility from '@/lib/models/Facility';
import FacilityForm from '@/components/admin/FacilityForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit Facility' };

export default async function EditFacilityPage({ params }) {
  await requireManagerPage();
  const { id } = await params;
  if (!isValidId(id)) redirect('/admin/facilities-config');
  await dbConnect();
  const facility = plain(await Facility.findById(id).lean());
  if (!facility) redirect('/admin/facilities-config');
  return <FacilityForm facility={facility} />;
}
