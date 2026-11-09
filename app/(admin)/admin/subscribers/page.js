import { Fragment } from 'react';
import { requireAdminPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';
import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/admin_subscribers';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Newsletter Subscribers" };

export default async function Page() {
  const user = await requireAdminPage();
  await dbConnect();
  const messages = {}; // flash messages are shown by the admin layout
  const subscribers = plain(await Subscriber.find({}).sort({ subscribedAt: -1 }).lean());
  const subscriberCount = subscribers.length;
  const activeCount = subscribers.filter((s) => s.isActive === true).length;
  const inactiveCount = subscriberCount - activeCount;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      <div className="container-fluid">
        <div className="row">
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">
                <i className="fa fa-users me-2" />
                Newsletter Subscribers
              </h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  <a href="/admin" className="btn btn-sm btn-outline-secondary">
                    <i className="fa fa-arrow-left me-1" />
                    Back to Dashboard
                  </a>
                  {' '}
                  <a href="/admin/subscribers/export" className="btn btn-sm btn-success" download="">
                    <i className="fa fa-download me-1" />
                    Export CSV
                  </a>
                </div>
              </div>
            </div>
            
      {(messages && messages.success) ? (<>
      
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {messages.success}{' '}
              <button type="button" className="btn-close" data-bs-dismiss="alert" />
            </div>
            
      </>) : null}
       
      {(messages && messages.error) ? (<>
      
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {messages.error}{' '}
              <button type="button" className="btn-close" data-bs-dismiss="alert" />
            </div>
            
      </>) : null}
      
            {/* Set default values for variables */}
            
      
      
            {/* Statistics */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="stat-card">
                  <h3>
                    {subscriberCount}
                  </h3>
                  <p className="mb-0">
                    Total Subscribers
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card" style={{ background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)" }}>
                  <h3>
                    {activeCount}
                  </h3>
                  <p className="mb-0">
                    Active
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card" style={{ background: "linear-gradient(135deg, #6c757d 0%, #adb5bd 100%)" }}>
                  <h3>
                    {inactiveCount}
                  </h3>
                  <p className="mb-0">
                    Inactive
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="card-title">
                      Quick Stats
                    </h6>
                    <div className="small">
                      <div className="d-flex justify-content-between mb-1">
                        <span>
                          This Month:
                        </span>
                        {' '}
                        <span>
                          0
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>
                          Last 7 Days:
                        </span>
                        {' '}
                        <span>
                          {subscriberCount}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>
                          Today:
                        </span>
                        {' '}
                        <span>
                          0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  Quick Actions
                </h5>
                <div className="subscriber-actions">
                  <button data-onclick="copyAllEmails()" className="btn btn-outline-primary">
                    <i className="fa fa-copy me-1" />
                    Copy All Emails
                  </button>
                  {' '}
                  <button data-onclick="exportEmails()" className="btn btn-outline-success">
                    <i className="fa fa-download me-1" />
                    Export as Text
                  </button>
                  {' '}
                  <button data-onclick="sendTestEmail()" className="btn btn-outline-info">
                    <i className="fa fa-envelope me-1" />
                    Send Test Email
                  </button>
                  {' '}
                  <a href="/admin/subscribers/export?format=csv" className="btn btn-outline-secondary">
                    <i className="fa fa-file-excel me-1" />
                    Export CSV
                  </a>
                </div>
              </div>
            </div>
            {/* Subscribers Table */}
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  Subscriber List
                </h5>
                <div className="d-flex align-items-center">
                  <div className="input-group input-group-sm me-2" style={{ width: "300px" }}>
                    <input type="text" id="searchInput" className="form-control" placeholder="Search emails..." />
                    {' '}
                    <button className="btn btn-outline-secondary" type="button" data-onclick="searchEmails()">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                  <span className="badge bg-secondary">
                    {subscriberCount} subscribers
                  </span>
                </div>
              </div>
              <div className="table-container">
                
      {(subscribers && subscribers.length > 0) ? (<>
      
                <div className="table-header">
                  <div>
                    #
                  </div>
                  <div>
                    Email Address
                  </div>
                  <div>
                    Subscribed Date
                  </div>
                  <div>
                    Source
                  </div>
                  <div>
                    Status
                  </div>
                  <div>
                    Actions
                  </div>
                </div>
                
      {subscribers.map((subscriber, index) => { 
                                      const rowNumber = index + 1;
                                      const isActive = subscriber.isActive === true || subscriber.isActive === 'true';
                                      const source = subscriber.source || 'website';
                                      const subscribedDate = subscriber.subscribedAt ? new Date(subscriber.subscribedAt) : new Date();
                                      const now = new Date();
                                      const diffTime = Math.abs(now - subscribedDate);
                                      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                      let timeAgo = '';
                                      
                                      if (diffDays === 0) {
                                          timeAgo = 'Today';
                                      } else if (diffDays === 1) {
                                          timeAgo = 'Yesterday';
                                      } else if (diffDays < 7) {
                                          timeAgo = diffDays + ' days ago';
                                      } else if (diffDays < 30) {
                                          timeAgo = Math.floor(diffDays / 7) + ' weeks ago';
                                      } else if (diffDays < 365) {
                                          timeAgo = Math.floor(diffDays / 30) + ' months ago';
                                      } else {
                                          timeAgo = Math.floor(diffDays / 365) + ' years ago';
                                      } 
        return (<Fragment key={index}>
      
                <div className="table-row" data-email={subscriber.email.toLowerCase()}>
                  <div>
                    {rowNumber}
                  </div>
                  <div className="email-cell">
                    <div className="email-address">
                      {subscriber.email}
                    </div>
                  </div>
                  <div>
                    <div>
                      {subscribedDate.toLocaleDateString()}
                    </div>
                    <small className="time-ago">
                      {timeAgo}
                    </small>
                  </div>
                  <div>
                    <span className="source-badge">
                      {source}
                    </span>
                  </div>
                  <div>
                    
      {(isActive) ? (<>
      {' '}
                    <span className="status-badge badge-active">
                      Active
                    </span>
                    {' '}
      </>) : (<>
      {' '}
                    <span className="status-badge badge-inactive">
                      Inactive
                    </span>
                    {' '}
      </>)}
      
                  </div>
                  <div className="email-actions">
                    <i className="fa fa-copy copy-btn" data-onclick={`copyEmail('${subscriber.email}')`} title="Copy email" />
                    {' '}
                    <a href={`mailto:${subscriber.email}`} className="text-decoration-none" title="Send email">
                      <i className="fa fa-envelope text-primary" />
                    </a>
                  </div>
                </div>
                
      </Fragment>); })}
       
      </>) : (<>
      
                <div className="no-data">
                  <i className="fa fa-users fa-4x text-muted mb-3" />
                  <h4 className="text-muted">
                    No Subscribers Yet
                  </h4>
                  <p className="text-muted">
                    Your newsletter subscription list is currently empty.
                  </p>
                  <p className="text-muted">
                    New subscribers will appear here when they sign up on your website.
                  </p>
                </div>
                
      </>)}
      
              </div>
              {/* Footer Info */}
              <div className="card-footer">
                <div className="row">
                  <div className="col-md-6">
                    <small className="text-muted">
                      Showing {subscriberCount} of {subscriberCount} entries
                    </small>
                  </div>
                  <div className="col-md-6 text-end">
                    <small className="text-muted">
                      Last updated: {new Date().toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer Info */}
            <div className="mt-3 text-end">
              <small className="text-muted">
                Active: {activeCount} | Inactive: {inactiveCount}
              </small>
            </div>
          </main>
        </div>
      </div>
      
      <div id="subscriber-data" data-count={subscriberCount} hidden />
      <PageScript kind="admin" src="/js/pages/admin_subscribers.js" />
    </>
  );
}
