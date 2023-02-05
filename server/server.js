require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Imported Routes
const itemRoutes = require("./routes/items");
const userRoutes = require("./routes/users");

// Middleware
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.all("*", (req, res) => {
  res.json("No routes found");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the DB");
    // Listening for request
    app.listen(process.env.PORT, () => {
      console.log(`Listening to port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
