import dbConnect from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isAdminUser } from '@/lib/auth';
import { buildSubscriberCsv, csvResponse } from '@/lib/subscribers';

// GET /subscribe/export?active=true|false|all&format=csv|json (admin only)
export async function GET(request) {
  if (!isAdminUser(await getCurrentUser())) return new Response('Unauthorized', { status: 401 });
  const { searchParams } = new URL(request.url);
  await dbConnect();
  const { csv, subscribers } = await buildSubscriberCsv(searchParams.get('active') || 'true');
  if (searchParams.get('format') === 'json') return Response.json({ success: true, count: subscribers.length, subscribers });
  return csvResponse(csv);
}
