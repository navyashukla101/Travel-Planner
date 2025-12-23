import React, { useState } from "react";

export default function TripEditModal({ trip, onClose, onSave }) {
  const [title, setTitle] = useState(
    trip.title ||
      (trip.destinations &&
        trip.destinations[0] &&
        trip.destinations[0].name) ||
      ""
  );
  const [destInput, setDestInput] = useState(
    trip.destinations && trip.destinations.length
      ? trip.destinations.map((d) => d.name).join(", ")
      : trip.destination || ""
  );
  const [startDate, setStartDate] = useState(
    trip.startDate ? new Date(trip.startDate).toISOString().slice(0, 10) : ""
  );
  const [endDate, setEndDate] = useState(
    trip.endDate ? new Date(trip.endDate).toISOString().slice(0, 10) : ""
  );
  const [totalBudget, setTotalBudget] = useState(trip.totalBudget || 0);
  const [status, setStatus] = useState(trip.status || "active");

  const handleSave = () => {
    const destinations = destInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    onSave({
      title,
      destinations,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      totalBudget: Number(totalBudget) || 0,
      status,
    });
  };

  return (
    <div style={modalStyles.backdrop}>
      <div style={modalStyles.modal}>
        <h3>Edit Trip</h3>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Destinations (comma separated)
          <input
            value={destInput}
            onChange={(e) => setDestInput(e.target.value)}
          />
        </label>

        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <label>
          Total Budget
          <input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
          />
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="past">Past</option>
          </select>
        </label>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={handleSave} style={modalStyles.saveBtn}>
            Save
          </button>
          <button onClick={onClose} style={modalStyles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const modalStyles = {
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
    width: 480,
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
