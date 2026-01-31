const { Payment, Invoice } = require('../../../../database/models');

// Create payment for invoice
const createPayment = async (invoiceId, amount, paymentMethod) => {
  if (!amount || amount <= 0) {
    throw new Error('Invalid payment amount');
  }

  if (!paymentMethod) {
    throw new Error('Payment method is required');
  }

  const invoice = await Invoice.findByPk(invoiceId);

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  if (invoice.status === 'paid') {
    throw new Error('Invoice already fully paid');
  }

  // Create payment
  const payment = await Payment.create({
    invoiceId,
    amount,
    paymentMethod,
    status: 'success'
  });

  // Update invoice paid amount
  const updatedPaidAmount = Number(invoice.paidAmount) + Number(amount);

  invoice.paidAmount = updatedPaidAmount;

  // Update invoice status
  if (updatedPaidAmount >= invoice.totalAmount) {
    invoice.status = 'paid';
  } else {
    invoice.status = 'partially_paid';
  }

  await invoice.save();

  return payment;
};

// Get payments by invoice
const getPaymentsByInvoice = async (invoiceId) => {
  return Payment.findAll({
    where: { invoiceId },
    order: [['createdAt', 'ASC']]
  });
};

module.exports = {
  createPayment,
  getPaymentsByInvoice
};
