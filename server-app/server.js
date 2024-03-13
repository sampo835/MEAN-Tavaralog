const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/database");
const itemsRoutes = require("./routes/items");
const usersRoutes = require("./routes/users");
const locationsRoutes = require("./routes/locations");
const app = express();

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on("connected", () => {
  console.log("Connected to database " + config.database);
});

// On Error
mongoose.connection.on("error", (err) => {
  console.log("Database error " + err);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use("/items", itemsRoutes);
app.use("/users", usersRoutes);
app.use("/locations", locationsRoutes);

// Start the server
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

module.exports = { startServer };
