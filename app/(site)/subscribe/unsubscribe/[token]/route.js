import dbConnect from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';

export async function POST(request, { params }) {
  const { token } = await params;
  try {
    await dbConnect();
    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
    if (!subscriber) return Response.json({ success: false, message: 'Invalid unsubscribe link' }, { status: 404 });
    if (!subscriber.isActive) return Response.json({ success: true, message: 'You are already unsubscribed' });
    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
    return Response.json({ success: true, message: 'You have been successfully unsubscribed from our newsletter' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return Response.json({ success: false, message: 'Error processing unsubscribe request' }, { status: 500 });
  }
}
