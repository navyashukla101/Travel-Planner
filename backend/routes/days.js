const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Day = require("../models/Day");

// Update day (notes, checklist, dailyBudget)
router.put("/:id", auth, async (req, res) => {
  try {
    const day = await Day.findById(req.params.id).populate("trip");
    if (!day || day.trip.user.toString() !== req.userId) {
      return res.status(404).json({ message: "Day not found" });
    }

    const { notes, checklist, dailyBudget } = req.body;

    if (typeof notes !== "undefined") day.notes = notes;
    if (typeof checklist !== "undefined") day.checklist = checklist;
    if (typeof dailyBudget !== "undefined") day.dailyBudget = dailyBudget;

    await day.save();
    res.json(day);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
