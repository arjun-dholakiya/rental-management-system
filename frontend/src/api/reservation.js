import api from './axios';

// Check availability
export const checkAvailability = async (productId, startDate, endDate) => {
  const response = await api.get('/reservations/check-reservation-availability', {
    params: { productId, startDate, endDate }
  });
  return response.data; // Expected { available: true/false }
};

// Create a reservation (direct)
export const createReservation = async (data) => {
  const response = await api.post('/reservations/create-reservation', data);
  return response.data;
};

// View reservations for a product
export const getProductReservations = async (productId) => {
  const response = await api.get(`/reservations/view-product-reservation/product/${productId}`);
  return response.data;
};
