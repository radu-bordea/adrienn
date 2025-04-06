// StrictMode helps highlight potential problems in an app
import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

// Clerk handles authentication (sign in, sign out, user data, etc.)
import { ClerkProvider } from "@clerk/clerk-react";

// Redux Provider to give app access to global store
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

// Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Render the app into the root DOM element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ClerkProvider wraps the app to enable authentication */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {/* Redux Provider gives access to Redux store for global state management */}
      <Provider store={store}>
        <App />
      </Provider>
    </ClerkProvider>
  </StrictMode>
);
