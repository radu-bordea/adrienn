import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  updateProduct,
} from "../redux/products/productsSlice";

const EditProductPage = () => {
  // Get product ID from URL params
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const dispatch = useDispatch();

  // Access selected product state from Redux
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  // Local state for form input values
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  // Fetch product data by ID when component mounts
  useEffect(() => {
    if (!isLoaded) return;

    // Redirect if user is not logged in
    if (!user) {
      alert("You must be logged in to access this page.");
      navigate("/");
      return;
    }

    dispatch(fetchProductById(id));
  }, [id, user, isLoaded, dispatch, navigate]);

  // Populate form with fetched product data
  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct);
    }
  }, [selectedProduct]);

  // Handle input changes and update local form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to update the product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch update action
    const resultAction = await dispatch(
      updateProduct({ id, updatedData: formData })
    );

    // Check if update was successful
    if (updateProduct.fulfilled.match(resultAction)) {
      alert("Product updated successfully!");
      navigate("/admin");
    } else {
      alert(resultAction.payload || "Update failed");
    }
  };

  // Display loading or error messages
  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      {/* Product Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-lg font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-lg font-semibold">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-lg font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-lg font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-lg font-semibold">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
