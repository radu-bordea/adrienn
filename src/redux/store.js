// Importing configureStore from Redux Toolkit to easily set up the Redux store
import { configureStore } from "@reduxjs/toolkit";

// Importing the products slice reducer which manages the products state
import productsReducer from "./products/productsSlice";

// Creating and exporting the Redux store
// We pass in our reducers — currently only 'products', but more can be added later
export const store = configureStore({
  reducer: {
    products: productsReducer, // products state will be managed by productsSlice
  },
});
