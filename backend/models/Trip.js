const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // support multiple destinations
    destinations: [
      {
        name: { type: String, required: true },
        locationHint: { type: String },
        images: [
          {
            url: String,
            caption: String,
            uploadedAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    title: { type: String },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // trip management fields
    status: {
      type: String,
      enum: ["active", "past"],
      default: "active",
    },
    archived: { type: Boolean, default: false },
    totalBudget: { type: Number, default: 0 },
    collaborators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        email: { type: String },
        permission: { type: String, enum: ["view", "edit"], default: "view" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
