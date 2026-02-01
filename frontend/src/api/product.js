import api from './axios';

export const getAllProducts = () => api.get('/products/fetch-products');

export const getProductById = (id) =>
  api.get(`/products/fetch-single-product/${id}`);

export const createProduct = (data) =>
  api.post('/products/create-product', data);

export const updateProduct = (id, data) =>
  api.put(`/products/update-product/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/remove-product/${id}`);

export const setPricing = (productId, pricingData) =>
  api.post(`/products/set-product-price/${productId}/pricing`, pricingData);
