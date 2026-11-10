import pageCss from '@/components/page-css/laundry';

export const metadata = {
  title: "Laundry & Dry Cleaning Services - Full Moon Hotels",
  description: "Professional laundry and dry cleaning services at Full Moon Hotels Owerri. Fast, reliable, and premium quality cleaning for our guests.",
};

export default function LaundryPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
        <section className="page">
          <div className="page-header" style={{ backgroundImage: "url('/assets/images/header-laundry.jpg')" }}>
            <div className="container">
              <h2 className="title">
                Laundry Services
              </h2>
              <p>
                Professional cleaning services & premium care
              </p>
            </div>
          </div>
          <div className="container" style={{ padding: "60px 0" }}>
            <div className="row" id="services">
              <div className="col-md-4">
                <div className="service-card">
                  <div className="service-icon">
                    <i className="fa fa-tint" />
                  </div>
                  <h3>
                    Laundry Service
                  </h3>
                  <p>
                    Professional washing, drying, and folding of your everyday garments. Perfect for casual wear and regular clothing.
                  </p>
                  <ul className="list-unstyled">
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Same-day service available
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Eco-friendly detergents
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Gentle on fabrics
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="service-card">
                  <div className="service-icon">
                    <i className="fa fa-snowflake-o" />
                  </div>
                  <h3>
                    Dry Cleaning
                  </h3>
                  <p>
                    Expert dry cleaning for delicate fabrics, suits, formal wear, and special occasion garments.
                  </p>
                  <ul className="list-unstyled">
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Next-day service
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Stain removal expertise
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Professional pressing
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="service-card">
                  <div className="service-icon">
                    <i className="fa fa-magic" />
                  </div>
                  <h3>
                    Premium Care
                  </h3>
                  <p>
                    Specialized care for luxury items, including wedding dresses, leather, and delicate accessories.
                  </p>
                  <ul className="list-unstyled">
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Hand-washing available
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Luxury fabric expertise
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Preservation services
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: "60px" }}>
              <div className="col-md-12">
                <div className="section-header text-center">
                  <h2 className="title">
                    How It Works
                  </h2>
                  <p>
                    Simple and convenient laundry service process
                  </p>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="process-step">
                      <div className="step-number">
                        1
                      </div>
                      <h4>
                        Request Service
                      </h4>
                      <p>
                        Call housekeeping or fill the laundry form in your room
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="process-step">
                      <div className="step-number">
                        2
                      </div>
                      <h4>
                        Collection
                      </h4>
                      <p>
                        We collect your laundry from your room at your preferred time
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="process-step">
                      <div className="step-number">
                        3
                      </div>
                      <h4>
                        Professional Care
                      </h4>
                      <p>
                        Expert cleaning with premium products and careful handling
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="process-step">
                      <div className="step-number">
                        4
                      </div>
                      <h4>
                        Delivery
                      </h4>
                      <p>
                        Fresh, clean garments delivered back to your room
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: "60px" }}>
              <div className="col-md-8 col-md-offset-2 text-center">
                <div className="service-card">
                  <h2>
                    Bookings & Enquiries
                  </h2>
                  <p className="lead">
                    Contact our housekeeping department for immediate assistance or to schedule a pickup
                  </p>
                  <div className="row" style={{ marginTop: "30px" }}>
                    <div className="col-md-6">
                      <h4>
                        <i className="fa fa-phone" />
                        {' '}Phone
                      </h4>
                      <p>
                        +234 (0) 812 313 9279
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h4>
                        <i className="fa fa-clock-o" />
                        {' '}Service Hours
                      </h4>
                      <p>
                        Daily: 7:00 AM - 9:00 PM
                      </p>
                      <p>
                        Emergency: 24/7 Available
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: "30px" }}>
                    <a href="tel:+2348123139279" className="btn btn-main btn-lg">
                      <i className="fa fa-phone" />
                      {' '}Call Housekeeping
                    </a>
                    {' '}
                    <a href="/contact" className="btn btn-default btn-lg">
                      General Enquiry
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
