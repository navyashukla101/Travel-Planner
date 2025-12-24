const express = require("express");
const router = express.Router();
const ai = require("../services/aiService");
const jwt = require("jsonwebtoken");

// POST /api/ai/query
// Body: { tripId, message, budgetLimit? }
router.post("/query", async (req, res) => {
  try {
    // try to decode optional token so we can perform authenticated actions
    let userId = null;
    const { tripId, message, budgetLimit } = req.body;
    if (!message)
      return res.status(400).json({ message: "message is required" });

    const text = message.trim();

    // Very simple keyword intent detection
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (e) {
        // invalid token - ignore and continue as anonymous
      }
    }
    if (/^add\b|\badd\s+/i.test(text) || /\bcreate\b/i.test(text)) {
      if (!tripId)
        return res.json({
          intent: "create_activity",
          result: {
            error: "no_trip",
            message:
              "Open a trip to add activities (select a trip and try again).",
          },
        });
      // require authenticated user to create activity
      if (!userId)
        return res.status(401).json({
          intent: "create_activity",
          result: {
            error: "unauthenticated",
            message: "You must be logged in to add activities.",
          },
        });
      const result = await ai.createActivityFromText({ tripId, text, userId });
      return res.json({ intent: "create_activity", result });
    }

    if (
      /suggest.*activities|suggest\b|recommend\b/i.test(text) &&
      /day\s*\d+/i.test(text)
    ) {
      if (!tripId)
        return res.json({
          intent: "suggest_activities",
          result: {
            error: "no_trip",
            message: "Open a trip to get day-specific suggestions.",
          },
        });
      const dayNum = (text.match(/day\s*(\d+)/i) || [])[1];
      const result = await ai.suggestActivities({
        tripId,
        dayNumber: parseInt(dayNum, 10),
      });
      return res.json({ intent: "suggest_activities", result });
    }

    if (
      /balance|not too packed|too rushed|evening rest|rest time/i.test(text)
    ) {
      if (!tripId)
        return res.json({
          intent: "balance_trip",
          result: {
            error: "no_trip",
            message: "Open a trip to let the assistant analyze pacing.",
          },
        });
      const result = await ai.balanceTrip({ tripId });
      return res.json({ intent: "balance_trip", result });
    }

    if (/budget|cost|low-budget|stay within budget|reduce cost/i.test(text)) {
      if (!tripId)
        return res.json({
          intent: "budget_recommendation",
          result: {
            error: "no_trip",
            message: "Open a trip to run budget analysis, or provide a tripId.",
          },
        });
      const result = await ai.budgetRecommendations({ tripId, budgetLimit });
      return res.json({ intent: "budget_recommendation", result });
    }

    // pack / general Q&A - can answer without a trip
    if (/pack|what should i pack|what to pack|what do i pack/i.test(text)) {
      const tips = [
        "Check weather for your destination and pack layers.",
        "Bring comfortable walking shoes and a light rain jacket.",
        "Pack necessary chargers, adapters, and a small first-aid kit.",
        "Consider a reusable water bottle and sunscreen.",
      ];
      return res.json({ intent: "pack_advice", result: { tips } });
    }

    // General city suggestions: catch many phrasings like
    // "things to do in Paris", "suggestions for Paris", "to do suggestions for paris"
    const cityMatch =
      text.match(
        /(?:things to do|what to do|what to see|things to see|ideas for|suggestions for|suggest for|suggest)\s*?(?:.*?\b(?:in|for|around|at|about)\b)?\s*([A-Za-z\s]{2,50})/i
      ) ||
      text.match(/(?:in|for|around|at|about)\s+([A-Za-z\s]{2,50})/i) ||
      text.match(/([A-Za-z\s]{2,50})$/i);
    if (cityMatch) {
      const city = (cityMatch[1] || "").trim();
      // discard very short matches
      if (city && city.length > 1) {
        const safeCity = city.replace(/\s+/g, " ");
        const result = await ai.citySuggestions(safeCity);
        return res.json({ intent: "city_suggestions", result });
      }
    }

    // simple travel-time question when tripId provided
    if (/how many hours per day|hours per day|how many hours/i.test(text)) {
      if (!tripId)
        return res.json({
          intent: "hours_query",
          result: {
            error: "no_trip",
            message: "Open a trip to calculate hours from your itinerary.",
          },
        });
      const summary = await ai.summarizeTrip(tripId);
      return res.json({ intent: "hours_query", result: summary });
    }

    // default: when trip provided, return summary; otherwise guide user
    if (tripId) {
      const summary = await ai.summarizeTrip(tripId);
      return res.json({ intent: "summary", result: summary });
    }

    return res.json({
      intent: "no_trip",
      result: {
        message:
          "Open a trip to use the AI assistant for context-aware help. You can also ask general questions like 'What should I pack?'",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
