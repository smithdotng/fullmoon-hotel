import pageCss from '@/components/page-css/error';

// Error page body from the original views/error.ejs
export default function ErrorContent({ error, title = 'Error' }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      <section className="page">
        <div className="page-header" style={{ backgroundImage: 'url(/assets/images/header-1.jpg)' }}>
          <div className="container">
            <h2 className="title">{title}</h2>
            <p>We apologize for the inconvenience</p>
          </div>
        </div>
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-8 mx-auto text-center">
              <div className="error-icon mb-4">
                <i className="fa fa-exclamation-triangle fa-5x text-warning" />
              </div>
              <h1 className="display-4 text-muted mb-3">Oops!</h1>
              <h2 className="mb-4 text-dark">{error}</h2>
              <p className="lead mb-4">
                We&apos;re sorry, but something went wrong. Our team has been notified and we&apos;re working to fix the issue.
              </p>
              <div className="error-actions mt-5">
                <a href="/" className="btn btn-main btn-lg mr-3">
                  <i className="fa fa-home" /> Go Home
                </a>{' '}
                <a href="/contact" className="btn btn-clean-dark btn-lg">
                  <i className="fa fa-phone" /> Contact Support
                </a>
              </div>
              <div className="mt-5">
                <p className="text-muted">You can also:</p>
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <a href="/rooms" className="btn btn-outline-primary btn-block mb-2">
                      <i className="fa fa-bed" /> Browse Rooms
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a href="/facilities" className="btn btn-outline-primary btn-block mb-2">
                      <i className="fa fa-star" /> View Facilities
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
