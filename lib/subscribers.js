import Subscriber from './models/Subscriber';

export async function buildSubscriberCsv(active = 'true') {
  const query = active === 'all' ? {} : { isActive: active === 'true' };
  const subscribers = await Subscriber.find(query).sort({ subscribedAt: -1 }).select('email subscribedAt source isActive').lean();
  const csv =
    'Email,Subscription Date,Source,Status\n' +
    subscribers
      .map((s) => `${s.email},${new Date(s.subscribedAt).toISOString()},${s.source || ''},${s.isActive ? 'Active' : 'Inactive'}`)
      .join('\n');
  return { csv, subscribers };
}

export function csvResponse(csv) {
  const filename = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename=${filename}` },
  });
}
