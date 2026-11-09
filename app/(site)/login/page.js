import { redirect } from 'next/navigation';
import { readFlash } from '@/lib/flash';
import { getCurrentUser } from '@/lib/session';
import { isAdminUser } from '@/lib/auth';
import pageCss from '@/components/page-css/login';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Login - Full Moon Hotels",
};

const DENIED = {
  admin: 'Please login as administrator to access this page',
};

export default async function Page({ searchParams }) {
  if (isAdminUser(await getCurrentUser())) redirect('/admin');
  const { denied } = await searchParams;
  const messages = await readFlash();
  if (DENIED[denied]) messages.error = [...(messages.error || []), DENIED[denied]];
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
        {/* ======================== Main Content ======================== */}
        <section className="page">
          {/* === Page header === */}
          <div className="page-header" style={{ backgroundImage: "url(/assets/images/header-1.jpg)" }}>
            <div className="container">
              <h2 className="title">
                Admin Login
              </h2>
              <p>
                Access your admin dashboard
              </p>
            </div>
          </div>
          {/* === Login Content === */}
          <div className="login-container">
            <div className="login-wrapper">
              <div className="login-card">
                <div className="card-header text-center">
                  <i className="fa fa-lock lock-icon" />
                  <h3 className="login-title">
                    Admin Login
                  </h3>
                  <p className="login-subtitle">
                    Access your dashboard
                  </p>
                </div>
                <div className="card-body">
                  
      {messages.error?.length > 0 && (
<div className="alert alert-danger alert-dismissible fade show text-center" role="alert">
                    <i className="fa fa-exclamation-circle me-2" />
                    {messages.error.join(' ')}{' '}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" />
                  </div>
)}
       
      {messages.success?.length > 0 && (
<div className="alert alert-success alert-dismissible fade show text-center" role="alert">
                    <i className="fa fa-check-circle me-2" />
                    {messages.success.join(' ')}{' '}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" />
                  </div>
)}
      
                  <form action="/api/auth/login" method="POST" className="login-form">
                    <div className="form-group">
                      <label htmlFor="username" className="form-label">
                        Username or Email
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa fa-user" />
                        </span>
                        {' '}
                        <input type="text" className="form-control" id="username" name="username" placeholder="Enter your username or email" required autoFocus />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa fa-key" />
                        </span>
                        {' '}
                        <input type="password" className="form-control" id="password" name="password" placeholder="Enter your password" required />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-login">
                      <i className="fa fa-sign-in me-2" />
                      Login to Dashboard
                    </button>
                  </form>
                  <div className="text-center back-home">
                    <a href="/" className="back-link">
                      <i className="fa fa-arrow-left me-1" />
                      Back to Home
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ======================== Subscribe ======================== */}
        <section className="subscribe">
          <div className="container">
            <div className="box">
              <h2 className="title">
                Stay Updated
              </h2>
              <div className="text">
                <p>
                  Subscribe to receive exclusive deals & promotions
                </p>
              </div>
              <div className="form-group">
                <input type="text" defaultValue="" placeholder="Your email" className="form-control" />
                {' '}
                <button className="btn btn-sm btn-main">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
