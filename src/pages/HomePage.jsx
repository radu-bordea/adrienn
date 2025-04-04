import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the database (replace with API endpont)

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://adrienn-backend.onrender.com/api/products"
        ); // Adjust API routes as needed
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Products</h1>


      {/* Product Grid  */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className="border text-gray-200 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 md:w-full md:h-192 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2 text-gray-500">
                {product.name}
              </h2>
              <p className="text-gray-500">{product.description}</p>
              <p className="text-blue-500 font-bold mt-2">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
