import api from './axios';

// Pay an invoice
export const payInvoice = async (invoiceId, data) => {
  // data should contain { amount, paymentMethod }
  const response = await api.post(`/payments/pay-invoice/${invoiceId}`, data);
  return response.data;
};

// Get payment history for an invoice
export const getInvoicePayments = async (invoiceId) => {
  const response = await api.get(`/payments/get-invoice-payments/${invoiceId}`);
  return response.data;
};
