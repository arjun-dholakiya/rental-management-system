const reservationService = require('../services/reservationServices');
const {
  availabilitySchema,
  createReservationSchema
} = require('../../../../validations/reservationValidation');

// Check Availability
const checkAvailability = async (req, res) => {
  try {
    const { error } = availabilitySchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { productId, startDate, endDate } = req.query;
    const available = await reservationService.checkAvailability(
      productId,
      startDate,
      endDate
    );

    res.json({ available });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create Reservation
const reserve = async (req, res) => {
  try {
    const { error } = createReservationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const reservation = await reservationService.createReservation(
      req.body.productId,
      req.body.startDate,
      req.body.endDate
    );

    res
      .status(201)
      .json({ message: 'Reservation Created Successfully', reservation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// View reservations of a product
const listByProduct = async (req, res) => {
  const reservations = await reservationService.getProductReservations(
    req.params.productId
  );
  res.json(reservations);
};

module.exports = {
  checkAvailability,
  reserve,
  listByProduct
};
