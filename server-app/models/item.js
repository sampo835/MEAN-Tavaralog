const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemname: {
    type: String,
    unique: true,
    required: true,
  },
  isLoaned: {
    type: Boolean,
    default: false,
  },
  loaner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: String,
    default: "Varastossa",
  },
  rfidTag: {
    type: String,
    unique: true,
    required: true,
  },
  loanTime: {
    type: Date,
    default: null,
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
