const invoiceService = require('../services/invoiceServices');

// Create invoice
const create = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoiceFromRentalOrder(
      req.params.rentalOrderId,
      req.user.id
    );
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get my invoices
const myInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getMyInvoices(req.user.id);
    res.json(invoices);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get single invoice
const getById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(
      req.params.id,
      req.user.id
    );
    res.json(invoice);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  create,
  myInvoices,
  getById
};
