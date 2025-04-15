import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Cloudinary API URL for image management
const CLOUDINARY_API_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/";

// Backend API URL for product CRUD operations
const API_URL = "https://adrienn-backend.onrender.com/api/products";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch product");
    }
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      // If image exists, upload to Cloudinary first
      let imageUpdate = {};
      if (productData.imageFile) {
        const form = new FormData();
        form.append("file", productData.imageFile);
        form.append("upload_preset", "YOUR_UPLOAD_PRESET");

        const cloudinaryRes = await axios.post(
          `${CLOUDINARY_API_URL}image/upload`,
          form
        );

        if (cloudinaryRes.status !== 200) {
          throw new Error("Cloudinary upload failed");
        }

        imageUpdate = {
          imageUrl: cloudinaryRes.data.secure_url,
          imagePublicId: cloudinaryRes.data.public_id,
        };
      }

      const response = await axios.post(API_URL, {
        ...productData,
        ...imageUpdate, // Add image data if available
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      // If new image exists, upload to Cloudinary first
      let imageUpdate = {};
      if (updatedData.imageFile) {
        const form = new FormData();
        form.append("file", updatedData.imageFile);
        form.append("upload_preset", "YOUR_UPLOAD_PRESET");

        const cloudinaryRes = await axios.post(
          `${CLOUDINARY_API_URL}image/upload`,
          form
        );

        if (cloudinaryRes.status !== 200) {
          throw new Error("Cloudinary upload failed");
        }

        imageUpdate = {
          imageUrl: cloudinaryRes.data.secure_url,
          imagePublicId: cloudinaryRes.data.public_id,
        };
      }

      const response = await axios.patch(`${API_URL}/${id}`, {
        ...updatedData,
        ...imageUpdate, // Add image data if available
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update product");
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      // Fetch the product before deletion to get the imagePublicId
      const productResponse = await axios.get(`${API_URL}/${id}`);
      const product = productResponse.data;

      // Delete the product from the backend
      await axios.delete(`${API_URL}/${id}`);

      // Now delete the image from Cloudinary if it exists
      if (product.imagePublicId) {
        const cloudinaryRes = await axios.post(`${CLOUDINARY_API_URL}image/destroy`, {
          public_id: product.imagePublicId,
          invalidate: true,
        });

        // Check if the Cloudinary deletion was successful
        if (cloudinaryRes.status !== 200) {
          console.error("Failed to delete image from Cloudinary:", cloudinaryRes.data);
          throw new Error("Cloudinary image deletion failed");
        }
      }

      // Return the product id to delete it from the state
      return id;
    } catch (error) {
      console.error("Error during product deletion:", error.message || error);
      // Provide a more specific error message
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);


// Products slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch one
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Remove product from the list after successful deletion
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
