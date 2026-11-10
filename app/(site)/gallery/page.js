import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/gallery';

export const metadata = {
  title: "Photo Gallery - Full Moon Hotels",
  description: "Explore our stunning photo gallery showcasing luxurious rooms, premium facilities, and beautiful spaces at Full Moon Hotels Owerri.",
};

export default function GalleryPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
        {/* ======================== Gallery ======================== */}
        <section className="page">
          {/* ===  Page header === */}
          <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
            <div className="container">
              <h2 className="title">
                Photo Gallery
              </h2>
              <p>
                Discover the Beauty of Full Moon Hotels
              </p>
            </div>
          </div>
          <div className="gallery-page">
            <div className="container">
              {/* ======================== Cards Section ======================== */}
              <section className="cards" style={{ paddingTop: "200px" }}>
                {/* === All Photos Section === */}
                <div className="gallery-section" id="all-photos">
                  <div className="section-header">
                    <div className="container">
                      <h2 className="title">
                        Hotel Gallery
                      </h2>
                      <p>
                        Explore our luxurious accommodations and premium facilities
                      </p>
                    </div>
                  </div>
                  {/* Gallery Filter */}
                  <div className="gallery-filter">
                    <button className="filter-btn active" data-filter="all">
                      All Photos
                    </button>
                    {' '}
                    <button className="filter-btn" data-filter="rooms">
                      Rooms & Suites
                    </button>
                    {' '}
                    <button className="filter-btn" data-filter="facilities">
                      Facilities
                    </button>
                    {' '}
                    <button className="filter-btn" data-filter="dining">
                      Dining
                    </button>
                    {' '}
                    <button className="filter-btn" data-filter="events">
                      Events
                    </button>
                    {' '}
                    <button className="filter-btn" data-filter="exterior">
                      Hotel Exterior
                    </button>
                  </div>
                  <div className="container">
                    <div className="row">
                      {/* === Featured Item (Large) === */}
                      <div className="col-xs-12 col-md-8">
                        <figure>
                          <a href="/assets/images/cigar-lounge.jpg" title="Chic Open-Air Escape">
                            <figcaption style={{ backgroundImage: "url(/assets/images/cigar-lounge.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/cigar-lounge.jpg" alt="Chic Open-Air Escape" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Chic Open-Air Escape
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Premium Ambience === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/lobby-1.jpg" title="Premium Ambience">
                            <figcaption style={{ backgroundImage: "url(/assets/images/lobby-1.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/lobby-1.jpg" alt="Premium Ambience" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Premium Ambience
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Intimate Coffee Nook === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/coffeebar-1.jpg" title="Intimate Coffee Nook">
                            <figcaption style={{ backgroundImage: "url(/assets/images/coffeebar-1.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/coffeebar-1.jpg" alt="Intimate Coffee Nook" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Intimate Coffee Nook
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Karaoke Lounge === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/karaoke-bar.jpg" title="Karaoke Lounge">
                            <figcaption style={{ backgroundImage: "url(/assets/images/karaoke-bar.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/karaoke-bar.jpg" alt="Exclusive Music Lounge" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Karaoke Lounge
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Fine Dining === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/gallery-dining.jpg" title="Fine Dining">
                            <figcaption style={{ backgroundImage: "url(/assets/images/gallery-dining.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/gallery-dining.jpg" alt="Fine Dining" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Fine Dining
                            </span>
                          </a>
                        </figure>
                      </div>
                    </div>
                    {/* /row */}
                  </div>
                  {/* /container */}
                </div>
                {/* === Rooms & Suites Section === */}
                <div className="gallery-section" id="rooms-section" style={{ display: "none" }}>
                  <div className="section-header">
                    <div className="container">
                      <h2 className="title">
                        Rooms & Suites
                      </h2>
                      <p>
                        Luxurious accommodations for business and leisure
                      </p>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row">
                      {/* === Deluxe Room (Large) === */}
                      <div className="col-xs-12 col-md-8">
                        <figure>
                          <a href="/assets/images/room-deluxe.jpg" title="Deluxe Room">
                            <figcaption style={{ backgroundImage: "url(/assets/images/room-deluxe.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/room-deluxe.jpg" alt="Deluxe Room" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Deluxe Room
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Executive Suite === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/room-executive.jpg" title="Executive Suite">
                            <figcaption style={{ backgroundImage: "url(/assets/images/room-executive.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/room-executive.jpg" alt="Executive Suite" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Executive Suite
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Penthouse Suite === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/room-penthouse-single.jpg" title="Penthouse Suite">
                            <figcaption style={{ backgroundImage: "url(/assets/images/room-penthouse-single.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/room-penthouse-single.jpg" alt="Penthouse Suite" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Penthouse Suite
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Premiere Room === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/room-premiere.jpg" title="Premiere Room">
                            <figcaption style={{ backgroundImage: "url(/assets/images/room-premiere.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/room-premiere.jpg" alt="Premiere Room" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Premiere Room
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Annex Room === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/room-annex.jpg" title="Annex Room">
                            <figcaption style={{ backgroundImage: "url(/assets/images/room-annex.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/room-annex.jpg" alt="Annex Room" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Annex Room
                            </span>
                          </a>
                        </figure>
                      </div>
                    </div>
                    {/* /row */}
                  </div>
                  {/* /container */}
                </div>
                {/* === Facilities Section === */}
                <div className="gallery-section" id="facilities-section" style={{ display: "none" }}>
                  <div className="section-header">
                    <div className="container">
                      <h2 className="title">
                        Hotel Facilities
                      </h2>
                      <p>
                        Premium amenities for business and leisure travelers
                      </p>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row">
                      {/* === Spa Center (Large) === */}
                      <div className="col-xs-12 col-md-8">
                        <figure>
                          <a href="/assets/images/facility-spa.jpg" title="Spa & Wellness Center">
                            <figcaption style={{ backgroundImage: "url(/assets/images/facility-spa.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/facility-spa.jpg" alt="Spa & Wellness Center" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Spa & Wellness
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Fitness Center === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/facility-gym.jpg" title="Fitness Center">
                            <figcaption style={{ backgroundImage: "url(/assets/images/facility-gym.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/facility-gym.jpg" alt="Fitness Center" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Fitness Center
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Swimming Pool === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/facility-pool.jpg" title="Swimming Pool">
                            <figcaption style={{ backgroundImage: "url(/assets/images/facility-pool.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/facility-pool.jpg" alt="Swimming Pool" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Swimming Pool
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Business Center === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/facility-business.jpg" title="Business Center">
                            <figcaption style={{ backgroundImage: "url(/assets/images/facility-business.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/facility-business.jpg" alt="Business Center" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Business Center
                            </span>
                          </a>
                        </figure>
                      </div>
                      {/* === Event Spaces === */}
                      <div className="col-xs-6 col-md-4">
                        <figure>
                          <a href="/assets/images/facility-event.jpg" title="Event Spaces">
                            <figcaption style={{ backgroundImage: "url(/assets/images/facility-event.jpg)" }}>
                              <img loading="lazy" decoding="async" src="/assets/images/facility-event.jpg" alt="Event Spaces" />
                            </figcaption>
                            <span className="btn btn-clean">
                              Event Spaces
                            </span>
                          </a>
                        </figure>
                      </div>
                    </div>
                    {/* /row */}
                  </div>
                  {/* /container */}
                </div>
                {/* Continue with the same pattern for other sections (Dining, Events, Exterior) */}
                {/* Make sure to update ALL figure elements in the same way */}
              </section>
              {/* /cards */}
              {/* Call to Action */}
              <div className="text-center" style={{ padding: "50px 0" }}>
                <h3>
                  Experience Our Luxury Firsthand
                </h3>
                <p className="lead" style={{ margin: "20px 0" }}>
                  Book your stay and create your own memorable moments at Full Moon Hotels
                </p>
                <a href="/rooms" className="btn btn-main btn-lg">
                  View Rooms & Suites
                </a>
                {' '}
                <a href="/contact" className="btn btn-default btn-lg">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      <PageScript src="/js/pages/gallery.js" />
    </>
  );
}
