const Cab = require('../models/Cab');

exports.getCabs = async (req, res) => {
  try {
    const cabs = await Cab.find({ available: true });
    res.render('cabs/list', { cabs, title: 'Cab Services' });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to fetch cabs' });
  }
};

exports.calculateFare = async (req, res) => {
  try {
    const { cabId, distance } = req.body;
    const cab = await Cab.findById(cabId);
    
    if (!cab) {
      return res.status(404).json({ error: 'Cab not found' });
    }

    const fare = cab.pricePerKm * distance;
    res.json({ fare, cab: cab.name });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate fare' });
  }
};