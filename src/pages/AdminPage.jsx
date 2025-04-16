import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/products/productsSlice";
import { useNavigate } from "react-router-dom";
import { useUser, SignedIn } from "@clerk/clerk-react";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      alert("You must be logged in to access this page.");
      navigate("/");
      return;
    }

    dispatch(fetchProducts());
  }, [dispatch, user, isLoaded, navigate]);

const handleDelete = async (id) => {
  const confirm = window.confirm(
    "Are you sure you want to delete this product?"
  );
  if (!confirm) return;

  try {
    await dispatch(deleteProduct(id)); // Trigger Redux deleteProduct action
    alert("Product deleted successfully");
  } catch (err) {
    console.error("Failed to delete product:", err.message || err);
    alert(`Failed to delete product: ${err.message || err}`);
  }
};


  const handleCreate = () => navigate("/admin/create-product");

  const handleEdit = (id) => navigate(`/admin/edit-product/${id}`);

  const limitDescription = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length <= 5 ? text : words.slice(0, 5).join(" ") + "...";
  };

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <SignedIn>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition mb-6"
        >
          + Create New Product
        </button>
      </SignedIn>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <ul className="w-full border rounded-lg shadow divide-y">
          {products.map((product) => (
            <li
              key={product._id}
              className="flex flex-col md:flex-row md:items-center p-4 gap-4"
            >
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={product.imageUrl || "https://via.placeholder.com/100"}
                  alt={product.name}
                  className="w-full h-full object-contain border rounded bg-white"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center min-w-[200px] text-left">
                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">
                  Category: {product.category}
                </p>
                <p className="text-sm text-gray-500">
                  Price: ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>

              {/* Description */}
              <div className="flex-1 text-sm text-gray-600 text-left">
                <span className="md:hidden block">
                  {limitDescription(product.description)}
                </span>
                <span className="hidden md:block">{product.description}</span>
              </div>

              {/* Admin Controls */}
              <SignedIn>
                <div className="flex flex-col md:flex-row gap-2 pl-4">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </SignedIn>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;
