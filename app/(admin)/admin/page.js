import { Fragment } from 'react';
import { requireAdminPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import Room from '@/lib/models/Room';
import Blog from '@/lib/models/Blog';
import FacilityBooking from '@/lib/models/FacilityBooking';
import Reservation from '@/lib/models/Reservation';
import Subscriber from '@/lib/models/Subscriber';
import { withReservationLabels } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Admin Dashboard" };

const DENIED = {
  manage: 'You do not have permission to perform this action',
  super: 'Super-admin access required for this action',
};

async function loadDashboard() {
  const [roomCount, availableRooms, blogCount, publishedBlogs, recentBlogs, facilityBookings, confirmedFacilityBookings] = await Promise.all([
    Room.countDocuments(),
    Room.countDocuments({ available: true }),
    Blog.countDocuments(),
    Blog.countDocuments({ published: true }),
    Blog.find().sort({ createdAt: -1 }).limit(5).lean(),
    FacilityBooking.countDocuments(),
    FacilityBooking.countDocuments({ status: 'confirmed' }),
  ]);
  const revenue = await FacilityBooking.aggregate([{ $match: { status: 'confirmed' } }, { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }]);
  const recentFacilityBookings = await FacilityBooking.find().populate('user', 'username email').sort({ createdAt: -1 }).limit(5).lean();
  const popularFacilities = await FacilityBooking.aggregate([
    { $group: { _id: '$facilityName', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);
  const reservationStats = {
    total: await Reservation.countDocuments(),
    pending: await Reservation.countDocuments({ status: 'pending' }),
    confirmed: await Reservation.countDocuments({ status: 'confirmed' }),
    cancelled: await Reservation.countDocuments({ status: 'cancelled' }),
    unpaid: await Reservation.countDocuments({ paymentStatus: 'unpaid' }),
    paid: await Reservation.countDocuments({ paymentStatus: 'paid' }),
  };
  const subscriberCount = await Subscriber.countDocuments({ isActive: true });
  const recentSubscribers = (await Subscriber.find({ isActive: true }).sort({ subscribedAt: -1 }).limit(5).select('email').lean()).map((s) => s.email);
  const recentReservations = await Reservation.find().populate('room', 'roomNumber type').sort({ createdAt: -1 }).limit(5).lean();
  return plain({
    roomCount, availableRooms, blogCount, publishedBlogs, recentBlogs, facilityBookings, confirmedFacilityBookings,
    facilityRevenue: revenue[0]?.totalRevenue || 0,
    recentFacilityBookings: recentFacilityBookings.map((b) => ({ ...b, user: b.user ? { ...b.user, name: b.user.username } : null })),
    popularFacilities, reservationStats, subscriberCount, recentSubscribers,
    recentReservations: recentReservations.map(withReservationLabels),
  });
}

export default async function Page({ searchParams }) {
  const user = await requireAdminPage();
  const { denied } = await searchParams;
  await dbConnect();
  const {
    roomCount, availableRooms, blogCount, publishedBlogs, recentBlogs, facilityBookings, confirmedFacilityBookings,
    facilityRevenue, recentFacilityBookings, popularFacilities, reservationStats, subscriberCount, recentSubscribers, recentReservations,
  } = await loadDashboard();
  // Flash messages are shown by the admin layout
  const messages = {};
  return (
    <>
      {DENIED[denied] && <div className="alert alert-danger">{DENIED[denied]}</div>}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          Admin Dashboard
        </h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <a href="/admin/facilities/stats" className="btn btn-sm btn-outline-secondary">
              <i className="fa fa-chart-bar me-1" />
              View Stats
            </a>
            {' '}
            <a href="/admin/facilities/calendar" className="btn btn-sm btn-outline-secondary">
              <i className="fa fa-calendar me-1" />
              Booking Calendar
            </a>
            {/* Logout Button */}
            <a href="/logout" className="btn btn-sm btn-outline-danger ms-2">
              <i className="fa fa-sign-out me-1" />
              Logout
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
      
      {/* Statistics Cards */}
      {/* Statistics Cards */}
      <div className="row">
        {/* Rooms Statistics */}
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Total Rooms
                  </h5>
                  <h2 className="card-text">
                    {roomCount || 0}
                  </h2>
                  <small>
                    Available: {availableRooms || 0}
                  </small>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-bed fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Blog Statistics */}
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Blog Posts
                  </h5>
                  <h2 className="card-text">
                    {blogCount || 0}
                  </h2>
                  <small>
                    Published: {publishedBlogs || 0}
                  </small>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-newspaper-o fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Subscribers Statistics */}
        <div className="col-md-3">
          <div className="card text-white" style={{ background: "linear-gradient(135deg, #8B7355 0%, #9a7f5f 100%)" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Newsletter Subscribers
                  </h5>
                  <h2 className="card-text">
                    {subscriberCount || 0}
                  </h2>
                  <small>
                    Recent: {recentSubscribers ? recentSubscribers.length : 0}
                  </small>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-users fa-2x" />
                </div>
              </div>
              
      {(subscriberCount > 0) ? (<>
      
              <div className="mt-3">
                <a href="/admin/subscribers" className="btn btn-sm btn-light">
                  <i className="fa fa-eye me-1" />
                  {' '}View All
                </a>
                {' '}
                <a href="/admin/subscribers/export" className="btn btn-sm btn-outline-light ms-1" download="">
                  <i className="fa fa-download me-1" />
                  {' '}Export
                </a>
              </div>
              
      </>) : null}
      
            </div>
          </div>
        </div>
        {/* Facilities Statistics */}
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Facility Bookings
                  </h5>
                  <h2 className="card-text">
                    {facilityBookings || 0}
                  </h2>
                  <small>
                    Confirmed: {confirmedFacilityBookings || 0}
                  </small>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-calendar-check-o fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Revenue Statistics */}
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Facility Revenue
                  </h5>
                  <h2 className="card-text">
                    ₦{(facilityRevenue || 0).toLocaleString()}
                  </h2>
                  <small>
                    This Month
                  </small>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-money fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Additional Row for Reservations Statistics */}
      <div className="row mt-2">
        {/* Reservations Statistics */}
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    Room Reservations
                  </h5>
                  <h2 className="card-text">
                    {reservationStats ? reservationStats.total : 0}
                  </h2>
                  <small>
                    Pending: {reservationStats ? reservationStats.pending : 0}
                  </small>
                </div>
                <div className="align-self-center">
                  <i className="fa fa-key fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Room Management */}
                <div className="col-md-3 mb-3">
                  <a href="/admin/rooms" className="btn btn-primary w-100">
                    <i className="fa fa-bed me-2" />
                    Manage Rooms
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/rooms/add" className="btn btn-success w-100">
                    <i className="fa fa-plus me-2" />
                    Add New Room
                  </a>
                </div>
                {/* Blog Management */}
                <div className="col-md-3 mb-3">
                  <a href="/admin/blog" className="btn btn-info w-100">
                    <i className="fa fa-newspaper-o me-2" />
                    Manage Blog
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/blog/add" className="btn btn-warning w-100">
                    <i className="fa fa-edit me-2" />
                    Add Blog Post
                  </a>
                </div>
                {/* Subscribers Management */}
                <div className="col-md-3 mb-3">
                  <a href="/admin/subscribers" className="btn btn-outline-secondary w-100">
                    <i className="fa fa-users me-2" />
                    View Subscribers
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/subscribers/export" className="btn btn-outline-info w-100">
                    <i className="fa fa-download me-2" />
                    Export Subscribers
                  </a>
                </div>
              </div>
              <div className="row mt-2">
                {/* Facilities Management */}
                <div className="col-md-3 mb-3">
                  <a href="/admin/facilities-config" className="btn btn-secondary w-100">
                    <i className="fa fa-building me-2" />
                    Manage Facilities
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/facilities-config/add" className="btn btn-dark w-100">
                    <i className="fa fa-plus-circle me-2" />
                    Add Facility
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/facilities" className="btn btn-outline-primary w-100">
                    <i className="fa fa-calendar me-2" />
                    View Bookings
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/" className="btn btn-outline-dark w-100">
                    <i className="fa fa-home me-2" />
                    View Website
                  </a>
                </div>
                {/* Reservations Management */}
                <div className="col-md-3 mb-3">
                  <a href="/admin/reservations" className="btn btn-outline-danger w-100">
                    <i className="fa fa-calendar-alt me-2" />
                    Room Reservations
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/reservations?status=pending" className="btn btn-outline-warning w-100">
                    <i className="fa fa-clock me-2" />
                    Pending Reservations
                  </a>
                </div>
                {/* Admin Management */}
                <div className="col-md-3 mb-3">
                  <a href="/admin/users" className="btn btn-outline-info w-100">
                    <i className="fa fa-users me-2" />
                    Manage Users
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/users/add" className="btn btn-outline-success w-100">
                    <i className="fa fa-user-plus me-2" />
                    Add Admin User
                  </a>
                </div>
              </div>
              {/* Sample Data Section (for testing) */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="alert alert-light border">
                    <h6 className="alert-heading">
                      Quick Setup
                    </h6>
                    <p className="mb-2">
                      Need sample data to get started?
                    </p>
                    <div className="btn-group">
                      <a href="/admin/facilities-config/sample" className="btn btn-sm btn-outline-success" data-onclick="return confirm('This will replace all existing facilities with sample data. Continue?')">
                        <i className="fa fa-magic me-1" />
                        Add Sample Facilities
                      </a>
                      {' '}
                      <a href="/add-sample-rooms" className="btn btn-sm btn-outline-info">
                        <i className="fa fa-bed me-1" />
                        Add Sample Rooms
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity Section */}
      <div className="row mt-4">
        {/* Recent Facility Bookings */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                Recent Facility Bookings
              </h5>
              <a href="/admin/facilities" className="btn btn-sm btn-outline-secondary">
                View All
              </a>
            </div>
            <div className="card-body">
              
      {(recentFacilityBookings && recentFacilityBookings.length > 0) ? (<>
      
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>
                        Facility
                      </th>
                      <th>
                        Date
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    
      {(recentFacilityBookings || []).map((booking, __i) => (<Fragment key={__i}>
      
                    <tr>
                      <td>
                        <strong>
                          {booking.facilityName}
                        </strong>
                        {' '}
                        <br />
                        {' '}
                        <small className="text-muted">
                          {booking.user ? booking.user.name : 'Guest'}
                        </small>
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
                        <span className={`badge 
                                                  ${booking.status === 'confirmed' ? 'bg-success' : 
                                                      booking.status === 'pending' ? 'bg-warning' : 
                                                      booking.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        ₦{booking.totalAmount}
                      </td>
                    </tr>
                    
      </Fragment>))}
      
                  </tbody>
                </table>
              </div>
              
      </>) : (<>
      
              <div className="text-center py-3">
                <i className="fa fa-calendar-times fa-2x text-muted mb-2" />
                <p className="text-muted mb-0">
                  No recent facility bookings
                </p>
              </div>
              
      </>)}
      
            </div>
          </div>
        </div>
        {/* Recent Blog Posts */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                Recent Blog Posts
              </h5>
              <a href="/admin/blog" className="btn btn-sm btn-outline-primary">
                View All
              </a>
            </div>
            <div className="card-body">
              
      {(recentBlogs && recentBlogs.length > 0) ? (<>
      
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>
                        Title
                      </th>
                      <th>
                        Category
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    
      {(recentBlogs || []).map((blog, __i) => (<Fragment key={__i}>
      
                    <tr>
                      <td>
                        <strong>
                          {blog.title}
                        </strong>
                        {' '}
      {(blog.featured) ? (<>
      {' '}
                        <span className="badge bg-warning ms-1">
                          Featured
                        </span>
                        {' '}
      </>) : null}
      
                      </td>
                      <td>
                        {blog.category}
                      </td>
                      <td>
                        <span className={`badge ${blog.published ? 'bg-success' : 'bg-secondary'}`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                    
      </Fragment>))}
      
                  </tbody>
                </table>
              </div>
              
      </>) : (<>
      
              <div className="text-center py-3">
                <i className="fa fa-newspaper-o fa-2x text-muted mb-2" />
                <p className="text-muted mb-0">
                  No blog posts yet
                </p>
                <a href="/admin/blog/add" className="btn btn-sm btn-primary mt-2">
                  Create First Post
                </a>
              </div>
              
      </>)}
      
            </div>
          </div>
        </div>
        {/* Recent Subscribers */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                Recent Subscribers
              </h5>
              <a href="/admin/subscribers" className="btn btn-sm btn-outline-secondary">
                View All
              </a>
            </div>
            <div className="card-body">
              
      {(recentSubscribers && recentSubscribers.length > 0) ? (<>
      
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>
                        #
                      </th>
                      <th>
                        Email
                      </th>
                      <th>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    
      {(recentSubscribers || []).map((email, index) => (<Fragment key={index}>
      
                    <tr>
                      <td>
                        {index + 1}
                      </td>
                      <td>
                        <strong>
                          {email}
                        </strong>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          Subscribed
                        </span>
                      </td>
                    </tr>
                    
      </Fragment>))}
      
                  </tbody>
                </table>
              </div>
              
      </>) : (<>
      
              <div className="text-center py-3">
                <i className="fa fa-users fa-2x text-muted mb-2" />
                <p className="text-muted mb-0">
                  No subscribers yet
                </p>
                <p className="text-muted small">
                  Subscribers will appear here when they sign up
                </p>
              </div>
              
      </>)}
      
            </div>
          </div>
        </div>
        {/* Recent Room Reservations */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                Recent Room Reservations
              </h5>
              <a href="/admin/reservations" className="btn btn-sm btn-outline-danger">
                View All
              </a>
            </div>
            <div className="card-body">
              
      {(recentReservations && recentReservations.length > 0) ? (<>
      
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>
                        Guest
                      </th>
                      <th>
                        Room
                      </th>
                      <th>
                        Check-in
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    
      {(recentReservations || []).map((reservation, __i) => (<Fragment key={__i}>
      
                    <tr>
                      <td>
                        <strong>
                          {reservation.guestName}
                        </strong>
                        {' '}
                        <br />
                        {' '}
                        <small className="text-muted">
                          {reservation.guestEmail}
                        </small>
                      </td>
                      <td>
                        {reservation.room ? reservation.room.roomNumber : 'N/A'}{' '}
                        <br />
                        {' '}
                        <small className="text-muted">
                          {reservation.room ? reservation.room.type : 'N/A'}
                        </small>
                      </td>
                      <td>
                        {reservation.formattedCheckIn}{' '}
                        <br />
                        {' '}
                        <small className="text-muted">
                          {reservation.nights} night(s)
                        </small>
                      </td>
                      <td>
                        <span className={`badge 
                                              ${reservation.status === 'confirmed' ? 'bg-success' : 
                                                  reservation.status === 'pending' ? 'bg-warning' : 
                                                  reservation.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td>
                        ₦{reservation.totalAmount}
                      </td>
                    </tr>
                    
      </Fragment>))}
      
                  </tbody>
                </table>
              </div>
              
      </>) : (<>
      
              <div className="text-center py-3">
                <i className="fa fa-bed fa-2x text-muted mb-2" />
                <p className="text-muted mb-0">
                  No recent room reservations
                </p>
                <a href="/admin/rooms" className="btn btn-sm btn-primary mt-2">
                  View Rooms
                </a>
              </div>
              
      </>)}
      
            </div>
          </div>
        </div>
      </div>
      {/* Popular Facilities Chart Placeholder */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Popular Facilities
              </h5>
            </div>
            <div className="card-body">
              
      {(popularFacilities && popularFacilities.length > 0) ? (<>
      
              <div className="row">
                
      {(popularFacilities || []).map((facility, __i) => (<Fragment key={__i}>
      
                <div className="col-md-4 mb-3">
                  <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                    <div>
                      <h6 className="mb-1">
                        {facility._id}
                      </h6>
                      <small className="text-muted">
                        {facility.count} bookings
                      </small>
                    </div>
                    <div className="text-end">
                      <strong>
                        ₦{facility.revenue}
                      </strong>
                    </div>
                  </div>
                </div>
                
      </Fragment>))}
      
              </div>
              
      </>) : (<>
      
              <div className="text-center py-4">
                <i className="fa fa-chart-pie fa-3x text-muted mb-3" />
                <p className="text-muted">
                  No facility booking data available yet
                </p>
              </div>
              
      </>)}
      
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
