const { Product, RentalPrice } = require('../../../../database/models');

// Create Products
const createProduct = async (data, vendorId) => {
  return Product.create({
    ...data,
    ownerVendorId: vendorId
  });
};

// Fetch All Products
const getAllProducts = async () => {
  return Product.findAll({
    where: { status: 'available' }
  });
};

// Fetch Products By Id
const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: ['pricing']
  });
  if (!product) throw new Error('Product not found');
  return product;
};

// Update Product
const updateProduct = async (id, vendorId, data) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  if (product.ownerVendorId !== vendorId) {
    throw new Error('Unauthorized access');
  }

  return product.update(data);
};

// Delete Product
const deleteProduct = async (id, vendorId) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  if (product.ownerVendorId !== vendorId) {
    throw new Error('Unauthorized access');
  }

  await product.destroy();
  return true;
};

// Set Product Price
const setPricing = async (productId, vendorId, pricingData) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');

  if (product.ownerVendorId !== vendorId) {
    throw new Error('Unauthorized access');
  }

  return RentalPrice.create({
    ...pricingData,
    productId
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  setPricing
};
