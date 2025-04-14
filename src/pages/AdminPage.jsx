import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/products/productsSlice";
import { useNavigate } from "react-router-dom";
import { useUser, SignedIn } from "@clerk/clerk-react";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  // Access product-related state from Redux store
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  // Fetch products on page load (only if user is authenticated)
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      alert("You must be logged in to access this page.");
      navigate("/");
      return;
    }

    dispatch(fetchProducts());
  }, [dispatch, user, isLoaded, navigate]);

  // Handle product deletion with confirmation
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;
    dispatch(deleteProduct(id));
  };

  // Navigate to the Create Product form
  const handleCreate = () => navigate("/admin/create-product");

  // Navigate to the Edit Product form with the selected product ID
  const handleEdit = (id) => navigate(`/admin/edit-product/${id}`);

  // Truncate long descriptions to show only first few words
  const limitDescription = (text) => {
    const words = text.split(" ");
    return words.length <= 5 ? text : words.slice(0, 5).join(" ") + "...";
  };

  // Display loading or error states
  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Button to create a new product (only shown when signed in) */}
      <SignedIn>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-6"
        >
          + Create New Product
        </button>
      </SignedIn>

      {/* Product List */}
      <ul className="w-full border rounded-lg shadow divide-y space-y-2">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex flex-col md:flex-row md:items-center p-4 gap-2 md:gap-0"
          >
            {/* Product Image */}
            <div className="w-24 flex-shrink-0 px-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-12 h-12 object-contain rounded"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center px-4 min-w-[200px] text-left">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">
                Category: {product.category}
              </p>
              <p className="text-sm text-gray-500">Price: ${product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            </div>

            {/* Product Description */}
            <div className="flex-1 px-4 text-sm text-gray-500 md:whitespace-normal text-left">
              {/* Shorter description on mobile */}
              <span className="md:hidden">
                {limitDescription(product.description)}
              </span>
              <span className="hidden md:block">{product.description}</span>
            </div>

            {/* Admin Controls (only visible if signed in) */}
            <SignedIn>
              <div className="pl-4 flex flex-col md:flex-row md:items-center gap-2">
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(product._id)}
                  className="px-4 py-1 w-1/3 bg-yellow-500 text-white rounded hover:bg-yellow-600 md:w-auto"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-1 w-1/3 bg-red-500 text-white rounded hover:bg-red-600 md:w-auto"
                >
                  Delete
                </button>
              </div>
            </SignedIn>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
