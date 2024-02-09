// User model for the database

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "regular"],
    default: "regular",
  },
  class: {
    type: String,
    unique: false,
    required: true,
  },
  rfidTag: {
    type: String,
    unique: true,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
