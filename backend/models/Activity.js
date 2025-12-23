const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    day: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Day",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    // Time-based fields
    startTime: { type: Date },
    endTime: { type: Date },
    // classification and metadata
    type: {
      type: String,
      enum: ["food", "travel", "sightseeing", "other"],
      default: "other",
    },
    location: { type: String, default: "" },
    notes: { type: String, default: "" },
    estimatedDurationMinutes: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    optional: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
