import React from "react";

function TripOverview({ trip }) {
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
      <h2 style={styles.title}>Trip Overview & Analytics</h2>

      <div style={styles.grid}>
        {/* Summary Cards */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>Days</div>
          <div style={styles.cardValue}>{totalDays}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Activities</div>
          <div style={styles.cardValue}>{totalActivities}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Completed</div>
          <div style={styles.cardValue}>{completionRate}%</div>
          <div style={styles.cardSubtitle}>
            {completedActivities} of {totalActivities}
          </div>
        </div>

        <div style={styles.card}>
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
    padding: "1.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    marginBottom: "2rem",
  },
  title: {
    color: "#1f2937",
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "white",
    padding: "1.25rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  cardLabel: {
    color: "#6b7280",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
  },
  cardValue: {
    color: "#1f2937",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#9ca3af",
    fontSize: "0.75rem",
    marginTop: "0.5rem",
  },
  section: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    color: "#1f2937",
    fontSize: "1.125rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  budgetCard: {
    backgroundColor: "white",
    padding: "1.25rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  budgetRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.75rem 0",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  },
  budgetValue: {
    fontWeight: "600",
    color: "#1f2937",
  },
  progressContainer: {
    marginTop: "1rem",
  },
  budgetPercentText: {
    color: "#6b7280",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  typeList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  typeItem: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  typeName: {
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  typeBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  typeBarFill: {
    height: "8px",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
    borderRadius: "4px",
  },
  typeCount: {
    color: "#6b7280",
    fontSize: "0.875rem",
    minWidth: "30px",
    textAlign: "right",
  },
  dailyList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  dailyItem: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  dailyHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#1f2937",
  },
  dayLabel: {
    color: "#374151",
  },
  dailyBudgetBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  budgetBarBg: {
    flex: 1,
    background: "#e5e7eb",
    height: "8px",
    borderRadius: "4px",
    overflow: "hidden",
  },
  budgetBarFill: {
    height: "100%",
  },
  budgetLabel: {
    color: "#6b7280",
    fontSize: "0.75rem",
    minWidth: "45px",
    textAlign: "right",
  },
};

export default TripOverview;
