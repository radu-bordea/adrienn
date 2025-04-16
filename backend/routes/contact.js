const express = require("express");
const {
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

// GET the contact
router.get("/", getContact);

// POST to create the contact (only if it doesn't exist)
router.post("/", createContact);

// PATCH to update the contact
router.patch("/", updateContact);

// DELETE the contact
router.delete("/", deleteContact);

module.exports = router;
