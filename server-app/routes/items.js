const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const User = require("../models/user");

//----------------------------------------------------------------------//

// Route to add an item
router.post("/add-item", async (req, res) => {
  try {
    const { itemname, isLoaned, rfidTag } = req.body;

    // Validate required fields
    if (!itemname || !rfidTag) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newItem = new Item({
      itemname,
      isLoaned: isLoaned || false,
      loaner: null,
      location: "stock",
      rfidTag,
    });

    await newItem.save();

    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    console.error("MongoDB Error:", error); // Log the full error for debugging

    if (error.code === 11000 || error.name === "MongoError") {
      const duplicateKey = error.keyValue ? error.keyValue.itemname : "unknown"; // Extract duplicate key value
      return res
        .status(400)
        .json({ error: `Duplicate key error for RFID tag: ${duplicateKey}` });
    }

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//----------------------------------------------------------------------//

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

//----------------------------------------------------------------------//

// Route to get all items
router.get("/get-items", async (req, res) => {
  try {
    // Fetch all items from the database
    const items = await Item.find();

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//----------------------------------------------------------------------//

// Route to get loaned items
router.get("/get-loaned-items", async (req, res) => {
  try {
    // Fetch all loaned items from the database
    const loanedItems = await Item.find({ isLoaned: true }).populate("loaner"); // Modify the condition based on your schema

    res.status(200).json(loanedItems);
  } catch (error) {
    console.error("Error fetching loaned items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//----------------------------------------------------------------------//

/*/ Route to loan an item by providing both user and item RFID tags
router.put("/loan-item", async (req, res) => {
  const { itemRfidTag, userRfidTag } = req.body;

  console.log("Received Item RFID Tag:", itemRfidTag);
  console.log("Received User RFID Tag:", userRfidTag);

  try {
    // Find the item by item RFID tag
    const item = await Item.findOne({ rfidTag: itemRfidTag });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the item is already loaned
    if (item.isLoaned) {
      return res.status(400).json({ message: "Item is already loaned" });
    }

    // Update the item's loan status
    item.isLoaned = true;

    // Associate the user ObjectId with the loaner field
    const user = await User.findOne({ rfidTag: userRfidTag });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    item.loaner = user._id;

    // Save the updated item
    await item.save();

    res.status(200).json({ message: "Item loaned successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});*/

// Route to loan an item by providing both user and item RFID tags, including location
router.put("/loan-item", async (req, res) => {
  const { itemRfidTag, userRfidTag, location } = req.body;

  console.log("Received Item RFID Tag:", itemRfidTag);
  console.log("Received User RFID Tag:", userRfidTag);
  console.log("Received Location:", location);

  try {
    // Find the item by item RFID tag
    const item = await Item.findOne({ rfidTag: itemRfidTag });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the item is already loaned
    if (item.isLoaned) {
      return res.status(400).json({ message: "Item is already loaned" });
    }

    // Update the item's loan status and location
    item.isLoaned = true;
    item.location = location; // Assuming you have a 'location' field in your item model

    // Associate the user ObjectId with the loaner field
    const user = await User.findOne({ rfidTag: userRfidTag });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    item.loaner = user._id;

    // Save the updated item
    await item.save();

    res.status(200).json({ message: "Item loaned successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//----------------------------------------------------------------------//

// Route to return a loaned item
router.put("/return/:rfidTag", async (req, res) => {
  const rfidTag = req.params.rfidTag;
  //console.log("Received RFID Tag:", rfidTag);

  try {
    // Find the item by RFID tag
    const item = await Item.findOne({ rfidTag });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the item is not loaned
    if (!item.isLoaned) {
      return res.status(400).json({ message: "Item is not loaned" });
    }

    // Update the item's loan status
    item.isLoaned = false;

    // Set the loaner field to null
    item.loaner = null;

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

// Route to check if an item with a specific RFID tag exists and if it is loaned
router.get("/check-item/:rfidTag", async (req, res) => {
  try {
    // Extract RFID tag from the request parameters
    const rfidTag = req.params.rfidTag;

    // Use Mongoose's findOne to find the item by RFID tag
    const item = await Item.findOne({ rfidTag });

    if (item) {
      // Check if the item is loaned
      const isLoaned = item.isLoaned; // Adjust this based on your item schema

      res.status(200).json({ itemExists: true, isLoaned });
    } else {
      // Respond with a not found message if the item is not found
      res.status(404).json({ itemExists: false, isLoaned: false });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
