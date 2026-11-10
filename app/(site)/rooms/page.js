import dbConnect, { plain } from '@/lib/db';
import Room from '@/lib/models/Room';
import { readFlash } from '@/lib/flash';
import Flash from '@/components/Flash';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "All Rooms & Suites - Full Moon Hotels",
};

const NOTICES = {
  missing: 'Missing booking details. Please start over.',
  'invalid-room': 'Invalid room ID format',
  'invalid-date': 'Invalid date format provided',
};

export default async function RoomsPage({ searchParams }) {
  const { notice } = await searchParams;
  const messages = await readFlash();
  if (notice) messages.error = [...(messages.error || []), NOTICES[notice] || String(notice).slice(0, 200)];
  await dbConnect();
  const rooms = plain(await Room.find({}).sort({ price: -1 }).lean());
  return (
    <>
      {/* ========================  Rooms ======================== */}
      <section className="page">
        {/* ========================  Page header ======================== */}
        <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
          <div className="container">
            <h2 className="title">
              Rooms & Suites
            </h2>
            <p>
              Luxury accommodation for business and leisure
            </p>
          </div>
        </div>
        {/* === rooms content === */}
        <div className="rooms rooms-category">
          <div className="container">
            <div className="row">
              
      {rooms.length > 0 ? (
                  rooms.map((room, index) => (
                    <div key={room._id} className={`col-sm-6 col-md-${index < 2 ? '6' : '4'}`}>
                      <div className="item">
                        <article>
                          <div className="image">
                            <img loading="lazy" decoding="async" src={room.images?.[0] || '/assets/images/room-default.jpg'} alt={room.type} />
                          </div>
                          <div className="details">
                            <div className="text">
                              <h2 className="title">
                                <a href={`/rooms/${room._id}`}>{room.type}</a>
                              </h2>
                              <p>{room.description || 'Luxurious accommodation with premium amenities'}</p>
                            </div>
                            <div className="book">
                              <div>
                                <a href={`/rooms/${room._id}`} className="btn btn-main">
                                  View Details
                                </a>
                              </div>
                              <div>
                                <span className="price h2">₦ {room.price.toLocaleString()}</span> <span>per night</span>
                              </div>
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i className="fa fa-bed fa-4x text-muted mb-3" />
                    <h3 className="text-muted">No Rooms Available</h3>
                    <p className="text-muted">We&apos;re currently updating our room inventory. Please check back later.</p>
                    <a href="/" className="btn btn-main mt-3">
                      Return to Home
                    </a>
                  </div>
                )}
      
            </div>
          </div>
          {/* /container */}
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
      {/* ========================  Gallery ======================== */}
      <section className="cards">
        {/* === gallery header === */}
        <div className="section-header">
          <div className="container">
            <h2 className="title">
              Hotel Gallery{' '}
              <a href="/gallery" className="btn btn-sm btn-clean-dark">
                View all
              </a>
            </h2>
            <p>
              Explore our luxurious accommodations and premium facilities
            </p>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {/* === item === */}
            <div className="col-xs-12 col-md-8">
              <figure>
                <figcaption style={{ backgroundImage: "url(/assets/images/cigar-lounge.jpg)" }}>
                  <img loading="lazy" decoding="async" src="/assets/images/cigar-lounge.jpg" alt="Chic Open-Air Escape" />
                </figcaption>
                <a href="/gallery" className="btn btn-clean">
                  Chic Open-Air Escape
                </a>
              </figure>
            </div>
            {/* === item === */}
            <div className="col-xs-6 col-md-4">
              <figure>
                <figcaption style={{ backgroundImage: "url(/assets/images/lobby-1.jpg)" }}>
                  <img loading="lazy" decoding="async" src="/assets/images/lobby-1.jpg" alt="Premium Ambience" />
                </figcaption>
                <a href="/gallery" className="btn btn-clean">
                  Premium Ambience
                </a>
              </figure>
            </div>
            {/* === item === */}
            <div className="col-xs-6 col-md-4">
              <figure>
                <figcaption style={{ backgroundImage: "url(/assets/images/coffeebar-1.jpg)" }}>
                  <img loading="lazy" decoding="async" src="/assets/images/coffeebar-1.jpg" alt="Intimate Coffee Nook" />
                </figcaption>
                <a href="/gallery" className="btn btn-clean">
                  Intimate Coffee Nook
                </a>
              </figure>
            </div>
            {/* === item === */}
            <div className="col-xs-6 col-md-4">
              <figure>
                <figcaption style={{ backgroundImage: "url(/assets/images/karaoke-bar.jpg)" }}>
                  <img loading="lazy" decoding="async" src="/assets/images/karaoke-bar.jpg" alt="Exclusive Music Lounge" />
                </figcaption>
                <a href="/gallery" className="btn btn-clean">
                  Karaoke Lounge
                </a>
              </figure>
            </div>
            {/* === item === */}
            <div className="col-xs-6 col-md-4">
              <figure>
                <figcaption style={{ backgroundImage: "url(/assets/images/gallery-dining.jpg)" }}>
                  <img loading="lazy" decoding="async" src="/assets/images/gallery-dining.jpg" alt="Fine Dining" />
                </figcaption>
                <a href="/gallery" className="btn btn-clean">
                  Fine Dining
                </a>
              </figure>
            </div>
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </section>
      
    </>
  );
}
