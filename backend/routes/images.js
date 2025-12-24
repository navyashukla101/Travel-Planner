const express = require("express");
const router = express.Router();
const imageService = require("../services/imageService");

// GET /api/images/search?query=Paris
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "query parameter is required" });
    }

    const result = await imageService.getDestinationImages(query);
    return res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
