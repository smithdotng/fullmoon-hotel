export default function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="footer-links">
          <div className="row">
            <div className="col-sm-6 footer-left">
              <a href="/privacy-policy">Privacy policy</a> |{' '}
              <a href="#" title="To be announced">
                Careers
              </a>
            </div>
            <div className="col-sm-6 footer-right">
              <a href="/gallery">Gallery</a> | <a href="/rooms">Reservations</a> | <a href="/contact">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="footer-social">
          <div className="row">
            <div className="col-sm-12 icons">
              <ul>
                <li>
                  <a href="https://www.facebook.com/FullMoonHotels.Owerri/">
                    <i className="fa fa-facebook" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/FullMoonHotels.Owerri/">
                    <i className="fa fa-instagram" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-sm-12 copyright">
              <small>Copyright © {new Date().getFullYear()} Full Moon Hotels | All Rights Reserved</small>
            </div>
            <div className="col-sm-12 text-center">
              <img loading="lazy" decoding="async" src="/assets/images/logo.png" alt="Full Moon Hotels" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
