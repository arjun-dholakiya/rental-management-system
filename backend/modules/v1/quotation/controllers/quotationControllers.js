const quotationService = require('../services/quotationServices');

// Create quotation
const create = async (req, res) => {
  try {
    const quotation = await quotationService.createQuotation(
      req.user.id,
      req.body.notes
    );
    res.status(201).json(quotation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add product / increase quantity
const addItem = async (req, res) => {
  try {
    const { productId, startDate, endDate, quantity } = req.body;

    if (!productId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'productId, startDate, endDate are required'
      });
    }

    const item = await quotationService.addItem(
      req.params.id,
      productId,
      startDate,
      endDate,
      quantity ?? 1
    );

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get single quotation
const getById = async (req, res) => {
  try {
    const quotation = await quotationService.getQuotationById(
      req.params.id,
      req.user.id
    );
    res.json(quotation);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Get my quotations
const myQuotations = async (req, res) => {
  try {
    const quotations = await quotationService.getMyQuotations(req.user.id);
    res.json(quotations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  addItem,
  getById,
  myQuotations
};
