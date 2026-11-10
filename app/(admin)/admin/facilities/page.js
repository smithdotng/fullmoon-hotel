import { Fragment } from 'react';
import { requireManagerPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import FacilityBooking from '@/lib/models/FacilityBooking';
import pageCss from '@/components/page-css/admin_facilities';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Manage Facility Bookings" };

export default async function Page() {
  const user = await requireManagerPage();
  await dbConnect();
  const messages = {}; // flash messages are shown by the admin layout
  const facilities = plain(
    (await FacilityBooking.find().populate('user', 'username email').sort({ bookingDate: -1, bookingTime: -1 }).lean()).map((b) => ({
      ...b,
      user: b.user ? { ...b.user, name: b.user.username } : null,
    }))
  );
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          Manage Facility Bookings
        </h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <a href="/admin/facilities/stats" className="btn btn-sm btn-outline-primary">
              <i className="fa fa-chart-bar me-1" />
              View Statistics
            </a>
            {' '}
            <a href="/admin/facilities/calendar" className="btn btn-sm btn-outline-secondary">
              <i className="fa fa-calendar me-1" />
              Calendar View
            </a>
            {' '}
            <a href="/admin" className="btn btn-sm btn-outline-dark">
              <i className="fa fa-dashboard me-1" />
              Dashboard
            </a>
          </div>
        </div>
      </div>
      
      {(messages.success) ? (<>
      
      <div className="alert alert-success alert-dismissible fade show" role="alert">
        {messages.success}{' '}
        <button type="button" className="btn-close" data-bs-dismiss="alert" />
      </div>
      
      </>) : null}
       
      {(messages.error) ? (<>
      
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {messages.error}{' '}
        <button type="button" className="btn-close" data-bs-dismiss="alert" />
      </div>
      
      </>) : null}
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            All Facility Bookings
          </h5>
        </div>
        <div className="card-body">
          
      {(facilities && facilities.length > 0) ? (<>
      
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>
                    Booking ID
                  </th>
                  <th>
                    Facility
                  </th>
                  <th>
                    Customer
                  </th>
                  <th>
                    Date & Time
                  </th>
                  <th>
                    Duration
                  </th>
                  <th>
                    Guests
                  </th>
                  <th>
                    Amount
                  </th>
                  <th>
                    Status
                  </th>
                  <th>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                
      {(facilities || []).map((booking, __i) => (<Fragment key={__i}>
      
                <tr>
                  <td>
                    <small className="text-muted">
                      #{booking._id.toString().slice(-6).toUpperCase()}
                    </small>
                  </td>
                  <td>
                    <strong>
                      {booking.facilityName}
                    </strong>
                    {' '}
      {(booking.specialRequests) ? (<>
      {' '}
                    <br />
                    {' '}
                    <small className="text-muted" title={booking.specialRequests}>
                      <i className="fa fa-info-circle" />
                      {' '}Special requests
                    </small>
                    {' '}
      </>) : null}
      
                  </td>
                  <td>
                    
      {(booking.user && booking.user.name) ? (<>
       {booking.user.name}{' '}
                    <br />
                    {' '}
                    <small className="text-muted">
                      {booking.user.email}
                    </small>
                    {' '}
      </>) : (<>
      {' '}
                    <span className="text-muted">
                      Guest
                    </span>
                    {' '}
      </>)}
      
                  </td>
                  <td>
                    {booking.bookingDate}{' '}
                    <br />
                    {' '}
                    <small className="text-muted">
                      {booking.bookingTime}
                    </small>
                  </td>
                  <td>
                    {booking.duration} hour(s)
                  </td>
                  <td>
                    {booking.guests}
                  </td>
                  <td>
                    <strong>
                      ₦{booking.totalAmount}
                    </strong>
                  </td>
                  <td>
                    <form action={`/admin/facilities/update-status/${booking._id}`} method="POST" className="d-inline">
                      <select name="status" className="form-select form-select-sm" data-onchange="this.form.submit()" defaultValue={booking.status}>
                        <option value="pending" >
                          Pending
                        </option>
                        <option value="confirmed" >
                          Confirmed
                        </option>
                        <option value="cancelled" >
                          Cancelled
                        </option>
                        <option value="completed" >
                          Completed
                        </option>
                      </select>
                    </form>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target={`#bookingModal${booking._id}`}>
                        <i className="fa fa-eye" />
                      </button>
                      <form action={`/admin/facilities/delete/${booking._id}`} method="POST" className="d-inline">
                        <button type="submit" className="btn btn-outline-danger" data-onclick="return confirm('Are you sure you want to delete this booking?')">
                          <i className="fa fa-trash" />
                        </button>
                      </form>
                    </div>
                    {/* Booking Details Modal */}
                    <div className="modal fade" id={`bookingModal${booking._id}`} tabIndex="-1">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">
                              Booking Details
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                          </div>
                          <div className="modal-body">
                            <div className="row">
                              <div className="col-6">
                                <strong>
                                  Facility:
                                </strong>
                              </div>
                              <div className="col-6">
                                {booking.facilityName}
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-6">
                                <strong>
                                  Booking Date:
                                </strong>
                              </div>
                              <div className="col-6">
                                {booking.bookingDate} at {booking.bookingTime}
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-6">
                                <strong>
                                  Duration:
                                </strong>
                              </div>
                              <div className="col-6">
                                {booking.duration} hour(s)
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-6">
                                <strong>
                                  Guests:
                                </strong>
                              </div>
                              <div className="col-6">
                                {booking.guests}
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-6">
                                <strong>
                                  Total Amount:
                                </strong>
                              </div>
                              <div className="col-6">
                                ₦{booking.totalAmount}
                              </div>
                            </div>
                            
      {(booking.specialRequests) ? (<>
      
                            <div className="row mt-2">
                              <div className="col-6">
                                <strong>
                                  Special Requests:
                                </strong>
                              </div>
                              <div className="col-6">
                                {booking.specialRequests}
                              </div>
                            </div>
                            
      </>) : null}
      
                            <div className="row mt-2">
                              <div className="col-6">
                                <strong>
                                  Status:
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className={`badge 
                                                                  ${booking.status === 'confirmed' ? 'bg-success' : 
                                                                      booking.status === 'pending' ? 'bg-warning' : 
                                                                      booking.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-6">
                                <strong>
                                  Booked On:
                                </strong>
                              </div>
                              <div className="col-6">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                
      </Fragment>))}
      
              </tbody>
            </table>
          </div>
          
      </>) : (<>
      
          <div className="text-center py-5">
            <i className="fa fa-calendar-times fa-4x text-muted mb-3" />
            <h4 className="text-muted">
              No Facility Bookings
            </h4>
            <p className="text-muted">
              There are no facility bookings to display.
            </p>
            <a href="/admin" className="btn btn-primary">
              Return to Dashboard
            </a>
          </div>
          
      </>)}
      
        </div>
      </div>
      
    </>
  );
}
