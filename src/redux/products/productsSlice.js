import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Cloudinary + Backend URLs from .env or fallback
const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "radubordea-dev";
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "unsigned_adrienn";
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

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

// Fetch one
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

// Create
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      let imageUpdate = {};

      if (productData.imageFile) {
        const form = new FormData();
        form.append("file", productData.imageFile);
        form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryRes = await axios.post(CLOUDINARY_API_URL, form);

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
        ...imageUpdate,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// Update
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      let imageUpdate = {};

      if (updatedData.imageFile) {
        const form = new FormData();
        form.append("file", updatedData.imageFile);
        form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryRes = await axios.post(CLOUDINARY_API_URL, form);

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
        ...imageUpdate,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update product");
    }
  }
);

// Delete product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    dispatch({ type: "DELETE_PRODUCT", payload: id }); // Send ID to remove from the state
  } catch (error) {
    console.error("Failed to delete product:", error);
    dispatch({ type: "DELETE_PRODUCT_ERROR", payload: error.message });
  }
};


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

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
