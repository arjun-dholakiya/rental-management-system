const paymentService = require('../services/paymentServices');

// Create payment
const create = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    const payment = await paymentService.createPayment(
      req.params.invoiceId,
      amount,
      paymentMethod
    );

    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get invoice payments
const getByInvoice = async (req, res) => {
  try {
    const payments = await paymentService.getPaymentsByInvoice(
      req.params.invoiceId
    );
    res.json(payments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  getByInvoice
};
