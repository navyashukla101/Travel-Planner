const Trip = require("../models/Trip");
const Day = require("../models/Day");
const Activity = require("../models/Activity");
const fetch = global.fetch || require("node-fetch");

function parseDayNumber(text) {
  const m = text.match(/day\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function parseTimeString(text) {
  const m = text.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = m[3];
  if (ampm) {
    if (/pm/i.test(ampm) && hour !== 12) hour += 12;
    if (/am/i.test(ampm) && hour === 12) hour = 0;
  }
  return { hour, minute };
}

async function loadTripData(tripId) {
  const trip = await Trip.findById(tripId).lean();
  if (!trip) return null;
  const days = await Day.find({ trip: tripId }).sort("dayNumber").lean();
  for (const d of days) {
    d.activities = await Activity.find({ day: d._id }).sort("order").lean();
  }
  return { trip, days };
}

async function summarizeTrip(tripId) {
  const data = await loadTripData(tripId);
  if (!data) return null;
  let totalCost = 0;
  const daySummaries = data.days.map((d) => {
    const dayCost = (d.activities || []).reduce((s, a) => s + (a.cost || 0), 0);
    const dayMinutes = (d.activities || []).reduce(
      (s, a) => s + (a.estimatedDurationMinutes || 0),
      0
    );
    totalCost += dayCost;
    return {
      dayNumber: d.dayNumber,
      date: d.date,
      cost: dayCost,
      minutes: dayMinutes,
    };
  });
  return { trip: data.trip, days: daySummaries, totalCost };
}

async function suggestActivities({ tripId, dayNumber }) {
  const data = await loadTripData(tripId);
  if (!data) return { error: "Trip not found" };
  const day = data.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return { error: "Day not found" };

  const usedMinutes = (day.activities || []).reduce(
    (s, a) => s + (a.estimatedDurationMinutes || 0),
    0
  );
  const freeMinutes = Math.max(0, 8 * 60 - usedMinutes);

  const suggestions = [];
  if (freeMinutes >= 60) {
    suggestions.push({
      title: "Local museum visit",
      estimatedDurationMinutes: 90,
      cost: 5,
      type: "sightseeing",
      note: "Good afternoon activity",
    });
  }
  if (freeMinutes >= 30) {
    suggestions.push({
      title: "Cafe / Tea break",
      estimatedDurationMinutes: 45,
      cost: 3,
      type: "food",
      note: "Evening rest stop",
    });
  }
  if (freeMinutes >= 120) {
    suggestions.push({
      title: "Half-day guided tour",
      estimatedDurationMinutes: 180,
      cost: 25,
      type: "sightseeing",
      note: "Consider if you want a deeper experience",
    });
  }

  return { dayNumber, freeMinutes, suggestions };
}

async function budgetRecommendations({ tripId, budgetLimit }) {
  const data = await loadTripData(tripId);
  if (!data) return { error: "Trip not found" };
  const currentCost = data.days.reduce(
    (s, d) => s + (d.activities || []).reduce((ss, a) => ss + (a.cost || 0), 0),
    0
  );
  if (!budgetLimit) return { currentCost };

  if (currentCost <= budgetLimit) return { currentCost, ok: true };

  // find removable optional activities ordered by cost
  const removable = [];
  for (const d of data.days) {
    for (const a of d.activities || []) {
      if (a.optional) removable.push({ dayNumber: d.dayNumber, activity: a });
    }
  }
  removable.sort((x, y) => (y.activity.cost || 0) - (x.activity.cost || 0));

  const toRemove = [];
  let reduced = currentCost;
  for (const r of removable) {
    if (reduced <= budgetLimit) break;
    reduced -= r.activity.cost || 0;
    toRemove.push(r);
  }

  return {
    currentCost,
    target: budgetLimit,
    reduced,
    suggestions: toRemove.map((r) => ({
      dayNumber: r.dayNumber,
      title: r.activity.title,
      cost: r.activity.cost,
    })),
  };
}

async function createActivityFromText({ tripId, text, userId }) {
  const dayNum = parseDayNumber(text);
  if (!dayNum)
    return { error: "Could not determine day. Please say e.g. 'Day 1'" };
  const day = await Day.findOne({ trip: tripId, dayNumber: dayNum });
  if (!day) return { error: "Day not found" };

  const timeParsed = parseTimeString(text);
  let startTime = null;
  if (timeParsed) {
    startTime = new Date(day.date);
    startTime.setHours(timeParsed.hour, timeParsed.minute || 0, 0, 0);
  }

  // naive title extraction
  const titleMatch = text.match(
    /add\s+(?:a\s+)?(.+?)\s*(?:on|at|to|in|for|day|$)/i
  );
  const title =
    titleMatch && titleMatch[1] ? titleMatch[1].trim() : "New activity";

  const activity = new Activity({
    day: day._id,
    title: title.replace(/\s+at\s+.*$/i, ""),
    startTime: startTime,
    estimatedDurationMinutes: 60,
    cost: 0,
    optional: false,
  });
  await activity.save();

  return { created: true, activity };
}

async function balanceTrip({ tripId }) {
  const data = await loadTripData(tripId);
  if (!data) return { error: "Trip not found" };
  const recommendations = [];
  for (const d of data.days) {
    const minutes = (d.activities || []).reduce(
      (s, a) => s + (a.estimatedDurationMinutes || 0),
      0
    );
    if (minutes > 8 * 60) {
      recommendations.push({
        dayNumber: d.dayNumber,
        issue: "too_packed",
        minutes,
        suggestion: "Mark some optional activities or move to other days",
      });
    }
  }
  return { recommendations };
}

async function citySuggestions(city, opts = {}) {
  const key = process.env.OPENTRIPMAP_KEY;
  const locale = opts.locale || "en";
  if (key) {
    try {
      // fetch geoname to get coordinates
      const geoRes = await fetch(
        `https://api.opentripmap.com/0.1/${locale}/places/geoname?name=${encodeURIComponent(
          city
        )}&apikey=${key}`
      );
      const geo = await geoRes.json();
      if (geo && geo.lat && geo.lon) {
        const lat = geo.lat;
        const lon = geo.lon;
        // fetch top places by radius
        const placesRes = await fetch(
          `https://api.opentripmap.com/0.1/${locale}/places/radius?radius=10000&limit=8&offset=0&lon=${lon}&lat=${lat}&apikey=${key}`
        );
        const placesJson = await placesRes.json();
        const suggestions = (placesJson.features || []).slice(0, 8).map((f) => {
          const props = f.properties || {};
          return `${props.name || "Attraction"} — ${
            props.kinds ? props.kinds.split(",")[0] : "sight"
          }`;
        });
        return { city, source: "opentripmap", suggestions };
      }
    } catch (e) {
      // fall through to canned suggestions
      console.error("OpenTripMap error:", e.message || e);
    }
  }

  // fallback canned, friendlier suggestions
  const suggestions = [
    `Explore the historic center of ${city} and visit its most famous cathedral or square.`,
    `Visit a top museum in ${city} (look for visitor-rated highlights).`,
    `Try local specialties at a popular market or a well-reviewed neighborhood restaurant.`,
    `Take a scenic walk or relax in a notable park or riverfront area in ${city}.`,
    `Check local event listings for concerts, exhibitions, or festivals during your stay.`,
  ];
  return { city, source: "canned", suggestions };
}

module.exports = {
  loadTripData,
  summarizeTrip,
  suggestActivities,
  budgetRecommendations,
  createActivityFromText,
  balanceTrip,
  citySuggestions,
};
