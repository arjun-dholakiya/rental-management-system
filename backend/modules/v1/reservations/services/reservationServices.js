const { Reservation, Product } = require('../../../../database/models');
const { Op } = require('sequelize');

// Check Availability
const checkAvailability = async (productId, startDate, endDate) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  if (product.status !== 'available' || !product.rentable) {
    return false;
  }

  const overlappingReservations = await Reservation.findOne({
    where: {
      productId,
      [Op.not]: {
        [Op.or]: [
          { endDate: { [Op.lt]: startDate } },
          { startDate: { [Op.gt]: endDate } }
        ]
      }
    }
  });

  return !overlappingReservations;
};

// Create Reservation
const createReservation = async (
  productId,
  startDate,
  endDate,
  rentalOrderId = null
) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');

  const isAvailable = await checkAvailability(productId, startDate, endDate);
  if (!isAvailable)
    throw new Error('Product is not available for selected dates');

  return Reservation.create({
    productId,
    startDate,
    endDate,
    rentalOrderId
  });
};

// View reservations of a product
const getProductReservations = async (productId) => {
  return Reservation.findAll({
    where: { productId }
  });
};

module.exports = {
  checkAvailability,
  createReservation,
  getProductReservations
};
