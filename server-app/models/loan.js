const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  loanTime: {
    type: Date,
    required: true,
  },
  returnTime: {
    type: Date,
  },
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
