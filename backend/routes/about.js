const express = require("express");
const {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

const router = express.Router();

router.get("/", getAbout);
router.post("/", createAbout);
router.patch("/:id", updateAbout);
router.delete("/:id", deleteAbout);

module.exports = router;
