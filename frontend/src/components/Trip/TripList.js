import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";

function TripList() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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

  const deleteTrip = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await API.delete(`/trips/${id}`);
        setTrips(trips.filter((trip) => trip._id !== id));
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Trips</h1>
        <Link to="/trips/new" style={styles.createBtn}>
          + Create New Trip
        </Link>
      </div>

      <div style={styles.filterRow}>
        <button
          onClick={() => setFilter("all")}
          style={filter === "all" ? styles.filterBtnActive : styles.filterBtn}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          style={
            filter === "active" ? styles.filterBtnActive : styles.filterBtn
          }
        >
          Active
        </button>
        <button
          onClick={() => setFilter("past")}
          style={filter === "past" ? styles.filterBtnActive : styles.filterBtn}
        >
          Past
        </button>
      </div>

      {trips.length === 0 ? (
        <div style={styles.empty}>
          <p>No trips yet. Create your first trip!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {trips
            .filter((t) => {
              if (filter === "all") return true;
              return (t.status || (t.archived ? "past" : "active")) === filter;
            })
            .map((trip) => (
              <div key={trip._id} style={styles.card}>
                <h3 style={styles.destination}>
                  {trip.title ||
                    (trip.destinations &&
                      trip.destinations[0] &&
                      trip.destinations[0].name) ||
                    trip.destination}
                </h3>
                <p style={styles.dates}>
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </p>
                <p style={{ color: "#374151", marginTop: 6 }}>
                  <strong>Budget:</strong> ${trip.totalBudget || 0}
                </p>
                <div style={styles.actions}>
                  <Link to={`/trips/${trip._id}`} style={styles.viewBtn}>
                    View Details
                  </Link>
                  <button
                    onClick={() => deleteTrip(trip._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    margin: "0",
    padding: "3rem 1.5rem",
    minHeight: "calc(100vh - 70px)",
    background: "linear-gradient(135deg, #e0dccaff 0%, #fbf7f0ff 100%)",
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
    fontWeight: "700",
    margin: 0,
  },
  createBtn: {
    background: "linear-gradient(135deg, #eac766ff 0%, #a27e4bff 100%)",
    color: "white",
    padding: "0.875rem 1.75rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
    display: "inline-block",
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
    border: "1.5px solid #e2e8f0",
    padding: "0.65rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
  },
  filterBtnActive: {
    background: "linear-gradient(135deg, #e6b766ff 0%, #985d53ff 100%)",
    color: "white",
    border: "none",
    padding: "0.65rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 1rem",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    color: "#718096",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "2rem",
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  destination: {
    color: "#1a202c",
    fontSize: "1.35rem",
    marginBottom: "0.75rem",
    fontWeight: "700",
  },
  dates: {
    color: "#718096",
    marginBottom: "1rem",
    fontSize: "0.95rem",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
  },
  viewBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #e6b766ff 0%, #985d53ff 100%)",
    color: "white",
    padding: "0.85rem",
    borderRadius: "8px",
    textDecoration: "none",
    textAlign: "center",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#fed7d7",
    color: "#c53030",
    padding: "0.85rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
};
export default TripList;
