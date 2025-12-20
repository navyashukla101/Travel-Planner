const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Activity = require("../models/Activity");
const Day = require("../models/Day");
const Trip = require("../models/Trip");

// Add activity to a day
router.post("/", auth, async (req, res) => {
  try {
    const { dayId, title, description } = req.body;

    // Verify day belongs to user's trip
    const day = await Day.findById(dayId).populate("trip");
    if (!day || day.trip.user.toString() !== req.userId) {
      return res.status(404).json({ message: "Day not found" });
    }

    const activity = new Activity({
      day: dayId,
      title,
      description,
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete activity
router.delete("/:id", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate({
      path: "day",
      populate: { path: "trip" },
    });

    if (!activity || activity.day.trip.user.toString() !== req.userId) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
