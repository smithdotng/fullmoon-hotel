import dbConnect, { plain } from '@/lib/db';
import Room from '@/lib/models/Room';
import { withImages } from '@/lib/rooms';
import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/home';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Full Moon Hotels - Luxury Accommodation in Owerri',
};

const FALLBACK_ROOMS = [
  { _id: 'fallback-1', type: 'Premiere Room', description: 'Panoramic city view, high floor', price: 55000, images: ['/assets/images/room-premiere.jpg'], amenities: ['Free WiFi', 'Smart TV', 'Mini Bar'] },
  { _id: 'fallback-2', type: 'Deluxe Room', description: 'Separate lounge and dining set', price: 65000, images: ['/assets/images/room-deluxe.jpg'], amenities: ['Free WiFi', 'Smart TV', 'Mini Bar', 'Work Desk'] },
  { _id: 'fallback-3', type: 'Executive Room', description: 'Spacious work area with city views', price: 85000, images: ['/assets/images/room-executive.jpg'], amenities: ['Free WiFi', 'Smart TV', 'Mini Bar', 'Executive Desk'] },
];

// Category slug used by the room title links on the homepage
function categoryFor(type = '') {
  if (type.includes('Penthouse Single')) return 'penthouse-single';
  if (type.includes('Penthouse Double')) return 'penthouse-double';
  if (type.includes('Executive')) return 'Executive';
  if (type.includes('Deluxe')) return 'Deluxe';
  if (type.includes('Premiere')) return 'Premiere';
  if (type.includes('Annex')) return 'Annex';
  return 'rooms';
}

async function getRooms() {
  try {
    await dbConnect();
    const rooms = await Room.find({}).sort({ price: 1 }).limit(6).lean();
    return rooms.length ? plain(rooms).map(withImages) : FALLBACK_ROOMS.slice(0, 2);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return FALLBACK_ROOMS;
  }
}

