const Product = require("../models/productModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Ensure Cloudinary is configured
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found." });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Error fetching product." });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const { name, price, description, category, stock, imageUrl, imagePublicId } =
    req.body;

  try {
    const product = await Product.create({
      name,
      price,
      description,
      category,
      stock,
      imageUrl: imageUrl || "https://via.placeholder.com/150",
      imagePublicId: imagePublicId || null,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create product." });
  }
};

// Delete a product (and remove image from Cloudinary if it exists)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found." });

    // Delete image from Cloudinary if it exists
    if (product.imagePublicId) {
      try {
        const result = await cloudinary.uploader.destroy(product.imagePublicId);
        if (result.result !== "ok") {
          console.warn("Cloudinary deletion result:", result);
        }
      } catch (err) {
        console.error("Cloudinary deletion error:", err);
        return res
          .status(500)
          .json({ error: "Failed to delete image from Cloudinary." });
      }
    }

    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Product and image deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product." });
  }
};

// Update a product (replace Cloudinary image if a new one is provided)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, stock, imageUrl, imagePublicId } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found." });

    // If replacing the image, delete the old one
    if (
      imagePublicId &&
      product.imagePublicId &&
      imagePublicId !== product.imagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (err) {
        console.error("Error deleting old image from Cloudinary:", err);
      }
    }

    const updatedData = {
      name,
      price,
      description,
      category,
      stock,
      imageUrl,
      imagePublicId,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update product." });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
