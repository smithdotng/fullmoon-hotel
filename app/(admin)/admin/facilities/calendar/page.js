import { Fragment } from 'react';
import { requireManagerPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import FacilityBooking from '@/lib/models/FacilityBooking';
import pageCss from '@/components/page-css/admin_facility-calendar';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Facility Booking Calendar" };

export default async function Page() {
  const user = await requireManagerPage();
  await dbConnect();
  const bookings = plain(
    await FacilityBooking.find({ status: 'confirmed' }).select('facilityName bookingDate bookingTime duration').sort({ bookingDate: 1, bookingTime: 1 }).lean()
  );
  // Group bookings by date
  const bookingsByDate = {};
  for (const booking of bookings) (bookingsByDate[booking.bookingDate] ||= []).push(booking);
  const sortedDates = Object.keys(bookingsByDate).sort();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          Facility Booking Calendar
        </h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <a href="/admin/facilities" className="btn btn-sm btn-outline-primary">
              <i className="fa fa-list me-1" />
              List View
            </a>
            {' '}
            <a href="/admin/facilities/stats" className="btn btn-sm btn-outline-secondary">
              <i className="fa fa-chart-bar me-1" />
              Statistics
            </a>
            {' '}
            <a href="/admin" className="btn btn-sm btn-outline-dark">
              <i className="fa fa-dashboard me-1" />
              Dashboard
            </a>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            Confirmed Bookings Calendar View
          </h5>
        </div>
        <div className="card-body">
          
      {(bookings && bookings.length > 0) ? (<>
      
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>
                    Date
                  </th>
                  <th>
                    Time
                  </th>
                  <th>
                    Facility
                  </th>
                  <th>
                    Duration
                  </th>
                  <th>
                    Booking Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                
      
       
      {(sortedDates || []).map((date, __i) => (<Fragment key={__i}>
      
                <tr className="table-active">
                  <td colSpan="5">
                    <strong>
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </strong>
                    {' '}
                    <span className="badge bg-primary ms-2">
                      {bookingsByDate[date].length} booking(s)
                    </span>
                  </td>
                </tr>
                
      {(bookingsByDate[date] || []).map((booking, __i) => (<Fragment key={__i}>
      
                <tr>
                  <td />
                  <td>
                    <strong>
                      {booking.bookingTime}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge 
                                              ${booking.facilityName === 'Spa & Wellness Center' ? 'bg-success' : 
                                                  booking.facilityName === 'Business Center' ? 'bg-info' : 
                                                  booking.facilityName === 'Event Spaces' ? 'bg-warning' : 'bg-secondary'}`}>
                      {booking.facilityName}
                    </span>
                  </td>
                  <td>
                    {booking.duration} hour(s)
                  </td>
                  <td>
                    <small className="text-muted">
                      #{booking._id.toString().slice(-6).toUpperCase()}
                    </small>
                  </td>
                </tr>
                
      </Fragment>))}
       
      </Fragment>))}
      
              </tbody>
            </table>
          </div>
          {/* Calendar Summary */}
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title mb-0">
                    Calendar Summary
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="d-flex align-items-center">
                        <span className="badge bg-success me-2" style={{ width: "20px", height: "20px" }} />
                        {' '}
                        <span>
                          Spa & Wellness Center
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex align-items-center">
                        <span className="badge bg-info me-2" style={{ width: "20px", height: "20px" }} />
                        {' '}
                        <span>
                          Business Center
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex align-items-center">
                        <span className="badge bg-warning me-2" style={{ width: "20px", height: "20px" }} />
                        {' '}
                        <span>
                          Event Spaces
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
      </>) : (<>
      
          <div className="text-center py-5">
            <i className="fa fa-calendar fa-4x text-muted mb-3" />
            <h4 className="text-muted">
              No Confirmed Bookings
            </h4>
            <p className="text-muted">
              There are no confirmed facility bookings to display in the calendar.
            </p>
            <a href="/admin/facilities" className="btn btn-primary">
              View All Bookings
            </a>
          </div>
          
      </>)}
      
        </div>
      </div>
      
    </>
  );
}
