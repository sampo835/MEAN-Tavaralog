const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Route to add a new user
router.post("/add-user", async (req, res) => {
  try {
    // Extract user data from request body
    const { username, role, group, rfidTag } = req.body;

    // Create a new user instance
    const newUser = new User({
      username,
      role,
      group,
      rfidTag,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a user
router.delete("/delete-user/:userId", async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const userId = req.params.userId;

    // Use Mongoose's findByIdAndDelete to delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      // Respond with a success message
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      // Respond with a not found message if user not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all users
router.get("/get-users", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to check if a user with a specific RFID tag is an admin
router.get("/check-admin/:rfidTag", async (req, res) => {
  try {
    // Extract RFID tag from the request parameters
    const rfidTag = req.params.rfidTag;

    // Use Mongoose's findOne to find the user by RFID tag
    const user = await User.findOne({ rfidTag });

    if (user) {
      // Check if the user has an admin role
      if (user.role === 'admin') {
        res.status(200).json({ isAdmin: true });
      } else {
        res.status(200).json({ isAdmin: false });
      }
    } else {
      // Respond with a not found message if user not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
