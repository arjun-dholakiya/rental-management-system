import api from './axios';

// Create a return for a rental order
export const createReturn = async (rentalOrderId, data = {}) => {
  // data might contain { lateFee }
  const response = await api.post(`/returns/create-return/${rentalOrderId}`, data);
  return response.data;
};

// Get return details for a rental order
export const getReturn = async (rentalOrderId) => {
  const response = await api.get(`/returns/get-return/${rentalOrderId}`);
  return response.data;
};
