import { Fragment } from 'react';
import { requireManagerPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import FacilityBooking from '@/lib/models/FacilityBooking';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Facility Booking Statistics" };

export default async function Page() {
  const user = await requireManagerPage();
  await dbConnect();
  const [totalBookings, confirmedBookings, cancelledBookings, completedBookings] = await Promise.all(
    [{}, { status: 'confirmed' }, { status: 'cancelled' }, { status: 'completed' }].map((q) => FacilityBooking.countDocuments(q))
  );
  const revenue = await FacilityBooking.aggregate([{ $match: { status: 'confirmed' } }, { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }]);
  const totalRevenue = revenue[0]?.totalRevenue || 0;
  const popularFacilities = await FacilityBooking.aggregate([
    { $group: { _id: '$facilityName', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          Facility Booking Statistics
        </h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <a href="/admin/facilities" className="btn btn-sm btn-outline-primary">
              <i className="fa fa-list me-1" />
              All Bookings
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
      {/* Statistics Cards */}
      <div className="row">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Total Bookings
                  </h5>
                  <h2 className="card-text">
                    {totalBookings || 0}
                  </h2>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-calendar fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Confirmed
                  </h5>
                  <h2 className="card-text">
                    {confirmedBookings || 0}
                  </h2>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-check-circle fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Cancelled
                  </h5>
                  <h2 className="card-text">
                    {cancelledBookings || 0}
                  </h2>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-times-circle fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Total Revenue
                  </h5>
                  <h2 className="card-text">
                    ₦{(totalRevenue || 0).toLocaleString()}
                  </h2>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-money fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Popular Facilities */}
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Most Popular Facilities
              </h5>
            </div>
            <div className="card-body">
              
      {(popularFacilities && popularFacilities.length > 0) ? (<>
      
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>
                        Facility
                      </th>
                      <th>
                        Total Bookings
                      </th>
                      <th>
                        Total Revenue
                      </th>
                      <th>
                        Average per Booking
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    
      {(popularFacilities || []).map((facility, __i) => (<Fragment key={__i}>
      
                    <tr>
                      <td>
                        <strong>
                          {facility._id}
                        </strong>
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {facility.count}
                        </span>
                      </td>
                      <td>
                        <strong>
                          ₦{facility.revenue.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        ₦{Math.round(facility.revenue / facility.count).toLocaleString()}
                      </td>
                    </tr>
                    
      </Fragment>))}
      
                  </tbody>
                </table>
              </div>
              
      </>) : (<>
      
              <div className="text-center py-4">
                <i className="fa fa-chart-bar fa-3x text-muted mb-3" />
                <p className="text-muted">
                  No facility booking data available yet
                </p>
              </div>
              
      </>)}
      
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Booking Status Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-center">
                <div style={{ width: "200px", height: "200px" }}>
                  {/* Simple status visualization */}
                  <div className="text-center">
                    <div className="mb-3">
                      <span className="badge bg-success me-2">
                        Confirmed: {confirmedBookings || 0}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="badge bg-warning me-2">
                        Pending: {(totalBookings - confirmedBookings - cancelledBookings - completedBookings) || 0}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="badge bg-danger me-2">
                        Cancelled: {cancelledBookings || 0}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="badge bg-info me-2">
                        Completed: {completedBookings || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <a href="/admin/facilities" className="btn btn-outline-primary">
                  <i className="fa fa-list me-2" />
                  Manage All Bookings
                </a>
                {' '}
                <a href="/admin/facilities/calendar" className="btn btn-outline-secondary">
                  <i className="fa fa-calendar me-2" />
                  View Calendar
                </a>
                {' '}
                <a href="/admin" className="btn btn-outline-dark">
                  <i className="fa fa-dashboard me-2" />
                  Back to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
