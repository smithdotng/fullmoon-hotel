// routes/manage-reservations.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const mongoose = require('mongoose');

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error', 'Admin access required');
    return res.redirect('/login');
  }
  next();
};

// Apply admin middleware to all routes
router.use(requireAdmin);

// GET /manage-reservations - View all reservations
router.get('/', async (req, res) => {
  try {
    const { status, payment, date, search } = req.query;
    
    let filter = {};
    
    // Filter by status
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // Filter by payment status
    if (payment && payment !== 'all') {
      filter.paymentStatus = payment;
    }
    
    // Filter by date
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.$or = [
        { checkIn: { $gte: searchDate, $lt: nextDay } },
        { checkOut: { $gte: searchDate, $lt: nextDay } }
      ];
    }
    
    // Search by guest name, email, or phone
    if (search) {
      filter.$or = [
        { guestName: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } },
        { guestPhone: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const reservations = await Reservation.find(filter)
      .populate('room')
      .sort({ createdAt: -1 })
      .lean();
    
    // Calculate totals for dashboard
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmed' });
    const unpaidReservations = await Reservation.countDocuments({ paymentStatus: 'unpaid' });
    
    // Format dates for display
    const formattedReservations = reservations.map(res => ({
      ...res,
      formattedCheckIn: new Date(res.checkIn).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      formattedCheckOut: new Date(res.checkOut).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      formattedCreatedAt: new Date(res.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      formattedAmount: new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(res.totalAmount)
    }));
    
    res.render('admin/manage-reservations', {
      title: 'Manage Reservations',
      reservations: formattedReservations,
      totals: {
        total: totalReservations,
        pending: pendingReservations,
        confirmed: confirmedReservations,
        unpaid: unpaidReservations
      },
      query: req.query,
      user: req.session.user
    });
    
  } catch (error) {
    console.error('Error loading reservations:', error);
    req.flash('error', 'Failed to load reservations');
    res.redirect('/admin');
  }
});

// GET /manage-reservations/:id - View reservation details
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('room')
      .lean();
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/manage-reservations');
    }
    
    // Format dates
    reservation.formattedCheckIn = new Date(reservation.checkIn).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    reservation.formattedCheckOut = new Date(reservation.checkOut).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    res.render('admin/reservation-details', {
      title: 'Reservation Details',
      reservation: reservation,
      user: req.session.user
    });
    
  } catch (error) {
    console.error('Error loading reservation:', error);
    req.flash('error', 'Failed to load reservation');
    res.redirect('/manage-reservations');
  }
});

// POST /manage-reservations/:id/confirm-payment - Confirm payment
router.post('/:id/confirm-payment', async (req, res) => {
  try {
    const { paymentMethod, receiptNumber, transactionNo, sessionId, bankName, notes } = req.body;
    
    if (!paymentMethod) {
      req.flash('error', 'Payment method is required');
      return res.redirect(`/manage-reservations/${req.params.id}`);
    }
    
    const updateData = {
      paymentStatus: 'paid',
      paymentMethod: paymentMethod,
      status: 'confirmed', // Change status to confirmed
      notes: notes || ''
    };
    
    // Add method-specific fields
    if (paymentMethod === 'cash') {
      if (!receiptNumber) {
        req.flash('error', 'Receipt number is required for cash payment');
        return res.redirect(`/manage-reservations/${req.params.id}`);
      }
      updateData.receiptNumber = receiptNumber;
    } 
    else if (paymentMethod === 'transfer') {
      if (!bankName || !transactionNo || !sessionId) {
        req.flash('error', 'Bank, transaction number, and session ID are required for transfer');
        return res.redirect(`/manage-reservations/${req.params.id}`);
      }
      updateData.bankName = bankName;
      updateData.transactionNo = transactionNo;
      updateData.sessionId = sessionId;
    }
    else if (paymentMethod === 'pos' || paymentMethod === 'card') {
      if (!transactionNo) {
        req.flash('error', 'Transaction number is required');
        return res.redirect(`/manage-reservations/${req.params.id}`);
      }
      updateData.transactionNo = transactionNo;
    }
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('room');
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/manage-reservations');
    }
    
    console.log(`Payment confirmed for reservation ${reservation._id}`);
    
    // TODO: Here you would call the function to post to PMS
    // await postToPMS(reservation, reservation.room);
    
    req.flash('success', `Payment confirmed for ${reservation.guestName}. Reservation is now confirmed.`);
    res.redirect(`/manage-reservations/${req.params.id}`);
    
  } catch (error) {
    console.error('Error confirming payment:', error);
    req.flash('error', 'Failed to confirm payment');
    res.redirect(`/manage-reservations/${req.params.id}`);
  }
});

