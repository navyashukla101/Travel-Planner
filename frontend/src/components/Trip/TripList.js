import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await API.get('/trips');
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await API.delete(`/trips/${id}`);
        setTrips(trips.filter(trip => trip._id !== id));
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

      {trips.length === 0 ? (
        <div style={styles.empty}>
          <p>No trips yet. Create your first trip!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {trips.map((trip) => (
            <div key={trip._id} style={styles.card}>
              <h3 style={styles.destination}>{trip.destination}</h3>
              <p style={styles.dates}>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
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
  },
  createBtn: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
  },
  destination: {
    color: "#1f2937",
    fontSize: "1.25rem",
    marginBottom: "0.5rem",
  },
  dates: {
    color: "#6b7280",
    marginBottom: "1rem",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  viewBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.5rem",
    borderRadius: "4px",
    textDecoration: "none",
    textAlign: "center",
    fontSize: "0.875rem",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    color: "white",
    padding: "0.5rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
};
export default TripList;