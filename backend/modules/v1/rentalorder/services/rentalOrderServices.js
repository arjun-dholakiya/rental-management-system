const {
    Quotation,
    QuotationItem,
    RentalOrder,
    Reservation
  } = require('../../../../database/models');
  
  const {
    checkAvailability
  } = require('../../reservations/services/reservationServices');
  
  // Confirm quotation & create rental order
  const confirmQuotation = async (quotationId, customerId) => {
    const quotation = await Quotation.findOne({
      where: { id: quotationId, customerId },
      include: ['items']
    });
  
    if (!quotation) {
      throw new Error('Quotation not found');
    }
  
    if (quotation.status !== 'draft') {
      throw new Error('Quotation already confirmed');
    }
  
    if (!quotation.items || quotation.items.length === 0) {
      throw new Error('Quotation has no items');
    }
  
    // Re-check availability before confirmation
    for (const item of quotation.items) {
      const available = await checkAvailability(
        item.productId,
        item.startDate,
        item.endDate
      );
  
      if (!available) {
        throw new Error(`Product ${item.productId} is no longer available`);
      }
    }
  
    // Calculate final total
    const totalAmount = quotation.items.reduce(
      (sum, item) => sum + Number(item.price),
      0
    );
  
    // Create rental order
    const rentalOrder = await RentalOrder.create({
      quotationId: quotation.id,
      customerId,
      totalAmount,
      status: 'confirmed'
    });
  
    // Create reservations (lock slots)
    for (const item of quotation.items) {
      await Reservation.create({
        productId: item.productId,
        startDate: item.startDate,
        endDate: item.endDate,
        rentalOrderId: rentalOrder.id
      });
    }
  
    // Update quotation status
    quotation.status = 'confirmed';
    await quotation.save();
  
    return rentalOrder;
  };
  
  // Get my rental orders
  const getMyRentalOrders = async (customerId) => {
    return RentalOrder.findAll({
      where: { customerId },
      order: [['createdAt', 'DESC']]
    });
  };
  
  // Get single rental order
  const getRentalOrderById = async (id, customerId) => {
    const order = await RentalOrder.findOne({
      where: { id, customerId }
    });
  
    if (!order) throw new Error('Rental order not found');
    return order;
  };
  
  module.exports = {
    confirmQuotation,
    getMyRentalOrders,
    getRentalOrderById
  };
  