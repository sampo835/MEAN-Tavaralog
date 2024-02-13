// Item model for the database

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  isLoaned: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: String,
    default: "stock",
  },
  rfidTag: {
    type: String,
    unique: true,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
