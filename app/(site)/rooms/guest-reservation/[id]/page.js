import { notFound } from 'next/navigation';
import { getReservationForGuest } from '@/lib/reservations';
import { readFlash } from '@/lib/flash';
import Flash from '@/components/Flash';
import pageCss from '@/components/page-css/rooms_guest-reservation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Booking Confirmed - Full Moon Hotels",
};

export default async function GuestReservationPage({ params }) {
  const { id } = await params;
  const reservation = await getReservationForGuest(id);
  if (!reservation) notFound();
  const messages = await readFlash();
  const nights = Math.ceil((reservation.checkOut - reservation.checkIn) / (1000 * 60 * 60 * 24));
  const roomRatePerNight = reservation.room.price;
  const totalAmount = reservation.totalAmount;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
        {/* ========================  Checkout ======================== */}
        <section className="page">
          {/* ===  Page header === */}
          <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
            <div className="container">
              <h2 className="title">
                Reservation completed
              </h2>
              <p>
                Thank you!
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
                  <li className="col-md-4 active">
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
              <Flash messages={messages} />
              <div className="clearfix">
                {/* ========================  Note block ======================== */}
                <div className="cart-wrapper">
                  <div className="note-block">
                    <div className="row">
                      {/* === left content === */}
                      <div className="col-md-6">
                        <div className="white-block">
                          <div className="h4">
                            Guest Information
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Full Name
                                </strong>
                                {' '}
                                <br />
                                {' '}
                                <span>
                                  {reservation.guestName}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Email
                                </strong>
                                <br />
                                {' '}
                                <span>
                                  {reservation.guestEmail}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Phone
                                </strong>
                                <br />
                                {' '}
                                <span>
                                  {reservation.guestPhone}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Booking Reference
                                </strong>
                                <br />
                                {' '}
                                <span className="text-primary">
                                  <strong>
                                    {reservation._id}
                                  </strong>
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Booking Status
                                </strong>
                                <br />
                                {' '}
                                <span className="badge badge-success">
                                  {reservation.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Booking Date
                                </strong>
                                <br />
                                {' '}
                                <span>
                                  {reservation.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* === right content === */}
                      <div className="col-md-6">
                        <div className="white-block">
                          <div className="h4">
                            Reservation Details
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Check-in Date
                                </strong>
                                {' '}
                                <br />
                                {' '}
                                <span>
                                  {reservation.checkIn.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Check-out Date
                                </strong>
                                {' '}
                                <br />
                                {' '}
                                <span>
                                  {reservation.checkOut.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Number of Nights
                                </strong>
                                {' '}
                                <br />
                                {' '}
      
      {' '}
                                <span>
                                  {nights}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Number of Guests
                                </strong>
                                {' '}
                                <br />
                                {' '}
                                <span>
                                  {reservation.guests}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="h4">
                            Payment Details
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Total Amount
                                </strong>
                                <br />
                                {' '}
                                <span className="h4 text-success">
                                  ₦{reservation.totalAmount.toLocaleString()}
                                </span>
                                {' '}
                                <small className="text-muted d-block">
                                  All taxes and charges included
                                </small>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Payment Status
                                </strong>
                                <br />
                                {' '}
                                <span className="badge badge-warning">
                                  AWAITING PAYMENT
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Room Type
                                </strong>
                                <br />
                                {' '}
                                <span>
                                  {reservation.room.type}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <strong>
                                  Rate Type
                                </strong>
                                <br />
                                {' '}
                                <span className="text-success">
                                  <i className="fa fa-check-circle" />
                                  {' '}All-Inclusive
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ========================  Cart wrapper ======================== */}
                <div className="cart-wrapper">
                  {/* cart header */}
                  <div className="cart-block cart-block-header clearfix">
                    <div>
                      <span>
                        Room Details
                      </span>
                    </div>
                    <div className="text-right">
                      <span>
                        Price
                      </span>
                    </div>
                  </div>
                  {/* cart items */}
                  <div className="clearfix">
                    <div className="cart-block cart-block-item clearfix">
                      <div className="image">
                        <a href={`/rooms/${reservation.room._id}`}>
                          
      <img loading="lazy" decoding="async" src={reservation.room.images?.[0] || '/assets/images/room-default.jpg'} alt={reservation.room.type} />
      
                        </a>
                      </div>
                      <div className="title">
                        <div className="h2">
                          <a href={`/rooms/${reservation.room._id}`}>
                            {reservation.room.type}
                          </a>
                        </div>
                        <div>
                          <strong>
                            Check-in Date
                          </strong>
                          {' '}
                          <span>
                            ({reservation.checkIn.toLocaleDateString()})
                          </span>
                        </div>
                        <div>
                          <strong>
                            Check-out Date
                          </strong>
                          {' '}
                          <span>
                            ({reservation.checkOut.toLocaleDateString()})
                          </span>
                        </div>
                        <div>
                          <strong>
                            Guests
                          </strong>
                          {' '}{reservation.guests} Person(s)
                        </div>
                        <div>
                          <strong>
                            Nights
                          </strong>
                          {' '}{nights}
                        </div>
                        <div>
                          <strong>
                            Room Number
                          </strong>
                          {' '}{reservation.room.roomNumber}
                        </div>
                        <div className="text-success mt-2">
                          <i className="fa fa-check-circle" />
                          {' '}
                          <strong>
                            All-inclusive rate includes:
                          </strong>
                        </div>
                        <div className="text-muted ml-3">
                          • 7.5% VAT + 5% Consumption Tax + 10% Service Charge
                          <br />
                          {' '}• Complimentary breakfast for one
                        </div>
                      </div>
                      <div className="price">
                        <span className="final h3">
                          ₦ {reservation.totalAmount.toLocaleString()}
                        </span>
                        {' '}
                        <span className="discount text-success">
                          Final Price - All Taxes Included
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* cart prices */}
                  
      
      
                  <div className="clearfix">
                    <div className="cart-block cart-block-footer clearfix">
                      <div>
                        <strong>
                          All-Inclusive Rate (₦{roomRatePerNight.toLocaleString()} × {nights} nights)
                        </strong>
                        {' '}
                        <small className="text-muted d-block">
                          <i className="fa fa-check text-success" />
                          {' '}Includes all taxes and charges
                        </small>
                      </div>
                      <div>
                        <span>
                          ₦{totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {/* Included Items Summary */}
                    <div className="cart-block cart-block-footer clearfix" style={{ backgroundColor: "#f8f9fa", borderLeft: "4px solid #28a745" }}>
                      <div>
                        <strong>
                          <i className="fa fa-check-circle text-success" />
                          {' '}Included in Your Rate:
                        </strong>
                        <div className="text-muted mt-1">
                          <small>
                            • 7.5% Value Added Tax (VAT)
                            <br />
                            {' '}• 5% Consumption Tax
                            <br />
                            {' '}• 10% Service Charge
                            <br />
                            {' '}• Complimentary breakfast for one
                          </small>
                        </div>
                      </div>
                      <div>
                        <span className="text-success">
                          ✓ Included
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* cart final price */}
                  <div className="clearfix">
                    <div className="cart-block cart-block-footer cart-block-footer-price clearfix">
                      <div>
                        <div className="mb-2">
                          <i className="fa fa-check text-success" />
                          {' '}Reservation Confirmed!
                        </div>
                        <div className="small text-muted">
                          <strong>
                            Note:
                          </strong>
                          {' '}This is the final all-inclusive price. No additional taxes or charges will be added.
                        </div>
                      </div>
                      <div>
                        <div className="h2 title">
                          ₦{totalAmount.toLocaleString()}
                        </div>
                        <div className="small text-success">
                          <i className="fa fa-check-circle" />
                          {' '}All taxes included
                        </div>
                      </div>
                    </div>
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
                            Present ID and this booking confirmation at check-in
                          </li>
                          <li className="mb-2">
                            <i className="fa fa-check text-success mr-2" />
                            Early check-in available upon request
                          </li>
                          <li className="mb-2">
                            <i className="fa fa-check text-success mr-2" />
                            All taxes and charges included in rate
                          </li>
                          <li className="mb-2">
                            <i className="fa fa-coffee text-success mr-2" />
                            Complimentary breakfast for one included
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
                            Contact: +234 812 313 9279
                          </li>
                          <li className="mb-2">
                            <i className="fa fa-map-marker text-primary mr-2" />
                            Address: Owerri, Imo State, Nigeria
                          </li>
                          <li className="mb-2">
                            <i className="fa fa-cutlery text-primary mr-2" />
                            Breakfast: 7:00 AM - 10:00 AM daily
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* All-Inclusive Rate Information */}
                    <div className="alert alert-success mt-3">
                      <h5>
                        <i className="fa fa-check-circle" />
                        {' '}All-Inclusive Rate Information
                      </h5>
                      <p className="mb-2">
                        Your booking is confirmed at our{' '}
                        <strong>
                          all-inclusive rate
                        </strong>
                        {' '}of{' '}
                        <strong>
                          ₦{roomRatePerNight.toLocaleString()} per night
                        </strong>
                        . This rate already includes:
                      </p>
                      <ul className="mb-2">
                        <li>
                          <strong>
                            7.5% Value Added Tax (VAT)
                          </strong>
                          {' '}- Required by Nigerian law
                        </li>
                        <li>
                          <strong>
                            5% Consumption Tax
                          </strong>
                          {' '}- Applicable on accommodation services
                        </li>
                        <li>
                          <strong>
                            10% Service Charge
                          </strong>
                          {' '}- For excellent hotel service
                        </li>
                        <li>
                          <strong>
                            Complimentary Breakfast
                          </strong>
                          {' '}- For one person daily
                        </li>
                      </ul>
                      <p className="mb-0">
                        <strong>
                          Total for {nights} night(s): ₦{totalAmount.toLocaleString()}
                        </strong>
                        {' '}- This is the final price with no additional charges.
                      </p>
                    </div>
                    {/* Payment Information */}
                    <div className="alert alert-info mt-2">
                      <h5>
                        <i className="fa fa-info-circle" />
                        {' '}Payment Information
                      </h5>
                      <p className="mb-2">
                        <strong>
                          Important:
                        </strong>
                        {' '}Your reservation is confirmed but payment is pending. To guarantee your accommodation, please make payment before 4pm on your arrival date.
                      </p>
                      <p className="mb-2">
                        <strong>
                          Payment Methods:
                        </strong>
                      </p>
                      <ul className="mb-2">
                        <li>
                          <strong>
                            Bank Transfer:
                          </strong>
                          {' '}Access Bank - Account Number: 0066351262
                        </li>
                        <li>
                          <strong>
                            Moniepoint:
                          </strong>
                          {' '}5033192156
                        </li>
                        <li>
                          <strong>
                            Direct Payment:
                          </strong>
                          {' '}At hotel front office
                        </li>
                      </ul>
                      <p className="mb-0">
                        <strong>
                          Send Proof of Payment to:
                        </strong>
                        <br />
                        {' '}📱 WhatsApp: 08123139279
                        <br />
                        {' '}📧 Email: reservations@fullmoon-hotels.com
                      </p>
                    </div>
                    {/* Breakfast Information */}
                    <div className="alert alert-warning mt-2">
                      <h5>
                        <i className="fa fa-coffee" />
                        {' '}Breakfast Information
                      </h5>
                      <p className="mb-0">
                        Your stay includes complimentary breakfast for one person served daily from 7:00 AM to 10:00 AM. Please present your room key at the restaurant. Additional breakfast can be purchased at the restaurant.{' '}
                        <strong>
                          Note:
                        </strong>
                        {' '}Breakfast element shall be removed if discounts are applied on same rates.
                      </p>
                    </div>
                  </div>
                  {/* ========================  Cart navigation ======================== */}
                  <div className="clearfix">
                    <div className="cart-block cart-block-footer cart-block-footer-price clearfix">
                      <div>
                        <a href="/rooms" className="btn btn-clean-dark">
                          <span className="icon icon-chevron-left" />
                          {' '}Book Another Room
                        </a>
                      </div>
                      <div>
                        <a data-onclick="window.print()" className="btn btn-main mr-2">
                          <span className="icon icon-printer" />
                          {' '}Print Confirmation
                        </a>
                        {' '}
                        <a href="/" className="btn btn-main">
                          <span className="icon icon-home" />
                          {' '}Back to Home
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
