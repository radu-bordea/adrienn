const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    imageUrl: { type: String, default: "https://via.placeholder.com/150" },
  },
  { timestamps: true }
); // Adds createdAt & updatedAt automatically

module.exports = mongoose.model("Product", productSchema);
