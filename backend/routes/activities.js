const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Activity = require("../models/Activity");
const Day = require("../models/Day");
const Trip = require("../models/Trip");

// Add activity to a day
router.post("/", auth, async (req, res) => {
  try {
    const {
      dayId,
      title,
      description,
      startTime,
      endTime,
      type,
      location,
      estimatedDurationMinutes,
      cost,
      optional,
      order,
    } = req.body;

    // Verify day belongs to user's trip
    const day = await Day.findById(dayId).populate("trip");
    if (!day || day.trip.user.toString() !== req.userId) {
      return res.status(404).json({ message: "Day not found" });
    }

    const activity = new Activity({
      day: dayId,
      title,
      description,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      type,
      location,
      estimatedDurationMinutes,
      cost,
      optional,
      order,
    });

    // overlap detection: if start/end provided, check existing activities on the same day
    if (activity.startTime && activity.endTime) {
      const conflicts = await Activity.find({
        day: dayId,
        _id: { $ne: activity._id },
        startTime: { $lt: activity.endTime },
        endTime: { $gt: activity.startTime },
      });

      if (conflicts.length) {
        // still save but warn client
        await activity.save();
        return res
          .status(201)
          .json({
            activity,
            warning: "Overlap detected with existing activities",
          });
      }
    }

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update activity
router.put("/:id", auth, async (req, res) => {
  try {
    const updates = req.body;
    const activity = await Activity.findById(req.params.id).populate({
      path: "day",
      populate: { path: "trip" },
    });
    if (!activity || activity.day.trip.user.toString() !== req.userId) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // apply updates
    Object.assign(activity, updates);

    // overlap detection
    if (activity.startTime && activity.endTime) {
      const conflicts = await Activity.find({
        day: activity.day._id,
        _id: { $ne: activity._id },
        startTime: { $lt: activity.endTime },
        endTime: { $gt: activity.startTime },
      });

      if (conflicts.length) {
        await activity.save();
        return res.json({
          activity,
          warning: "Overlap detected with existing activities",
        });
      }
    }

    await activity.save();
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Move activity to another day
router.patch("/:id/move", auth, async (req, res) => {
  try {
    const { targetDayId } = req.body;
    const activity = await Activity.findById(req.params.id).populate({
      path: "day",
      populate: { path: "trip" },
    });
    if (!activity || activity.day.trip.user.toString() !== req.userId)
      return res.status(404).json({ message: "Activity not found" });

    const targetDay = await Day.findById(targetDayId).populate("trip");
    if (!targetDay || targetDay.trip.user.toString() !== req.userId)
      return res.status(404).json({ message: "Target day not found" });

    activity.day = targetDayId;
    await activity.save();
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Reorder activity within a day (set order)
router.patch("/:id/reorder", auth, async (req, res) => {
  try {
    const { order } = req.body;
    const activity = await Activity.findById(req.params.id).populate({
      path: "day",
      populate: { path: "trip" },
    });
    if (!activity || activity.day.trip.user.toString() !== req.userId)
      return res.status(404).json({ message: "Activity not found" });

    activity.order = order;
    await activity.save();
    res.json(activity);
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
