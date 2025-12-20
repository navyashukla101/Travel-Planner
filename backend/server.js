require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/trips", require("./routes/trips"));
app.use("/api/activities", require("./routes/activities"));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Travel Planner API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
