import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  updateProduct,
} from "../redux/products/productsSlice";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    imagePublicId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      alert("You must be logged in.");
      navigate("/");
      return;
    }
    dispatch(fetchProductById(id));
  }, [id, user, isLoaded, dispatch, navigate]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        category: selectedProduct.category || "",
        price: selectedProduct.price || "",
        stock: selectedProduct.stock || "",
        description: selectedProduct.description || "",
        imageUrl: selectedProduct.imageUrl || "",
        imagePublicId: selectedProduct.imagePublicId || "",
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return {};

    const form = new FormData();
    form.append("file", imageFile);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("folder", "adrienn");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error("Image upload failed");

    return {
      imageUrl: data.secure_url.replace(
        "/upload/",
        "/upload/w_800,c_fit,f_auto/"
      ),
      imagePublicId: data.public_id,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageData = {};
      if (imageFile) {
        imageData = await uploadImageToCloudinary();
      }

      const updatedProduct = {
        ...formData,
        ...imageData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      const resultAction = await dispatch(
        updateProduct({ id, updatedData: updatedProduct })
      );

      if (updateProduct.fulfilled.match(resultAction)) {
        alert("Product updated!");
        navigate("/admin");
      } else {
        alert(resultAction.payload || "Update failed");
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "category", "price", "stock"].map((field) => (
          <div key={field}>
            <label className="block text-lg font-semibold capitalize">
              {field}
            </label>
            <input
              type={field === "price" || field === "stock" ? "number" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-lg font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-lg font-semibold">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-60 mt-2" />
          ) : (
            formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Current"
                className="max-h-60 mt-2"
              />
            )
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
