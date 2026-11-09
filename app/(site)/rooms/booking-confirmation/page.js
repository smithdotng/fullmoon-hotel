import { redirect } from 'next/navigation';
import dbConnect, { isValidId, plain } from '@/lib/db';
import Room from '@/lib/models/Room';
import { readFlash } from '@/lib/flash';
import { canBookRoom, parseBookingDate, nightsBetween } from '@/lib/rooms';
import { longDate } from '@/lib/format';
import pageCss from '@/components/page-css/rooms_booking-confirmation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Confirm Booking - Full Moon Hotels",
};

// GET /rooms/booking-confirmation?roomId&checkIn=YYYY-MM-DD&checkOut&guests
// Invalid or unbookable requests go back to /rooms (the reason can't be flashed
// while rendering, so it's passed as ?notice= and shown there).
export default async function BookingConfirmationPage({ searchParams }) {
  const q = await searchParams;
  const messages = await readFlash();
  const { roomId, checkIn, checkOut, guests } = q;
  if (!roomId || !checkIn || !checkOut || !guests) redirect('/rooms?notice=missing');
  if (!isValidId(roomId)) redirect('/rooms?notice=invalid-room');
  const checkInDate = parseBookingDate(checkIn);
  const checkOutDate = parseBookingDate(checkOut);
  if (!checkInDate || !checkOutDate) redirect('/rooms?notice=invalid-date');
  await dbConnect();
  const check = await canBookRoom(roomId, checkInDate, checkOutDate);
  if (!check.canBook) redirect(`/rooms?notice=${encodeURIComponent(check.reason)}`);
  const room = plain(check.room.toObject());
  const nights = nightsBetween(checkInDate, checkOutDate);
  if (nights <= 0) redirect('/rooms?notice=invalid-date');
  const roomRatePerNight = room.price;
  const totalAmount = roomRatePerNight * nights;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
        <header>
          {/* ======================== Navigation ======================== */}
        </header>
        {/* ========================  Checkout ======================== */}
        <section className="page">
          {/* ===  Page header === */}
          <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
            <div className="container">
              <h2 className="title">
                Confirm your reservation
              </h2>
              <p>
                Guest information
              </p>
            </div>
          </div>
          {/* ===  Step wrapper === */}
          <div className="step-wrapper">
            <div className="container">
              <div className="stepper">
                <ul className="row">
                  <li className="col-md-4 active">
                    <a href="/rooms">
                      <span data-text="Room & rates" />
                    </a>
                  </li>
                  <li className="col-md-4 active">
                    <a href="#">
                      <span data-text="Reservation" />
                    </a>
                  </li>
                  <li className="col-md-4">
                    <a href="#">
                      <span data-text="Confirmation" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* ===  Checkout === */}
          <div className="checkout">
            <div className="container">
              <div className="clearfix">
                {/* ========================  Note block ======================== */}
                <div className="cart-wrapper">
                  <div className="note-block">
                    <div className="row">
                      {/* === left content === */}
                      <div className="col-md-8">
                        {/* Guest Information Form */}
                        <div className="white-block">
                          <div className="h4">
                            Guest Information
                          </div>
                          <hr />
                          {/* Flash Messages */}
                          
      {messages.error?.length > 0 && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                          {messages.error.join(' ')}{' '}
                          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">×</span>
                          </button>
                        </div>
                      )}
       
      {messages.success?.length > 0 && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                          {messages.success.join(' ')}{' '}
                          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">×</span>
                          </button>
                        </div>
                      )}
      
                          <form action="/rooms/confirm-booking" method="POST">
                            <input type="hidden" name="roomId" value={room._id} />
                            {' '}
                            <input type="hidden" name="checkIn" value={checkIn} />
                            {' '}
                            <input type="hidden" name="checkOut" value={checkOut} />
                            {' '}
                            <input type="hidden" name="guests" value={guests} />
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label">
                                    Full Name{' '}
                                    <span className="text-danger">
                                      *
                                    </span>
                                  </label>
                                  {' '}
                                  <input type="text" name="guestName" className="form-control" required placeholder="e.g. John Doe" />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label">
                                    Email{' '}
                                    <span className="text-danger">
                                      *
                                    </span>
                                  </label>
                                  {' '}
                                  <input type="email" name="guestEmail" className="form-control" required placeholder="john@example.com" />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label">
                                    Phone{' '}
                                    <span className="text-danger">
                                      *
                                    </span>
                                  </label>
                                  {' '}
                                  <input type="text" name="guestPhone" className="form-control" required placeholder="+234 800 000 0000" />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <hr />
                                <div className="text-center">
                                  <button type="submit" className="btn btn-main btn-lg">
                                    <i className="fa fa-check mr-2" />
                                    {' '}Confirm & Book (No Login Required)
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        {/* Important Information */}
                        <div className="white-block mt-4">
                          <div className="h4">
                            Important Information
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-md-6">
                              <ul className="list-unstyled">
                                <li className="mb-2">
                                  <i className="fa fa-check text-success mr-2" />
                                  Free cancellation up to 24 hours before check-in
                                </li>
                                <li className="mb-2">
                                  <i className="fa fa-check text-success mr-2" />
                                  Present ID at check-in
                                </li>
                                <li className="mb-2">
                                  <i className="fa fa-check text-success mr-2" />
                                  Early check-in available upon request
                                </li>
                                <li className="mb-2">
                                  <i className="fa fa-percent text-success mr-2" />
                                  All taxes and charges included
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6">
                              <ul className="list-unstyled">
                                <li className="mb-2">
                                  <i className="fa fa-clock-o text-primary mr-2" />
                                  Check-in: 2:00 PM
                                </li>
                                <li className="mb-2">
                                  <i className="fa fa-clock-o text-primary mr-2" />
                                  Check-out: 12:00 PM
                                </li>
                                <li className="mb-2">
                                  <i className="fa fa-phone text-primary mr-2" />
                                  Contact: +234 (0) 812 313 9279
                                </li>
                              </ul>
                            </div>
                          </div>
                          {/* Tax Information */}
                          <div className="alert alert-info mt-3">
                            <h5>
                              <i className="fa fa-info-circle" />
                              {' '}All-Inclusive Rate Information
                            </h5>
                            <p className="mb-0">
                              The displayed room rate is{' '}
                              <strong>
                                all-inclusive
                              </strong>
                              {' '}and already includes:
                            </p>
                            <ul className="mb-0 mt-2">
                              <li>
                                7.5% Value Added Tax (VAT)
                              </li>
                              <li>
                                5% Consumption Tax
                              </li>
                              <li>
                                10% Service Charge
                              </li>
                              <li>
                                Breakfast (unless discounts are applied)
                              </li>
                            </ul>
                            <p className="mb-0 mt-2">
                              <strong>
                                Note:
                              </strong>
                              {' '}The breakfast element shall be removed if discounts are applied on the same rates.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* /col-md-8 */}
                      {/* === right content === */}
                      <div className="col-md-4">
                        {/* Booking Summary */}
                        <div className="white-block">
                          <div className="h4">
                            Booking Summary
                          </div>
                          <hr />
                          {/* Room Details */}
                          <div className="cart-block cart-block-item clearfix">
                            <div className="image">
                              <a href={`/rooms/${room._id}`}>
                                
      <img src={room.images?.[0] || '/assets/images/room-default.jpg'} alt={room.type} />
      
                              </a>
                            </div>
                            <div className="title">
                              <div className="h4">
                                <a href={`/rooms/${room._id}`}>
                                  {room.type}
                                </a>
                              </div>
                              <div>
                                <strong>
                                  Check-in:
                                </strong>
                                {' '}{longDate(checkInDate)}
                              </div>
                              <div>
                                <strong>
                                  Check-out:
                                </strong>
                                {' '}{longDate(checkOutDate)}
                              </div>
                              <div>
                                <strong>
                                  Guests:
                                </strong>
                                {' '}{guests}
                              </div>
                              <div>
                                <strong>
                                  Nights:
                                </strong>
                                {' '}{nights}
                              </div>
                            </div>
                          </div>
                          {/* Price Breakdown */}
                          
      
      
                          <div className="clearfix mt-4">
                            <div className="cart-block cart-block-footer clearfix">
                              <div>
                                <strong>
                                  Room Rate (₦{roomRatePerNight.toLocaleString()} × {nights} nights)
                                </strong>
                                {' '}
                                <small className="text-muted d-block">
                                  <i className="fa fa-check-circle text-success" />
                                  {' '}All-inclusive rate
                                </small>
                              </div>
                              <div>
                                <span>
                                  ₦{totalAmount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            {/* Included Taxes Summary */}
                            <div className="cart-block cart-block-footer clearfix" style={{ backgroundColor: "#f8f9fa", borderLeft: "4px solid #28a745" }}>
                              <div>
                                <strong>
                                  <i className="fa fa-check text-success" />
                                  {' '}Included in Rate:
                                </strong>
                                {' '}
                                <small className="text-muted d-block">
                                  7.5% VAT + 5% Consumption Tax + 10% Service Charge
                                </small>
                              </div>
                              <div>
                                <span className="text-success">
                                  ✓ Included
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Final Price */}
                          <div className="clearfix">
                            <div className="cart-block cart-block-footer cart-block-footer-price clearfix">
                              <div>
                                <strong>
                                  Total Amount
                                </strong>
                                {' '}
                                <small className="text-muted d-block">
                                  All taxes and charges included
                                </small>
                              </div>
                              <div>
                                <div className="h2 title">
                                  ₦{totalAmount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Tax Note */}
                          <div className="small text-success mt-2">
                            <i className="fa fa-check-circle" />
                            {' '}This is the final price - no additional taxes or charges will be added
                          </div>
                        </div>
                      </div>
                      {/* /col-md-4 */}
                    </div>
                    {/* /row */}
                  </div>
                  {/* /note-block */}
                </div>
                {/* /cart-wrapper */}
                {/* ========================  Cart navigation ======================== */}
                <div className="clearfix">
                  <div className="cart-block cart-block-footer cart-block-footer-price clearfix">
                    <div>
                      <a href="/rooms" className="btn btn-clean-dark">
                        <span className="icon icon-chevron-left" />
                        {' '}Back to Rooms
                      </a>
                    </div>
                    <div>
                      <small className="text-muted d-block mb-2">
                        Best Rate Guaranteed - All Taxes Included
                      </small>
                      {' '}
                      <a href="/contact" className="btn btn-main">
                        Need Help? Contact Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* /clearfix */}
            </div>
            {/* /container */}
          </div>
          {/* /checkout */}
        </section>
        {/* ========================  Subscribe ======================== */}
        <section className="subscribe">
          <div className="container">
            <div className="box">
              <h2 className="title">
                Special Offers
              </h2>
              <div className="text">
                <p>
                  Subscribe to receive exclusive deals & promotions
                </p>
              </div>
              <div className="form-group">
                <input type="text" defaultValue="" placeholder="Your email" className="form-control" />
                {' '}
                <button className="btn btn-sm btn-main">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
