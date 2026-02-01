import api from './axios';

// Create a new quotation
export const createQuotation = async (data = {}) => {
  const response = await api.post('/quotations/create-quotation', data);
  return response.data;
};

// Add item to quotation
export const addProductToQuotation = async (quotationId, { productId, quantity, startDate, endDate }) => {
  const payload = {
    productId: Number(productId),
    quantity: Number(quantity),
    startDate: new Date(startDate).toISOString(), // Ensure ISO string
    endDate: new Date(endDate).toISOString()      // Ensure ISO string
  };
  
  const response = await api.post(`/quotations/add-product-to-quotation/${quotationId}/items`, payload);
  return response.data;
};

// Get single quotation
export const getSingleQuotation = async (id) => {
  const response = await api.get(`/quotations/get-single-quotation/${id}`);
  return response.data;
};

// Get all my quotations
export const getMyQuotations = async () => {
  const response = await api.get('/quotations/get-my-quotations');
  return response.data;
};
