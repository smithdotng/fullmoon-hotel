import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import FacilityBooking from '@/lib/models/FacilityBooking';
import { getCurrentUser } from '@/lib/session';
import { readFlash } from '@/lib/flash';
import Flash from '@/components/Flash';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'My Facility Bookings - Full Moon Hotels' };

const BADGE = { confirmed: 'success', cancelled: 'danger', completed: 'info' };

export default async function MyBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const messages = await readFlash();
  await dbConnect();
  const bookings = await FacilityBooking.find({ user: user._id }).sort({ createdAt: -1 }).lean();

  return (
    <main className="main-content" style={{ paddingTop: 160, paddingBottom: 60 }}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1>My Facility Bookings</h1>
            <Flash messages={messages} />
            {bookings.length === 0 ? (
              <div className="alert alert-info">
                <p>You haven&apos;t made any facility bookings yet.</p>
                <a href="/facilities" className="btn btn-main">
                  Explore Facilities
                </a>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div className="booking-card card mb-4" key={String(booking._id)}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-8">
                          <h4 className="card-title">{booking.facilityName}</h4>
                          <p className="card-text">
                            <strong>Date &amp; Time:</strong> {booking.bookingDate} {booking.bookingTime}
                            <br />
                            <strong>Duration:</strong> {booking.duration} hour(s)
                            <br />
                            {booking.guests > 1 && (
                              <>
                                <strong>Guests:</strong> {booking.guests}
                                <br />
                              </>
                            )}
                            <strong>Total Amount:</strong> ₦{booking.totalAmount}
                            <br />
                            <strong>Status:</strong>{' '}
                            <span className={`badge badge-${BADGE[booking.status] || 'warning'}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <br />
                            <strong>Booking Reference:</strong> {String(booking._id).slice(-8).toUpperCase()}
                          </p>
                          {booking.specialRequests && (
                            <p className="card-text">
                              <strong>Special Requests:</strong> {booking.specialRequests}
                            </p>
                          )}
                        </div>
                        <div className="col-md-4 text-right">
                          {booking.status === 'confirmed' && (
                            <form action={`/facilities/cancel-booking/${booking._id}`} method="POST" className="d-inline">
                              <button
                                type="submit"
                                className="btn btn-danger"
                                data-onclick="return confirm('Are you sure you want to cancel this booking?')"
                              >
                                Cancel Booking
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
