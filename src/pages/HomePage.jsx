import React from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const HomePage = () => {
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
    </div>
  );
};

export default HomePage;
