import { readFlash } from '@/lib/flash';
import { getCurrentUser } from '@/lib/session';
import { ALL_FACILITIES, BOOKABLE_FACILITIES } from '@/lib/facilities';
import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/facilities';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hotel Facilities - Full Moon Hotels',
  description: 'Explore our premium facilities',
};

const FEATURES = {
  dining: ['International cuisine', 'Professional service', 'Elegant ambiance'],
  spa: ['Professional therapists', 'Premium products', 'Relaxing environment'],
  wellness: ['Modern equipment', 'Personal training available', '24/7 access for guests'],
  business: ['High-speed WiFi', 'Audio-visual equipment', 'Professional setup'],
  recreation: ['Lounge area', 'Poolside service', 'Family friendly'],
};

function FacilityCard({ facility, user }) {
  const key = facility.type === 'wellness' && facility.name.includes('Spa') ? 'spa' : facility.type;
  const bookable = BOOKABLE_FACILITIES.includes(facility.name);
  return (
    <div className="col-md-6">
      <div className="facility-card">
        <img loading="lazy" decoding="async" src={facility.image} alt={facility.name} className="facility-image" />
        <h3>{facility.name}</h3>
        <p>{facility.description}</p>
        <div className="facility-meta">
          <p>
            <strong>Capacity:</strong> {facility.capacity} people
          </p>
          <p>
            <strong>Hours:</strong> {facility.operatingHours}
          </p>
        </div>
        <ul className="facility-features">
          {FEATURES[key].map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        {bookable ? (
          <button
            className="btn btn-main book-facility-btn"
            data-facility={facility.name}
            disabled={!user}
            title={!user ? 'Please login to book facilities' : undefined}
          >
            Book Now
          </button>
        ) : facility.type === 'dining' ? (
          <button className="btn btn-default" disabled>
            Walk-in Only
          </button>
        ) : (
          <button className="btn btn-default">Available for Guests</button>
        )}
      </div>
    </div>
  );
}

function Tab({ id, type, active, user }) {
  return (
    <div role="tabpanel" className={`tab-pane${active ? ' active' : ''}`} id={id}>
      <div className="content">
        <div className="row">
          {ALL_FACILITIES.filter((f) => f.type === type).map((facility) => (
            <FacilityCard key={facility.name} facility={facility} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function FacilitiesPage() {
  const messages = await readFlash();
  const user = await getCurrentUser();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      <section className="page">
        {/* ===  Page header === */}
        <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
          <div className="container text-center">
            <h2 className="title">
              Hotel Facilities
            </h2>
            <p>
              Premium Amenities & Services
            </p>
          </div>
        </div>
        {/* Flash Messages */}
        {messages.error?.length > 0 && (
          <div className="container">
            <div className="alert alert-danger alert-dismissible fade in" role="alert">
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>{' '}
              {messages.error.join(' ')}
            </div>
          </div>
        )}
        {messages.success?.length > 0 && (
          <div className="container">
            <div className="alert alert-success alert-dismissible fade in" role="alert">
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>{' '}
              {messages.success.join(' ')}
            </div>
          </div>
        )}
        <div className="facility">
          <div className="container">
            <div className="facility-gallery">
              <div className="owl-slider owl-theme owl-slider-gallery">
                {/* === slide item === */}
                <div className="item" style={{ backgroundImage: "url(/assets/images/cigar-lounge.jpg)" }}>
                  <img loading="lazy" decoding="async" src="/assets/images/cigar-lounge.jpg" alt="Full Moon Hotels Facilities" />
                </div>
                {/* === slide item === */}
                <div className="item" style={{ backgroundImage: "url(/assets/images/coffeebar-1.jpg)" }}>
                  <img loading="lazy" decoding="async" src="/assets/images/facility-spa.jpg" alt="Spa & Wellness Center" />
                </div>
                {/* === slide item === */}
                <div className="item" style={{ backgroundImage: "url(/assets/images/facility-gym.jpg)" }}>
                  <img loading="lazy" decoding="async" src="/assets/images/facility-gym.jpg" alt="State-of-the-art Gym" />
                </div>
              </div>
              {/* /owl-slider */}
            </div>
            {/* /facilty-gallery */}
            <div className="row">
              <div className="col-md-10 col-md-offset-1">
                {/* === facility-info === */}
                <div className="facility-info">
                  <div className="row">
                    <div className="col-md-6">
                      <h2>
                        Premium Facilities
                      </h2>
                      <p>
                        Full Moon Hotels offers a comprehensive range of premium facilities designed to meet the needs of both business and leisure travelers. From our state-of-the-art fitness center to our luxurious spa, every facility is maintained to the highest standards.
                      </p>
                      <p>
                        Our dedicated staff ensures that all facilities are available and properly maintained throughout your stay, providing you with a seamless and enjoyable experience.
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h2>
                        24/7 Services
                      </h2>
                      <p>
                        We understand that our guests have different schedules and needs. That's why we offer 24-hour room service, concierge assistance, and access to key facilities to ensure your comfort and convenience at any time.
                      </p>
                      <p>
                        Whether you need early morning gym access or late-night dining options, our facilities and services are designed to accommodate your lifestyle.
                      </p>
                    </div>
                  </div>
                </div>
                {/* === facility-addons === */}
                <div className="facility-addons">
                  {/* === nav-tabs === */}
                  <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation" className="active">
                      <a href="#dining" aria-controls="dining" role="tab" data-toggle="tab">
                        <i className="hotelicon hotelicon-kitchen" />
                        {' '}
                        <span className="visible-md visible-lg">
                          Dining
                        </span>
                      </a>
                    </li>
                    <li role="presentation">
                      <a href="#wellness" aria-controls="wellness" role="tab" data-toggle="tab">
                        <i className="hotelicon hotelicon-spa" />
                        {' '}
                        <span className="visible-md visible-lg">
                          Wellness
                        </span>
                      </a>
                    </li>
                    <li role="presentation">
                      <a href="#business" aria-controls="business" role="tab" data-toggle="tab">
                        <i className="hotelicon hotelicon-business" />
                        {' '}
                        <span className="visible-md visible-lg">
                          Business
                        </span>
                      </a>
                    </li>
                    <li role="presentation">
                      <a href="#recreation" aria-controls="recreation" role="tab" data-toggle="tab">
                        <i className="hotelicon hotelicon-pool" />
                        {' '}
                        <span className="visible-md visible-lg">
                          Recreation
                        </span>
                      </a>
                    </li>
                  </ul>
                  {/* === tab-panes === */}
                  <div className="tab-content">
                    <Tab id="dining" type="dining" active user={user} />
                    <Tab id="wellness" type="wellness" user={user} />
                    <Tab id="business" type="business" user={user} />
                    <Tab id="recreation" type="recreation" user={user} />
                  </div>
                  {/* /tab-content */}
                </div>
                {/* /facility-addons */}
              </div>
              {/* /col-md-10 */}
            </div>
            {/* /row */}
          </div>
          {/* /container */}
        </div>
      </section>
      {/* ========================  Stretcher widget ======================== */}
      <section className="stretcher-wrapper stretcher-wrapper-noheader">
        <ul className="stretcher">
          <li className="stretcher-item" style={{ backgroundImage: "url(/assets/images/facility-spa.jpg)" }}>
            <div className="stretcher-logo">
              <div className="text">
                <span className="text-intro h2">
                  Spa Center
                </span>
              </div>
            </div>
            <figure>
              <h4>
                Spa Center
              </h4>
              <figcaption>
                Unparalleled devotion to luxury
              </figcaption>
            </figure>
            <a href="#wellness">
              Anchor link
            </a>
          </li>
          <li className="stretcher-item" style={{ backgroundImage: "url(/assets/images/facility-gym.jpg)" }}>
            <div className="stretcher-logo">
              <div className="text">
                <span className="text-intro h2">
                  Gym
                </span>
              </div>
            </div>
            <figure>
              <h4>
                Gym
              </h4>
              <figcaption>
                Care about results
              </figcaption>
            </figure>
            <a href="#wellness">
              Anchor link
            </a>
          </li>
          <li className="stretcher-item" style={{ backgroundImage: "url(/assets/images/facility-pool.jpg)" }}>
            <div className="stretcher-logo">
              <div className="text">
                <span className="text-intro h2">
                  Swimming Pool
                </span>
              </div>
            </div>
            <figure>
              <h4>
                Swimming Pool
              </h4>
              <figcaption>
                Your daily relaxation
              </figcaption>
            </figure>
            <a href="#recreation">
              Anchor link
            </a>
          </li>
          <li className="stretcher-item" style={{ backgroundImage: "url(/assets/images/facility-business.jpg)" }}>
            <div className="stretcher-logo">
              <div className="text">
                <span className="text-intro h2">
                  Business Center
                </span>
              </div>
            </div>
            <figure>
              <h4>
                Business Center
              </h4>
              <figcaption>
                Professional services
              </figcaption>
            </figure>
            <a href="#business">
              Anchor link
            </a>
          </li>
          <li className="stretcher-item more">
            <div className="more-icon">
              <span data-title-show="Show more" data-title-hide="+" />
            </div>
            <a href="#" />
          </li>
        </ul>
      </section>
      {/* ========================  Facilities Grid ======================== */}
      <section className="facilities">
        <div className="section-header text-center">
          <div className="container">
            <h2 className="title">
              Hotel Services
            </h2>
            <p>
              Experience & Amenities
            </p>
          </div>
        </div>
        <div className="container">
          <div className="facilities-wrapper">
            <div className="row">
              <div className="col-xs-6 col-sm-3">
                <figure>
                  <figcaption>
                    <span className="hotelicon hotelicon-roomservice" />
                    <p className="title">
                      24/7 Room Service
                    </p>
                  </figcaption>
                </figure>
              </div>
              <div className="col-xs-6 col-sm-3">
                <figure>
                  <figcaption>
                    <span className="hotelicon hotelicon-wifi" />
                    <p className="title">
                      Free WiFi
                    </p>
                  </figcaption>
                </figure>
              </div>
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
              <div className="col-xs-6 col-sm-3">
                <figure>
                  <figcaption>
                    <span className="hotelicon hotelicon-coctail" />
                    <p className="title">
                      Cocktail Bar
                    </p>
                  </figcaption>
                </figure>
              </div>
              <div className="col-xs-6 col-sm-3">
                <figure>
                  <figcaption>
                    <span className="hotelicon hotelicon-parking" />
                    <p className="title">
                      Free Parking
                    </p>
                  </figcaption>
                </figure>
              </div>
              <div className="col-xs-6 col-sm-3">
                <figure>
                  <figcaption>
                    <span className="hotelicon hotelicon-pool" />
                    <p className="title">
                      Swimming Pool
                    </p>
                  </figcaption>
                </figure>
              </div>
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
              <div className="col-xs-6 col-sm-3">
                <figure>
                  <figcaption>
                    <span className="hotelicon hotelicon-keys" />
                    <p className="title">
                      24/7 Reception
                    </p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /wrapper */}
      {/* Facility Booking Modal */}
      <div className="modal fade booking-modal" id="bookingModal" tabIndex="-1" role="dialog" aria-labelledby="bookingModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  ×
                </span>
              </button>
              <h4 className="modal-title" id="bookingModalLabel">
                Book Facility
              </h4>
            </div>
            <form action="/facilities/book" method="POST" id="facilityBookingForm">
              <div className="modal-body">
                <input type="hidden" name="facilityName" id="modalFacilityName" />
                <div className="form-group">
                  <label htmlFor="bookingDate">
                    Booking Date *
                  </label>
                  {' '}
                  <input type="date" className="form-control" id="bookingDate" name="bookingDate" required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label htmlFor="bookingTime">
                    Booking Time *
                  </label>
                  {' '}
                  <select className="form-control" id="bookingTime" name="bookingTime" required>
                    <option value="">
                      Select Time
                    </option>
                    <option value="09:00">
                      09:00 AM
                    </option>
                    <option value="10:00">
                      10:00 AM
                    </option>
                    <option value="11:00">
                      11:00 AM
                    </option>
                    <option value="12:00">
                      12:00 PM
                    </option>
                    <option value="13:00">
                      01:00 PM
                    </option>
                    <option value="14:00">
                      02:00 PM
                    </option>
                    <option value="15:00">
                      03:00 PM
                    </option>
                    <option value="16:00">
                      04:00 PM
                    </option>
                    <option value="17:00">
                      05:00 PM
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="duration">
                    Duration (hours) *
                  </label>
                  {' '}
                  <select className="form-control" id="duration" name="duration" required>
                    <option value="1">
                      1 hour
                    </option>
                    <option value="2">
                      2 hours
                    </option>
                    <option value="3">
                      3 hours
                    </option>
                    <option value="4">
                      4 hours
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="guests">
                    Number of Guests
                  </label>
                  {' '}
                  <input type="number" className="form-control" id="guests" name="guests" min="1" max="50" defaultValue="1" />
                </div>
                <div className="form-group">
                  <label htmlFor="specialRequests">
                    Special Requests
                  </label>
                  {' '}
                  <textarea className="form-control" id="specialRequests" name="specialRequests" rows="3" placeholder="Any special requirements or requests..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">
                  Cancel
                </button>
                {' '}
                <button type="submit" className="btn btn-main">
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <PageScript src="/js/pages/facilities.js" />
    </>
  );
}
