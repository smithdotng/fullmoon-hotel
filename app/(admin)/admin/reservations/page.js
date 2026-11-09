import { Fragment } from 'react';
import { requireAdminPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import { loadReservationsAdmin } from '@/lib/admin-reservations';
import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/admin_reservations';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Manage Room Reservations" };

export default async function Page({ searchParams }) {
  const user = await requireAdminPage();
  await dbConnect();
  const messages = {}; // flash messages are shown by the admin layout
  const query = await searchParams;
  const {
    reservations, todaysCheckIns, todaysCheckOuts, upcomingArrivals, stats,
    occupancyRate, occupiedRooms, totalRooms, availabilityByType, ROOM_CAPACITY,
  } = await loadReservationsAdmin(query);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/admin">
            Full Moon Hotels Admin
          </a>
          {' '}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/admin">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/admin/reservations">
                  Reservations
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/rooms">
                  Rooms
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/users">
                  Users
                </a>
              </li>
            </ul>
            <span className="navbar-text">
              <i className="fas fa-user-circle me-1" />
              {user.username} |{' '}
              <a href="/logout" className="text-white">
                <i className="fas fa-sign-out-alt me-1" />
                Logout
              </a>
            </span>
          </div>
        </div>
      </nav>
      <div className="container-fluid mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3">
              <i className="fas fa-calendar-check me-2" />
              Reservations Management
            </h1>
            <p className="text-muted">
              Manage check-ins, check-outs, room assignments, and property operations
            </p>
          </div>
          <div className="btn-group">
            <a href="/admin/reservations/occupancy-report" className="btn btn-outline-info">
              <i className="fas fa-chart-line me-1" />
              Occupancy Report
            </a>
            {' '}
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#todaySummaryModal">
              <i className="fas fa-calendar-day me-1" />
              Today's Summary
            </button>
          </div>
        </div>
        {/* Flash Messages */}
        
      {(messages.error) ? (<>
      
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2" />
          {messages.error}{' '}
          <button type="button" className="btn-close" data-bs-dismiss="alert" />
        </div>
        
      </>) : null}
       
      {(messages.success) ? (<>
      
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2" />
          {messages.success}{' '}
          <button type="button" className="btn-close" data-bs-dismiss="alert" />
        </div>
        
      </>) : null}
      
        {/* Room Capacity Breakdown - Updated with Real-time Availability */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="fas fa-bed me-2" />
              Hotel Room Capacity Breakdown (Real-time)
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-2 text-center">
                <div className="card border-primary mb-3">
                  <div className="card-body">
                    <h3 className="text-primary">
                      {availabilityByType && availabilityByType['Penthouse Double Suite'] ? availabilityByType['Penthouse Double Suite'].booked : 0}/1
                    </h3>
                    <h6>
                      Penthouse Double Suite
                    </h6>
                    <div className="progress mb-2" style={{ height: "10px" }}>
                      <div className="progress-bar bg-primary" style={{ width: `${availabilityByType && availabilityByType['Penthouse Double Suite'] ? availabilityByType['Penthouse Double Suite'].percentage : 0}%` }}>
                      </div>
                    </div>
                    <small className="text-muted">
                      {availabilityByType && availabilityByType['Penthouse Double Suite'] ? availabilityByType['Penthouse Double Suite'].available : 1} available
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-2 text-center">
                <div className="card border-info mb-3">
                  <div className="card-body">
                    <h3 className="text-info">
                      {availabilityByType && availabilityByType['Penthouse Single Suite'] ? availabilityByType['Penthouse Single Suite'].booked : 0}/2
                    </h3>
                    <h6>
                      Penthouse Single Suite
                    </h6>
                    <div className="progress mb-2" style={{ height: "10px" }}>
                      <div className="progress-bar bg-info" style={{ width: `${availabilityByType && availabilityByType['Penthouse Single Suite'] ? availabilityByType['Penthouse Single Suite'].percentage : 0}%` }}>
                      </div>
                    </div>
                    <small className="text-muted">
                      {availabilityByType && availabilityByType['Penthouse Single Suite'] ? availabilityByType['Penthouse Single Suite'].available : 2} available
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 text-center">
                <div className="card border-success mb-3">
                  <div className="card-body">
                    <h3 className="text-success">
                      {availabilityByType && availabilityByType['Executive Room'] ? availabilityByType['Executive Room'].booked : 0}/9
                    </h3>
                    <h6>
                      Executive Room
                    </h6>
                    <div className="progress mb-2" style={{ height: "10px" }}>
                      <div className="progress-bar bg-success" style={{ width: `${availabilityByType && availabilityByType['Executive Room'] ? availabilityByType['Executive Room'].percentage : 0}%` }}>
                      </div>
                    </div>
                    <small className="text-muted">
                      {availabilityByType && availabilityByType['Executive Room'] ? availabilityByType['Executive Room'].available : 9} available
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 text-center">
                <div className="card border-warning mb-3">
                  <div className="card-body">
                    <h3 className="text-warning">
                      {availabilityByType && availabilityByType['Deluxe Room'] ? availabilityByType['Deluxe Room'].booked : 0}/37
                    </h3>
                    <h6>
                      Deluxe Room
                    </h6>
                    <div className="progress mb-2" style={{ height: "10px" }}>
                      <div className="progress-bar bg-warning" style={{ width: `${availabilityByType && availabilityByType['Deluxe Room'] ? availabilityByType['Deluxe Room'].percentage : 0}%` }}>
                      </div>
                    </div>
                    <small className="text-muted">
                      {availabilityByType && availabilityByType['Deluxe Room'] ? availabilityByType['Deluxe Room'].available : 37} available
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-2 text-center">
                <div className="card border-danger mb-3">
                  <div className="card-body">
                    <h3 className="text-danger">
                      {availabilityByType && availabilityByType['Premiere Room'] ? availabilityByType['Premiere Room'].booked : 0}/20
                    </h3>
                    <h6>
                      Premiere Room
                    </h6>
                    <div className="progress mb-2" style={{ height: "10px" }}>
                      <div className="progress-bar bg-danger" style={{ width: `${availabilityByType && availabilityByType['Premiere Room'] ? availabilityByType['Premiere Room'].percentage : 0}%` }}>
                      </div>
                    </div>
                    <small className="text-muted">
                      {availabilityByType && availabilityByType['Premiere Room'] ? availabilityByType['Premiere Room'].available : 20} available
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2" />
                  {' '}
                  <strong>
                    Note:
                  </strong>
                  {' '}All room types are treated as classes. When a room is reserved, it reduces the availability for that entire class, not just the specific room.
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Stats Dashboard */}
        <div className="row mb-4">
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stats-card bg-total">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">
                    Total
                  </h5>
                  <h2 className="card-text">
                    {stats.total}
                  </h2>
                </div>
                <i className="fas fa-list fa-2x opacity-75" />
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stats-card bg-pending">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">
                    Pending
                  </h5>
                  <h2 className="card-text">
                    {stats.pending}
                  </h2>
                </div>
                <i className="fas fa-clock fa-2x opacity-75" />
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stats-card bg-confirmed">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">
                    Confirmed
                  </h5>
                  <h2 className="card-text">
                    {stats.confirmed}
                  </h2>
                </div>
                <i className="fas fa-check-circle fa-2x opacity-75" />
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stats-card bg-checkedin">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">
                    Checked-in
                  </h5>
                  <h2 className="card-text">
                    {stats.checkedIn}
                  </h2>
                </div>
                <i className="fas fa-sign-in-alt fa-2x opacity-75" />
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stats-card bg-completed">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">
                    Completed
                  </h5>
                  <h2 className="card-text">
                    {stats.completed}
                  </h2>
                </div>
                <i className="fas fa-sign-out-alt fa-2x opacity-75" />
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stats-card bg-occupancy">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">
                    Occupancy
                  </h5>
                  <h2 className="card-text">
                    {occupancyRate}%
                  </h2>
                  <small>
                    {occupiedRooms}/{totalRooms} rooms
                  </small>
                </div>
                <i className="fas fa-bed fa-2x opacity-75" />
              </div>
            </div>
          </div>
        </div>
        {/* Today's Quick Stats */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                  <i className="fas fa-sign-in-alt me-2" />
                  Today's Check-ins ({todaysCheckIns.length})
                </h5>
              </div>
              <div className="card-body">
                
      {(todaysCheckIns.length > 0) ? (<>
      
                <div className="list-group">
                  
      {(todaysCheckIns || []).map((checkin, __i) => (<Fragment key={__i}>
      
                  <div className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>
                          {checkin.guestName}
                        </strong>
                        {' '}
                        <br />
                        {' '}
                        <small className="text-muted">
                          Room {checkin.room?.roomNumber || 'N/A'} • Check-in: {new Date(checkin.checkInDate || checkin.checkIn).toLocaleDateString()} at {new Date(checkin.checkInDate || checkin.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                      </div>
                      <a href={`/admin/reservations/${checkin._id}`} className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-arrow-right" />
                      </a>
                    </div>
                  </div>
                  
      </Fragment>))}
      
                </div>
                
      </>) : (<>
      
                <p className="text-center text-muted mb-0">
                  No check-ins scheduled for today
                </p>
                
      </>)}
      
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0">
                  <i className="fas fa-sign-out-alt me-2" />
                  Today's Check-outs ({todaysCheckOuts.length})
                </h5>
              </div>
              <div className="card-body">
                
      {(todaysCheckOuts.length > 0) ? (<>
      
                <div className="list-group">
                  
      {(todaysCheckOuts || []).map((checkout, __i) => (<Fragment key={__i}>
      
                  <div className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>
                          {checkout.guestName}
                        </strong>
                        {' '}
                        <br />
                        {' '}
                        <small className="text-muted">
                          Room {checkout.room?.roomNumber || 'N/A'} • Check-out: {new Date(checkout.checkOutDate || checkout.checkOut).toLocaleDateString()} at {new Date(checkout.checkOutDate || checkout.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                      </div>
                      <div>
                        <a href={`/admin/reservations/${checkout._id}`} className="btn btn-sm btn-outline-success me-2">
                          Process
                        </a>
                        {' '}
                        <button data-onclick={`quickCheckOut('${checkout._id}')`} className="btn btn-sm btn-success">
                          <i className="fas fa-sign-out-alt" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
      </Fragment>))}
      
                </div>
                
      </>) : (<>
      
                <p className="text-center text-muted mb-0">
                  No check-outs scheduled for today
                </p>
                
      </>)}
      
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Filters */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="fas fa-filter me-2" />
              Advanced Filters
            </h5>
          </div>
          <div className="card-body">
            <form method="GET" className="row g-3">
              <div className="col-md-2">
                <label className="form-label">
                  Status
                </label>
                {' '}
                <select name="status" className="form-select" defaultValue={query.status}>
                  <option value="all" >
                    All Statuses
                  </option>
                  <option value="pending" >
                    Pending
                  </option>
                  <option value="confirmed" >
                    Confirmed
                  </option>
                  <option value="checked-in" >
                    Checked-in
                  </option>
                  <option value="completed" >
                    Completed
                  </option>
                  <option value="cancelled" >
                    Cancelled
                  </option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">
                  Payment
                </label>
                {' '}
                <select name="payment" className="form-select" defaultValue={query.payment}>
                  <option value="all" >
                    All Payments
                  </option>
                  <option value="unpaid" >
                    Unpaid
                  </option>
                  <option value="paid" >
                    Paid
                  </option>
                  <option value="partially-paid" >
                    Partially Paid
                  </option>
                  <option value="refunded" >
                    Refunded
                  </option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">
                  Check-in Date
                </label>
                {' '}
                <input type="date" name="date" className="form-control" defaultValue={query.date || ''} />
              </div>
              <div className="col-md-2">
                <label className="form-label">
                  Room Type
                </label>
                {' '}
                <select name="roomType" className="form-select" defaultValue={query.roomType}>
                  <option value="all" >
                    All Types
                  </option>
                  <option value="Penthouse Double Suite" >
                    Penthouse Double
                  </option>
                  <option value="Penthouse Single Suite" >
                    Penthouse Single
                  </option>
                  <option value="Executive Room" >
                    Executive
                  </option>
                  <option value="Deluxe Room" >
                    Deluxe
                  </option>
                  <option value="Premiere Room" >
                    Premiere
                  </option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Search
                </label>
                <div className="input-group">
                  <input type="text" name="search" className="form-control" placeholder="Guest name, email, phone, or confirmation code" defaultValue={query.search || ''} />
                  {' '}
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-search" />
                  </button>
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-filter me-1" />
                  {' '}Apply Filters
                </button>
                {' '}
                <a href="/admin/reservations" className="btn btn-secondary">
                  <i className="fas fa-redo me-1" />
                  {' '}Clear Filters
                </a>
                {' '}
                <button type="button" className="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#upcomingArrivalsModal">
                  <i className="fas fa-plane-arrival me-1" />
                  {' '}View Upcoming Arrivals ({upcomingArrivals.length})
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Reservations Table */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              <i className="fas fa-table me-2" />
              Reservations ({reservations.length})
            </h5>
            <div>
              <span className="me-3">
                <i className="fas fa-bed me-1" />
                {' '}
                <span className="text-success">
                  {occupiedRooms}
                </span>
                /
                <span className="text-muted">
                  {totalRooms}
                </span>
                {' '}rooms occupied (
                <span className="text-info">
                  {occupancyRate}%
                </span>
                )
              </span>
            </div>
          </div>
          <div className="card-body">
            
      {(reservations.length > 0) ? (<>
      
            <div className="table-responsive">
              <table className="table table-hover" id="reservationsTable">
                <thead>
                  <tr>
                    <th>
                      Confirmation
                    </th>
                    <th>
                      Guest
                    </th>
                    <th>
                      Room
                    </th>
                    <th>
                      Dates & Duration
                    </th>
                    <th>
                      Amount
                    </th>
                    <th>
                      Status
                    </th>
                    <th>
                      Payment
                    </th>
                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  
      {(reservations || []).map((res, __i) => (<Fragment key={__i}>
      
                  <tr className={res.status === 'checked-in' ? 'table-success' : 
                                                   res.status === 'pending' ? 'table-warning' : 
                                                   res.status === 'cancelled' ? 'table-danger' : ''}>
                    <td>
                      <strong>
                        {res.confirmationCode || res._id.toString().slice(-8).toUpperCase()}
                      </strong>
                      <br />
                      {' '}
                      <small className="text-muted">
                        {new Date(res.createdAt).toLocaleDateString()}
                      </small>
                      {' '}
      {(res.checkedInBy) ? (<>
      {' '}
                      <br />
                      <small>
                        Checked in by: {res.checkedInBy}
                      </small>
                      {' '}
      </>) : null}
      
                    </td>
                    <td>
                      <strong>
                        {res.guestName}
                      </strong>
                      <br />
                      {' '}
                      <small className="text-muted">
                        {res.guestEmail}
                      </small>
                      <br />
                      {' '}
                      <small>
                        {res.guestPhone}
                      </small>
                      <br />
                      {' '}
                      <small className="badge bg-info">
                        {res.numberOfGuests || res.guests} guest(s)
                      </small>
                    </td>
                    <td>
                      
      {(res.room) ? (<>
      {' '}
                      <span className="badge bg-dark">
                        {res.room.roomNumber}
                      </span>
                      <br />
                      {' '}
                      <small>
                        {res.room.type}
                      </small>
                      <br />
                      {' '}
                      <small>
                        ₦{(res.roomRate || res.room.price || 0).toLocaleString()}/night
                      </small>
                      {' '}
      </>) : (<>
      {' '}
                      <span className="badge bg-secondary">
                        Not Assigned
                      </span>
                      {' '}
      </>)}
      
                    </td>
                    <td>
                      <div className="mb-1">
                        <strong>
                          Check-in:
                        </strong>
                        <br />
                        {' '}
      {(res.checkInDate) ? (<>
       {new Date(res.checkInDate).toLocaleDateString()} 
      </>) : (res.checkIn) ? (<>
       {new Date(res.checkIn).toLocaleDateString()} 
      </>) : (<>
      {' '}
                        <span className="text-danger">
                          Invalid Date
                        </span>
                        {' '}
      </>)}
       
      {(res.actualCheckIn) ? (<>
      {' '}
                        <br />
                        <small className="text-success">
                          Actual: {new Date(res.actualCheckIn).toLocaleDateString()}
                        </small>
                        {' '}
      </>) : null}
      
                      </div>
                      <div>
                        <strong>
                          Check-out:
                        </strong>
                        <br />
                        {' '}
      {(res.checkOutDate) ? (<>
       {new Date(res.checkOutDate).toLocaleDateString()} 
      </>) : (res.checkOut) ? (<>
       {new Date(res.checkOut).toLocaleDateString()} 
      </>) : (<>
      {' '}
                        <span className="text-danger">
                          Invalid Date
                        </span>
                        {' '}
      </>)}
       
      {(res.actualCheckOut) ? (<>
      {' '}
                        <br />
                        <small className="text-success">
                          Actual: {new Date(res.actualCheckOut).toLocaleDateString()}
                        </small>
                        {' '}
      </>) : null}
      
                      </div>
                      <div className="mt-1">
                        <small className="badge bg-primary">
                          {res.nights || Math.ceil(((res.checkOut || res.checkOutDate) - (res.checkIn || res.checkInDate)) / (1000 * 60 * 60 * 24))} night(s)
                        </small>
                      </div>
                    </td>
                    <td>
                      <strong>
                        ₦{(res.totalAmount || 0).toLocaleString()}
                      </strong>
                      <br />
                      {' '}
      {(res.paidAmount) ? (<>
      {' '}
                      <small className="text-success">
                        Paid: ₦{res.paidAmount.toLocaleString()}
                      </small>
                      <br />
                      {' '}
      </>) : null}
       
      {(res.extraCharges && res.extraCharges > 0) ? (<>
      {' '}
                      <small className="text-warning">
                        Extra: ₦{res.extraCharges.toLocaleString()}
                      </small>
                      {' '}
      </>) : null}
      
                    </td>
                    <td>
                      <span className={`badge ${res.status === 'confirmed' ? 'bg-success' : 
                                                  res.status === 'pending' ? 'bg-warning' : 
                                                  res.status === 'checked-in' ? 'bg-primary' :
                                                  res.status === 'completed' ? 'bg-info' :
                                                  'bg-danger'} badge-status`}>
                        {res.status ? res.status.toUpperCase() : 'UNKNOWN'}
                      </span>
                      {' '}
      {(res.status === 'checked-in') ? (<>
      {' '}
                      <br />
                      <small>
                        Since: {res.actualCheckIn ? new Date(res.actualCheckIn).toLocaleDateString() : 'Today'}
                      </small>
                      {' '}
      </>) : null}
      
                    </td>
                    <td>
                      <span className={`badge ${res.paymentStatus === 'paid' ? 'bg-success' : 
                                                  res.paymentStatus === 'partially-paid' ? 'bg-warning' : 
                                                  'bg-danger'} badge-status`}>
                        {res.paymentStatus ? res.paymentStatus.toUpperCase() : 'UNPAID'}
                      </span>
                      {' '}
      {(res.paymentMethod) ? (<>
      {' '}
                      <br />
                      <small>
                        {res.paymentMethod}
                      </small>
                      {' '}
      </>) : null}
       
      {(res.transactionId || res.transactionNo) ? (<>
      {' '}
                      <br />
                      <small>
                        Ref: {res.transactionId || res.transactionNo}
                      </small>
                      {' '}
      </>) : null}
      
                    </td>
                    <td>
                      <div className="action-buttons">
                        <a href={`/admin/reservations/${res._id}`} className="btn btn-sm btn-info quick-action-btn mb-1" title="View Details">
                          <i className="fas fa-eye" />
                        </a>
                        {' '}
      {(res.status === 'confirmed') ? (<>
      {' '}
                        <button data-onclick={`checkIn('${res._id}')`} className="btn btn-sm btn-success quick-action-btn mb-1" title="Check-in Guest">
                          <i className="fas fa-sign-in-alt" />
                        </button>
                        {' '}
                        <button data-onclick={`assignRoom('${res._id}')`} className="btn btn-sm btn-secondary quick-action-btn mb-1" title="Assign/Change Room">
                          <i className="fas fa-bed" />
                        </button>
                        {' '}
      </>) : null}
       
      {(res.status === 'checked-in') ? (<>
      {' '}
                        <button data-onclick={`checkOut('${res._id}')`} className="btn btn-sm btn-warning quick-action-btn mb-1" title="Check-out Guest">
                          <i className="fas fa-sign-out-alt" />
                        </button>
                        {' '}
                        <button data-onclick={`earlyCheckOut('${res._id}')`} className="btn btn-sm btn-danger quick-action-btn mb-1" title="Early Check-out">
                          <i className="fas fa-running" />
                        </button>
                        {' '}
      </>) : null}
       
      {(res.status === 'pending' && res.paymentStatus !== 'paid') ? (<>
      {' '}
                        <button data-onclick={`confirmPayment('${res._id}')`} className="btn btn-sm btn-primary quick-action-btn mb-1" title="Confirm Payment">
                          <i className="fas fa-money-check-alt" />
                        </button>
                        {' '}
      </>) : null}
       
      {(['pending', 'confirmed'].includes(res.status)) ? (<>
      {' '}
                        <button data-onclick={`cancelReservation('${res._id}')`} className="btn btn-sm btn-outline-danger quick-action-btn mb-1" title="Cancel Reservation">
                          <i className="fas fa-times" />
                        </button>
                        {' '}
      </>) : null}
      {' '}
                        <a href={`/admin/reservations/invoice/${res._id}`} className="btn btn-sm btn-outline-info quick-action-btn mb-1" title="Generate Invoice">
                          <i className="fas fa-file-invoice" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  
      </Fragment>))}
      
                </tbody>
              </table>
            </div>
            
      </>) : (<>
      
            <div className="text-center py-5">
              <i className="fas fa-bed fa-4x text-muted mb-3" />
              <h5>
                No reservations found
              </h5>
              <p className="text-muted">
                Try adjusting your filters or create a new reservation
              </p>
              <a href="/" className="btn btn-primary">
                <i className="fas fa-home me-1" />
                {' '}View Website
              </a>
            </div>
            
      </>)}
      
          </div>
        </div>
      </div>
      {/* Today's Summary Modal */}
      <div className="modal fade" id="todaySummaryModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-lg-custom">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="fas fa-calendar-day me-2" />
                Today's Operations Summary
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="card mb-3">
                    <div className="card-header bg-success text-white">
                      <h6 className="mb-0">
                        Check-ins ({todaysCheckIns.length})
                      </h6>
                    </div>
                    <div className="card-body">
                      
      {(todaysCheckIns.length > 0) ? (<>
      
                      <ul className="list-unstyled">
                        
      {(todaysCheckIns || []).map((checkin, __i) => (<Fragment key={__i}>
      
                        <li className="mb-2">
                          <i className="fas fa-user text-success me-2" />
                          {' '}
                          <strong>
                            {checkin.guestName}
                          </strong>
                          {' '}
                          <span className="badge bg-dark ms-2">
                            Room {checkin.room?.roomNumber || 'N/A'}
                          </span>
                          {' '}
                          <br />
                          {' '}
                          <small className="text-muted">
                            {checkin.room?.type} • {new Date(checkin.checkInDate || checkin.checkIn).toLocaleDateString()} at {new Date(checkin.checkInDate || checkin.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </small>
                        </li>
                        
      </Fragment>))}
      
                      </ul>
                      
      </>) : (<>
      
                      <p className="text-muted text-center mb-0">
                        No check-ins today
                      </p>
                      
      </>)}
      
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card mb-3">
                    <div className="card-header bg-warning text-white">
                      <h6 className="mb-0">
                        Check-outs ({todaysCheckOuts.length})
                      </h6>
                    </div>
                    <div className="card-body">
                      
      {(todaysCheckOuts.length > 0) ? (<>
      
                      <ul className="list-unstyled">
                        
      {(todaysCheckOuts || []).map((checkout, __i) => (<Fragment key={__i}>
      
                        <li className="mb-2">
                          <i className="fas fa-user text-warning me-2" />
                          {' '}
                          <strong>
                            {checkout.guestName}
                          </strong>
                          {' '}
                          <span className="badge bg-dark ms-2">
                            Room {checkout.room?.roomNumber || 'N/A'}
                          </span>
                          {' '}
                          <br />
                          {' '}
                          <small className="text-muted">
                            Check-out: {new Date(checkout.checkOutDate || checkout.checkOut).toLocaleDateString()} at {new Date(checkout.checkOutDate || checkout.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </small>
                        </li>
                        
      </Fragment>))}
      
                      </ul>
                      
      </>) : (<>
      
                      <p className="text-muted text-center mb-0">
                        No check-outs today
                      </p>
                      
      </>)}
      
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">
                        Property Status (69 Total Rooms)
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row text-center">
                        <div className="col-md-4">
                          <h3 className="text-success">
                            {occupiedRooms}
                          </h3>
                          <small className="text-muted">
                            Occupied Rooms
                          </small>
                        </div>
                        <div className="col-md-4">
                          <h3 className="text-primary">
                            {totalRooms - occupiedRooms}
                          </h3>
                          <small className="text-muted">
                            Available Rooms
                          </small>
                        </div>
                        <div className="col-md-4">
                          <h3 className="text-info">
                            {occupancyRate}%
                          </h3>
                          <small className="text-muted">
                            Occupancy Rate
                          </small>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-12">
                          <h6 className="mb-2">
                            Current Availability by Type:
                          </h6>
                          <div className="d-flex flex-wrap gap-2">
                            <span className="badge bg-primary">
                              Penthouse Double: {availabilityByType && availabilityByType['Penthouse Double Suite'] ? availabilityByType['Penthouse Double Suite'].available : 1}/1
                            </span>
                            {' '}
                            <span className="badge bg-info">
                              Penthouse Single: {availabilityByType && availabilityByType['Penthouse Single Suite'] ? availabilityByType['Penthouse Single Suite'].available : 2}/2
                            </span>
                            {' '}
                            <span className="badge bg-success">
                              Executive: {availabilityByType && availabilityByType['Executive Room'] ? availabilityByType['Executive Room'].available : 9}/9
                            </span>
                            {' '}
                            <span className="badge bg-warning">
                              Deluxe: {availabilityByType && availabilityByType['Deluxe Room'] ? availabilityByType['Deluxe Room'].available : 37}/37
                            </span>
                            {' '}
                            <span className="badge bg-danger">
                              Premiere: {availabilityByType && availabilityByType['Premiere Room'] ? availabilityByType['Premiere Room'].available : 20}/20
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
      {/* Upcoming Arrivals Modal */}
      <div className="modal fade" id="upcomingArrivalsModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-lg-custom">
          <div className="modal-content">
            <div className="modal-header bg-info text-white">
              <h5 className="modal-title">
                <i className="fas fa-plane-arrival me-2" />
                Upcoming Arrivals (Next 7 Days)
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              
      {(upcomingArrivals.length > 0) ? (<>
      
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>
                        Guest
                      </th>
                      <th>
                        Arrival
                      </th>
                      <th>
                        Room
                      </th>
                      <th>
                        Nights
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
                    
      {(upcomingArrivals || []).map((arrival, __i) => (<Fragment key={__i}>
      
                    <tr>
                      <td>
                        <strong>
                          {arrival.guestName}
                        </strong>
                        <br />
                        {' '}
                        <small className="text-muted">
                          {arrival.guestEmail}
                        </small>
                      </td>
                      <td>
                        {new Date(arrival.checkInDate || arrival.checkIn).toLocaleDateString()}
                        <br />
                        {' '}
                        <small className="text-muted">
                          {new Date(arrival.checkInDate || arrival.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                      </td>
                      <td>
                        
      {(arrival.room) ? (<>
      {' '}
                        <span className="badge bg-dark">
                          {arrival.room.roomNumber}
                        </span>
                        <br />
                        {' '}
                        <small>
                          {arrival.room.type}
                        </small>
                        {' '}
      </>) : (<>
      {' '}
                        <span className="badge bg-warning">
                          Room to assign
                        </span>
                        {' '}
      </>)}
      
                      </td>
                      <td>
                        {arrival.nights}
                      </td>
                      <td>
                        <span className={`badge ${arrival.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                          {arrival.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <a href={`/admin/reservations/${arrival._id}`} className="btn btn-sm btn-outline-info">
                          <i className="fas fa-eye" />
                        </a>
                        {' '}
      {(!arrival.room) ? (<>
      {' '}
                        <button data-onclick={`assignRoom('${arrival._id}')`} className="btn btn-sm btn-outline-success">
                          <i className="fas fa-bed" />
                        </button>
                        {' '}
      </>) : null}
      
                      </td>
                    </tr>
                    
      </Fragment>))}
      
                  </tbody>
                </table>
              </div>
              
      </>) : (<>
      
              <p className="text-center text-muted py-3">
                No upcoming arrivals in the next 7 days
              </p>
              
      </>)}
      
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <PageScript
        kind="admin"
        src="/js/pages/admin_reservations.js"
        libs={[
          'https://code.jquery.com/jquery-3.6.0.min.js',
          'https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js',
          'https://cdn.datatables.net/1.11.5/js/dataTables.bootstrap5.min.js',
        ]}
      />
    </>
  );
}
