import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch products from backend API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts", // Action type
  async (_, thunkAPI) => {
    try {
      // Call the API to get all products
      const res = await fetch(
        "https://adrienn-backend.onrender.com/api/products"
      );
      const data = await res.json();
      return data; // This gets passed to .fulfilled
    } catch (error) {
      // Handle error by sending a custom error message to .rejected
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);

// Async thunk to delete products from backend API
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct", // Action type
  async (id, thunkAPI) => {
    try {
      const response = await fetch(
        `https://adrienn-backend.onrender.com/api/products/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      return id;
    } catch (error) {
      // Handle error by sending a custom error message to .rejected
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Creating the products slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [], // Array to store fetched products
    loading: false, // To show loading state during fetch
    error: null, // To capture any error during fetch
  },
  reducers: {}, // No standard reducers for now — just using extraReducers
  extraReducers: (builder) => {
    // When fetchProducts is triggered and pending
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When fetchProducts is successful
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      // When fetchProducts fails
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // When deleteProduct is successful
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (product) => product._id !== action.payload
        );
      })
      // When deleteProduct fails
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Exporting the reducer to use in the store
export default productsSlice.reducer;
