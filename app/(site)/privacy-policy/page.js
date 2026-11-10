import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/privacy-policy';

export const metadata = {
  title: "Privacy Policy - Full Moon Hotels",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      {/* ========================  Page header ======================== */}
      <section className="page">
        <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
          <div className="container">
            <h2 className="title">
              Privacy Policy
            </h2>
            <p>
              Your privacy is important to us at Full Moon Hotels
            </p>
          </div>
        </div>
        {/* ========================  Privacy Policy Content ======================== */}
        <div className="container" style={{ padding: "60px 0" }}>
          <div className="row">
            <div className="col-md-12">
              {/* Introduction */}
              <div className="policy-section">
                <div className="highlight-box">
                  <h4>
                    <i className="fa fa-shield" />
                    {' '}Our Commitment to Your Privacy
                  </h4>
                  <p>
                    At Full Moon Hotels, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make reservations, or use our services.
                  </p>
                </div>
              </div>
              {/* Information We Collect */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-info-circle" />
                  {' '}Information We Collect
                </h3>
                <p>
                  We collect several types of information from and about users of our website, including:
                </p>
                <h5>
                  Personal Information:
                </h5>
                <ul className="policy-list">
                  <li>
                    <strong>
                      Contact Information:
                    </strong>
                    {' '}Name, email address, phone number, postal address
                  </li>
                  <li>
                    <strong>
                      Booking Information:
                    </strong>
                    {' '}Check-in/check-out dates, room preferences, special requests
                  </li>
                  <li>
                    <strong>
                      Payment Information:
                    </strong>
                    {' '}Credit/debit card details (securely processed through payment gateways)
                  </li>
                  <li>
                    <strong>
                      Identification:
                    </strong>
                    {' '}Government-issued ID for check-in purposes
                  </li>
                </ul>
                <h5>
                  Non-Personal Information:
                </h5>
                <ul className="policy-list">
                  <li>
                    <strong>
                      Technical Data:
                    </strong>
                    {' '}IP address, browser type, device information, operating system
                  </li>
                  <li>
                    <strong>
                      Usage Data:
                    </strong>
                    {' '}Pages visited, time spent on site, booking patterns
                  </li>
                  <li>
                    <strong>
                      Cookies:
                    </strong>
                    {' '}We use cookies to enhance your browsing experience
                  </li>
                </ul>
              </div>
              {/* How We Use Your Information */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-cogs" />
                  {' '}How We Use Your Information
                </h3>
                <p>
                  We use the information we collect for various purposes, including:
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card border-light mb-3">
                      <div className="card-body">
                        <h5 className="card-title">
                          <i className="fa fa-bed text-primary" />
                          {' '}Service Provision
                        </h5>
                        <p className="card-text">
                          To process your reservations, manage your stay, and provide requested services
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-light mb-3">
                      <div className="card-body">
                        <h5 className="card-title">
                          <i className="fa fa-envelope text-warning" />
                          {' '}Communication
                        </h5>
                        <p className="card-text">
                          To send booking confirmations, updates, and respond to your inquiries
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-light mb-3">
                      <div className="card-body">
                        <h5 className="card-title">
                          <i className="fa fa-chart-line text-success" />
                          {' '}Improvements
                        </h5>
                        <p className="card-text">
                          To analyze website usage and improve our services and user experience
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-light mb-3">
                      <div className="card-body">
                        <h5 className="card-title">
                          <i className="fa fa-shield-alt text-danger" />
                          {' '}Security
                        </h5>
                        <p className="card-text">
                          To detect and prevent fraudulent activities and ensure website security
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Data Sharing and Disclosure */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-share-alt" />
                  {' '}Data Sharing and Disclosure
                </h3>
                <p>
                  We may share your information in the following circumstances:
                </p>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>
                          Purpose
                        </th>
                        <th>
                          With Whom
                        </th>
                        <th>
                          What Information
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          Service Providers
                        </td>
                        <td>
                          Payment processors, booking systems
                        </td>
                        <td>
                          Booking details, payment information
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Legal Requirements
                        </td>
                        <td>
                          Law enforcement, government agencies
                        </td>
                        <td>
                          Required by law or legal process
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Business Transfers
                        </td>
                        <td>
                          Successor entities in mergers/acquisitions
                        </td>
                        <td>
                          All stored information
                        </td>
                      </tr>
                      <tr>
                        <td>
                          With Your Consent
                        </td>
                        <td>
                          Third parties you authorize
                        </td>
                        <td>
                          Specified information only
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Data Security */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-lock" />
                  {' '}Data Security
                </h3>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information:
                </p>
                <div className="row text-center">
                  <div className="col-md-3 mb-3">
                    <div className="p-3 border rounded">
                      <i className="fa fa-credit-card fa-2x text-primary mb-2" />
                      <h6>
                        SSL Encryption
                      </h6>
                      <small>
                        All data transfers are encrypted
                      </small>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="p-3 border rounded">
                      <i className="fa fa-database fa-2x text-success mb-2" />
                      <h6>
                        Secure Storage
                      </h6>
                      <small>
                        Protected database systems
                      </small>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="p-3 border rounded">
                      <i className="fa fa-user-shield fa-2x text-warning mb-2" />
                      <h6>
                        Access Control
                      </h6>
                      <small>
                        Limited employee access
                      </small>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="p-3 border rounded">
                      <i className="fa fa-sync fa-2x text-danger mb-2" />
                      <h6>
                        Regular Audits
                      </h6>
                      <small>
                        Continuous security monitoring
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              {/* Your Rights */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-user-check" />
                  {' '}Your Privacy Rights
                </h3>
                <p>
                  You have certain rights regarding your personal information:
                </p>
                <div className="row">
                  <div className="col-md-12">
                    <div className="list-group">
                      <div className="list-group-item">
                        <h6 className="mb-1">
                          <i className="fa fa-eye text-info" />
                          {' '}Right to Access
                        </h6>
                        <small>
                          Request a copy of your personal data we hold
                        </small>
                      </div>
                      <div className="list-group-item">
                        <h6 className="mb-1">
                          <i className="fa fa-edit text-primary" />
                          {' '}Right to Correction
                        </h6>
                        <small>
                          Request correction of inaccurate personal data
                        </small>
                      </div>
                      <div className="list-group-item">
                        <h6 className="mb-1">
                          <i className="fa fa-trash text-danger" />
                          {' '}Right to Deletion
                        </h6>
                        <small>
                          Request deletion of your personal data under certain conditions
                        </small>
                      </div>
                      <div className="list-group-item">
                        <h6 className="mb-1">
                          <i className="fa fa-ban text-warning" />
                          {' '}Right to Object
                        </h6>
                        <small>
                          Object to processing of your personal data
                        </small>
                      </div>
                      <div className="list-group-item">
                        <h6 className="mb-1">
                          <i className="fa fa-download text-success" />
                          {' '}Data Portability
                        </h6>
                        <small>
                          Receive your data in a structured, commonly used format
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Cookies Policy */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-cookie" />
                  {' '}Cookies Policy
                </h3>
                <p>
                  We use cookies and similar tracking technologies to track activity on our website:
                </p>
                <div className="row">
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-header bg-primary text-white">
                        <h6 className="mb-0">
                          Essential Cookies
                        </h6>
                      </div>
                      <div className="card-body">
                        <small>
                          Required for website functionality and security
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-header bg-success text-white">
                        <h6 className="mb-0">
                          Performance Cookies
                        </h6>
                      </div>
                      <div className="card-body">
                        <small>
                          Help us understand how visitors interact with our website
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-header bg-info text-white">
                        <h6 className="mb-0">
                          Functional Cookies
                        </h6>
                      </div>
                      <div className="card-body">
                        <small>
                          Remember your preferences and settings
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="alert alert-info">
                  <i className="fa fa-info-circle" />
                  {' '}You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.
                </div>
              </div>
              {/* Children's Privacy */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-child" />
                  {' '}Children's Privacy
                </h3>
                <p>
                  Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </div>
              {/* Third-Party Links */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-external-link-alt" />
                  {' '}Third-Party Links
                </h3>
                <p>
                  Our website may contain links to third-party websites. This Privacy Policy does not apply to those websites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </div>
              {/* International Data Transfers */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-globe" />
                  {' '}International Data Transfers
                </h3>
                <p>
                  Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
                </p>
              </div>
              {/* Changes to Privacy Policy */}
              <div className="policy-section">
                <h3>
                  <i className="fa fa-history" />
                  {' '}Changes to This Privacy Policy
                </h3>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>
              {/* Contact Information */}
              <div className="contact-info">
                <h3>
                  <i className="fa fa-headset" />
                  {' '}Contact Us
                </h3>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <h5>
                      <i className="fa fa-envelope" />
                      {' '}Email
                    </h5>
                    <p>
                      privacy@fullmoon-hotels.com
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h5>
                      <i className="fa fa-phone" />
                      {' '}Phone
                    </h5>
                    <p>
                      +234 (0) 812 313 9279 | +234 (0) 704 210 9087 | +234 (0) 903 886 9936
                    </p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <h5>
                      <i className="fa fa-map-marker-alt" />
                      {' '}Postal Address
                    </h5>
                    <p>
                      Data Protection Officer
                      <br />
                      {' '}Plot H-1 Fullmoon Avenue, by Akanchawa Road{' '}
                      <br />
                      {' '}Housing Area "C", New Owerri{' '}
                      <br />
                      {' '}Owerri 460721, Imo State
                    </p>
                  </div>
                </div>
              </div>
              {/* Last Updated */}
              <div className="last-updated">
                <p>
                  <i className="fa fa-calendar-alt" />
                  {' '}This Privacy Policy was last updated on{' '}
                  <strong>
                    December 9, 2025
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* JavaScript files */}
      <PageScript src="/js/pages/privacy-policy.js" />
    </>
  );
}
