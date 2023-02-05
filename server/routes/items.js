const express = require("express");
const Item = require("../models/Item");
const mongoose = require("mongoose");

const router = express.Router();

// Get all items
router.get("/", async (req, res) => {
  const item = await Item.find({}).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: item });
});

// Get specific item
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, error: "No such item found" });

  const item = await Item.findById(id);

  if (!item) {
    return res
      .status(404)
      .json({ success: false, error: "No such item found" });
  }
  res.status(200).json({ success: true, data: item });
});

// Add new item
router.post("/add", async (req, res) => {
  const { name, quantity } = req.body;

  try {
    const item = await Item.create({ name, quantity });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error });
  }
});

// Update an item
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, error: "No such item found" });

  const item = await Item.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!item) {
    return res
      .status(404)
      .json({ success: false, error: "No such item found" });
  }

  res.status(200).json({ success: true, data: { ...item._doc, ...req.body } });
});

// Delete an item
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, error: "No such item found" });

  const item = await Item.findOneAndDelete({ _id: id });
  if (!item) {
    return res
      .status(404)
      .json({ success: false, error: "No such item found" });
  }
  res.status(200).json({ success: true, data: item });
});

module.exports = router;
