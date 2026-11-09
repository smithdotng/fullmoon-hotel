import { notFound } from 'next/navigation';
import dbConnect, { isValidId, plain } from '@/lib/db';
import Room from '@/lib/models/Room';
import PageScript from '@/components/PageScript';

export const dynamic = 'force-dynamic';

async function getRoom(id) {
  if (!isValidId(id)) return null;
  await dbConnect();
  return plain(await Room.findById(id).lean());
}

export async function generateMetadata({ params }) {
  const room = await getRoom((await params).id);
  return { title: room ? `${room.type} - Full Moon Hotels` : 'Room Not Found' };
}

export default async function RoomDetailPage({ params }) {
  const room = await getRoom((await params).id);
  if (!room) notFound();
  const images = Array.isArray(room.images) ? room.images.filter(Boolean) : [];
  const t = room.type.toLowerCase();

  return (
    <>
      <section className="page">
        {/* ===  Page header === */}
        <div className="page-header" style={{ backgroundImage: "url('/assets/images/coffeebar-1.jpg')" }}>
          <div className="container">
            <h2 className="title">{room.type}</h2>
            <p>Available from ₦{room.price.toLocaleString()} per night</p>
          </div>
        </div>
        <div className="room">
          {/* === Room gallery === */}
          <div className="room-gallery">
            <div className="container">
              <div className="owl-slider owl-theme owl-slider-gallery">
                {images.length > 0
                  ? images.map((image, i) => (
                      <div className="item" key={i} style={{ backgroundImage: `url(${image})` }}>
                        <img src={image} alt={room.type} />
                      </div>
                    ))
                  : ['/assets/images/room-4.jpg', '/assets/images/room-2.jpg', '/assets/images/room-1.jpg'].map((src) => (
                      <div className="item" key={src} style={{ backgroundImage: `url(${src})` }}>
                        <img src={src} alt="" />
                      </div>
                    ))}
              </div>
            </div>
          </div>
          {/* /room-gallery */}
          {/* === Booking === */}
          <section className="booking booking-default-theme">
            <div className="section-header hidden">
              <div className="container">
                <h2 className="title">
                  Booking & reservations
                </h2>
              </div>
            </div>
            <div className="booking-wrapper">
              <div className="container">
                <form action="/rooms/check-availability" method="POST">
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
                          <input className="qty-result" type="text" defaultValue="1" id="qty-result" readOnly />
                          <div className="qty-result-text date-value" id="qty-result-text">
                            1 Guest
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
                              <input className="qty-amount" defaultValue="1" type="text" id="ticket-adult" name="adults" data-value="1" readOnly />
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
                              <button type="button" className="qty-btn qty-minus" value="-" data-field="adult">
                                -
                              </button>
                              {' '}
                              <button type="button" className="qty-btn qty-plus" value="+" data-field="adult">
                                +
                              </button>
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
                              <button type="button" className="qty-btn qty-minus" value="-" data-field="children">
                                -
                              </button>
                              {' '}
                              <button type="button" className="qty-btn qty-plus" value="+" data-field="children">
                                +
                              </button>
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
                              <button type="button" className="qty-btn qty-minus" value="-" data-field="infant">
                                -
                              </button>
                              {' '}
                              <button type="button" className="qty-btn qty-plus" value="+" data-field="infant">
                                +
                              </button>
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
          </section>
          {/* ===  Room overview === */}
          <div className="room-overview">
            <div className="container">
              <div className="row">
                <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                  {/* === Room amenities === */}
                  <div className="room-block room-aminities">
                    <h2 className="title">
                      Room amenities
                    </h2>
                    <div className="row" style={{ justifyContent: "center" }}>
                      {/* === item === */}
                      <div className="col-xs-6 col-sm-2">
                        <figure>
                          <figcaption>
                            <span className="hotelicon hotelicon-air-condition" />
                            <p>
                              Aircondition
                            </p>
                          </figcaption>
                        </figure>
                      </div>
                      {/* === item === */}
                      <div className="col-xs-6 col-sm-2">
                        <figure>
                          <figcaption>
                            <span className="hotelicon hotelicon-king-bed" />
                            <p>
                              1 Kingsize bed
                            </p>
                          </figcaption>
                        </figure>
                      </div>
                      {/* === item === */}
                      <div className="col-xs-6 col-sm-2">
                        <figure>
                          <figcaption>
                            <span className="hotelicon hotelicon-guest" />
                            <p>
                              2 People
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
                      {room.description || 'The ' + room.type + ' pays tribute to fashion and craftsmanship. The rooms are approximately 19m2 with views of the garden. The selection and pairing of materials has been carefully chosen to give you a cool experience. The super soft bed topper is simply extravagant! Every room is different but the colour palette uses unique and expertly matched hues. An openwork brass screen separates the bathroom from the bedroom. This original feature helps make every room your very own cosy and peaceful haven. Bathrobes, slippers and SOTHYS toiletries are provided in the bathroom to pamper you.'}
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
                </div>
                {/* /col-sm-10 */}
              </div>
              {/* /row */}
            </div>
            {/* /container */}
          </div>
          {/* /room-overview */}
        </div>
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
      {/* ========================  Cards ======================== */}
      {/* ========================  Cards ======================== */}
      <section className="cards">
        {/* === cards header === */}
        <div className="section-header">
          <div className="container">
            <h2 className="title">
              Room Gallery{' '}
              <a href="/gallery" className="btn btn-sm btn-clean-dark">
                View all
              </a>
            </h2>
            <p>
              Explore more views of this beautiful accommodation
            </p>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {images.length > 0
              ? images.slice(0, 5).map((image, index) => (
                  <div key={index} className={index === 0 ? 'col-xs-12 col-md-8' : 'col-xs-6 col-md-4'}>
                    <figure>
                      <figcaption style={{ backgroundImage: `url(${image})` }}>
                        <img src={image} alt={`${room.type} - View ${index + 1}`} />
                      </figcaption>
                      <a href={image} className="btn btn-clean" data-lightbox="room-gallery">
                        View Image
                      </a>
                    </figure>
                  </div>
                ))
              : [
                  ['col-xs-12 col-md-8', `room-${t.includes('penthouse') ? 'penthouse' : 'premiere'}.jpg`, room.type, 'Room View'],
                  ['col-xs-6 col-md-4', `bathroom-${t.includes('penthouse') ? 'luxury' : 'standard'}.jpg`, `${room.type} Bathroom`, 'Bathroom'],
                  ['col-xs-6 col-md-4', `view-${t.includes('penthouse') ? 'city' : 'garden'}.jpg`, `${room.type} View`, 'Room View'],
                  ['col-xs-6 col-md-4', `amenities-${t.includes('executive') ? 'workspace' : 'living'}.jpg`, `${room.type} Amenities`, 'Amenities'],
                  ['col-xs-6 col-md-4', `details-${t.includes('deluxe') ? 'premium' : 'standard'}.jpg`, `${room.type} Details`, 'Details'],
                ].map(([col, file, alt, label]) => (
                  <div key={file} className={col}>
                    <figure>
                      <figcaption style={{ backgroundImage: `url(/assets/images/${file})` }}>
                        <img src={`/assets/images/${file}`} alt={alt} />
                      </figcaption>
                      <a href={`/assets/images/${file}`} className="btn btn-clean" data-lightbox="room-gallery">
                        {label}
                      </a>
                    </figure>
                  </div>
                ))}
          </div>
        </div>
      </section>
      <PageScript src="/js/pages/rooms_detail.js" />
    </>
  );
}