export default async function HomePage() {
  const rooms = await getRooms();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
        <section className="frontpage-slider">
          <div className="owl-slider owl-slider-header">
            {/* === slide item === */}
            <div className="item" style={{ backgroundImage: "url(/assets/images/slide-beach.jpg)" }}>
              <div className="box box-bottom text-center">
                <div className="container">
                  <div className="rating animated" data-animation="fadeInDown">
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                  </div>
                  <h2 className="title animated h1" data-animation="fadeInDown">
                    Full Moon Hotels{' '}
                    <br />
                    {' '}
                    <span style={{ textTransform: "lowercase" }}>
                      .... rest assured
                    </span>
                  </h2>
                  <div className="desc animated" data-animation="fadeInUp">
                    Four-star accommodation for business and leisure
                  </div>
                  <div className="animated" data-animation="fadeInUp">
                    <a href="/rooms" className="btn btn-clean">
                      Book Your Stay
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* === slide item === */}
            <div className="item" style={{ backgroundImage: "url(/assets/images/slide-lobby.jpg)" }}>
              <div className="box box-bottom text-center">
                <div className="container">
                  <h2 className="title animated h1" data-animation="fadeInDown">
                    Elegant Rooms{' '}
                    <br />
                    {' '}& Suites
                  </h2>
                  <div className="desc animated" data-animation="fadeInUp">
                    Art deco-style rooms with panoramic city views and premium amenities
                  </div>
                  <div className="animated" data-animation="fadeInUp">
                    <a href="/rooms" className="btn btn-clean">
                      Explore Rooms
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* === slide item === */}
            <div className="item" style={{ backgroundImage: "url(/assets/images/slide-coffee.jpg)" }}>
              <div className="box box-bottom text-center">
                <div className="container">
                  <div className="rating animated" data-animation="fadeInDown">
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                  </div>
                  <h2 className="title animated h1" data-animation="fadeInDown">
                    Premium Service
                  </h2>
                  <div className="desc animated" data-animation="fadeInUp">
                    Attentive, first-rate service by well-trained staff
                  </div>
                  <div className="desc animated" data-animation="fadeInUp">
                    for an unforgettable stay
                  </div>
                  <div className="animated" data-animation="fadeInUp">
                    <a href="/about" className="btn btn-clean">
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* === NEW slide item - Poolside Bar === */}
            <div className="item" style={{ backgroundImage: "url(/assets/images/poolside-bar-night.jpg)" }}>
              <div className="box box-bottom text-center">
                <div className="container">
                  <div className="rating animated" data-animation="fadeInDown">
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                    {' '}
                    <i className="fa fa-star" />
                  </div>
                  <h2 className="title animated h1" data-animation="fadeInDown">
                    Poolside Bar{' '}
                    <br />
                    {' '}
                    <span>
                      Under the Stars
                    </span>
                  </h2>
                  <div className="desc animated" data-animation="fadeInUp">
                    Unwind with signature cocktails and premium spirits
                  </div>
                  <div className="desc animated" data-animation="fadeInUp">
                    in our elegant nighttime oasis
                  </div>
                  <div className="animated" data-animation="fadeInUp">
                    <a href="/facilities" className="btn btn-clean">
                      Explore Facilities
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /owl-slider */}
        </section>
        {/* ======================== Booking ======================== */}
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
                            <button type="button" className="qty-btn qty-minus" value="-" data-field="ticket-adult">
                              -
                            </button>
                            {' '}
                            <button type="button" className="qty-btn qty-plus" value="+" data-field="ticket-adult">
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
                            <button type="button" className="qty-btn qty-minus" value="-" data-field="ticket-children">
                              -
                            </button>
                            {' '}
                            <button type="button" className="qty-btn qty-plus" value="+" data-field="ticket-children">
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
                            <button type="button" className="qty-btn qty-minus" value="-" data-field="ticket-infants">
                              -
                            </button>
                            {' '}
                            <button type="button" className="qty-btn qty-plus" value="+" data-field="ticket-infants">
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
        {/* ========================  Rooms ======================== */}
        {/* ========================  Rooms ======================== */}
        <section className="rooms rooms-widget">
          {/* === rooms header === */}
          <div className="section-header">
            <div className="container">
              <h2 className="title">
                Luxury Accommodations{' '}
                <a href="/rooms" className="btn btn-sm btn-clean-dark">
                  View all
                </a>
              </h2>
              <p>
                Elegant rooms and suites designed for business and leisure travelers
              </p>
            </div>
          </div>
          {/* === rooms content === */}
          <div className="container">
            <div className="owl-rooms owl-theme">
              
              {rooms.map((room) => (
                <div className="item" key={room._id}>
                  <article>
                    <div className="image">
                      <img src={room.images[0]} alt={room.type} data-onerror="this.onerror=null; this.src='/assets/images/room-default.jpg';" />
                    </div>
                    <div className="details">
                      <div className="text">
                        <h3 className="title">
                          <a href={`/rooms/category/${categoryFor(room.type)}`}>{room.type}</a>
                        </h3>
                        <p>{room.description || 'Luxurious accommodation with premium amenities'}</p>
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="amenities-preview">
                            <small>
                              <strong>Includes:</strong> {room.amenities.slice(0, 2).join(', ')}
                              {room.amenities.length > 2 && '...'}
                            </small>
                          </div>
                        )}
                      </div>
                      <div className="book">
                        <div>
                          <a href={String(room._id).startsWith('fallback') ? '/rooms' : `/rooms/${room._id}`} className="btn btn-main">
                            View Details
                          </a>
                        </div>
                        <div>
                          <span className="price h4">₦ {room.price.toLocaleString()}</span> <span>per night</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
      
            </div>
            {/* /owl-rooms */}
          </div>
          {/* /container */}
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
                    <img src="/assets/images/cigar-lounge.jpg" alt="Chic Open-Air Escape" />
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
                    <img src="/assets/images/lobby-1.jpg" alt="Premium Ambience" />
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
                    <img src="/assets/images/coffeebar-1.jpg" alt="Intimate Coffee Nook" />
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
                    <img src="/assets/images/karaoke-bar.jpg" alt="Exclusive Music Lounge" />
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
                    <img src="/assets/images/gallery-dining.jpg" alt="Fine Dining" />
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
        {/* ======================== Facilities ======================== */}
        <section className="facilities">
          <div className="section-header text-center">
            <div className="container">
              <h2 className="title">
                Hotel services
              </h2>
              <p>
                Experience & aminities
              </p>
            </div>
          </div>
          <div className="container">
            <div className="facilities-wrapper">
              <div className="row">
                {/* === item === */}
                <div className="col-xs-6 col-sm-3">
                  <figure>
                    <figcaption>
                      <span className="hotelicon hotelicon-roomservice" />
                      <p className="title">
                        Roomservice
                      </p>
                    </figcaption>
                  </figure>
                </div>
                {/* === item === */}
                <div className="col-xs-6 col-sm-3">
                  <figure>
                    <figcaption>
                      <span className="hotelicon hotelicon-wifi" />
                      <p className="title">
                        Free Wifi
                      </p>
                    </figcaption>
                  </figure>
                </div>
                {/* === item === */}
                <div className="col-xs-6 col-sm-3">
                  <figure>
                    <figcaption>
                      <span className="hotelicon hotelicon-kitchen" />
                      <p className="title">
                        Restaurant
                      </p>
                    </figcaption>
                  </figure>
                </div>
                {/* === item === */}
                <div className="col-xs-6 col-sm-3">
                  <figure>
                    <figcaption>
                      <span className="hotelicon hotelicon-coctail" />
                      <p className="title">
                        Cocktail bar
                      </p>
                    </figcaption>
                  </figure>
                </div>
                {/* === item === */}
                <div className="col-xs-6 col-sm-3">
                  <figure>
                    <figcaption>
                      <span className="hotelicon hotelicon-parking" />
                      <p className="title">
                        Free parking
                      </p>
                    </figcaption>
                  </figure>
                </div>
                {/* === item === */}
                <div className="col-xs-6 col-sm-3">
                  <figure>
                    <figcaption>
                      <span className="hotelicon hotelicon-pool" />
                      <p className="title">
                        Pool
                      </p>
                    </figcaption>
                  </figure>
                </div>
                {/* === item === */}
                <div className="col-xs-6 col-sm-3">
                  <figure>
                    <figcaption>
                      <span className="hotelicon hotelicon-elevator" />
                      <p className="title">
                        Elevator
                      </p>
                    </figcaption>
                  </figure>
                </div>
                {/* === item === */}
                <div className="col-xs-6 col-sm-3">
                  <figure>
                    <figcaption>
                      <span className="hotelicon hotelicon-keys" />
                      <p className="title">
                        Private rooms
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ======================== Image blocks ======================== */}
        <section className="image-blocks image-blocks-header">
          <div className="section-header" style={{ backgroundImage: "url(/assets/images/coffee-bar-area.jpg)" }}>
            <div className="container">
              <h2 className="title">
                Premium Suites{' '}
                <a href="/rooms" className="btn btn-sm btn-clean">
                  View all
                </a>
              </h2>
              <p>
                Ultimate luxury and comfort
              </p>
            </div>
          </div>
          <div className="container">
            {/* item block */}
            <div className="blocks blocks-left">
              <div className="item">
                <div className="text">
                  {/* === room info === */}
                  <h2 className="title">
                    Single Penthouse{' '}
                    <br />
                    Suite
                  </h2>
                  <p>
                    Panoramic city views, high floor, art deco-style room, separate lounge and dining set. A beautifully designed suite made for both the business traveler and family. Keeping up with work couldn't be easier, with a desk and WiFi access available throughout the suite. Enjoy all your meals with business associates, family & friends in a comfortable dining set up.
                  </p>
                  {/* === room facilities === */}
                  <div className="room-facilities">
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-roomservice" />
                        {' '}24/7 Room Service
                      </figcaption>
                    </figure>
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-king-bed" />
                        {' '}Kingsize bed
                      </figcaption>
                    </figure>
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-kitchen" />
                        {' '}Separate dining
                      </figcaption>
                    </figure>
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-compas" />
                        {' '}Spacious layout
                      </figcaption>
                    </figure>
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-tv" />
                        {' '}Smart TV
                      </figcaption>
                    </figure>
                  </div>
                  {/* === booking === */}
                  <div className="book">
                    <div>
                      <a href="/rooms/category/Penthouse-single" className="btn btn-danger btn-lg">
                        Book
                      </a>
                    </div>
                    <div>
                      <span className="price h2">
                        ₦ 140,000
                      </span>
                      {' '}
                      <span>
                        per night
                      </span>
                    </div>
                  </div>
                  {/* /booking */}
                </div>
                {/* /text */}
              </div>
              {/* /item */}
              <div className="image" style={{ backgroundImage: "url(/assets/images/room-penthouse-single.jpg)" }}>
                <img src="/assets/images/room-penthouse-single.jpg" alt="Single Penthouse Suite" />
              </div>
            </div>
            {/* item block */}
            <div className="blocks blocks-right">
              <div className="item">
                <div className="text">
                  {/* === room info === */}
                  <h2 className="title">
                    Double Penthouse{' '}
                    <br />
                    Suite
                  </h2>
                  <p>
                    Panoramic city views, high floor, art deco-style room, separate lounge and dining set. A beautifully designed suite made for both the business traveler and family. A terrace of two bedrooms. Keeping up with work couldn't be easier, with a desk and Wi-Fi access available throughout the suite. Perfect for families or executives needing extra space.
                  </p>
                  {/* === room facilities === */}
                  <div className="room-facilities">
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-king-bed" />
                        {' '}Two bedrooms
                      </figcaption>
                    </figure>
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-roomservice" />
                        {' '}Private terrace
                      </figcaption>
                    </figure>
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-kitchen" />
                        {' '}Spacious lounge
                      </figcaption>
                    </figure>
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-compas" />
                        {' '}Executive workspace
                      </figcaption>
                    </figure>
                    {/* === icon === */}
                    <figure>
                      <figcaption>
                        <i className="hotelicon hotelicon-tv" />
                        {' '}Entertainment system
                      </figcaption>
                    </figure>
                  </div>
                  {/* === booking === */}
                  <div className="book">
                    <div>
                      <a href="/rooms/category/Penthouse-double" className="btn btn-danger btn-lg">
                        Book
                      </a>
                    </div>
                    <div>
                      <span className="price h2">
                        ₦ 200,000
                      </span>
                      {' '}
                      <span>
                        per night
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="image" style={{ backgroundImage: "url(/assets/images/room-penthouse-double.jpg)" }}>
                <img src="/assets/images/room-penthouse-double.jpg" alt="Double Penthouse Suite" />
              </div>
            </div>
          </div>
          {/* /container */}
        </section>
        {/* ======================== Quotes ======================== */}
        <section className="quotes quotes-slider" style={{ backgroundImage: "url(/assets/images/testimonial-bg.jpg)" }}>
          <div className="container">
            {/* === Quotes header === */}
            <div className="section-header">
              <h2 className="title">
                Guest Reviews
              </h2>
              <p>
                What our guests say about their experience
              </p>
            </div>
            <div className="row">
              <div className="col-md-8 col-md-offset-2">
                <div className="quote-carousel">
                  {/* === quote item === */}
                  <div className="quote">
                    <div className="text">
                      <h4>
                        Chinedu Okoro
                      </h4>
                      <p>
                        The Executive Room was perfect for my business trip. The workspace was well-equipped and the high-speed internet made remote work seamless.
                      </p>
                    </div>
                    <div className="more">
                      <div className="rating">
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                      </div>
                    </div>
                  </div>
                  {/* === quote item === */}
                  <div className="quote">
                    <div className="text">
                      <h4>
                        Amina Yusuf
                      </h4>
                      <p>
                        Our family loved the Double Penthouse Suite. The separate bedrooms and spacious lounge gave everyone their own space while still being together.
                      </p>
                    </div>
                    <div className="more">
                      <div className="rating">
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                      </div>
                    </div>
                  </div>
                  {/* === quote item === */}
                  <div className="quote">
                    <div className="text">
                      <h4>
                        James Okafor
                      </h4>
                      <p>
                        The attention to detail in the Premiere Room was remarkable. The city view was breathtaking and the marble bathroom was pure luxury.
                      </p>
                    </div>
                    <div className="more">
                      <div className="rating">
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                      </div>
                    </div>
                  </div>
                  {/* === quote item === */}
                  <div className="quote">
                    <div className="text">
                      <h4>
                        Grace Williams
                      </h4>
                      <p>
                        As a frequent business traveler, I appreciate the reliable Wi-Fi and comfortable work desk in the Deluxe Room. The service was exceptional throughout my stay.
                      </p>
                    </div>
                    <div className="more">
                      <div className="rating">
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                        {' '}
                        <span className="fa fa-star" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /quote-carousel */}
              </div>
            </div>
            {/* /row */}
          </div>
          {/* /container */}
        </section>
        {/* ========================  About ======================== */}
        <section className="about">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2">
                <div className="text-content text-center">
                  <h2 className="title">
                    About Full Moon Hotels
                  </h2>
                  <p>
                    FULLMOON HOTELS LIMITED OWERRI is an elite brand hotel with high standards designed for business and high net worth individuals. Our hotel is well situated in Housing Area C, New Owerri, at Plot H-1 Fullmoon Avenue near Akanchawa Road. It takes around 30 minutes to get there by car from the Imo Airport. The hotel's luxurious environment is complemented by our attentive, first-rate service provided by well-trained staff, who make sure that visitors have a delightfully unforgettable stay.
                  </p>
                  <p>
                    The Fullmoon Hotel has four stars. Modern amenities can be found throughout the hotel, from the lobby to the hallways and directly into the guest rooms. Beautiful lawns and gardens enhance the tranquil setting in which high-profile executives, senior government officials, business decision-makers, and key personalities may fully rest and enjoy complete seclusion.
                  </p>
                  <a href="/about" className="btn btn-main">
                    Learn More About Us
                  </a>
                </div>
              </div>
            </div>
          </div>
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
              {/* SIMPLIFIED Subscription Form */}
              <form id="newsletterForm" className="newsletter-form" noValidate>
                <div className="subscribe-form-group">
                  <div className="email-input-wrapper">
                    <input type="email" id="newsletterEmail" name="email" defaultValue="" placeholder="Your email address" className="subscribe-email" required />
                  </div>
                  <button type="submit" id="subscribe-button" className="subscribe-btn">
                    <span id="subscribe-text">
                      Subscribe
                    </span>
                    {' '}
                    <span id="subscribe-spinner" className="subscribe-spinner" style={{ display: "none" }}>
                      ⌛
                    </span>
                  </button>
                </div>
                <div className="subscribe-note">
                  We respect your privacy. Unsubscribe at any time.
                </div>
              </form>
              {/* Success/Error Messages */}
              <div id="newsletterMessage" className="newsletter-message" />
            </div>
          </div>
        </section>
      <PageScript src="/js/pages/home.js" />
    </>
  );
}
