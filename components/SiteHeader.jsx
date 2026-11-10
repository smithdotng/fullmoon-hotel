// Header markup from the original views/layout.ejs. Plain <a> links on purpose:
// each page is a full load so the jQuery theme initialises cleanly.
export default function SiteHeader() {
  return (
    <header>
      <div className="container">
        {/* Top navigation (desktop only) */}
        <nav className="navigation-top clearfix">
          <div className="navigation-top-left">
            <a className="box" href="https://www.facebook.com/FullMoonHotels.Owerri/">
              <i className="fa fa-facebook" />
            </a>
            <a className="box" href="https://www.instagram.com/FullMoonHotels.Owerri/">
              <i className="fa fa-instagram" />
            </a>
          </div>
          <div className="navigation-top-right">
            <a className="box" href="#">
              <i className="icon icon-star" /> Special offers
            </a>
            <a className="box" href="/rooms">
              <i className="icon icon-tag" /> Reservations
            </a>
            <a className="box" href="#">
              <i className="icon icon-phone-handset" /> +234 (0) 812 313 9279 | +234 (0) 704 210 9087
            </a>
          </div>
        </nav>

        {/* Main navigation */}
        <nav className="navigation-main clearfix">
          <div className="logo animated fadeIn">
            <a href="/">
              <img className="logo-desktop" src="/assets/images/logo.png" alt="Full Moon Hotels" />
              <img className="logo-mobile" src="/assets/images/logo-mobile.png" alt="Full Moon Hotels" />
            </a>
          </div>

          <div className="toggle-menu">
            <i className="icon icon-menu" />
          </div>

          <div className="navigation-block clearfix">
            {/* Mobile Menu Header (inside sliding panel) */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-logo-new">
                <img src="/assets/images/logo.png" alt="Full Moon Hotels" />
              </div>
              <button className="mobile-menu-close" aria-label="Close menu">
                <i className="fa fa-times" />
              </button>
            </div>

            <ul className="navigation-left">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/rooms">
                  Rooms{' '}
                  <span className="open-dropdown">
                    <i className="fa fa-angle-down" />
                  </span>
                </a>
                <ul>
                  <li><a href="/rooms">All Room Types</a></li>
                  <li><a href="/rooms/category/Premiere">Premiere Room</a></li>
                  <li><a href="/rooms/category/Deluxe">Deluxe Room</a></li>
                  <li><a href="/rooms/category/Executive">Executive Room</a></li>
                  <li><a href="/rooms/category/Penthouse-single">Penthouse Single Suites</a></li>
                  <li><a href="/rooms/category/Penthouse-double">Penthouse Double Suites</a></li>
                </ul>
              </li>
              <li>
                <a href="/facilities">Facilities</a>
              </li>
            </ul>
            <ul className="navigation-right">
              <li>
                <a href="#">
                  Services
                  <span className="open-dropdown">
                    <i className="fa fa-angle-down" />
                  </span>
                </a>
                <ul>
                  <li><a href="/gym">Gym</a></li>
                  <li><a href="/laundry">Laundry</a></li>
                </ul>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
