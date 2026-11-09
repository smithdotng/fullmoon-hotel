import dbConnect from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';
import { getCurrentUser } from '@/lib/session';
import { isAdminUser } from '@/lib/auth';

export async function GET() {
  if (!isAdminUser(await getCurrentUser())) return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const total = await Subscriber.countDocuments({ isActive: true });
    const todayCount = await Subscriber.countDocuments({ isActive: true, subscribedAt: { $gte: today } });
    const recent = await Subscriber.find({ isActive: true }).sort({ subscribedAt: -1 }).limit(10).select('email subscribedAt source');
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date();
      start.setMonth(start.getMonth() - i, 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      monthlyGrowth.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        count: await Subscriber.countDocuments({ subscribedAt: { $gte: start, $lt: end } }),
      });
    }
    const sourceDistribution = await Subscriber.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
    return Response.json({ success: true, total, today: todayCount, recent, monthlyGrowth, sourceDistribution, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Stats error:', error);
    return Response.json({ success: false, message: 'Error fetching statistics' }, { status: 500 });
  }
}
