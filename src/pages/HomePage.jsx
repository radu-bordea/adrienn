import React, { useEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react"; // Optional: For showing different views for signed in/out users
import { Link } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux"; // For interacting with the Redux store
import { fetchProducts } from "../redux/products/productsSlice"; // Thunk action to fetch products

const HomePage = () => {
  const dispatch = useDispatch();

  // Extracting product data, loading status, and error from Redux state
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Products</h1>

      {/* Show loading and error states */}
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className="border text-gray-200 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
              {/* Product Image */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 md:w-full md:h-192 object-contain rounded-md"
              />

              {/* Product Name */}
              <h2 className="text-lg font-semibold mt-2 text-gray-500">
                {product.name}
              </h2>

              {/* Description */}
              <p className="text-gray-500">{product.description}</p>

              {/* Price */}
              <p className="text-blue-500 font-bold mt-2">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
