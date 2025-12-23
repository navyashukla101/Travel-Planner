import React, { useState, useEffect } from "react";
import { updateActivity, moveActivity } from "../../utils/api";

export default function ActivityDetailModal({
  activity,
  days,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({});
  const [targetDay, setTargetDay] = useState(activity.day);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const a = activity || {};
    const startTime = a.startTime
      ? new Date(a.startTime).toISOString().slice(11, 16)
      : "";
    const endTime = a.endTime
      ? new Date(a.endTime).toISOString().slice(11, 16)
      : "";
    setForm({
      title: a.title || "",
      description: a.description || "",
      type: a.type || "other",
      location: a.location || "",
      notes: a.notes || "",
      estimatedDurationMinutes: a.estimatedDurationMinutes || 0,
      cost: a.cost || 0,
      optional: !!a.optional,
      completed: !!a.completed,
      startTime,
      endTime,
    });
    setTargetDay(a.day || (days && days[0] && days[0]._id));
  }, [activity, days]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // construct start/end Date strings if times provided
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        location: form.location,
        notes: form.notes,
        estimatedDurationMinutes: Number(form.estimatedDurationMinutes) || 0,
        cost: Number(form.cost) || 0,
        optional: !!form.optional,
        completed: !!form.completed,
      };

      // combine date from activity's day if available
      const dayObj = days.find((d) => d._id === (activity.day || targetDay));
      if (form.startTime) {
        if (dayObj && dayObj.date)
          payload.startTime = new Date(
            `${new Date(dayObj.date).toISOString().slice(0, 10)}T${
              form.startTime
            }:00Z`
          );
        else payload.startTime = form.startTime;
      }
      if (form.endTime) {
        if (dayObj && dayObj.date)
          payload.endTime = new Date(
            `${new Date(dayObj.date).toISOString().slice(0, 10)}T${
              form.endTime
            }:00Z`
          );
        else payload.endTime = form.endTime;
      }

      const res = await updateActivity(activity._id, payload);

      // if moved day changed
      if (targetDay && targetDay !== activity.day) {
        await moveActivity(activity._id, targetDay);
      }

      // surface server warning if present
      if (res && res.data && res.data.warning) {
        alert(res.data.warning);
      }
      if (onSaved) onSaved(res.data || res);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.warning) {
        alert(err.response.data.warning);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!activity) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h3>Activity Details</h3>

        <label>
          Title
          <input
            name="title"
            value={form.title || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <label>
          Type
          <select
            name="type"
            value={form.type || "other"}
            onChange={handleChange}
          >
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="sightseeing">Sightseeing</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Location
          <input
            name="location"
            value={form.location || ""}
            onChange={handleChange}
          />
        </label>

        <label style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            Start time
            <input
              type="time"
              name="startTime"
              value={form.startTime || ""}
              onChange={handleChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            End time
            <input
              type="time"
              name="endTime"
              value={form.endTime || ""}
              onChange={handleChange}
            />
          </div>
        </label>

        <label>
          Estimated Duration (minutes)
          <input
            type="number"
            name="estimatedDurationMinutes"
            value={form.estimatedDurationMinutes || 0}
            onChange={handleChange}
          />
        </label>

        <label>
          Cost
          <input
            type="number"
            name="cost"
            value={form.cost || 0}
            onChange={handleChange}
          />
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            name="optional"
            checked={!!form.optional}
            onChange={handleChange}
          />{" "}
          Optional
          <input
            type="checkbox"
            name="completed"
            checked={!!form.completed}
            onChange={handleChange}
            style={{ marginLeft: 12 }}
          />{" "}
          Completed
        </label>

        <label>
          Move to day
          <select
            value={targetDay}
            onChange={(e) => setTargetDay(e.target.value)}
          >
            {days.map((d) => (
              <option key={d._id} value={d._id}>
                Day {d.dayNumber} - {new Date(d.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} style={styles.cancelBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: 520,
    maxWidth: "95%",
    display: "grid",
    gap: 8,
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: 4,
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: 4,
    cursor: "pointer",
  },
};
