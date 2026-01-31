const rentalOrderService = require('../services/rentalOrderServices');

// Confirm quotation → rental order
const confirm = async (req, res) => {
  try {
    const rentalOrder = await rentalOrderService.confirmQuotation(
      req.params.quotationId,
      req.user.id
    );

    res.status(201).json(rentalOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get my rental orders
const myOrders = async (req, res) => {
  try {
    const orders = await rentalOrderService.getMyRentalOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get single rental order
const getById = async (req, res) => {
  try {
    const order = await rentalOrderService.getRentalOrderById(
      req.params.id,
      req.user.id
    );
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  confirm,
  myOrders,
  getById
};
