import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Cloudinary config
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CreateProductPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    imageUrl: "", // Will be populated after uploading to Cloudinary
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); // For previewing image
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file)); // Preview image before uploading
    }
  };

  // Function to upload the image to Cloudinary and return the URL
  const uploadImageToCloudinary = async () => {
    if (!imageFile) return ""; // If no image is selected, return empty

    setUploading(true);
    const form = new FormData();
    form.append("file", imageFile);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("folder", "adrienn"); // Optional: Folder in Cloudinary

    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const res = await fetch(cloudinaryUploadUrl, {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setUploading(false);

    if (!res.ok) throw new Error("Image upload failed");

    // Return the URL of the uploaded image (optimized size)
    return data.secure_url.replace("/upload/", "/upload/w_800,c_fit,f_auto/"); // Optimized image URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let finalImageUrl = "";

      // If an image is selected, upload it to Cloudinary and get the image URL
      if (imageFile) {
        finalImageUrl = await uploadImageToCloudinary();
      }

      // Create product data object with the image URL (either uploaded or fallback)
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: finalImageUrl || "https://via.placeholder.com/150", // Fallback image if no file uploaded
      };

      // Send the product data to the backend (MongoDB)
      const response = await fetch(
        "https://adrienn-backend.onrender.com/api/products/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) throw new Error("Failed to create product");

      const newProduct = await response.json();
      console.log("Product Created:", newProduct);
      navigate("/admin"); // Redirect after success
    } catch (err) {
      setError(err.message); // Handle errors (e.g., network issues, etc.)
    } finally {
      setLoading(false); // Turn off loading spinner
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Fields */}
        {["name", "price", "category", "stock"].map((field) => (
          <input
            key={field}
            type={field === "price" || field === "stock" ? "number" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            required
            className="border rounded w-full p-2 text-gray-500"
          />
        ))}

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="border rounded w-full p-2 text-gray-500"
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border rounded w-full p-2 text-gray-500"
        />
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 object-contain rounded mx-auto"
            />
          </div>
        )}
        {uploading && <p className="text-blue-500">Uploading image...</p>}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
          disabled={loading || uploading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;
