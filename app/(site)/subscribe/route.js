import dbConnect from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';
import { readForm } from '@/lib/http';

// POST /subscribe - newsletter sign-up (JSON in, JSON out)
export async function POST(request) {
  try {
    const body = await readForm(request);
    const email = String(body.email || '').trim().toLowerCase();
    const source = typeof body.source === 'string' ? body.source : 'website';
    if (!email || !email.includes('@')) {
      return Response.json({ success: false, message: 'Please enter a valid email address' }, { status: 400 });
    }
    await dbConnect();
    const existing = await Subscriber.findOne({ email });
    if (existing?.isActive) {
      return Response.json({ success: false, message: 'This email is already subscribed.' }, { status: 400 });
    }
    if (existing) {
      existing.isActive = true;
      existing.source = source;
      await existing.save();
    } else {
      await new Subscriber({ email, source }).save();
    }
    return Response.json({ success: true, message: 'Thank you for subscribing to our newsletter!' });
  } catch (error) {
    if (error.code === 11000) {
      return Response.json({ success: false, message: 'This email is already subscribed.' }, { status: 400 });
    }
    if (error.name === 'ValidationError') {
      return Response.json({ success: false, message: 'Please enter a valid email address' }, { status: 400 });
    }
    console.error('Subscription error:', error);
    return Response.json({ success: false, message: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}
