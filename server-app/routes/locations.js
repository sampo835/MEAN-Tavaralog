const express = require("express");
const router = express.Router();
const Location = require("../models/location");

// Route to add a new location
router.post("/add-location", async (req, res) => {
  const { name } = req.body;

  try {
    // Check if the location with the provided name already exists
    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
      return res
        .status(400)
        .json({ message: "Location with this name already exists" });
    }

    // Create a new location
    const newLocation = new Location({
      name,
    });

    // Save the new location to the database
    await newLocation.save();

    res
      .status(201)
      .json({ message: "Location added successfully", location: newLocation });
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a location
router.delete("/delete-location/:locationId", async (req, res) => {
  const locationId = req.params.locationId;

  try {
    const location = await Location.findByIdAndDelete(locationId);

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all locations
router.get("/get-locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
