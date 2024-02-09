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

// Route to delete an item by ID
router.delete("/delete-item/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Check if the item exists
    const existingItem = await Item.findById(itemId);
    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Delete the item
    await Item.findByIdAndDelete(itemId);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all items
router.get("/get-items", async (req, res) => {
  try {
    // Fetch all items from the database
    const allItems = await Item.find();

    res.status(200).json(allItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
