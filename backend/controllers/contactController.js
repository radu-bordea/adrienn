const Contact = require("../models/contactModel");
const mongoose = require("mongoose");

// Get the single contact
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({});
    if (!contact) return res.status(404).json({ error: "Contact not found." });
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contact." });
  }
};

// Create the contact (only if one doesn't exist)
const createContact = async (req, res) => {
  const { name, address, email, facebook, instagram } = req.body;

  try {
    const existing = await Contact.findOne({});
    if (existing) {
      return res.status(400).json({ error: "Contact already exists." });
    }

    const contact = await Contact.create({
      name,
      address,
      email,
      facebook,
      instagram,
    });

    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create contact." });
  }
};

// Update the contact
const updateContact = async (req, res) => {
  const { name, address, email, facebook, instagram } = req.body;

  try {
    const contact = await Contact.findOne({});
    if (!contact) return res.status(404).json({ error: "Contact not found." });

    contact.name = name || contact.name;
    contact.address = address || contact.address;
    contact.email = email || contact.email;
    contact.facebook = facebook || contact.facebook;
    contact.instagram = instagram || contact.instagram;

    const updatedContact = await contact.save();
    res.status(200).json(updatedContact);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update contact." });
  }
};

// Delete the contact
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({});
    if (!contact) return res.status(404).json({ error: "Contact not found." });

    await Contact.findByIdAndDelete(contact._id);
    res.status(200).json({ message: "Contact deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete contact." });
  }
};

module.exports = {
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
