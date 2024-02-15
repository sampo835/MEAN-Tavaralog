const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/database");
const itemsRoutes = require("./routes/items");
const usersRoutes = require("./routes/users");

const app = express();
//app.use(cors());

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
app.use(bodyParser.json());

// Use routes
app.use("/items", itemsRoutes);
app.use("/users", usersRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
