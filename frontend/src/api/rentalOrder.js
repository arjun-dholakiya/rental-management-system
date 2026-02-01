import api from './axios';

// Confirm a quotation to create a rental order
export const confirmQuotation = async (quotationId) => {
  const response = await api.post(`/rental-orders/confirm-quotation/${quotationId}`);
  return response.data;
};

// Get all rental orders for the logged-in user
export const getMyRentalOrders = async () => {
  const response = await api.get('/rental-orders/get-my-rental-orders');
  return response.data;
};

// Get a single rental order by ID
export const getSingleRentalOrder = async (id) => {
  const response = await api.get(`/rental-orders/get-single-rental-order/${id}`);
  return response.data;
};
