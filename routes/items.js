/* Routes for items */
const express = require("express");
const router = express.Router();
const Item = require("../models/item");

// Route to add an item
router.post("/add-item", async (req, res) => {
  try {
    const { name, isLoaned, rfidTag } = req.body;

    // Create a new item instance
    const newItem = new Item({
      name,
      isLoaned: isLoaned || false,
      rfidTag,
    });

    // Save the item to the database
    const savedItem = await newItem.save();

    res
      .status(201)
      .json({ message: "Item added successfully", item: savedItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
