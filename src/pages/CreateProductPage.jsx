import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProductPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Convert stock and price to numbers
    const formattedData = {
      ...formData,
      price: Number(formData.price), // Ensure it's a number
      stock: Number(formData.stock), // Ensure it's a number
    };

    try {
      const response = await fetch(
        "https://adrienn-backend.onrender.com/api/products/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData), // Send converted data
        }
      );

      if (!response.ok) throw new Error("Failed to create product");

      const newProduct = await response.json();
      console.log("Product Created:", newProduct);
      navigate("/admin"); // Redirect after success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="border rounded w-full p-2"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="border rounded w-full p-2"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="border rounded w-full p-2"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="border rounded w-full p-2"
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
          className="border rounded w-full p-2"
        />
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className="border rounded w-full p-2"
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
