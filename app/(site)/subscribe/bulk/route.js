import dbConnect from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';
import { getCurrentUser } from '@/lib/session';
import { isAdminUser } from '@/lib/auth';

// POST /subscribe/bulk  { emails: [...], source } (admin only)
export async function POST(request) {
  if (!isAdminUser(await getCurrentUser())) return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  let body = {};
  try {
    body = await request.json();
  } catch {}
  const { emails, source = 'bulk-upload' } = body;
  if (!Array.isArray(emails) || emails.length === 0) {
    return Response.json({ success: false, message: 'Please provide an array of email addresses' }, { status: 400 });
  }
  await dbConnect();
  const results = { total: emails.length, added: 0, duplicates: 0, errors: 0, details: [] };
  for (const raw of emails) {
    const email = String(raw).trim().toLowerCase();
    try {
      if (!email.includes('@')) {
        results.errors++;
        results.details.push({ email: raw, status: 'invalid' });
        continue;
      }
      const existing = await Subscriber.findOne({ email });
      if (existing && existing.isActive) {
        results.duplicates++;
        results.details.push({ email: raw, status: 'duplicate' });
      } else if (existing) {
        existing.isActive = true;
        existing.source = source;
        await existing.save();
        results.added++;
        results.details.push({ email: raw, status: 'reactivated' });
      } else {
        await Subscriber.create({ email, source, metadata: { addedVia: 'bulk-upload' } });
        results.added++;
        results.details.push({ email: raw, status: 'added' });
      }
    } catch (error) {
      results.errors++;
      results.details.push({ email: raw, status: 'error', error: error.message });
    }
  }
  return Response.json({ success: true, message: `Bulk import completed: ${results.added} added, ${results.duplicates} duplicates`, results });
}
