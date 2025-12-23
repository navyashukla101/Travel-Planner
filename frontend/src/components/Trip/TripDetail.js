import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, {
  editTrip,
  archiveTrip,
  reorderActivity,
  updateActivity,
  moveActivity,
  updateDay,
} from "../../utils/api";
import TripEditModal from "./TripEditModal";
import ActivityDetailModal from "./ActivityDetailModal";
import ActivityTimeline from "./ActivityTimeline";
import TripOverview from "./TripOverview";
import TripShareModal from "./TripShareModal";

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityWarnings, setActivityWarnings] = useState({});
  const [dayEdits, setDayEdits] = useState({});

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const handleDragStart = (e, activityId, sourceDayId) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ id: activityId, dayId: sourceDayId })
    );
  };

  const handleDrop = async (e, targetDayId, targetIndex) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData("text/plain");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const draggedId = parsed.id;
      const sourceDayId = parsed.dayId;
      if (!draggedId) return;

      if (sourceDayId !== targetDayId) {
        // move to target day first
        await moveActivity(draggedId, targetDayId);
      }

      // then set order
      await reorderActivity(draggedId, targetIndex);
      fetchTrip();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrip = async () => {
    try {
      const response = await API.get(`/trips/${id}`);
      setTrip(response.data);
      // initialize day edits state
      const map = {};
      if (response.data.days) {
        response.data.days.forEach((d) => {
          map[d._id] = {
            notes: d.notes || "",
            checklist: d.checklist || [],
            dailyBudget:
              typeof d.dailyBudget !== "undefined" ? d.dailyBudget : 0,
            newChecklistText: "",
          };
        });
      }
      setDayEdits(map);
      // compute activity conflicts
      const warnings = {};
      if (response.data.days) {
        response.data.days.forEach((d) => {
          const acts = (d.activities || [])
            .filter((a) => a.startTime && a.endTime)
            .map((a) => ({
              ...a,
              start: new Date(a.startTime),
              end: new Date(a.endTime),
            }));
          for (let i = 0; i < acts.length; i++) {
            for (let j = i + 1; j < acts.length; j++) {
              const a = acts[i];
              const b = acts[j];
              if (a.start < b.end && b.start < a.end) {
                warnings[a._id] = "Overlaps with another activity";
                warnings[b._id] = "Overlaps with another activity";
              }
            }
          }
        });
      }
      setActivityWarnings(warnings);
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDayEdit = (dayId, changes) => {
    setDayEdits((prev) => ({
      ...(prev || {}),
      [dayId]: { ...(prev[dayId] || {}), ...changes },
    }));
  };

  const saveDay = async (dayId) => {
    try {
      const edit = dayEdits[dayId] || {};
      await updateDay(dayId, {
        notes: edit.notes,
        checklist: edit.checklist,
        dailyBudget: Number(edit.dailyBudget) || 0,
      });
      fetchTrip();
    } catch (err) {
      console.error(err);
    }
  };

  const addChecklistItem = (dayId) => {
    const edit = dayEdits[dayId] || { checklist: [] };
    const text = (edit.newChecklistText || "").trim();
    if (!text) return;
    const next = [...(edit.checklist || []), { text, completed: false }];
    updateDayEdit(dayId, { checklist: next, newChecklistText: "" });
  };

  const toggleChecklist = (dayId, idx) => {
    const edit = dayEdits[dayId] || { checklist: [] };
    const next = (edit.checklist || []).map((it, i) =>
      i === idx ? { ...it, completed: !it.completed } : it
    );
    updateDayEdit(dayId, { checklist: next });
  };

  const removeChecklistItem = (dayId, idx) => {
    const edit = dayEdits[dayId] || { checklist: [] };
    const next = (edit.checklist || []).filter((_, i) => i !== idx);
    updateDayEdit(dayId, { checklist: next });
  };

  const addActivity = async (dayId) => {
    if (!activityTitle.trim()) return;

    try {
      const res = await API.post("/activities", {
        dayId,
        title: activityTitle,
        description: activityDescription,
      });
      // handle server overlap warning
      if (res.data && res.data.warning && res.data.activity) {
        setActivityWarnings((w) => ({
          ...(w || {}),
          [res.data.activity._id]: res.data.warning,
        }));
      }
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

  // compute trip budget spent
  const tripSpent = trip.days
    ? trip.days.reduce(
        (sum, d) =>
          sum +
          (d.activities
            ? d.activities.reduce((s, a) => s + (a.cost || 0), 0)
            : 0),
        0
      )
    : 0;

  const DayBudgetBar = ({ day, edit = {} }) => {
    const budget =
      typeof edit.dailyBudget !== "undefined"
        ? Number(edit.dailyBudget)
        : day.dailyBudget || 0;
    const spent = day.activities
      ? day.activities.reduce((s, a) => s + (a.cost || 0), 0)
      : 0;
    const percent =
      budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
    const over = budget > 0 && spent > budget;
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            marginBottom: 6,
          }}
        >
          <div>Spent: ${spent}</div>
          <div>Budget: ${budget}</div>
        </div>
        <div
          style={{
            background: "#e5e7eb",
            height: 10,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: over ? "#ef4444" : "#10b981",
            }}
          />
        </div>
        {over && (
          <div style={{ color: "#b91c1c", marginTop: 6 }}>
            Over budget for this day
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backBtn}>
        ← Back to Trips
      </button>

      <TripOverview trip={trip} />

      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>
            {trip.title ||
              (trip.destinations &&
                trip.destinations[0] &&
                trip.destinations[0].name) ||
              trip.destination}
          </h1>
          <p style={styles.subtitle}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </p>
          <div style={styles.summary}>
            <strong>Budget:</strong> ${trip.totalBudget || 0} •{" "}
            <strong>Days:</strong> {trip.days ? trip.days.length : 0}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button onClick={() => setShowEditModal(true)} style={styles.editBtn}>
            Edit Trip
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            style={styles.shareBtn}
          >
            Share
          </button>
          <button
            onClick={async () => {
              try {
                const updated = await archiveTrip(trip._id, !trip.archived);
                setTrip(updated.data);
              } catch (err) {
                console.error(err);
              }
            }}
            style={styles.archiveBtn}
          >
            {trip.archived ? "Unarchive" : "Archive"}
          </button>
        </div>
      </div>

      {showEditModal && (
        <TripEditModal
          trip={trip}
          onClose={() => setShowEditModal(false)}
          onSave={async (updates) => {
            try {
              await editTrip(trip._id, updates);
              setShowEditModal(false);
              fetchTrip();
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}
      {showShareModal && (
        <TripShareModal
          trip={trip}
          onClose={() => setShowShareModal(false)}
          onSaved={() => fetchTrip()}
        />
      )}
      {editingActivity && (
        <ActivityDetailModal
          activity={editingActivity.activity}
          days={trip.days}
          onClose={() => setEditingActivity(null)}
          onSaved={() => {
            setEditingActivity(null);
            fetchTrip();
          }}
        />
      )}

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
                  day.activities.map((activity, idx) => (
                    <div
                      key={activity._id}
                      style={styles.activityCard}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, activity._id, day._id)
                      }
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, day._id, idx)}
                    >
                      <div style={styles.activityContent}>
                        <h4 style={styles.activityTitle}>
                          {activity.title}{" "}
                          {activityWarnings[activity._id] && (
                            <span style={styles.conflictBadge}>
                              ⚠️ Conflict
                            </span>
                          )}
                        </h4>
                        {activity.description && (
                          <p style={styles.activityDesc}>
                            {activity.description}
                          </p>
                        )}
                        <div
                          style={{
                            marginTop: 6,
                            color: "#4b5563",
                            fontSize: 13,
                          }}
                        >
                          {activity.type && (
                            <span style={{ marginRight: 8 }}>
                              {activity.type}
                            </span>
                          )}
                          {activity.location && (
                            <span style={{ marginRight: 8 }}>
                              {activity.location}
                            </span>
                          )}
                          {activity.cost ? (
                            <span>• ${activity.cost}</span>
                          ) : null}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          marginLeft: 12,
                        }}
                      >
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() =>
                              setEditingActivity({ activity, dayId: day._id })
                            }
                            style={styles.editActivityBtn}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteActivity(activity._id)}
                            style={styles.deleteActivityBtn}
                          >
                            Delete
                          </button>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={async () => {
                              try {
                                await reorderActivity(
                                  activity._id,
                                  (activity.order || idx) - 1
                                );
                                fetchTrip();
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            style={styles.smallBtn}
                          >
                            ↑
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await reorderActivity(
                                  activity._id,
                                  (activity.order || idx) + 1
                                );
                                fetchTrip();
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            style={styles.smallBtn}
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={styles.noActivities}>No activities yet</p>
                )}
              </div>

              <ActivityTimeline day={day} />

              <div style={styles.dayFooter}>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <label>
                    Daily budget
                    <input
                      type="number"
                      value={
                        (dayEdits[day._id] && dayEdits[day._id].dailyBudget) ||
                        0
                      }
                      onChange={(e) =>
                        updateDayEdit(day._id, { dailyBudget: e.target.value })
                      }
                      style={{ marginLeft: 8, padding: 6, width: 120 }}
                    />
                  </label>

                  <div style={{ flex: 1 }}>
                    <DayBudgetBar day={day} edit={dayEdits[day._id]} />
                  </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <strong>Notes</strong>
                  <textarea
                    rows={3}
                    value={(dayEdits[day._id] && dayEdits[day._id].notes) || ""}
                    onChange={(e) =>
                      updateDayEdit(day._id, { notes: e.target.value })
                    }
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </div>

                <div>
                  <strong>Checklist</strong>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      placeholder="New item"
                      value={
                        (dayEdits[day._id] &&
                          dayEdits[day._id].newChecklistText) ||
                        ""
                      }
                      onChange={(e) =>
                        updateDayEdit(day._id, {
                          newChecklistText: e.target.value,
                        })
                      }
                      style={{ flex: 1, padding: 8 }}
                    />
                    <button
                      onClick={() => addChecklistItem(day._id)}
                      style={styles.saveBtn}
                    >
                      Add
                    </button>
                  </div>

                  <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                    {(
                      (dayEdits[day._id] && dayEdits[day._id].checklist) ||
                      []
                    ).map((it, idx) => (
                      <li
                        key={idx}
                        style={{
                          marginBottom: 6,
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!it.completed}
                          onChange={() => toggleChecklist(day._id, idx)}
                        />
                        <span
                          style={{
                            textDecoration: it.completed
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {it.text}
                        </span>
                        <button
                          onClick={() => removeChecklistItem(day._id, idx)}
                          style={{
                            marginLeft: "auto",
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => saveDay(day._id)}
                    style={styles.saveBtn}
                  >
                    Save Day
                  </button>
                </div>
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
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  title: {
    color: "#1f2937",
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  summary: {
    color: "#374151",
    marginTop: 6,
  },
  editBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  shareBtn: {
    backgroundColor: "#8b5cf6",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  archiveBtn: {
    backgroundColor: "#6b7280",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
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
  editActivityBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.35rem 0.6rem",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
  },
  smallBtn: {
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "0.25rem 0.5rem",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
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
  conflictBadge: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "2px 6px",
    borderRadius: 6,
    fontSize: 12,
    marginLeft: 8,
  },
  dayFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px dashed #e5e7eb",
  },
};

export default TripDetail;
