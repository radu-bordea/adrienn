import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignedIn } from "@clerk/clerk-react";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      alert("You must be logged in to access this page.");
      navigate("/");
      return;
    }

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
  }, [user, navigate, isLoaded]);

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

  const handleCreate = () => {
    navigate("/admin/create-product");
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  // Helper function to limit description to 5 words
  const limitDescription = (text) => {
    const words = text.split(" ");
    if (words.length <= 5) return text;
    return words.slice(0, 5).join(" ") + "...";
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <SignedIn>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-6"
        >
          + Create New Product
        </button>
      </SignedIn>

      <ul className="w-full border rounded-lg shadow divide-y space-y-2">
        {products.map((product) => (
          <li key={product._id} className="flex flex-col md:flex-row md:items-center p-4 gap-2 md:gap-0">
            {/* Column 1: Image */}
            <div className="w-24 flex-shrink-0 px-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
            </div>

            {/* Column 2: Basic info */}
            <div className="flex flex-col justify-center px-4 min-w-[200px] text-left">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">
                Category: {product.category}
              </p>
              <p className="text-sm text-gray-500">Price: ${product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            </div>

            {/* Column 3: Description */}
            <div className="flex-1 px-4 text-sm text-gray-500 md:whitespace-normal md:overflow-visible md:text-ellipsis text-left">
              <span className="md:hidden">{limitDescription(product.description)}</span>
              <span className="hidden md:block">{product.description}</span>
            </div>

            {/* Column 4: Edit and Delete Button */}
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
