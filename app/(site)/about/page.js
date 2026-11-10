import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/about';

export const metadata = {
  title: "About Us - Full Moon Hotels",
  description: "Discover Full Moon Hotels Owerri - Luxury accommodation with premium amenities, exceptional service, and authentic Nigerian hospitality in the heart of Imo State.",
};

export default function AboutPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
        {/* ======================== About ======================== */}
        <section className="page">
          {/* ===  Page header === */}
          <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
            <div className="container">
              <h2 className="title">
                About Full Moon Hotels
              </h2>
              <p>
                Where Luxury Meets Authentic Nigerian Hospitality
              </p>
            </div>
          </div>
          <div className="image-blocks image-blocks-category">
            <div className="container">
              <div className="about">
                {/* text-block */}
                <div className="text-block">
                  <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                      <div className="text">
                        <span className="heritage-badge">
                          EST. 2014 • OWERRI'S PREMIER LUXURY DESTINATION
                        </span>
                        <h2>
                          Welcome to Full Moon Hotels
                        </h2>
                        {/* ===  Gallery === */}
                        <div className="gallery">
                          <div className="owl-slider owl-slider-gallery">
                            {/* === slide item === */}
                            <div className="item" style={{ backgroundImage: "url(/assets/images/hotel-exterior.jpg)" }} />
                            {/* === slide item === */}
                            <div className="item" style={{ backgroundImage: "url(/assets/images/lobby-area.jpg)" }} />
                            {/* === slide item === */}
                            <div className="item" style={{ backgroundImage: "url(/assets/images/pool-area.jpg)" }} />
                          </div>
                        </div>
                        <p>
                          <strong className="text-center">
                            Our Heritage & Vision
                          </strong>
                        </p>
                        <p>
                          Nestled in the vibrant heart of Owerri, Full Moon Hotels emerged as a beacon of luxury and comfort in 2014. Our hotel represents the perfect fusion of international luxury standards with the warm, authentic hospitality that Nigeria is renowned for worldwide.
                        </p>
                        <p>
                          We believe that true luxury lies in the details - from the carefully curated interior designs that reflect rich cultural motifs to the personalized service that makes every guest feel like royalty. Our commitment to excellence has made us the preferred choice for discerning travelers, business executives, and families seeking an unforgettable experience in Imo State.
                        </p>
                        <div className="cultural-highlight">
                          <h4 className="text-center">
                            🌟 Our Cultural Promise
                          </h4>
                          <p className="text-center" style={{ fontSize: "18px", fontStyle: "italic" }}>
                            "At Full Moon Hotels, we don't just host guests; we welcome them into our family. Every stay is an opportunity to share the rich heritage and warm spirit of Southeastern Nigeria."
                          </p>
                        </div>
                        {/* Excellence Features */}
                        <div className="row" style={{ margin: "40px 0" }}>
                          <div className="col-md-4">
                            <div className="excellence-item">
                              <i className="fa fa-shield" />
                              <h4>
                                Premium Security
                              </h4>
                              <p>
                                24/7 state-of-the-art security ensuring your complete peace of mind
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="excellence-item">
                              <i className="fa fa-leaf" />
                              <h4>
                                Sustainable Luxury
                              </h4>
                              <p>
                                Eco-friendly practices combined with uncompromised comfort in every one of our 84 rooms.
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="excellence-item">
                              <i className="fa fa-star" />
                              <h4>
                                Award-Winning
                              </h4>
                              <p>
                                Consistently rated among Owerri's top luxury accommodations
                              </p>
                            </div>
                          </div>
                        </div>
                        <p>
                          <strong className="text-center">
                            World-Class Facilities
                          </strong>
                        </p>
                        <p>
                          Full Moon Hotels offers an extensive range of premium facilities designed to cater to every need. Our{' '}
                          <strong>
                            Spa & Wellness Center
                          </strong>
                          {' '}provides traditional Nigerian treatments alongside international therapies, while our{' '}
                          <strong>
                            state-of-the-art Business Center
                          </strong>
                          {' '}ensures corporate travelers remain productive. The{' '}
                          <strong>
                            elegant event spaces
                          </strong>
                          {' '}have hosted numerous successful conferences, weddings, and social gatherings, each executed with impeccable precision.
                        </p>
                        <p>
                          Our culinary experiences are a journey through Nigerian and international cuisine, with our master chefs using locally sourced ingredients to create unforgettable dining experiences. The{' '}
                          <strong>
                            swimming pool
                          </strong>
                          {' '}and{' '}
                          <strong>
                            fitness center
                          </strong>
                          {' '}provide perfect spaces for relaxation and rejuvenation, completing our comprehensive approach to guest wellness.
                        </p>
                        <h2>
                          Our Commitment to Excellence
                        </h2>
                        {/* === Our team === */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* === Hotel Information Block === */}
                <div className="blocks blocks-left">
                  <div className="item">
                    <div className="text">
                      <div className="h2">
                        Hotel Information
                      </div>
                      <ul>
                        <li>
                          📍 Plot H-1 Fullmoon Avenue, Housing Area C, New Owerri
                        </li>
                        <li>
                          🕒 Check-in Time: 2:00 PM
                        </li>
                        <li>
                          🕛 Check-out Time: 12:00 PM
                        </li>
                        <li>
                          📶 Complimentary High-Speed WiFi
                        </li>
                        <li>
                          🚗 Secure Parking Available
                        </li>
                        <li>
                          👶 Family Rooms
                        </li>
                        <li>
                          💰 Best Price Guarantee
                        </li>
                        <li>
                          🎯 Early Check-In Available
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="image" style={{ backgroundImage: "url(/assets/images/room-penthouse-single.jpg)" }}>
                    <img loading="lazy" decoding="async" src="/assets/images/room-penthouse-single.jpg" alt="Full Moon Hotels Location" />
                  </div>
                </div>
                {/* === Premium Facilities Block === */}
                <div className="blocks blocks-right">
                  <div className="item">
                    <div className="text">
                      <div className="h2">
                        Premium Facilities
                      </div>
                      <ul>
                        <li>
                          💆‍♀️ Luxurious Spa & Wellness Center
                        </li>
                        <li>
                          💼 State-of-the-Art Business Center
                        </li>
                        <li>
                          🏊‍♂️ Outdoor Swimming Pool
                        </li>
                        <li>
                          💪 24/7 Fitness Center
                        </li>
                        <li>
                          🍽️ Fine Dining Restaurant
                        </li>
                        <li>
                          🥂 Cocktail & Lounge Bar
                        </li>
                        <li>
                          🎪 Multi-Purpose Event Spaces
                        </li>
                        <li>
                          🛎️ 24-Hour Concierge Service
                        </li>
                        <li>
                          🚗 Airport Transfer Services
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="image" style={{ backgroundImage: "url(/assets/images/room-penthouse-double.jpg)" }}>
                    <img loading="lazy" decoding="async" src="/assets/images/room-penthouse-double.jpg" alt="Full Moon Hotels Facilities" />
                  </div>
                </div>
                {/* === Community & Values === */}
                <div className="text-block">
                  <div className="row">
                    <div className="col-md-8 col-lg-offset-2">
                      <h2>
                        Our Values & Community Commitment
                      </h2>
                      <p>
                        At Full Moon Hotels, our success is deeply intertwined with the prosperity of our community. We proudly source over 80% of our ingredients from local farmers and suppliers, supporting the economic growth of Imo State. Our staff development programs have created numerous career opportunities for local youth, and we actively participate in community development initiatives throughout the year.
                      </p>
                      <div className="cultural-highlight">
                        <h4 className="text-center">
                          🌍 Sustainable Tourism Champion
                        </h4>
                        <p className="text-center">
                          Recognized as a leader in sustainable hospitality, we've implemented numerous eco-friendly practices including water conservation systems, solar energy utilization, and comprehensive recycling programs.
                        </p>
                      </div>
                      <h2>
                        Experience Owerri with Us
                      </h2>
                      <p>
                        Located in the heart of Southeastern Nigeria's cultural hub, Full Moon Hotels serves as your perfect gateway to explore Owerri's rich heritage. Our concierge team can curate unforgettable experiences that showcase the true spirit of Igbo land.
                      </p>
                      <div style={{ textAlign: "center", margin: "40px 0", padding: "30px", background: "linear-gradient(135deg, #f8f9fa, #e9ecef)", borderRadius: "8px" }}>
                        <h3>
                          Ready to Experience Full Moon Luxury?
                        </h3>
                        <p>
                          Book your stay today and discover why we're Owerri's premier choice for luxury accommodation.
                        </p>
                        <a href="/rooms" className="btn btn-main btn-lg" style={{ margin: "10px" }}>
                          View Our Rooms
                        </a>
                        {' '}
                        <a href="/contact" className="btn btn-default btn-lg" style={{ margin: "10px" }}>
                          Contact Us
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      <PageScript src="/js/pages/about.js" />
    </>
  );
}
