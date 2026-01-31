const {
  Return,
  RentalOrder,
  Reservation
} = require('../../../../database/models');

// Create return for rental order
const createReturn = async (rentalOrderId, customerId, lateFee = 0) => {
  const rentalOrder = await RentalOrder.findOne({
    where: { id: rentalOrderId, customerId }
  });

  if (!rentalOrder) {
    throw new Error('Rental order not found');
  }

  if (rentalOrder.status === 'completed') {
    throw new Error('Rental order already completed');
  }

  // Prevent duplicate return
  const existingReturn = await Return.findOne({
    where: { rentalOrderId }
  });

  if (existingReturn) {
    throw new Error('Return already exists for this rental order');
  }

  // Create return record
  const returnRecord = await Return.create({
    rentalOrderId,
    returnDate: new Date(),
    lateFee
  });

  // Mark rental order as completed
  rentalOrder.status = 'completed';
  await rentalOrder.save();

  // Free inventory by removing reservations
  await Reservation.destroy({
    where: { rentalOrderId }
  });

  return returnRecord;
};

// Get return details
const getReturnByRentalOrder = async (rentalOrderId) => {
  const returnRecord = await Return.findOne({
    where: { rentalOrderId }
  });

  if (!returnRecord) {
    throw new Error('Return record not found');
  }

  return returnRecord;
};

module.exports = {
  createReturn,
  getReturnByRentalOrder
};
