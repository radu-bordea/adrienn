const About = require("../models/aboutModel");
const mongoose = require("mongoose");

// GET all paragraphs
const getAbout = async (req, res) => {
  try {
    const paragraphs = await About.find().sort({ createdAt: -1 });
    res.status(200).json(paragraphs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch about content." });
  }
};

// POST new paragraph
const createAbout = async (req, res) => {
  const { paragraph } = req.body;

  if (!paragraph)
    return res.status(400).json({ error: "Paragraph is required." });

  try {
    const newParagraph = await About.create({ paragraph });
    res.status(201).json(newParagraph);
  } catch (err) {
    res.status(400).json({ error: "Failed to create paragraph." });
  }
};

// UPDATE paragraph
const updateAbout = async (req, res) => {
  const { id } = req.params;
  const { paragraph } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "Invalid ID." });

  try {
    const updated = await About.findByIdAndUpdate(
      id,
      { paragraph },
      { new: true } // return updated doc
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update paragraph." });
  }
};

// DELETE paragraph
const deleteAbout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "Invalid ID." });

  try {
    await About.findByIdAndDelete(id);
    res.status(200).json({ id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete paragraph." });
  }
};

module.exports = {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
};
