import React, { useEffect, useState } from "react";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";

const API = "https://adrienn-backend.onrender.com/api/about"; // Update with the correct API endpoint

const AboutPage = () => {
  const { user, isLoaded } = useUser();
  const [paragraphs, setParagraphs] = useState([]);
  const [newParagraph, setNewParagraph] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchParagraphs();
  }, []);

  const fetchParagraphs = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setParagraphs(data);
    } catch (err) {
      console.error("Failed to fetch paragraphs", err);
    }
  };

  const handleAdd = async () => {
    if (!newParagraph) return;
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paragraph: newParagraph }),
      });
      const data = await res.json();
      setParagraphs([data, ...paragraphs]);
      setNewParagraph("");
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this paragraph?"
    );
    if (!confirm) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      setParagraphs(paragraphs.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paragraph: editText }),
      });
      const data = await res.json();
      setParagraphs(paragraphs.map((p) => (p._id === id ? data : p)));
      setEditId(null);
      setEditText("");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!isLoaded) return <div className="text-center text-gray-700">Loading...</div>;

  return (
    <div className="container mx-auto p-6 mt-1 rounded-xl ">
      <h1 className="text-3xl font-bold mb-6 ">About Me</h1>

      <SignedIn>
        <div className="mb-6">
          <textarea
            value={newParagraph}
            onChange={(e) => setNewParagraph(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Write a new paragraph about yourself..."
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
          >
            Add Paragraph
          </button>
        </div>
      </SignedIn>

      {paragraphs.map((p) => (
        <div
          key={p._id}
          className={` p-4 rounded-md  mb-4 ${
            p._id === paragraphs[0]._id ? "rounded-t-md" : ""
          } ${
            p._id === paragraphs[paragraphs.length - 1]._id
              ? "rounded-b-md"
              : ""
          }`}
        >
          {editId === p._id ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 border border-blue-400  text-gray-500 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(p._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-200"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditId(null);
                    setEditText("");
                  }}
                  className="px-4 py-2 bg-gray-400 text-gray-800 rounded-md shadow-md hover:bg-gray-500 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:flex-1">
                <p className="text-lg text-gray-500">{p.paragraph}</p>
              </div>

              <SignedIn>
                <div className="flex flex-col gap-2 sm:w-1/4">
                  <button
                    onClick={() => {
                      setEditId(p._id);
                      setEditText(p.paragraph);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="flex flex-col gap-2 sm:w-1/4">
                  {/* No buttons for logged-out users */}
                </div>
              </SignedOut>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AboutPage;
