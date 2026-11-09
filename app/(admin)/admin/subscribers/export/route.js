import dbConnect from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isAdminUser } from '@/lib/auth';
import { buildSubscriberCsv, csvResponse } from '@/lib/subscribers';
import { redirectTo } from '@/lib/http';

// GET /admin/subscribers/export - CSV download linked from the subscribers page
export async function GET(request) {
  if (!isAdminUser(await getCurrentUser())) return redirectTo(request, '/login');
  await dbConnect();
  const active = new URL(request.url).searchParams.get('active') || 'all';
  const { csv } = await buildSubscriberCsv(active);
  return csvResponse(csv);
}
