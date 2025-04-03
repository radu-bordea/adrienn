import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the database (replace with API endpont)

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/products"); // Adjust API routes as needed
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
      <h1 className="text-2xl font-bold">Home Page</h1>

      {/* Show 'Good Job' if the user is logged in */}
      <SignedIn>
        <p className="text-green-500 text-lg font-semibold mt-4">
          🎉 Good Job! You are logged in.
        </p>
      </SignedIn>

      {/* Show this if the user is NOT logged in */}
      <SignedOut>
        <p className="text-gray-500 text-lg mt-4">
          Please sign in to access more features.
        </p>
      </SignedOut>

      {/* Product Grid  */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-md">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-192 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-500">{product.description}</p>
            <p className="text-blue-500 font-bold mt-2">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
