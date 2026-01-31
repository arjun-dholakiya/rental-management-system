const productService = require('../services/productServices');
const {
  createProductSchema,
  updateProductSchema,
  pricingSchema
} = require('../../../../validations/productValidation');

// Create Products
const create = async (req, res) => {
  try {
    const { error } = createProductSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const product = await productService.createProduct(req.body, req.user.id);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch All Products
const list = async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
};

// Fetch Products By Id
const getById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Update Product
const update = async (req, res) => {
  try {
    const { error } = updateProductSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const product = await productService.updateProduct(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Product
const remove = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id, req.user.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Set Product Price
const pricing = async (req, res) => {
  try {
    const { error } = pricingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const price = await productService.setPricing(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json(price);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  pricing
};