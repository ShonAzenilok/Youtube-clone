const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const cors = require("cors");
const app = express();
const port = 8000;
const MONGO_URL = `mongodb://localhost:27017/`;

// Middleware setup
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  });

// Routers
const usersRouter = require("./routes/users");
const videosRouter = require("./routes/videos");
const tokensRouter = require("./routes/tokens");

// Route middleware
app.use("/api/users", usersRouter);
app.use("/api/videos", videosRouter);
app.use("/api/tokens", tokensRouter);

// Serve static files from the 'build' directory (for the React app)
app.use(express.static(path.join(__dirname, "build")));

// Serve static files from the 'resources' directory
app.use(express.static(path.join(__dirname, "resources")));

// Serve static files from the root directory (if needed)
app.use(express.static(path.join(__dirname, "./")));

// Serve the React app for any unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error occurred: ${err.message}`);
  res.status(500).json({ error: "An internal server error occurred" });
});

// Start server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
