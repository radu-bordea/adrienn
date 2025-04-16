import React, { useState, useEffect } from "react";
import axios from "axios";

const ContactPage = () => {
  const [contact, setContact] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    facebook: "",
    instagram: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch contact on mount
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(
          "https://adrienn-backend.onrender.com/api/contact"
        );
        setContact(res.data);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch contact info.");
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "https://adrienn-backend.onrender.com/api/contact",
        formData
      );
      setContact(res.data);
      alert("Contact updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update contact.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      {/* Toggle Button */}
      <button
        onClick={toggleContactInfo}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {showContactInfo ? "Hide Contact Info" : "Show Contact Info"}
      </button>

      {/* Display Contact Info */}
      {showContactInfo && contact && (
        <div className="mt-4 text-gray-700 space-y-1">
          <p className="text-lg font-semibold">Name: {contact.name}</p>
          <p className="text-lg font-semibold">Address: {contact.address}</p>
          <p className="text-lg font-semibold">Email: {contact.email}</p>
          <p className="text-lg font-semibold">
            Facebook:{" "}
            <a
              href={`https://${contact.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {contact.facebook}
            </a>
          </p>
          <p className="text-lg font-semibold">
            Instagram:{" "}
            <a
              href={`https://${contact.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600"
            >
              {contact.instagram}
            </a>
          </p>
        </div>
      )}

      {/* Edit Form */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Edit Contact Info</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "address", "email", "facebook", "instagram"].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize text-gray-700">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            )
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Update Contact
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
