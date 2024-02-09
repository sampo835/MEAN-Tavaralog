/* Routes for users */

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

module.exports = router;
