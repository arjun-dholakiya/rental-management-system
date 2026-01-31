const returnService = require('../services/returnServices');

// Create return
const create = async (req, res) => {
  try {
    const { lateFee } = req.body;

    const returnRecord = await returnService.createReturn(
      req.params.rentalOrderId,
      req.user.id,
      lateFee || 0
    );

    res.status(201).json(returnRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get return details
const getByRentalOrder = async (req, res) => {
  try {
    const returnRecord = await returnService.getReturnByRentalOrder(
      req.params.rentalOrderId
    );

    res.json(returnRecord);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  create,
  getByRentalOrder
};
