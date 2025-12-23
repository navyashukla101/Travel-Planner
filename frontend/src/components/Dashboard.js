import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, past

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await API.get("/trips");
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await API.delete(`/trips/${tripId}`);
      setTrips(trips.filter((t) => t._id !== tripId));
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isActivated = (trip) => {
    const end = new Date(trip.endDate);
    return end > new Date();
  };

  let filteredTrips = trips;
  if (filter === "active") {
    filteredTrips = trips.filter((t) => !t.archived && isActivated(t));
  } else if (filter === "past") {
    filteredTrips = trips.filter((t) => t.archived || !isActivated(t));
  } else {
    filteredTrips = trips.filter((t) => !t.archived);
  }

  // Calculate dashboard stats
  const totalTrips = trips.filter((t) => !t.archived).length;
  const totalBudget = trips.reduce((sum, t) => sum + (t.totalBudget || 0), 0);
  const totalDays = trips.reduce(
    (sum, t) => sum + (t.days ? t.days.length : 0),
    0
  );

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Travel Plans</h1>
        <button
          onClick={() => navigate("/create-trip")}
          style={styles.newTripBtn}
        >
          + New Trip
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Active Trips</div>
          <div style={styles.statValue}>{totalTrips}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Days</div>
          <div style={styles.statValue}>{totalDays}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Budget</div>
          <div style={styles.statValue}>${totalBudget}</div>
        </div>
      </div>

      <div style={styles.filterRow}>
        <button
          onClick={() => setFilter("all")}
          style={{
            ...styles.filterBtn,
            ...(filter === "all" ? styles.filterBtnActive : {}),
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          style={{
            ...styles.filterBtn,
            ...(filter === "active" ? styles.filterBtnActive : {}),
          }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("past")}
          style={{
            ...styles.filterBtn,
            ...(filter === "past" ? styles.filterBtnActive : {}),
          }}
        >
          Past
        </button>
      </div>

      {filteredTrips.length > 0 ? (
        <div style={styles.tripsGrid}>
          {filteredTrips.map((trip) => {
            const destText =
              trip.destinations && trip.destinations.length
                ? trip.destinations.map((d) => d.name).join(", ")
                : trip.destination || "Unknown";

            return (
              <div key={trip._id} style={styles.tripCard}>
                <div style={styles.tripHeader}>
                  <h3 style={styles.tripTitle}>{trip.title || destText}</h3>
                  {trip.archived && (
                    <span style={styles.archivedBadge}>Archived</span>
                  )}
                </div>

                <div style={styles.tripMeta}>
                  <div style={styles.tripDestination}>{destText}</div>
                  <div style={styles.tripDates}>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </div>
                </div>

                <div style={styles.tripStats}>
                  <span style={styles.statBadge}>
                    {trip.days ? trip.days.length : 0} days
                  </span>
                  {trip.totalBudget > 0 && (
                    <span style={styles.statBadge}>${trip.totalBudget}</span>
                  )}
                  {trip.collaborators && trip.collaborators.length > 0 && (
                    <span style={styles.statBadge}>
                      👥 {trip.collaborators.length}
                    </span>
                  )}
                </div>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => navigate(`/trips/${trip._id}`)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteTrip(trip._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No trips found</p>
          <button
            onClick={() => navigate("/create-trip")}
            style={styles.newTripBtn}
          >
            Create Your First Trip
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "3rem 1.5rem",
    minHeight: "calc(100vh - 70px)",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "3rem",
  },
  title: {
    color: "#1a202c",
    fontSize: "2.5rem",
    margin: 0,
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  newTripBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "0.875rem 1.75rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "1rem",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },
  statCard: {
    background: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
    textAlign: "center",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
  },
  statLabel: {
    color: "#718096",
    fontSize: "0.95rem",
    marginBottom: "0.75rem",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    color: "#667eea",
    fontSize: "2.5rem",
    fontWeight: "700",
  },
  filterRow: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  filterBtn: {
    backgroundColor: "white",
    color: "#4a5568",
    padding: "0.65rem 1.25rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
  },
  filterBtnActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderColor: "transparent",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  },
  tripsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "2rem",
  },
  tripCard: {
    background: "white",
    borderRadius: "12px",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    padding: "1.75rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  },
  tripHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.25rem",
  },
  tripTitle: {
    color: "#1a202c",
    fontSize: "1.35rem",
    margin: 0,
    flex: 1,
    fontWeight: "700",
  },
  archivedBadge: {
    backgroundColor: "#fed7d7",
    color: "#c53030",
    padding: "0.35rem 0.85rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    marginLeft: "0.75rem",
    whiteSpace: "nowrap",
  },
  tripMeta: {
    marginBottom: "1.25rem",
  },
  tripDestination: {
    color: "#2d3748",
    fontSize: "1rem",
    marginBottom: "0.35rem",
    fontWeight: "500",
  },
  tripDates: {
    color: "#a0aec0",
    fontSize: "0.9rem",
  },
  tripStats: {
    display: "flex",
    gap: "0.65rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  statBadge: {
    background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
    color: "#1e40af",
    padding: "0.4rem 0.9rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  cardActions: {
    display: "flex",
    gap: "0.75rem",
  },
  viewBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "0.85rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  deleteBtn: {
    backgroundColor: "#fed7d7",
    color: "#c53030",
    padding: "0.85rem 1.25rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 1rem",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  emptyText: {
    color: "#718096",
    fontSize: "1.2rem",
    marginBottom: "2rem",
    fontWeight: "500",
  },
};

export default Dashboard;
