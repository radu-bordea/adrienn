import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser(); // Get logged-in user and isLoaded state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure user data is fully loaded
  useEffect(() => {
    if (!isLoaded) return; // Wait for the user data to load
    if (!user) {
      alert("You must be logged in to access this page.");
      navigate("/"); // Redirect to home if not logged in
      return;
    }

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://adrienn-backend.onrender.com/api/products"
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, navigate, isLoaded]); // Add isLoaded in dependency array to ensure it only runs when the user is loaded

  // Handle Product Deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(
        `https://adrienn-backend.onrender.com/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((product) => product._id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Redirect to Create Product Page
  const handleCreate = () => {
    navigate("/admin/create-product"); // Route to product creation page
  };

  // Loading and error handling
  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Only show the create button if the user is logged in */}
      <SignedIn>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-6"
        >
          + Create New Product
        </button>
      </SignedIn>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-md">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-500">{product.price}</p>
            <SignedIn>
              <button
                onClick={() => handleDelete(product._id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </SignedIn>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
