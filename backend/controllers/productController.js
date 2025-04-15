const Product = require("../models/productModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

// Get a single product
const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid product ID." });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  res.status(200).json(product);
};

// Create a new product
const createProduct = async (req, res) => {
  const { name, price, description, category, stock, imageUrl, imagePublicId } =
    req.body;

  try {
    // Save product details along with image URL and image public ID
    const product = await Product.create({
      name,
      price,
      description,
      category,
      stock,
      imageUrl, // Cloudinary image URL
      imagePublicId, // Cloudinary public ID
    });

    res.status(200).json(product);
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Failed to create product." });
  }
};


// Delete a product (and remove image from Cloudinary if it exists)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid product ID." });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  // Delete image from Cloudinary if it exists
  if (product.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(product.imagePublicId);
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err.message);
    }
  }

  await Product.findByIdAndDelete(id);

  res.status(200).json({ message: "Product and image deleted successfully." });
};

// Update a product (replace Cloudinary image if a new one is provided)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, stock, imageUrl, imagePublicId } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid product ID." });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  // If a new imagePublicId is provided and it's different from the old one, delete the old image
  if (imagePublicId && imagePublicId !== product.imagePublicId) {
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (err) {
        console.error(
          "Failed to delete previous image from Cloudinary:",
          err.message
        );
      }
    }
  }

  // Prepare data to update the product
  const updatedData = {
    name,
    price,
    description,
    category,
    stock,
    imageUrl, // Only update imageUrl and imagePublicId if provided
    imagePublicId,
  };

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true, // This ensures the updated product is returned
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to update product.",
    });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
