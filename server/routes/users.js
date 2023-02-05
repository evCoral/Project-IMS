const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// Get users
router.get("/", async (req, res) => {
  const user = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: user });
});

// Create new user
router.post("/add", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error });
  }
});

// Validate User Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    console.log("No User found");
    return res.status(404).json({ success: false, error: "No User found" });
  }

  if (user.password === password)
    res.status(200).json({ success: true, data: user });
  else {
    console.log("Wrong password");
    res.status(404).json({ success: false, error: "Wrong password" });
  }
});

module.exports = router;
