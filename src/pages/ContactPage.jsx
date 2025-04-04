import React, { useState } from "react";

const ContactPage = () => {
  const [showContactInfo, setShowContactInfo] = useState(false);

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  return (
    <div className="container mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      {/* Button to show or hide contact info */}
      <button
        onClick={toggleContactInfo}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {showContactInfo ? "Hide Contact Info" : "Show Contact Info"}
      </button>

      {/* Conditionally rendered contact info */}
      {showContactInfo && (
        <div className="mt-4 text-gray-400">
          <p className="text-lg font-semibold">Name: John Doe</p>
          <p className="text-lg font-semibold">
            Address: 1234 Main St, Springfield
          </p>
          <p className="text-lg font-semibold">Email: johndoe@example.com</p>
          <p className="text-lg font-semibold">
            Facebook:{" "}
            <a
              href="https://facebook.com/johndoe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              facebook.com/johndoe
            </a>
          </p>
          <p className="text-lg font-semibold">
            Instagram:{" "}
            <a
              href="https://instagram.com/johndoe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600"
            >
              instagram.com/johndoe
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
