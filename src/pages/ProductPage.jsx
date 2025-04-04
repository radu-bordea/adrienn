import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://adrienn-backend.onrender.com/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        console.log(data); // Debugging
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle loading and error states
  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p className="text-gray-500">Product not found.</p>;

  return (
    <div className="container mx-auto mt-10 p-4 flex flex-col md:flex-row gap-6">
      {/* Image Column */}
      <div className="w-full md:w-2/3">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-192 object-cover rounded-md"
        />
      </div>

      {/* Product Info Column */}
      <div className="w-full md:w-1/3 flex flex-col">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500 mt-2">{product.description}</p>
        <p className="text-blue-500 font-bold mt-4">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductPage;
