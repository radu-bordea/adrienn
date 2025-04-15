require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/products");
const cloudinary = require("cloudinary").v2;

// express app
const app = express();

// Allow requests from the frontend
app.use(
  cors({
    origin: ["https://adrienn-frontend.onrender.com", "http://localhost:5173"],
  })
);

// middleware - looks if there is body to the request
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/products", productRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for request
    app.listen(process.env.PORT, () => {
      console.log("connecting to db & listening on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
