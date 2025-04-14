import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        "https://adrienn-backend.onrender.com/api/products"
      );
      const data = await res.json();
      return data;
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
      const res = await fetch(
        `https://adrienn-backend.onrender.com/api/products/${id}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch product");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await fetch(
        `https://adrienn-backend.onrender.com/api/products/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to update product");
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(
        `https://adrienn-backend.onrender.com/api/products/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete product");
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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

      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;

        // Update the item in the list if it exists
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
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
