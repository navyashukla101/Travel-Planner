import React, { useState, useEffect } from "react";
import API from "../../utils/api";

function TripOverview({ trip }) {
  const [destinationsWithImages, setDestinationsWithImages] = useState(
    trip.destinations || []
  );
  const [loading, setLoading] = useState(true);

  // Fetch images for destinations on mount or when trip changes
  useEffect(() => {
    const fetchImages = async () => {
      if (!trip.destinations || trip.destinations.length === 0) {
        setDestinationsWithImages([]);
        setLoading(false);
        return;
      }

      try {
        const updated = await Promise.all(
          trip.destinations.map(async (dest) => {
            // If destination already has images, return as-is
            if (dest.images && dest.images.length > 0) {
              return dest;
            }

            // Fetch images from API
            try {
              console.log(`Fetching images for ${dest.name}...`);
              const res = await API.get(
                `/images/search?query=${encodeURIComponent(dest.name)}`
              );
              const imageData = res.data;
              console.log(`Got response for ${dest.name}:`, imageData);

              if (
                imageData &&
                imageData.images &&
                imageData.images.length > 0
              ) {
                const updatedDest = {
                  ...dest,
                  images: imageData.images.map((img) => ({
                    url: img.url,
                    caption: img.caption || dest.name,
                  })),
                };
                console.log(
                  `Updated ${dest.name} with ${imageData.images.length} images`
                );
                return updatedDest;
              }
            } catch (err) {
              console.error(`Failed to fetch images for ${dest.name}:`, err);
            }

            return dest;
          })
        );

        console.log("Final destinations with images:", updated);
        setDestinationsWithImages(updated);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [trip]);

  // Calculate stats
  const totalDays = trip.days ? trip.days.length : 0;
  const totalActivities = trip.days
    ? trip.days.reduce(
        (sum, d) => sum + (d.activities ? d.activities.length : 0),
        0
      )
    : 0;

  const totalSpent = trip.days
    ? trip.days.reduce(
        (sum, d) =>
          sum +
          (d.activities
            ? d.activities.reduce((s, a) => s + (a.cost || 0), 0)
            : 0),
        0
      )
    : 0;

  const budget = trip.totalBudget || 0;
  const remaining = budget - totalSpent;
  const budgetPercent =
    budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;
  const isOverBudget = budget > 0 && totalSpent > budget;

  // Activity type distribution
  const activityTypeCount = {};
  if (trip.days) {
    trip.days.forEach((d) => {
      if (d.activities) {
        d.activities.forEach((a) => {
          const type = a.type || "Unspecified";
          activityTypeCount[type] = (activityTypeCount[type] || 0) + 1;
        });
      }
    });
  }

  // Completed activities
  const completedActivities = trip.days
    ? trip.days.reduce(
        (sum, d) =>
          sum +
          (d.activities ? d.activities.filter((a) => a.completed).length : 0),
        0
      )
    : 0;

  const completionRate =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>✈️ Trip Overview & Analytics</h2>
      </div>

      {/* Destination Gallery */}
      {destinationsWithImages && destinationsWithImages.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🌍 Destinations</h3>
          <div style={styles.destinationGallery}>
            {destinationsWithImages.map((dest, idx) => (
              <div key={idx} style={styles.destinationCard}>
                {dest.images && dest.images.length > 0 ? (
                  <img
                    src={dest.images[0].url}
                    alt={dest.name}
                    style={styles.destinationImage}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  style={{
                    ...styles.destinationImagePlaceholder,
                    display:
                      dest.images && dest.images.length > 0 ? "none" : "flex",
                  }}
                >
                  📸
                </div>
                <div style={styles.destinationInfo}>
                  <div style={styles.destinationName}>{dest.name}</div>
                  {dest.locationHint && (
                    <div style={styles.destinationHint}>
                      {dest.locationHint}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📅</div>
          <div style={styles.cardLabel}>Days</div>
          <div style={styles.cardValue}>{totalDays}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>🎯</div>
          <div style={styles.cardLabel}>Activities</div>
          <div style={styles.cardValue}>{totalActivities}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>✅</div>
          <div style={styles.cardLabel}>Completed</div>
          <div style={styles.cardValue}>{completionRate}%</div>
          <div style={styles.cardSubtitle}>
            {completedActivities} of {totalActivities}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>📍</div>
          <div style={styles.cardLabel}>Destinations</div>
          <div style={styles.cardValue}>
            {trip.destinations ? trip.destinations.length : 0}
          </div>
        </div>
      </div>

      {/* Budget Section */}
      {budget > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Budget Breakdown</h3>
          <div style={styles.budgetCard}>
            <div style={styles.budgetRow}>
              <span>Total Budget</span>
              <span style={styles.budgetValue}>${budget}</span>
            </div>
            <div style={styles.budgetRow}>
              <span>Spent</span>
              <span style={{ color: isOverBudget ? "#dc2626" : "#10b981" }}>
                ${totalSpent}
              </span>
            </div>
            <div style={styles.budgetRow}>
              <span>Remaining</span>
              <span style={{ color: remaining > 0 ? "#10b981" : "#dc2626" }}>
                ${remaining}
              </span>
            </div>
            <div style={styles.progressContainer}>
              <div
                style={{
                  background: "#e5e7eb",
                  height: "10px",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(budgetPercent, 100)}%`,
                    height: "100%",
                    background: isOverBudget ? "#ef4444" : "#10b981",
                  }}
                />
              </div>
              <div style={styles.budgetPercentText}>{budgetPercent}% spent</div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Types */}
      {Object.keys(activityTypeCount).length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Activity Types</h3>
          <div style={styles.typeList}>
            {Object.entries(activityTypeCount)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <div key={type} style={styles.typeItem}>
                  <div style={styles.typeName}>{type}</div>
                  <div style={styles.typeBar}>
                    <div
                      style={{
                        ...styles.typeBarFill,
                        width: `${(count / totalActivities) * 100}%`,
                      }}
                    />
                  </div>
                  <div style={styles.typeCount}>{count}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Daily Cost Breakdown */}
      {trip.days && trip.days.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Daily Costs</h3>
          <div style={styles.dailyList}>
            {trip.days.map((day, idx) => {
              const dayCost = day.activities
                ? day.activities.reduce((s, a) => s + (a.cost || 0), 0)
                : 0;
              const dayBudget = day.dailyBudget || 0;
              const dayOver = dayBudget > 0 && dayCost > dayBudget;
              return (
                <div key={day._id} style={styles.dailyItem}>
                  <div style={styles.dailyHeader}>
                    <span style={styles.dayLabel}>Day {day.dayNumber}</span>
                    <span style={{ color: dayOver ? "#dc2626" : "#10b981" }}>
                      ${dayCost}
                    </span>
                  </div>
                  {dayBudget > 0 && (
                    <div style={styles.dailyBudgetBar}>
                      <div style={styles.budgetBarBg}>
                        <div
                          style={{
                            ...styles.budgetBarFill,
                            width: `${Math.min(
                              (dayCost / dayBudget) * 100,
                              100
                            )}%`,
                            background: dayOver ? "#ef4444" : "#3b82f6",
                          }}
                        />
                      </div>
                      <span style={styles.budgetLabel}>of ${dayBudget}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderRadius: "12px",
    marginBottom: "2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    color: "#0f172a",
    fontSize: "1.875rem",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: "1.125rem",
    fontWeight: "700",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  destinationGallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  destinationCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  destinationImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  destinationImagePlaceholder: {
    width: "100%",
    height: "180px",
    background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
  },
  destinationInfo: {
    padding: "1rem",
  },
  destinationName: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "1rem",
    marginBottom: "0.25rem",
  },
  destinationHint: {
    color: "#64748b",
    fontSize: "0.875rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "1.25rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  cardIcon: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  cardLabel: {
    color: "#64748b",
    fontSize: "0.875rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardValue: {
    color: "#0f172a",
    fontSize: "2.25rem",
    fontWeight: "800",
  },
  cardSubtitle: {
    color: "#94a3b8",
    fontSize: "0.75rem",
    marginTop: "0.5rem",
  },
  budgetCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  budgetRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.875rem 0",
    borderBottom: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "0.95rem",
  },
  budgetValue: {
    fontWeight: "700",
    color: "#0f172a",
  },
  progressContainer: {
    marginTop: "1.25rem",
  },
  budgetPercentText: {
    color: "#64748b",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
    fontWeight: "600",
  },
  typeList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  typeItem: {
    backgroundColor: "white",
    padding: "1.25rem",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  typeName: {
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "0.75rem",
    fontSize: "0.95rem",
  },
  typeBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  typeBarFill: {
    height: "10px",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    borderRadius: "6px",
  },
  typeCount: {
    color: "#64748b",
    fontSize: "0.875rem",
    minWidth: "30px",
    textAlign: "right",
    fontWeight: "600",
  },
  dailyList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  dailyItem: {
    backgroundColor: "white",
    padding: "1.25rem",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  dailyHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
    fontWeight: "700",
    color: "#0f172a",
  },
  dayLabel: {
    color: "#475569",
  },
  dailyBudgetBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  budgetBarBg: {
    flex: 1,
    background: "#e2e8f0",
    height: "10px",
    borderRadius: "6px",
    overflow: "hidden",
  },
  budgetBarFill: {
    height: "100%",
  },
  budgetLabel: {
    color: "#64748b",
    fontSize: "0.75rem",
    minWidth: "50px",
    textAlign: "right",
    fontWeight: "600",
  },
};

export default TripOverview;
