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

// Route to loan an item
router.put("/loan/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    // Find the item by ID
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the item is already loaned
    if (item.isLoaned) {
      return res.status(400).json({ message: "Item is already loaned" });
    }

    // Update the item's loan status
    item.isLoaned = true;

    // Save the updated item
    await item.save();

    res.status(200).json({ message: "Item loaned successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to return a loaned item
router.put("/return/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    // Find the item by ID
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the item is not loaned
    if (!item.isLoaned) {
      return res.status(400).json({ message: "Item is not loaned" });
    }

    // Update the item's loan status
    item.isLoaned = false;

    // Save the updated item
    const updatedItem = await item.save();

    res
      .status(200)
      .json({ message: "Item returned successfully", item: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
