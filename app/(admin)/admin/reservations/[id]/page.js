import { requireAdminPage } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect, { isValidId, plain } from '@/lib/db';
import Reservation from '@/lib/models/Reservation';
import Room from '@/lib/models/Room';
import { withReservationLabels } from '@/lib/format';
import PageScript from '@/components/PageScript';
import pageCss from '@/components/page-css/admin_reservation-details';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Reservation Details" };

export default async function Page({ params }) {
  const user = await requireAdminPage();
  await dbConnect();
  const messages = {}; // flash messages are shown by the admin layout
  const { id } = await params;
  if (!isValidId(id)) redirect('/admin/reservations');
  const doc = await Reservation.findById(id).populate('room', 'roomNumber type price amenities images').lean();
  if (!doc) redirect('/admin/reservations');
  const reservation = withReservationLabels(plain(doc));
  // Rooms of the same class, for the "assign room" form
  const assignableRooms = plain(
    await Room.find({ available: true, ...(doc.room?.type ? { type: doc.room.type } : {}) }).select('roomNumber type').sort({ roomNumber: 1 }).lean()
  );
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
                  <i className="bi bi-speedometer2" />
                  {' '}Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/admin/reservations">
                  <i className="bi bi-calendar-check" />
                  {' '}Reservations
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/rooms">
                  <i className="bi bi-house-door" />
                  {' '}Rooms
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/facilities">
                  <i className="bi bi-building" />
                  {' '}Facilities
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/blog">
                  <i className="bi bi-newspaper" />
                  {' '}Blog
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/users">
                  <i className="bi bi-people" />
                  {' '}Users
                </a>
              </li>
            </ul>
            <span className="navbar-text">
              <i className="bi bi-person-circle" />
              {' '}{user.username} |{' '}
              <a href="/logout" className="text-white">
                <i className="bi bi-box-arrow-right" />
                {' '}Logout
              </a>
            </span>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            {/* Header with Status */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-calendar-check me-2" />
                  {' '}Reservation Details
                </h1>
                <p className="text-muted mb-0">
                  Reservation ID: {reservation._id}
                </p>
              </div>
              <div>
                <span className={`badge ${{ confirmed: 'bg-success', pending: 'bg-warning', 'checked-in': 'bg-primary', completed: 'bg-info' }[reservation.status] || 'bg-danger'} status-badge`} style={{ fontSize: "1rem" }}>
                  {reservation.status ? reservation.status.toUpperCase() : 'UNKNOWN'}
                </span>
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
      
            <div className="row">
              {/* Left Column - Reservation Details */}
              <div className="col-md-8">
                {/* Guest Information */}
                <div className="card detail-card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-user me-2" />
                      Guest Information
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>
                            Name:
                          </strong>
                          {' '}{reservation.guestName}
                        </p>
                        <p>
                          <strong>
                            Email:
                          </strong>
                          {' '}{reservation.guestEmail}
                        </p>
                        <p>
                          <strong>
                            Phone:
                          </strong>
                          {' '}{reservation.guestPhone}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>
                            Reservation ID:
                          </strong>
                          {' '}{reservation._id}
                        </p>
                        <p>
                          <strong>
                            Created:
                          </strong>
                          {' '}{new Date(reservation.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Booking Details with Room Info */}
                <div className="card detail-card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-calendar-alt me-2" />
                      Booking Details
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        
      {(reservation.room) ? (<>
      
                        <div className="room-info-card p-3 rounded mb-3">
                          <h6 className="mb-1">
                            Room Information
                          </h6>
                          <h4 className="mb-0">
                            {reservation.room.roomNumber}
                          </h4>
                          <p className="mb-0">
                            {reservation.room.type}
                          </p>
                          <small>
                            ₦{(reservation.roomRate || 0).toLocaleString()} per night
                          </small>
                        </div>
                        
      </>) : null}
      
                        <p>
                          <strong>
                            Check-in:
                          </strong>
                          {' '}
      {(reservation.checkIn) ? (<>
       {reservation.formattedCheckIn || new Date(reservation.checkIn).toLocaleDateString()} 
      </>) : (<>
      {' '}
                          <span className="text-danger">
                            Invalid Date
                          </span>
                          {' '}
      </>)}
      
                        </p>
                        <p>
                          <strong>
                            Check-out:
                          </strong>
                          {' '}
      {(reservation.checkOut) ? (<>
       {reservation.formattedCheckOut || new Date(reservation.checkOut).toLocaleDateString()} 
      </>) : (<>
      {' '}
                          <span className="text-danger">
                            Invalid Date
                          </span>
                          {' '}
      </>)}
      
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>
                            Nights:
                          </strong>
                          {' '}{reservation.nights || 'N/A'}
                        </p>
                        <p>
                          <strong>
                            Guests:
                          </strong>
                          {' '}{reservation.guests || 'N/A'}
                        </p>
                        <p>
                          <strong>
                            Room Rate:
                          </strong>
                          {' '}₦{(reservation.roomRate || 0).toLocaleString()} per night
                        </p>
                        <p>
                          <strong>
                            Total Amount:
                          </strong>
                          {' '}
                          <span className="h5 text-success">
                            ₦{(reservation.totalAmount || 0).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Check-in/Check-out Timeline */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-history me-2" />
                      Stay Timeline
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="timeline-item">
                      <h6>
                        Reservation Created
                      </h6>
                      <p className="timeline-date">
                        {new Date(reservation.createdAt).toLocaleString()}
                      </p>
                      <p className="mb-0">
                        Booking was created and is currently {reservation.status}.
                      </p>
                    </div>
                    
      {(reservation.actualCheckIn) ? (<>
      
                    <div className="timeline-item">
                      <div className="checkin-info-card p-3 rounded">
                        <h6>
                          <i className="fas fa-sign-in-alt me-2" />
                          Checked In
                        </h6>
                        <p className="mb-0">
                          Guest checked in on {new Date(reservation.actualCheckIn).toLocaleString()}
                        </p>
                        
      {(reservation.checkedInBy) ? (<>
      {' '}
                        <small>
                          Processed by: {reservation.checkedInBy}
                        </small>
                        {' '}
      </>) : null}
      
                      </div>
                    </div>
                    
      </>) : null}
       
      {(reservation.actualCheckOut) ? (<>
      
                    <div className="timeline-item">
                      <div className="checkout-info-card p-3 rounded">
                        <h6>
                          <i className="fas fa-sign-out-alt me-2" />
                          Checked Out
                        </h6>
                        <p className="mb-0">
                          Guest checked out on {new Date(reservation.actualCheckOut).toLocaleString()}
                        </p>
                        
      {(reservation.checkedOutBy) ? (<>
      {' '}
                        <small>
                          Processed by: {reservation.checkedOutBy}
                        </small>
                        {' '}
      </>) : null}
       
      {(reservation.extraCharges && reservation.extraCharges > 0) ? (<>
      {' '}
                        <small>
                          Extra charges: ₦{(reservation.extraCharges || 0).toLocaleString()}
                        </small>
                        {' '}
      </>) : null}
       
      {(reservation.extraNights && reservation.extraNights > 0) ? (<>
      {' '}
                        <small>
                          Extra nights: {reservation.extraNights}
                        </small>
                        {' '}
      </>) : null}
      
                      </div>
                    </div>
                    
      </>) : null}
       
      {(reservation.status === 'cancelled') ? (<>
      
                    <div className="timeline-item">
                      <div className="bg-danger text-white p-3 rounded">
                        <h6>
                          <i className="fas fa-times-circle me-2" />
                          Cancelled
                        </h6>
                        <p className="mb-0">
                          Reservation was cancelled
                        </p>
                        
      {(reservation.cancelledAt) ? (<>
      {' '}
                        <small>
                          Cancelled on: {new Date(reservation.cancelledAt).toLocaleString()}
                        </small>
                        {' '}
      </>) : null}
       
      {(reservation.cancelledBy) ? (<>
      {' '}
                        <small>
                          Cancelled by: {reservation.cancelledBy}
                        </small>
                        {' '}
      </>) : null}
       
      {(reservation.cancellationReason) ? (<>
      {' '}
                        <small>
                          Reason: {reservation.cancellationReason}
                        </small>
                        {' '}
      </>) : null}
      
                      </div>
                    </div>
                    
      </>) : null}
      
                  </div>
                </div>
                {/* Payment Information */}
                <div className="card detail-card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-credit-card me-2" />
                      Payment Information
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>
                            Status:
                          </strong>
                          {' '}
                          <span className={`badge ${reservation.paymentStatus === 'paid' ? 'bg-success' : 'bg-danger'} status-badge`}>
                            {reservation.paymentStatus ? reservation.paymentStatus.toUpperCase() : 'UNKNOWN'}
                          </span>
                        </p>
                        
      {(reservation.paymentMethod) ? (<>
      
                        <p>
                          <strong>
                            Method:
                          </strong>
                          {' '}{reservation.paymentMethod.toUpperCase()}
                        </p>
                        
      </>) : null}
       
      {(reservation.transactionNo) ? (<>
      
                        <p>
                          <strong>
                            Transaction ID:
                          </strong>
                          {' '}{reservation.transactionNo}
                        </p>
                        
      </>) : null}
       
      {(reservation.paidAt) ? (<>
      
                        <p>
                          <strong>
                            Paid At:
                          </strong>
                          {' '}{new Date(reservation.paidAt).toLocaleString()}
                        </p>
                        
      </>) : null}
      
                      </div>
                      <div className="col-md-6">
                        
      {(reservation.receiptNumber) ? (<>
      
                        <p>
                          <strong>
                            Receipt No:
                          </strong>
                          {' '}{reservation.receiptNumber}
                        </p>
                        
      </>) : null}
       
      {(reservation.bankName) ? (<>
      
                        <p>
                          <strong>
                            Bank:
                          </strong>
                          {' '}{reservation.bankName}
                        </p>
                        
      </>) : null}
       
      {(reservation.sessionId) ? (<>
      
                        <p>
                          <strong>
                            Session ID:
                          </strong>
                          {' '}{reservation.sessionId}
                        </p>
                        
      </>) : null}
       
      {(reservation.cardType) ? (<>
      
                        <p>
                          <strong>
                            Card Type:
                          </strong>
                          {' '}{reservation.cardType}
                        </p>
                        
      </>) : null}
      
                      </div>
                    </div>
                  </div>
                </div>
                {/* Notes */}
                <div className="card notes-box mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-sticky-note me-2" />
                      Notes
                    </h5>
                    
      {(reservation.notes) ? (<>
      
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
      {reservation.notes}              </pre>
                    
      </>) : (<>
      
                    <p className="text-muted">
                      No notes
                    </p>
                    
      </>)}
      
                  </div>
                </div>
              </div>
              {/* Right Column - Actions */}
              <div className="col-md-4">
                {/* Check-in/Check-out Actions */}
                <div className="card mb-4">
                  <div className="card-header bg-success text-white">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-door-open me-2" />
                      Check-in & Check-out
                    </h5>
                  </div>
                  <div className="card-body">
                    
      {(reservation.status === 'confirmed') ? (<>
      
                    {/* Check-in Button */}
                    <div className="text-center mb-3">
                      <form action={`/admin/reservations/checkin/${reservation._id}`} method="POST">
                        <button type="submit" className="btn btn-success btn-lg w-100">
                          <i className="fas fa-sign-in-alt me-2" />
                          Check-in Guest
                        </button>
                      </form>
                      <small className="text-muted">
                        Mark guest as checked in and occupy the room
                      </small>
                    </div>
                    
      </>) : null}
       
      {(reservation.status === 'checked-in') ? (<>
      
                    {/* Check-out Button */}
                    <div className="text-center mb-3">
                      <form action={`/admin/reservations/checkout/${reservation._id}`} method="POST">
                        <button type="submit" className="btn btn-warning btn-lg w-100">
                          <i className="fas fa-sign-out-alt me-2" />
                          Check-out Guest
                        </button>
                      </form>
                      <small className="text-muted">
                        Process check-out and free up the room
                      </small>
                    </div>
                    
      </>) : null}
       
      {(reservation.status === 'checked-in') ? (<>
      
                    <div className="alert alert-success">
                      <i className="fas fa-info-circle me-2" />
                      {' '}
                      <strong>
                        Guest is currently checked in
                      </strong>
                      <br />
                      {' '}
                      <small>
                        Since: {reservation.actualCheckIn ? new Date(reservation.actualCheckIn).toLocaleDateString() : 'Today'}
                        <br />
                        {' '}Room: {reservation.room ? reservation.room.roomNumber : 'N/A'}
                      </small>
                    </div>
                    
      </>) : null}
      
                  </div>
                </div>
                {/* Payment Confirmation */}
                
      {(reservation.paymentStatus === 'unpaid') ? (<>
      
                <div className="card payment-form-section mb-4">
                  <div className="card-body">
                    <h5 className="card-title text-success">
                      <i className="fas fa-money-check-alt me-2" />
                      Confirm Payment
                    </h5>
                    <form action={`/admin/reservations/confirm-payment/${reservation._id}`} method="POST">
                      <div className="mb-3">
                        <label className="form-label">
                          Payment Method *
                        </label>
                        {' '}
                        <select name="paymentMethod" id="paymentMethod" className="form-select" required>
                          <option value="">
                            Select method
                          </option>
                          <option value="cash">
                            Cash
                          </option>
                          <option value="transfer">
                            Bank Transfer
                          </option>
                          <option value="pos">
                            POS
                          </option>
                        </select>
                      </div>
                      {/* Cash Fields */}
                      <div id="cashFields" className="payment-method-fields" style={{ display: "none" }}>
                        <div className="mb-3">
                          <label className="form-label">
                            Receipt Number *
                          </label>
                          {' '}
                          <input type="text" name="receiptNumber" className="form-control" placeholder="e.g., REC-00123" />
                        </div>
                      </div>
                      {/* Transfer Fields */}
                      <div id="transferFields" className="payment-method-fields" style={{ display: "none" }}>
                        <div className="mb-3">
                          <label className="form-label">
                            Bank Name *
                          </label>
                          {' '}
                          <input type="text" name="bankName" className="form-control" placeholder="e.g., Access Bank" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Transaction Number *
                          </label>
                          {' '}
                          <input type="text" name="transferTransactionNo" className="form-control" placeholder="e.g., TXN-456789" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Session ID *
                          </label>
                          {' '}
                          <input type="text" name="sessionId" className="form-control" placeholder="e.g., SESS-12345" />
                        </div>
                      </div>
                      {/* POS Fields */}
                      <div id="posFields" className="payment-method-fields" style={{ display: "none" }}>
                        <div className="mb-3">
                          <label className="form-label">
                            Card Type *
                          </label>
                          {' '}
                          <select name="cardType" className="form-control">
                            <option value="visa">
                              Visa
                            </option>
                            <option value="mastercard">
                              MasterCard
                            </option>
                            <option value="verve">
                              Verve
                            </option>
                            <option value="amex">
                              American Express
                            </option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Transaction Number *
                          </label>
                          {' '}
                          <input type="text" name="posTransactionNo" className="form-control" placeholder="e.g., TXN-456789" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Notes
                        </label>
                        {' '}
                        <textarea name="notes" className="form-control" rows="3" placeholder="Any additional notes..." />
                      </div>
                      <button type="submit" className="btn btn-success w-100">
                        <i className="fas fa-check-circle me-2" />
                        {' '}Confirm Payment
                      </button>
                    </form>
                  </div>
                </div>
                
      </>) : (<>
      
                <div className="card bg-light mb-4">
                  <div className="card-body text-center">
                    <i className="fas fa-check-circle text-success" style={{ fontSize: "3rem" }} />
                    <h5 className="mt-3">
                      Payment Confirmed
                    </h5>
                    <p className="text-muted">
                      This reservation has been paid
                    </p>
                    
      {(reservation.paymentMethod) ? (<>
      
                    <p>
                      <strong>
                        Method:
                      </strong>
                      {' '}{reservation.paymentMethod}
                    </p>
                    
      </>) : null}
       
      {(reservation.paidAt) ? (<>
      
                    <p>
                      <strong>
                        Paid on:
                      </strong>
                      {' '}{new Date(reservation.paidAt).toLocaleDateString()}
                    </p>
                    
      </>) : null}
      
                  </div>
                </div>
                
      </>)}
      
                {/* Quick Actions */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-bolt me-2" />
                      Quick Actions
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="action-buttons d-grid gap-2">
                      
      {(reservation.status === 'pending' || reservation.status === 'confirmed') ? (<>
      
                      {/* Cancel Reservation */}
                      <button className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#cancelModal">
                        <i className="fas fa-times me-2" />
                        Cancel Reservation
                      </button>
                      {' '}
      </>) : null}
      
                      {/* Update Status */}
                      <form action={`/admin/reservations/update-status/${reservation._id}`} method="POST" className="d-grid">
                        <select name="status" className="form-select mb-2" defaultValue={reservation.status}>
                          <option value="pending">
                            Pending
                          </option>
                          <option value="confirmed">
                            Confirmed
                          </option>
                          <option value="cancelled">
                            Cancelled
                          </option>
                        </select>
                        {' '}
                        <button type="submit" className="btn btn-primary">
                          <i className="fas fa-sync me-2" />
                          Update Status
                        </button>
                      </form>
                      {/* Assign / change room (target of the "Assign Room" buttons on the list) */}
                      {assignableRooms.length > 0 && (
                        <form id="assign-room" action={`/admin/reservations/assign-room/${reservation._id}`} method="POST" className="d-grid">
                          <select name="roomId" className="form-select mb-2" defaultValue={reservation.room?._id || ''}>
                            <option value="">Select room…</option>
                            {assignableRooms.map((r) => (
                              <option key={r._id} value={r._id}>
                                Room {r.roomNumber} ({r.type})
                              </option>
                            ))}
                          </select>
                          <button type="submit" className="btn btn-outline-secondary">
                            <i className="fas fa-door-open me-2" />
                            Assign Room
                          </button>
                        </form>
                      )}
                      {/* View Guest Page */}
                      <a href={`/rooms/guest-reservation/${reservation._id}`} className="btn btn-outline-info" target="_blank">
                        <i className="fas fa-file-invoice me-2" />
                        View Guest Page
                      </a>
                      {/* Back to List */}
                      <a href="/admin/reservations" className="btn btn-outline-dark">
                        <i className="fas fa-arrow-left me-2" />
                        Back to Reservations
                      </a>
                    </div>
                  </div>
                </div>
                {/* Room Status */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-bed me-2" />
                      Room Status
                    </h5>
                  </div>
                  <div className="card-body">
                    
      {(reservation.room) ? (<>
      
                    <div className="text-center">
                      <h4 className="text-primary">
                        {reservation.room.roomNumber}
                      </h4>
                      <p className="mb-1">
                        <strong>
                          {reservation.room.type}
                        </strong>
                      </p>
                      <p className="mb-1">
                        Price: ₦{(reservation.roomRate || 0).toLocaleString()}/night
                      </p>
                      <p className="mb-1">
                        Capacity: {reservation.guests} guest(s)
                      </p>
                      <div className="mt-3">
                        
      {(reservation.status === 'checked-in') ? (<>
      {' '}
                        <span className="badge bg-danger">
                          OCCUPIED
                        </span>
                        {' '}
      </>) : (reservation.status === 'confirmed') ? (<>
      {' '}
                        <span className="badge bg-warning">
                          RESERVED
                        </span>
                        {' '}
      </>) : (reservation.status === 'completed' || reservation.status === 'cancelled') ? (<>
      {' '}
                        <span className="badge bg-secondary">
                          AVAILABLE
                        </span>
                        {' '}
      </>) : (<>
      {' '}
                        <span className="badge bg-success">
                          AVAILABLE
                        </span>
                        {' '}
      </>)}
      
                      </div>
                    </div>
                    
      </>) : (<>
      
                    <div className="alert alert-warning text-center">
                      <i className="fas fa-exclamation-triangle me-2" />
                      {' '}
                      <strong>
                        No room information
                      </strong>
                      <p className="mb-0">
                        Room details not available
                      </p>
                    </div>
                    
      </>)}
      
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cancel Reservation Modal */}
      <div className="modal fade" id="cancelModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="fas fa-times me-2" />
                Cancel Reservation
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
            </div>
            <form action={`/admin/reservations/cancel/${reservation._id}`} method="POST">
              <div className="modal-body">
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-circle me-2" />
                  {' '}
                  <strong>
                    Warning: This action cannot be undone
                  </strong>
                  <p className="mb-0 mt-2">
                    Cancelling this reservation will free up the room and update the status.
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Cancellation Reason *
                  </label>
                  {' '}
                  <textarea name="cancellationReason" className="form-control" rows="3" required placeholder="Please specify the reason for cancellation..." />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Refund Amount (₦)
                  </label>
                  {' '}
                  <input type="number" name="refundAmount" className="form-control" defaultValue="0" min="0" step="0.01" />
                  {' '}
                  <small className="text-muted">
                    If applicable, enter the amount to refund to guest
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Go Back
                </button>
                {' '}
                <button type="submit" className="btn btn-danger">
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <PageScript kind="admin" src="/js/pages/admin_reservation-details.js" />
    </>
  );
}
