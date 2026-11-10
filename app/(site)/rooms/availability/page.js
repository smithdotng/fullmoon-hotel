import { Fragment } from 'react';
import { redirect } from 'next/navigation';
import dbConnect, { plain } from '@/lib/db';
import { getAvailableRooms, parseBookingDate, toISODate } from '@/lib/rooms';
import { longDate } from '@/lib/format';
import PageScript from '@/components/PageScript';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Available Rooms - Full Moon Hotels' };

const SCRIPT = `
$(function() {
  $('.cart-block-item').hover(function() { $(this).addClass('hover'); }, function() { $(this).removeClass('hover'); });
  $('[data-toggle="tooltip"]').tooltip();
});`;

// GET /rooms/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=&children=&infants=
// (POST /rooms/check-availability validates the search and redirects here)
export default async function AvailabilityPage({ searchParams }) {
  const q = await searchParams;
  const checkInDate = parseBookingDate(q.checkIn);
  const checkOutDate = parseBookingDate(q.checkOut);
  const adults = q.adults || '';
  const children = q.children || '';
  const infants = q.infants || '';
  const guests = (parseInt(adults) || 0) + (parseInt(children) || 0) + (parseInt(infants) || 0);
  if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate || guests <= 0) redirect('/rooms');

  await dbConnect();
  const rooms = plain(await getAvailableRooms(checkInDate, checkOutDate));
  const checkIn = toISODate(checkInDate);
  const checkOut = toISODate(checkOutDate);

  return (
    <>
      {/* ========================  Checkout ======================== */}
      {/* ========================  Checkout ======================== */}
      <section className="page">
        {/* ===  Page header === */}
        <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
          <div className="container">
            <h2 className="title">
              Available Rooms
            </h2>
            <p>
              Select your preferred accommodation
            </p>
          </div>
        </div>
        {/* ===  Checkout steps === */}
        <div className="step-wrapper">
          <div className="container">
            <div className="stepper">
              <ul className="row">
                <li className="col-md-4 active">
                  <a href="#">
                    <span data-text="Room & rates" />
                  </a>
                </li>
                <li className="col-md-4">
                  <a href="#">
                    <span data-text="Reservation" />
                  </a>
                </li>
                <li className="col-md-4">
                  <a href="#">
                    <span data-text="Checkout" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* ===  Checkout === */}
        <div className="checkout">
          <div className="container">
            {/* Search Criteria Summary */}
            <div className="search-summary mb-4">
              <div className="alert alert-info">
                <h4>
                  Your Search Criteria
                </h4>
                <div className="row">
                  <div className="col-md-3">
                    <strong>
                      Check-in:
                    </strong>
                    {' '}{longDate(checkInDate)}
                  </div>
                  <div className="col-md-3">
                    <strong>
                      Check-out:
                    </strong>
                    {' '}{longDate(checkOutDate)}
                  </div>
                  <div className="col-md-3">
                    <strong>
                      Guests:
                    </strong>
                    {' '}{guests || 'Not specified'}
                  </div>
                  <div className="col-md-3">
                    <a href="/rooms" className="btn btn-sm btn-clean-dark">
                      Modify Search
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="clearfix">
              {/* ========================  Cart wrapper ======================== */}
              <div className="cart-wrapper">
                {/* cart header */}
                <div className="cart-block cart-block-header clearfix">
                  <div>
                    <span>
                      Room type
                    </span>
                  </div>
                  <div className="text-center">
                    <span>
                      Amenities
                    </span>
                  </div>
                  <div className="text-right">
                    <span>
                      Price per night
                    </span>
                  </div>
                </div>
            {rooms.length > 0 ? (
              <div className="clearfix">
                {rooms.map((room, index) => (
                  <Fragment key={room._id}>
                    <div className="cart-block cart-block-item clearfix">
                      <div className="image">
                        <a href={`/rooms/${room._id}`} target="_blank">
                          <img loading="lazy" decoding="async" src={room.images?.[0] || '/assets/images/room-default.jpg'} alt={room.type} />
                        </a>
                      </div>
                      <div className="title">
                        <div className="h2">
                          <a href={`/rooms/${room._id}`} target="_blank">
                            {room.type}
                          </a>
                        </div>
                        <p>{room.description || 'Luxurious accommodation with premium amenities'}</p>
                        <p>
                          <strong>Capacity:</strong> Up to {room.amenities && room.amenities.includes('2-4 Persons') ? '4' : '2'} guests
                        </p>
                        <div className="mt-3">
                          <a href={`/rooms/${room._id}`} className="btn btn-sm btn-clean-dark" target="_blank">
                            View Details
                          </a>
                        </div>
                      </div>
                      <div className="amenities text-center">
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="amenities-list">
                            {room.amenities.slice(0, 3).map((amenity) => (
                              <div className="amenity-item" key={amenity}>
                                <i className="fa fa-check text-success" /> <small>{amenity}</small>
                              </div>
                            ))}
                            {room.amenities.length > 3 && (
                              <div className="amenity-item">
                                <i className="fa fa-plus text-muted" /> <small>+{room.amenities.length - 3} more</small>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="price">
                        <span className="final h3">₦ {room.price.toLocaleString()}</span> <span>per night</span>
                        <div className="mt-3">
                          <form action={`/rooms/book/${room._id}`} method="POST">
                            <input type="hidden" name="checkIn" value={checkIn} />
                            <input type="hidden" name="checkOut" value={checkOut} />
                            <input type="hidden" name="guests" value={guests} />
                            {adults && <input type="hidden" name="adults" value={adults} />}
                            {children && <input type="hidden" name="children" value={children} />}
                            {infants && <input type="hidden" name="infants" value={infants} />}
                            <button type="submit" className="btn btn-main">
                              Book Now
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                    {index < rooms.length - 1 && <hr className="room-divider" />}
                  </Fragment>
                ))}
              </div>
            ) : (
              <div className="cart-block cart-block-item clearfix text-center py-5">
                <div className="col-12">
                  <i className="fa fa-bed fa-4x text-muted mb-3" />
                  <h3 className="text-muted">No Rooms Available</h3>
                  <p className="text-muted">We&apos;re sorry, but no rooms are available for your selected dates and criteria.</p>
                  <div className="mt-4">
                    <a href="/rooms" className="btn btn-main">
                      Search Different Dates
                    </a>{' '}
                    <a href="/contact" className="btn btn-clean-dark">
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            )}
            {/* ========================  Cart navigation ======================== */}
            <div className="clearfix">
              <div className="cart-block cart-block-footer cart-block-footer-price clearfix">
                <div>
                  <a href="/rooms" className="btn btn-clean-dark">
                    <span className="icon icon-chevron-left" /> Back to Rooms
                  </a>
                </div>
                <div>
                  {rooms.length > 0 && <small className="text-muted d-block mb-2">{rooms.length} room(s) available</small>}{' '}
                  <a href="/contact" className="btn btn-main">
                    Need Help? Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
            {/* Additional Information */}
            <div className="row mt-5">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="fa fa-shield fa-3x text-primary mb-3" />
                    <h5>
                      Best Rate Guarantee
                    </h5>
                    <p className="text-muted">
                      Find a lower rate elsewhere and we'll match it with an additional 10% discount.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="fa fa-credit-card fa-3x text-primary mb-3" />
                    <h5>
                      No Booking Fees
                    </h5>
                    <p className="text-muted">
                      Book directly with us and avoid unnecessary booking fees and charges.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="fa fa-clock-o fa-3x text-primary mb-3" />
                    <h5>
                      Flexible Cancellation
                    </h5>
                    <p className="text-muted">
                      Free cancellation up to 24 hours before your check-in date.
                    </p>
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
      <PageScript code={SCRIPT} />
    </>
  );
}
