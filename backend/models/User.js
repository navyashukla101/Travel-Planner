const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Profile fields
    travelStyle: {
      type: String,
      enum: ["relaxed", "packed", "adventure"],
      default: "relaxed",
    },
    budgetPreference: {
      // e.g. "low", "medium", "high" or numeric baseline
      type: String,
      default: "medium",
    },
    profileNotes: {
      type: String,
      default: "",
    },
    // Preferences persisted across trips
    preferences: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
