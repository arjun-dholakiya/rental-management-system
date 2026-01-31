const { Invoice, RentalOrder } = require('../../../../database/models');

// Create invoice from rental order
const createInvoiceFromRentalOrder = async (rentalOrderId, customerId) => {
  const rentalOrder = await RentalOrder.findOne({
    where: { id: rentalOrderId, customerId }
  });

  if (!rentalOrder) {
    throw new Error('Rental order not found');
  }

  const existingInvoice = await Invoice.findOne({
    where: { rentalOrderId }
  });

  if (existingInvoice) {
    throw new Error('Invoice already exists for this rental order');
  }

  const invoiceNumber = `INV-${Date.now()}`;

  const invoice = await Invoice.create({
    rentalOrderId,
    invoiceNumber,
    totalAmount: rentalOrder.totalAmount,
    paidAmount: 0,
    status: 'unpaid'
  });

  return invoice;
};

// Get all invoices of logged-in customer
const getMyInvoices = async (customerId) => {
  return Invoice.findAll({
    include: [
      {
        model: RentalOrder,
        where: { customerId }
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

// Get single invoice
const getInvoiceById = async (id, customerId) => {
  const invoice = await Invoice.findOne({
    where: { id },
    include: [
      {
        model: RentalOrder,
        where: { customerId }
      }
    ]
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  return invoice;
};

module.exports = {
  createInvoiceFromRentalOrder,
  getMyInvoices,
  getInvoiceById
};
