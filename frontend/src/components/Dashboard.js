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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    color: "#1f2937",
    fontSize: "2rem",
    margin: 0,
  },
  newTripBtn: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "0.875rem",
    marginBottom: "0.5rem",
  },
  statValue: {
    color: "#1f2937",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  filterRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  filterBtn: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    padding: "0.5rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  filterBtnActive: {
    backgroundColor: "#2563eb",
    color: "white",
    borderColor: "#2563eb",
  },
  tripsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  tripCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    padding: "1.5rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "pointer",
  },
  tripHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  tripTitle: {
    color: "#1f2937",
    fontSize: "1.25rem",
    margin: 0,
    flex: 1,
  },
  archivedBadge: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    marginLeft: "0.5rem",
    whiteSpace: "nowrap",
  },
  tripMeta: {
    marginBottom: "1rem",
  },
  tripDestination: {
    color: "#374151",
    fontSize: "0.95rem",
    marginBottom: "0.25rem",
  },
  tripDates: {
    color: "#9ca3af",
    fontSize: "0.875rem",
  },
  tripStats: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  statBadge: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  cardActions: {
    display: "flex",
    gap: "0.5rem",
  },
  viewBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.75rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 1rem",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: "1.125rem",
    marginBottom: "1.5rem",
  },
};

export default Dashboard;
