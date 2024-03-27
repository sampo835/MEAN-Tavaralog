const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const Loan = require("../models/loan");

// Create a new loan
router.post("/add-loan", async (req, res) => {
  const { itemName, userName, location, loanTime } = req.body;

  try {
    const newLoan = new Loan({
      itemName,
      userName,
      location,
      loanTime,
      returnTime: null,
    });

    const savedLoan = await newLoan.save();
    res
      .status(201)
      .json({ message: "Loan created successfully", loan: savedLoan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get loan history
router.get("/loan-history", async (req, res) => {
  try {
    const loanHistory = await Loan.find().exec();
    res.status(200).json(loanHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update loan with return time
router.put("/update-loan-with-return-time", async (req, res) => {
  try {
    const { itemName, returnTime } = req.body;

    // Find the active loan by item name and return time null
    const loan = await Loan.findOne({ itemName, returnTime: null });

    if (!loan) {
      return res.status(404).json({ message: "Active loan not found" });
    }

    // Update the return time
    loan.returnTime = returnTime;
    await loan.save();

    res.status(200).json({ message: "Loan updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define the function to remove old loan records
const removeOldLoans = async () => {
  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    await Loan.deleteMany({ returnTime: { $lt: twoWeeksAgo } });
    console.log("Old loan records removed successfully.");
  } catch (error) {
    console.error("Error removing old loan records:", error);
  }
};

// Schedule the function to run every day at midnight
cron.schedule(
  "0 0 * * *",
  () => {
    console.log("Scheduled task running...");
    removeOldLoans();
  },
  {
    timezone: "Europe/Helsinki",
  }
);

module.exports = router;
