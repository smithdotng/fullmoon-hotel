import { readFlash, readFormData } from '@/lib/flash';
import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/contact';

export const metadata = {
  title: "Contact Us - Full Moon Hotels Owerri",
  description: "Get in touch with Full Moon Hotels Owerri. Luxury accommodation with premium amenities and exceptional service. Call 0903 886 9936 or send us a message.",
};

export default async function ContactPage() {
  const messages = await readFlash();
  const formData = await readFormData();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
        {/* ======================== Contact ======================== */}
        <section className="page">
          {/* ===  Page header === */}
          <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
            <div className="container">
              <h2 className="title">
                Contact
              </h2>
              <p>
                The place, our services & our team
              </p>
            </div>
          </div>
          {/* Flash Messages */}
          
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
      
          {/* ===  Contact === */}
          <div className="contact">
            <div className="container">
              {/* === Static Map === */}
              <div className="map-static">
                <div className="container">
                  <div className="row">
                    <div className="col-md-8 col-md-offset-2 text-center">
                      <div className="map-placeholder">
                        <i className="icon icon-map-marker" style={{ fontSize: "48px", color: "#c19b76", marginBottom: "20px" }} />
                        <h3>
                          Our Location
                        </h3>
                        <p style={{ fontSize: "16px", marginBottom: "30px" }}>
                          Plot H-1 Fullmoon Avenue, by Akanchawa Road
                          <br />
                          {' '}Housing Area "C", New Owerri
                          <br />
                          {' '}Owerri 460721, Imo State
                        </p>
                        <a href="https://maps.google.com/maps?q=Plot+H-1+Fullmoon+Avenue+Housing+Area+C+New+Owerri" target="_blank" className="btn btn-main">
                          Get Directions on Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1">
                  {/* === Contact block === */}
                  <div className="contact-block">
                    {/* === Contact banner === */}
                    <div className="banner">
                      <div className="row">
                        <div className="col-md-offset-1 col-md-10 text-center">
                          <h2 className="title">
                            Send us a message
                          </h2>
                          <p>
                            Please use this form if you have any questions about our hotel{' '}
                            <br />
                            {' '}and we'll get back with you very soon.
                          </p>
                          <div className="contact-form-wrapper">
                            <a className="btn btn-clean open-form" data-text-open="Contact us via form" data-text-close="Close form">
                              Contact us via form
                            </a>
                            <div className="contact-form" id="contactForm" data-keep-open={messages.success || messages.error ? '1' : undefined}>
                              <form action="/contact/send" method="POST">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <input type="text" name="name" defaultValue={formData.name || ''} className="form-control" placeholder="Your name" required />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <input type="email" name="email" defaultValue={formData.email || ''} className="form-control" placeholder="Your email" required />
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <input type="text" name="subject" defaultValue={formData.subject || ''} className="form-control" placeholder="Subject" required />
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <textarea name="message" className="form-control" placeholder="Your message" rows="10" required defaultValue={formData.message || ''} />
                                    </div>
                                  </div>
                                  <div className="col-md-12 text-center">
                                    <input type="submit" className="btn btn-clean" value="Send message" />
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* === Contact info === */}
                    <div className="contact-info">
                      <div className="row">
                        <div className="col-sm-4">
                          <figure className="text-center">
                            <span className="icon icon-map-marker" />
                            <figcaption>
                              <strong>
                                Where are we?
                              </strong>
                              {' '}
                              <span>
                                Plot H-1 Fullmoon Avenue,{' '}
                                <br />
                                {' '}Housing Area "C", New Owerri,{' '}
                                <br />
                                {' '}Owerri 460721, Imo State
                              </span>
                            </figcaption>
                          </figure>
                        </div>
                        <div className="col-sm-4">
                          <figure className="text-center">
                            <span className="icon icon-phone" />
                            <figcaption>
                              <strong>
                                Call us
                              </strong>
                              {' '}
                              <span>
                                <strong>
                                  T
                                </strong>
                                {' '}+234 (0) 812 313 9279 | +234 (0) 704 210 9087{' '}
                                <br />
                                {' '}
                                <strong>
                                  E
                                </strong>
                                {' '}info@fullmoon-hotels.com
                              </span>
                            </figcaption>
                          </figure>
                        </div>
                        <div className="col-sm-4">
                          <figure className="text-center">
                            <span className="icon icon-clock" />
                            <figcaption>
                              <strong>
                                Working hours
                              </strong>
                              {' '}
                              <span>
                                <strong>
                                  Reception
                                </strong>
                                {' '}24/7{' '}
                                <br />
                                {' '}
                                <strong>
                                  Check-in
                                </strong>
                                {' '}2:00 PM
                                <br />
                                {' '}
                                <strong>
                                  Check-out
                                </strong>
                                {' '}12:00 PM
                              </span>
                            </figcaption>
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /contact-block */}
                </div>
                {/* col-sm-8 */}
              </div>
              {/* /row */}
            </div>
            {/* /container */}
          </div>
          {/* /contact */}
        </section>
      <PageScript src="/js/pages/contact.js" />
    </>
  );
}
