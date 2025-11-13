const Facility = require('../models/Facility');

exports.getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({ available: true });
    res.render('facilities/list', { facilities, title: 'Hotel Facilities' });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to fetch facilities' });
  }
};

exports.bookFacility = async (req, res) => {
  try {
    const { facilityId, date, hours } = req.body;
    const facility = await Facility.findById(facilityId);
    
    if (!facility) {
      return res.status(404).render('error', { error: 'Facility not found' });
    }

    // Here you would typically create a facility booking record
    const totalAmount = facility.pricePerHour * hours;
    
    res.render('facilities/booking-confirmation', {
      facility,
      date,
      hours,
      totalAmount,
      title: 'Booking Confirmation'
    });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to book facility' });
  }
};