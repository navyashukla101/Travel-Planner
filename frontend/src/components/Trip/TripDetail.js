import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(null);
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] = useState("");

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await API.get(`/trips/${id}`);
      setTrip(response.data);
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (dayId) => {
    if (!activityTitle.trim()) return;

    try {
      await API.post("/activities", {
        dayId,
        title: activityTitle,
        description: activityDescription,
      });
      setActivityTitle("");
      setActivityDescription("");
      setShowForm(null);
      fetchTrip();
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const deleteActivity = async (activityId) => {
    if (window.confirm("Delete this activity?")) {
      try {
        await API.delete(`/activities/${activityId}`);
        fetchTrip();
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (!trip) {
    return <div style={styles.container}>Trip not found</div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backBtn}>
        ← Back to Trips
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>{trip.destination}</h1>
        <p style={styles.subtitle}>
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
      </div>

      <div style={styles.days}>
        {trip.days &&
          trip.days.map((day) => (
            <div key={day._id} style={styles.dayCard}>
              <div style={styles.dayHeader}>
                <h3 style={styles.dayTitle}>
                  Day {day.dayNumber} - {formatDate(day.date)}
                </h3>
                <button
                  onClick={() =>
                    setShowForm(showForm === day._id ? null : day._id)
                  }
                  style={styles.addBtn}
                >
                  + Add Activity
                </button>
              </div>

              {showForm === day._id && (
                <div style={styles.activityForm}>
                  <input
                    type="text"
                    placeholder="Activity title"
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    style={styles.input}
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={activityDescription}
                    onChange={(e) => setActivityDescription(e.target.value)}
                    style={styles.textarea}
                    rows="3"
                  />
                  <div style={styles.formButtons}>
                    <button
                      onClick={() => addActivity(day._id)}
                      style={styles.saveBtn}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(null);
                        setActivityTitle("");
                        setActivityDescription("");
                      }}
                      style={styles.cancelFormBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div style={styles.activities}>
                {day.activities && day.activities.length > 0 ? (
                  day.activities.map((activity) => (
                    <div key={activity._id} style={styles.activityCard}>
                      <div style={styles.activityContent}>
                        <h4 style={styles.activityTitle}>{activity.title}</h4>
                        {activity.description && (
                          <p style={styles.activityDesc}>
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteActivity(activity._id)}
                        style={styles.deleteActivityBtn}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={styles.noActivities}>No activities yet</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem",
  },
  backBtn: {
    backgroundColor: "#6b7280",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "1.5rem",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    color: "#1f2937",
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1.125rem",
  },
  days: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  dayCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
  },
  dayHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e5e7eb",
  },
  dayTitle: {
    color: "#1f2937",
    fontSize: "1.25rem",
  },
  addBtn: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
  activityForm: {
    backgroundColor: "#f9fafb",
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    marginBottom: "0.5rem",
    fontSize: "1rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    fontFamily: "inherit",
    resize: "vertical",
  },
  formButtons: {
    display: "flex",
    gap: "0.5rem",
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelFormBtn: {
    backgroundColor: "#6b7280",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  activities: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  activityCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "4px",
    border: "1px solid #e5e7eb",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: "#1f2937",
    fontSize: "1rem",
    marginBottom: "0.25rem",
  },
  activityDesc: {
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  deleteActivityBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "0.375rem 0.75rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.75rem",
  },
  noActivities: {
    color: "#9ca3af",
    fontStyle: "italic",
    padding: "1rem",
    textAlign: "center",
  },
};

export default TripDetail;
