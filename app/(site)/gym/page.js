import { readFlash, readFormData } from '@/lib/flash';
import pageCss from '@/components/page-css/gym';

export const metadata = {
  title: "Fitness Centre - Full Moon Hotels",
  description: "State-of-the-art fitness centre at Full Moon Hotels Owerri. Modern equipment, personal training, and wellness services for hotel guests.",
};

export default async function GymPage() {
  const messages = await readFlash();
  const formData = await readFormData();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
        <section className="page">
          {/* === Page header === */}
          <div className="page-header" style={{ backgroundImage: "url('/assets/images/header-gym.jpg')" }}>
            <div className="container">
              <h2 className="title">
                Fitness Centre
              </h2>
              <p>
                Stay fit and energized during your stay
              </p>
            </div>
          </div>
          <div className="container" style={{ padding: "60px 0" }}>
            {/* Flash Messages Display */}
            
      {messages.error?.length > 0 ? (
            <div className="row">
              <div className="col-md-8 col-md-offset-2">
                <div className="alert-message alert-danger text-center">{messages.error[0]}</div>
              </div>
            </div>
          ) : messages.success?.length > 0 ? (
            <div className="row">
              <div className="col-md-8 col-md-offset-2">
                <div className="alert-message alert-success text-center">{messages.success[0]}</div>
              </div>
            </div>
          ) : null}
      
            {/* === Facilities Overview === */}
            <div className="row" id="facilities">
              <div className="col-md-4">
                <div className="service-card">
                  <div className="service-icon">
                    <i className="fa fa-bicycle" />
                  </div>
                  <h3>
                    Modern Equipment
                  </h3>
                  <p>
                    Train effectively with our range of cardio machines, treadmills, and stationary bikes designed for all fitness levels.
                  </p>
                  <ul className="list-unstyled">
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}High-end Treadmills
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Elliptical Machines
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Spinning Bikes
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="service-card">
                  <div className="service-icon">
                    <i className="fa fa-users" />
                  </div>
                  <h3>
                    Strength & Training
                  </h3>
                  <p>
                    Build strength with our comprehensive free weights section and resistance training machines.
                  </p>
                  <ul className="list-unstyled">
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Dumbbells & Barbells
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Bench Press Station
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Multi-Gym Station
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="service-card">
                  <div className="service-icon">
                    <i className="fa fa-heartbeat" />
                  </div>
                  <h3>
                    Wellness Space
                  </h3>
                  <p>
                    A dedicated area for stretching, yoga, and cooling down after your intense workout session.
                  </p>
                  <ul className="list-unstyled">
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Yoga Mats Available
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Stability Balls
                    </li>
                    <li className="benefit-item">
                      <i className="fa fa-check benefit-icon" />
                      {' '}Stretching Area
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* === Gym Highlights/Amenities (Process Steps) === */}
            <div className="row" style={{ marginTop: "60px" }}>
              <div className="col-md-12">
                <div className="section-header text-center">
                  <h2 className="title">
                    Facility Highlights
                  </h2>
                  <p>
                    Everything you need for a comfortable workout
                  </p>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="process-step">
                      <div className="step-number">
                        <i className="fa fa-snowflake-o" style={{ fontSize: "20px" }} />
                      </div>
                      <h4>
                        Air Conditioned
                      </h4>
                      <p>
                        Fully climate-controlled environment for your comfort
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="process-step">
                      <div className="step-number">
                        <i className="fa fa-tint" style={{ fontSize: "20px" }} />
                      </div>
                      <h4>
                        Hydration Station
                      </h4>
                      <p>
                        Complimentary water dispenser to keep you hydrated
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="process-step">
                      <div className="step-number">
                        <i className="fa fa-music" style={{ fontSize: "20px" }} />
                      </div>
                      <h4>
                        Audio System
                      </h4>
                      <p>
                        Motivational background music to keep you moving
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="process-step">
                      <div className="step-number">
                        <i className="fa fa-medkit" style={{ fontSize: "20px" }} />
                      </div>
                      <h4>
                        Sanitized
                      </h4>
                      <p>
                        Equipment cleaned regularly for your safety
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* === Enquiry Form Box (REPLACED STATIC CONTENT WITH FORM) === */}
            <div className="row" style={{ marginTop: "60px" }}>
              <div className="col-md-8 col-md-offset-2">
                <div className="service-card text-center">
                  <h2>
                    Membership & Training Enquiry
                  </h2>
                  <p className="lead">
                    Interested in a membership, personal training, or group class details? Send us a message!
                  </p>
                  <div className="row" style={{ marginTop: "30px", marginBottom: "30px" }}>
                    <div className="col-md-6">
                      <h4>
                        <i className="fa fa-phone" />
                        {' '}Direct Line
                      </h4>
                      <p>
                        +234 (0) 812 313 9279
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h4>
                        <i className="fa fa-clock-o" />
                        {' '}Operating Hours
                      </h4>
                      <p>
                        Daily: 6:00 AM - 10:00 PM
                      </p>
                    </div>
                  </div>
                  {/* Membership Enquiry Form, posts to the NEW self-contained route */}
                  <form method="POST" action="/gym/send-enquiry" className="clearfix">
                    {/* Hidden field to pre-set the subject for the backend */}
                    <input type="hidden" name="subject" value="Gym Membership Enquiry" />
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <input type="text" name="name" defaultValue={formData.name || ''} required className="form-control" placeholder="Your Name*" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <input type="email" name="email" defaultValue={formData.email || ''} required className="form-control" placeholder="Your Email*" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <textarea name="message" required className="form-control" rows="4" placeholder="Your Enquiry (e.g., 'I would like details on monthly membership rates.')*" defaultValue={formData.message || ''} />
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-main btn-lg">
                        <i className="fa fa-envelope-o" />
                        {' '}Send Enquiry
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
