import { reservationAction } from '@/lib/reservation-actions';

export const POST = reservationAction(async ({ reservation, body, user }) => {
  reservation.paymentStatus = 'paid';
  reservation.paymentMethod = body.paymentMethod || 'manual';
  reservation.transactionId = body.transactionId || `MANUAL-${Date.now()}`;
  reservation.paidAmount = parseFloat(body.paymentAmount) || reservation.totalAmount;
  reservation.paymentConfirmedBy = user.username;
  reservation.paymentConfirmedAt = new Date();
  reservation.paidAt = reservation.paidAt || new Date();
  if (reservation.status === 'pending') reservation.status = 'confirmed';
  await reservation.save();
  return { message: `Payment confirmed for ₦${reservation.paidAmount.toLocaleString()}` };
});
