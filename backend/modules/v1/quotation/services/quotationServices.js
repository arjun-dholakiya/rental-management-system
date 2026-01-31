const {
    Quotation,
    QuotationItem,
    RentalPrice,
    sequelize
  } = require('../../../../database/models');
  
  const {
    checkAvailability
  } = require('../../reservations/services/reservationServices');
  
  // Create quotation
  const createQuotation = async (customerId, notes) => {
    return Quotation.create({
      customerId,
      status: 'draft',
      notes
    });
  };
  
  // Add or update product in quotation
  const addItem = async (
    quotationId,
    productId,
    startDate,
    endDate,
    quantity = 1
  ) => {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
  
    if (new Date(endDate) < new Date(startDate)) {
      throw new Error('End date must be after start date');
    }
  
    return sequelize.transaction(async (t) => {
      const quotation = await Quotation.findByPk(quotationId, { transaction: t });
      if (!quotation) throw new Error('Quotation not found');
  
      if (quotation.status !== 'draft') {
        throw new Error('Quotation already confirmed');
      }
  
      const isAvailable = await checkAvailability(productId, startDate, endDate);
      if (!isAvailable) {
        throw new Error('Product not available for selected dates');
      }
  
      const pricing = await RentalPrice.findOne({
        where: { productId },
        transaction: t
      });
  
      if (!pricing || !pricing.pricePerDay) {
        throw new Error('Rental price not found');
      }
  
      const days =
        Math.ceil(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        ) || 1;
  
      const existingItem = await QuotationItem.findOne({
        where: { quotationId, productId },
        transaction: t
      });
  
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.startDate = startDate;
        existingItem.endDate = endDate;
        existingItem.price =
          pricing.pricePerDay * existingItem.quantity * days;
  
        await existingItem.save({ transaction: t });
        return existingItem;
      }
  
      const price = pricing.pricePerDay * quantity * days;
  
      return QuotationItem.create(
        {
          quotationId,
          productId,
          startDate,
          endDate,
          quantity,
          price
        },
        { transaction: t }
      );
    });
  };
  
  // Get single quotation
  const getQuotationById = async (quotationId, customerId) => {
    const quotation = await Quotation.findOne({
      where: { id: quotationId, customerId },
      include: [{ association: 'items' }]
    });
  
    if (!quotation) throw new Error('Quotation not found');
    return quotation;
  };
  
  // Get all quotations
  const getMyQuotations = async (customerId) => {
    return Quotation.findAll({
      where: { customerId },
      include: [{ association: 'items' }],
      order: [['createdAt', 'DESC']]
    });
  };
  
  module.exports = {
    createQuotation,
    addItem,
    getQuotationById,
    getMyQuotations
  };
  