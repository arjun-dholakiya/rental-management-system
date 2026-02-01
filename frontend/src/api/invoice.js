import api from './axios';

// Create an invoice from a rental order
export const createInvoice = async (rentalOrderId) => {
  const response = await api.post(`/invoices/create-invoice/${rentalOrderId}`);
  return response.data;
};

// Get all invoices for the logged-in user
export const getMyInvoices = async () => {
  const response = await api.get('/invoices/get-my-invoices');
  return response.data;
};

// Get a single invoice by ID
export const getSingleInvoice = async (id) => {
  const response = await api.get(`/invoices/get-single-invoice/${id}`);
  return response.data;
};
