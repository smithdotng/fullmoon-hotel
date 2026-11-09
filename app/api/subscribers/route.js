import dbConnect from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';
import { getCurrentUser } from '@/lib/session';
import { isAdminUser } from '@/lib/auth';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/subscribers?active=true|false|all&page&limit&sort&search&startDate&endDate (admin only)
export async function GET(request) {
  if (!isAdminUser(await getCurrentUser())) return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const q = Object.fromEntries(new URL(request.url).searchParams);
  const page = Math.max(1, parseInt(q.page) || 1);
  const limit = Math.min(500, Math.max(1, parseInt(q.limit) || 100));
  const query = {};
  const active = q.active || 'true';
  if (active !== 'all') query.isActive = active === 'true';
  if (q.search) query.email = { $regex: escapeRegex(q.search), $options: 'i' };
  if (q.startDate || q.endDate) {
    query.subscribedAt = {};
    if (q.startDate) query.subscribedAt.$gte = new Date(q.startDate);
    if (q.endDate) query.subscribedAt.$lte = new Date(q.endDate);
  }
  try {
    await dbConnect();
    const subscribers = await Subscriber.find(query)
      .sort(q.sort || '-subscribedAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .select('email subscribedAt source isActive');
    const total = await Subscriber.countDocuments(query);
    return Response.json({ success: true, count: subscribers.length, total, page, pages: Math.ceil(total / limit), subscribers, lastUpdated: new Date().toISOString() });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ success: false, message: 'Error fetching subscribers' }, { status: 500 });
  }
}
