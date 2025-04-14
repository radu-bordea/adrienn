import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../redux/products/productsSlice";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    imageUrl: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format data before sending
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    const resultAction = await dispatch(createProduct(formattedData));

    // Check if product was created successfully
    if (createProduct.fulfilled.match(resultAction)) {
      alert("Product created successfully!");
      navigate("/admin");
    } else {
      alert(resultAction.payload || "Failed to create product");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Product Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="border rounded w-full p-2 text-gray-500"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="border rounded w-full p-2 text-gray-500"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="border rounded w-full p-2 text-gray-500"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="border rounded w-full p-2 text-gray-500"
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
          className="border rounded w-full p-2 text-gray-500"
        />
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className="border rounded w-full p-2 text-gray-500"
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;
