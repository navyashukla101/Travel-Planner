const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Trip = require("../models/Trip");
const Day = require("../models/Day");
const Activity = require("../models/Activity");

// Get all trips for user
router.get("/", auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single trip with days and activities
router.get("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.userId });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const days = await Day.find({ trip: trip._id }).sort({ dayNumber: 1 });

    const daysWithActivities = await Promise.all(
      days.map(async (day) => {
        const activities = await Activity.find({ day: day._id });
        return {
          ...day.toObject(),
          activities,
        };
      })
    );

    res.json({
      ...trip.toObject(),
      days: daysWithActivities,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create trip
router.post("/", auth, async (req, res) => {
  try {
    const { destination, startDate, endDate } = req.body;

    // Validation
    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    // Create trip
    const trip = new Trip({
      user: req.userId,
      destination,
      startDate,
      endDate,
    });

    await trip.save();

    // Auto-generate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < dayCount; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      const day = new Day({
        trip: trip._id,
        date: currentDate,
        dayNumber: i + 1,
      });

      await day.save();
    }

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete trip
router.delete("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.userId });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Delete all days and activities
    const days = await Day.find({ trip: trip._id });
    const dayIds = days.map((day) => day._id);

    await Activity.deleteMany({ day: { $in: dayIds } });
    await Day.deleteMany({ trip: trip._id });
    await Trip.findByIdAndDelete(trip._id);

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
