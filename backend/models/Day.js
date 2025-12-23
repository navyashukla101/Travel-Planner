const mongoose = require("mongoose");

const daySchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    // day-level budget and notes
    dailyBudget: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    checklist: [
      {
        text: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Day", daySchema);
