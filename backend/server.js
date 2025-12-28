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
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/trips", require("./routes/trips"));
app.use("/api/activities", require("./routes/activities"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/days", require("./routes/days"));
// AI assistant route
app.use("/api/ai", require("./routes/ai"));
// Images route
app.use("/api/images", require("./routes/images"));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Travel Planner API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
