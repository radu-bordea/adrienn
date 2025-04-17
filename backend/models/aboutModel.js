const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const aboutSchema = new Schema(
  {
    paragraph: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
