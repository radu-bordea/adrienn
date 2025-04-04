import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser, SignedIn } from "@clerk/clerk-react";

const EditProductPage = () => {
  const { id } = useParams(); // Get product ID from URL parameters
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      alert("You must be logged in to access this page.");
      navigate("/");
      return;
    }

    // Fetch the product details to edit
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://adrienn-backend.onrender.com/api/products/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data); // Set the product data for the form
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isLoaded, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://adrienn-backend.onrender.com/api/products/${id}`,
        {
          method: "PATCH", // Change to PATCH
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );
      if (!response.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      navigate("/admin"); // Redirect back to the admin dashboard
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      {/* Edit Product Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-lg font-semibold">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

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
