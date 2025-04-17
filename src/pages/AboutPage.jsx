import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const API = "https://adrienn-backend.onrender.com/api/about";

const AboutPage = () => {
  const [paragraphs, setParagraphs] = useState([]);
  const [newParagraph, setNewParagraph] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const { isSignedIn } = useUser();

  useEffect(() => {
    fetchParagraphs();
  }, []);

  const fetchParagraphs = async () => {
    try {
      const res = await axios.get(API);
      setParagraphs(res.data);
    } catch (err) {
      console.error("Failed to fetch paragraphs", err);
    }
  };

  const handleAdd = async () => {
    if (!newParagraph) return;
    try {
      const res = await axios.post(API, { paragraph: newParagraph });
      setParagraphs([res.data, ...paragraphs]);
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
      await axios.delete(`${API}/${id}`);
      setParagraphs(paragraphs.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.patch(`${API}/${id}`, { paragraph: editText });
      setParagraphs(paragraphs.map((p) => (p._id === id ? res.data : p)));
      setEditId(null);
      setEditText("");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="container mx-auto p-6 mt-10 text-gray-700">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>

      {/* Add New - Only show if signed in */}
      {isSignedIn && (
        <div className="mb-6">
          <textarea
            value={newParagraph}
            onChange={(e) => setNewParagraph(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            rows={3}
            placeholder="Write new about paragraph..."
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Paragraph
          </button>
        </div>
      )}

      {/* List All */}
      {paragraphs.map((p) => (
        <div key={p._id} className="mb-6">
          {editId === p._id ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border border-blue-300 rounded mb-2"
                rows={3}
              />
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdate(p._id)}
                  className="px-4 py-1 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditId(null);
                    setEditText("");
                  }}
                  className="px-4 py-1 bg-gray-300 text-gray-700 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-2">{p.paragraph}</p>
              {isSignedIn && (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditId(p._id);
                      setEditText(p.paragraph);
                    }}
                    className="px-3 py-1 bg-blue-400 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AboutPage;