// POST /manage-reservations/:id/update-status - Update reservation status
router.post('/:id/update-status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'no-show'].includes(status)) {
      req.flash('error', 'Invalid status');
      return res.redirect(`/manage-reservations/${req.params.id}`);
    }
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/manage-reservations');
    }
    
    req.flash('success', `Status updated to ${status}`);
    res.redirect(`/manage-reservations/${req.params.id}`);
    
  } catch (error) {
    console.error('Error updating status:', error);
    req.flash('error', 'Failed to update status');
    res.redirect(`/manage-reservations/${req.params.id}`);
  }
});

// POST /manage-reservations/:id/add-note - Add note
router.post('/:id/add-note', async (req, res) => {
  try {
    const { note } = req.body;
    
    if (!note) {
      req.flash('error', 'Note cannot be empty');
      return res.redirect(`/manage-reservations/${req.params.id}`);
    }
    
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/manage-reservations');
    }
    
    const timestamp = new Date().toISOString();
    const adminNote = `[${timestamp}] ${req.session.user.username}: ${note}\n`;
    
    reservation.notes = (reservation.notes || '') + adminNote;
    await reservation.save();
    
    req.flash('success', 'Note added');
    res.redirect(`/manage-reservations/${req.params.id}`);
    
  } catch (error) {
    console.error('Error adding note:', error);
    req.flash('error', 'Failed to add note');
    res.redirect(`/manage-reservations/${req.params.id}`);
  }
});

// POST /manage-reservations/:id/upload-proof - Upload proof of payment
router.post('/:id/upload-proof', async (req, res) => {
  try {
    if (!req.files || !req.files.proofFile) {
      req.flash('error', 'Please select a file');
      return res.redirect(`/manage-reservations/${req.params.id}`);
    }
    
    const proofFile = req.files.proofFile;
    const fileName = `proof_${req.params.id}_${Date.now()}${path.extname(proofFile.name)}`;
    const uploadPath = path.join(__dirname, '../public/uploads/proofs', fileName);
    
    // Create directory if it doesn't exist
    const dirPath = path.dirname(uploadPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    await proofFile.mv(uploadPath);
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { 
        proofOfPayment: `/uploads/proofs/${fileName}`,
        notes: (reservation.notes || '') + `\n[${new Date().toISOString()}] Proof of payment uploaded: ${fileName}`
      },
      { new: true }
    );
    
    req.flash('success', 'Proof of payment uploaded');
    res.redirect(`/manage-reservations/${req.params.id}`);
    
  } catch (error) {
    console.error('Error uploading proof:', error);
    req.flash('error', 'Failed to upload proof of payment');
    res.redirect(`/manage-reservations/${req.params.id}`);
  }
});

// GET /manage-reservations/export/csv - Export reservations as CSV
router.get('/export/csv', async (req, res) => {
  try {
    const reservations = await Reservation.find({})
      .populate('room')
      .sort({ createdAt: -1 })
      .lean();
    
    const csvData = [
      ['Reservation ID', 'Guest Name', 'Email', 'Phone', 'Room Type', 
       'Check-in', 'Check-out', 'Nights', 'Guests', 'Room Rate', 
       'Room Total', 'VAT', 'Service Charge', 'Total Amount',
       'Status', 'Payment Status', 'Payment Method', 'Receipt/Transaction No',
       'Created At']
    ];
    
    reservations.forEach(res => {
      csvData.push([
        res._id.toString(),
        res.guestName,
        res.guestEmail,
        res.guestPhone,
        res.room?.type || 'N/A',
        new Date(res.checkIn).toISOString().split('T')[0],
        new Date(res.checkOut).toISOString().split('T')[0],
        res.nights,
        res.guests,
        res.roomRate,
        res.roomTotal,
        res.vatAmount,
        res.serviceCharge,
        res.totalAmount,
        res.status,
        res.paymentStatus,
        res.paymentMethod || 'N/A',
        res.receiptNumber || res.transactionNo || 'N/A',
        new Date(res.createdAt).toISOString()
      ]);
    });
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    res.header('Content-Type', 'text/csv');
    res.attachment(`reservations-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);
    
  } catch (error) {
    console.error('Export error:', error);
    req.flash('error', 'Failed to export data');
    res.redirect('/manage-reservations');
  }
});

module.exports = router;