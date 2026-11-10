import { notFound } from 'next/navigation';
import dbConnect, { plain } from '@/lib/db';
import Room from '@/lib/models/Room';
import { CATEGORY_MAP } from '@/lib/rooms';
import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/rooms_category';

export const dynamic = 'force-dynamic';

const validImages = (room) =>
  Array.isArray(room.images) ? room.images.filter((img) => img && typeof img === 'string' && img.trim() !== '') : [];

export async function generateMetadata({ params }) {
  const { category } = await params;
  const roomType = CATEGORY_MAP[category.toLowerCase()];
  return { title: roomType ? `${roomType} - Full Moon Hotels` : 'Category Not Found' };
}

function RoomDetails({ r }) {
  const images = validImages(r);
  return (
    <div className={`room ${!r.available ? 'room-unavailable' : ''}`}>
      {/* === Room gallery === */}
      <div className="room-gallery">
        <div className="container">
          {/* Room Header with Image Count */}
          <div className="room-header">
            {images.length > 0 && (
              <div className="room-image-count">
                <i className="fa fa-camera" /> {images.length} images
              </div>
            )}
          </div>
          {images.length > 0 ? (
            <>
              <div className={`owl-slider owl-theme owl-slider-gallery ${!r.available ? 'image-overlay unavailable' : ''}`} data-room-id={r._id}>
                {images.map((image, index) => (
                  <div className="item" key={index} style={{ backgroundImage: `url(${image})` }}>
                    <img loading="lazy" decoding="async" src={image} alt={`${r.type} - Image ${index + 1}`} />
                    <div className="image-counter">
                      <i className="fa fa-camera" /> {index + 1} / {images.length}
                    </div>
                  </div>
                ))}
              </div>
              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="gallery-thumbnails" id={`thumbnails-${r._id}`}>
                  {images.map((image, index) => (
                    <div key={index} className={`thumb ${index === 0 ? 'active' : ''}`} data-index={index}>
                      <img loading="lazy" decoding="async" src={image} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Fallback if no images */
            <div className={`owl-slider owl-theme owl-slider-gallery ${!r.available ? 'image-overlay unavailable' : ''}`}>
              {['/assets/images/room-4.jpg', '/assets/images/room-2.jpg', '/assets/images/room-1.jpg'].map((src, i) => (
                <div className="item" key={src} style={{ backgroundImage: `url(${src})` }}>
                  <img loading="lazy" decoding="async" src={src} alt={r.type} />
                  <div className="image-counter">
                    <i className="fa fa-camera" /> {i + 1} / 3
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* ===  Room overview === */}
      <div className="room-overview">
        <div className="container">
          {!r.available && <div className="room-unavailable-overlay" />}
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
              {/* === Room amenities === */}
              <div className="room-block room-aminities">
                <h2 className="title">Room amenities</h2>
                <div className="row">
                  <div className="col-xs-6 col-sm-2">
                    <figure>
                      <figcaption>
                        <span className="hotelicon hotelicon-air-condition" />
                        <p>Aircondition</p>
                      </figcaption>
                    </figure>
                  </div>
                  <div className="col-xs-6 col-sm-2">
                    <figure>
                      <figcaption>
                        <span className="hotelicon hotelicon-king-bed" />
                        <p>
                          {r.type === 'Penthouse Double Suite'
                            ? '2 Kingsize beds'
                            : r.type === 'Penthouse Single Suite'
                              ? '1 Kingsize bed'
                              : `${r.maxGuests || 2} People`}
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                  <div className="col-xs-6 col-sm-2">
                    <figure>
                      <figcaption>
                        <span className="hotelicon hotelicon-guest" />
                        <p>
                          {r.type === 'Penthouse Double Suite'
                            ? '4 People'
                            : r.type === 'Penthouse Single Suite'
                              ? '2 People'
                              : `${r.maxGuests || 2} People`}
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                  {/* === item === */}
                  <div className="col-xs-6 col-sm-2">
                    <figure>
                      <figcaption>
                        <span className="hotelicon hotelicon-wifi" />
                        <p>
                          Internet
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                  {/* === item === */}
                  <div className="col-xs-6 col-sm-2">
                    <figure>
                      <figcaption>
                        <span className="hotelicon hotelicon-washer" />
                        <p>
                          Washer
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                  {/* === item === */}
                  <div className="col-xs-6 col-sm-2">
                    <figure>
                      <figcaption>
                        <span className="hotelicon hotelicon-roomservice" />
                        <p>
                          Room service
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
              {/* === Room block === */}
              <div className="room-block">
                <h2 className="title">
                  Room overview
                </h2>
                <p>
                  {r.description || 'The ' + r.type + ' pays tribute to fashion and craftsmanship. The rooms are approximately 19m2 with views of the garden. The selection and pairing of materials has been carefully chosen to give you a cool experience. The super soft bed topper is simply extravagant! Every room is different but the colour palette uses unique and expertly matched hues. An openwork brass screen separates the bathroom from the bedroom. This original feature helps make every room your very own cosy and peaceful haven. Bathrobes, slippers and SOTHYS toiletries are provided in the bathroom to pamper you.'}
                </p>
                <p>
                  Wake up to a fresh cup of coffee prepared in your room and catch up on work in the flexible workstation.
                </p>
              </div>
              {/* === Room block === */}
              <div className="room-block">
                <h2 className="title">
                  House rules
                </h2>
                {/* === box === */}
                <div className="box">
                  <div className="row">
                    <div className="col-md-4">
                      <p>
                        <strong>
                          Check-In
                        </strong>
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        14:00 - 22:00
                      </p>
                    </div>
                  </div>
                </div>
                {/* === box === */}
                <div className="box">
                  <div className="row">
                    <div className="col-md-4">
                      <p>
                        <strong>
                          Check-out
                        </strong>
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        Until 12:00 noon
                      </p>
                    </div>
                  </div>
                </div>
                {/* === box === */}
                <div className="box">
                  <div className="row">
                    <div className="col-md-4">
                      <p>
                        <strong>
                          Luggage storage
                        </strong>
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        Available at reception
                      </p>
                    </div>
                  </div>
                </div>
                {/* === box === */}
                <div className="box">
                  <div className="row">
                    <div className="col-md-4">
                      <p>
                        <strong>
                          Cancellation/prepayment
                        </strong>
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        Cancellation and prepayment policies vary according to room type. Please enter the dates of your stay and check the conditions of your required room.
                      </p>
                    </div>
                  </div>
                </div>
                {/* === box === */}
                <div className="box">
                  <div className="row">
                    <div className="col-md-4">
                      <p>
                        <strong>
                          Children and extra beds
                        </strong>
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        All children are welcome.
                      </p>
                      <p>
                        There is no capacity for extra beds in the room.
                      </p>
                      <p>
                        Supplements are not calculated automatically in the total costs and will have to be paid for separately during your stay.
                      </p>
                    </div>
                  </div>
                </div>
                {/* === box === */}
                <div className="box">
                  <div className="row">
                    <div className="col-md-4">
                      <p>
                        <strong>
                          Pets
                        </strong>
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        Pets are not allowed.
                      </p>
                    </div>
                  </div>
                </div>
                {/* === box === */}
                <div className="box">
                  <div className="row">
                    <div className="col-md-4">
                      <p>
                        <strong>
                          Additional info
                        </strong>
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        The restaurant is open everyday of the week.
                      </p>
                      <p>
                        Please note that parking spaces cannot be reserved or guaranteed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* === Book This Room Button === */}
              <div className="room-block text-center">
                {r.available ? (
                  <a href={`/rooms/${r._id}`} className="btn btn-main btn-lg">
                    <i className="fa fa-calendar-check" /> Book This Room <small>Direct Booking - Best Price Guaranteed</small>
                  </a>
                ) : (
                  <div className="unavailable-actions">
                    <button className="btn btn-secondary btn-lg" disabled>
                      <i className="fa fa-calendar-times" /> Currently Booked <small>Not available for selected dates</small>
                    </button>
                    <div className="mt-3">
                      <a href="/rooms" className="btn btn-outline-primary">
                        <i className="fa fa-search" /> Check Other Rooms
                      </a>{' '}
                      <a href="/rooms" className="btn btn-outline-success ml-2">
                        <i className="fa fa-calendar-alt" /> Check Future Dates
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function RoomCategoryPage({ params }) {
  const slug = (await params).category.toLowerCase();
  const roomType = CATEGORY_MAP[slug];
  if (!roomType) notFound();

  await dbConnect();
  const rooms = plain(await Room.find({ type: roomType }).sort({ price: 1, roomNumber: 1 }).lean());
  if (rooms.length === 0) notFound();

  const category = roomType;
  const allCategoryImages = rooms.flatMap((room) =>
    validImages(room).map((image) => ({ image, roomType: room.type, roomId: room._id, roomNumber: room.roomNumber }))
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      {/* ========================  Room Category ======================== */}
      <section className="page">
        {/* ===  Page header === */}
        <div className="page-header" style={{ backgroundImage: "url('/assets/images/header-1.jpg')" }}>
          <div className="container">
            <h2 className="title">
              {category.charAt(0).toUpperCase() + category.slice(1)} Rooms
            </h2>
            <p>
              Explore our {category} room collection
            </p>
          </div>
        </div>
        {/* Category Booking Widget */}
        <div className="booking category-booking">
          <div className="container">
            <div className="booking-wrapper" style={{ backgroundColor: "cornflowerblue" }}>
              <form action="/rooms/check-availability" method="POST">
                <input type="hidden" name="category" value={category} />
                <div className="row">
                  {/* === date arrival === */}
                  <div className="col-xs-4 col-sm-3">
                    <div className="date" id="dateArrival" data-text="Arrival">
                      <input className="datepicker" name="checkIn" readOnly required />
                      <div className="date-value">
                        Arrival
                      </div>
                    </div>
                  </div>
                  {/* === date departure === */}
                  <div className="col-xs-4 col-sm-3">
                    <div className="date" id="dateDeparture" data-text="Departure">
                      <input className="datepicker" name="checkOut" readOnly required />
                      <div className="date-value">
                        Departure
                      </div>
                    </div>
                  </div>
                  {/* === guests === */}
                  <div className="col-xs-4 col-sm-2">
                    <div className="guests" data-text="Guests">
                      <div className="result">
                        <input className="qty-result" type="text" defaultValue="2" id="qty-result" readOnly />
                        <div className="qty-result-text date-value" id="qty-result-text">
                          2 Guests
                        </div>
                      </div>
                      {/* === guests list === */}
                      <ul className="guest-list">
                        <li className="header">
                          Please choose number of guests{' '}
                          <span className="qty-apply">
                            Apply
                          </span>
                          {' '}
                          <span className="qty-close">
                            <i className="icon icon-cross" />
                          </span>
                        </li>
                        {/* === adults === */}
                        <li className="clearfix">
                          <div>
                            <input className="qty-amount" defaultValue="2" type="text" id="ticket-adult" name="adults" data-value="2" readOnly />
                          </div>
                          <div>
                            <span>
                              Adults{' '}
                              <small>
                                16+ years
                              </small>
                            </span>
                          </div>
                          <div>
                            <input className="qty-btn qty-minus" value="-" type="button" data-field="ticket-adult" />
                            {' '}
                            <input className="qty-btn qty-plus" value="+" type="button" data-field="ticket-adult" />
                          </div>
                        </li>
                        {/* === children === */}
                        <li className="clearfix">
                          <div>
                            <input className="qty-amount" defaultValue="0" type="text" id="ticket-children" name="children" data-value="0" readOnly />
                          </div>
                          <div>
                            <span>
                              Children{' '}
                              <small>
                                2-11 years
                              </small>
                            </span>
                          </div>
                          <div>
                            <input className="qty-btn qty-minus" value="-" type="button" data-field="ticket-children" />
                            {' '}
                            <input className="qty-btn qty-plus" value="+" type="button" data-field="ticket-children" />
                          </div>
                        </li>
                        {/* === infants === */}
                        <li className="clearfix">
                          <div>
                            <input className="qty-amount" defaultValue="0" type="text" id="ticket-infants" name="infants" data-value="0" readOnly />
                          </div>
                          <div>
                            <span>
                              Infants{' '}
                              <small>
                                Under 2 years
                              </small>
                            </span>
                          </div>
                          <div>
                            <input className="qty-btn qty-minus" value="-" type="button" data-field="ticket-infants" />
                            {' '}
                            <input className="qty-btn qty-plus" value="+" type="button" data-field="ticket-infants" />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* === button === */}
                  <div className="col-xs-12 col-sm-4">
                    <button type="submit" className="btn btn-clean">
                      Check Availability{' '}
                      <small>
                        Best Rates Guaranteed
                      </small>
                    </button>
                  </div>
                </div>
                {/* /row */}
              </form>
            </div>
            {/* /booking-wrapper */}
          </div>
          {/* /container */}
        </div>
        {/* /booking */}
        {/* Display each room in the full detail layout */}
        {rooms.map((r) => (
          <RoomDetails key={r._id} r={r} />
        ))}
      </section>
      {/* ========================  Stretcher widget ======================== */}
      <section className="stretcher-wrapper">
        {/* === stretcher header === */}
        <div className="section-header">
          <div className="container">
            <h2 className="title">
              Hotel Facilities{' '}
              <a href="/facilities" className="btn btn-sm btn-clean-dark">
                Explore more
              </a>
            </h2>
            <p>
              Premium amenities for business and leisure travelers
            </p>
          </div>
        </div>
        {/* === stretcher === */}
        <ul className="stretcher">
          {/* === stretcher item === */}
          <li className="stretcher-item" style={{ backgroundImage: "url(/assets/images/facility-gym.jpg)" }}>
            {/* logo-item */}
            <div className="stretcher-logo">
              <div className="text">
                <span className="text-intro h4">
                  Gym and Fitness
                </span>
              </div>
            </div>
            {/* main text */}
            <figure>
              <h4>
                Fine Dining
              </h4>
              <figcaption>
                State-of-the-art equipment and expert trainers
              </figcaption>
            </figure>
            {/* anchor */}
            <a href="/menu">
              Anchor link
            </a>
          </li>
          {/* === stretcher item === */}
          <li className="stretcher-item" style={{ backgroundImage: "url(/assets/images/facility-business.jpg)" }}>
            {/* logo-item */}
            <div className="stretcher-logo">
              <div className="text">
                <span className="text-intro h4">
                  Business Center
                </span>
              </div>
            </div>
            {/* main text */}
            <figure>
              <h4>
                Business Center
              </h4>
              <figcaption>
                Fully equipped for business needs
              </figcaption>
            </figure>
            {/* anchor */}
            <a href="/facilities">
              Anchor link
            </a>
          </li>
          {/* === stretcher item === */}
          <li className="stretcher-item" style={{ backgroundImage: "url(/assets/images/facility-spa.jpg)" }}>
            {/* logo-item */}
            <div className="stretcher-logo">
              <div className="text">
                <span className="text-intro h4">
                  Spa & Wellness
                </span>
              </div>
            </div>
            <figure>
              <h4>
                Spa & Wellness
              </h4>
              <figcaption>
                Relaxation and rejuvenation
              </figcaption>
            </figure>
            {/* anchor */}
            <a href="/facilities">
              Anchor link
            </a>
          </li>
          {/* === stretcher item === */}
          <li className="stretcher-item" style={{ backgroundImage: "url(/assets/images/facility-event.jpg)" }}>
            {/* logo-item */}
            <div className="stretcher-logo">
              <div className="text">
                <span className="text-intro h4">
                  Event Spaces
                </span>
              </div>
            </div>
            {/* main text */}
            <figure>
              <h4>
                Event Spaces
              </h4>
              <figcaption>
                Elegant venues for special occasions
              </figcaption>
            </figure>
            {/* anchor */}
            <a href="/facilities">
              Anchor link
            </a>
          </li>
          {/* === stretcher item more === */}
          <li className="stretcher-item more">
            <div className="more-icon">
              <span data-title-show="Show more" data-title-hide="+" />
            </div>
            <a href="/facilities">
              Anchor link
            </a>
          </li>
        </ul>
      </section>
      {/* ========================  Category Image Gallery ======================== */}
      {/* ========================  Category Image Gallery ======================== */}
      {allCategoryImages.length > 0 && (
        <section className="cards">
          <div className="section-header">
            <div className="container">
              <h2 className="title">{category.charAt(0).toUpperCase() + category.slice(1)} Complete Gallery</h2>
              <p>
                All {allCategoryImages.length} images from our {category} room collection
              </p>
            </div>
          </div>
          <div className="container">
            <div className="row">
              {allCategoryImages.map((item, index) => (
                <div key={index} className={index % 6 === 0 ? 'col-xs-12 col-md-8' : 'col-xs-6 col-md-4'}>
                  <figure>
                    <figcaption style={{ backgroundImage: `url(${item.image})` }}>
                      <img loading="lazy" decoding="async" src={item.image} alt={`${item.roomType} - Room ${item.roomNumber}`} />
                    </figcaption>
                    <div className="image-caption">
                      <a href={`/rooms/${item.roomId}`} className="btn btn-clean" target="_blank">
                        {item.roomType}
                      </a>
                    </div>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <PageScript src="/js/pages/rooms_category.js" />
    </>
  );
}
