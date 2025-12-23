import React, { useState } from "react";
import API from "../../utils/api";

function TripShareModal({ trip, onClose, onSaved }) {
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaborators, setCollaborators] = useState(trip.collaborators || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addCollaborator = async () => {
    if (!collaboratorEmail.trim()) {
      setError("Email required");
      return;
    }

    // Basic email validation
    if (!collaboratorEmail.includes("@")) {
      setError("Invalid email");
      return;
    }

    // Check if already added
    if (collaborators.find((c) => c.email === collaboratorEmail)) {
      setError("Already added");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const updated = await API.patch(`/trips/${trip._id}/collaborators`, {
        action: "add",
        email: collaboratorEmail,
      });
      setCollaborators(updated.data.collaborators || []);
      setCollaboratorEmail("");
      setSuccess("Collaborator added!");
      setTimeout(() => setSuccess(""), 2000);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add collaborator");
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (email) => {
    setLoading(true);
    setError("");
    try {
      const updated = await API.patch(`/trips/${trip._id}/collaborators`, {
        action: "remove",
        email,
      });
      setCollaborators(updated.data.collaborators || []);
      setSuccess("Collaborator removed");
      setTimeout(() => setSuccess(""), 2000);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove collaborator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Share Trip</h2>

        <div style={styles.section}>
          <label style={styles.label}>Invite Collaborator</label>
          <div style={styles.inputRow}>
            <input
              type="email"
              placeholder="user@example.com"
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCollaborator()}
              style={styles.input}
              disabled={loading}
            />
            <button
              onClick={addCollaborator}
              style={styles.addBtn}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}
        </div>

        <div style={styles.section}>
          <label style={styles.label}>
            Collaborators ({collaborators.length})
          </label>
          {collaborators.length > 0 ? (
            <div style={styles.collaboratorList}>
              {collaborators.map((collab) => (
                <div key={collab.email} style={styles.collaboratorItem}>
                  <div>
                    <div style={styles.collaboratorName}>
                      {collab.name || collab.email}
                    </div>
                    <div style={styles.collaboratorEmail}>{collab.email}</div>
                    <div style={styles.collaboratorRole}>
                      {collab.role || "Viewer"}
                    </div>
                  </div>
                  <button
                    onClick={() => removeCollaborator(collab.email)}
                    style={styles.removeBtn}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noCollaborators}>No collaborators yet</p>
          )}
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.closeBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "2rem",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  title: {
    color: "#1f2937",
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
  },
  section: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  inputRow: {
    display: "flex",
    gap: "0.5rem",
  },
  input: {
    flex: 1,
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  addBtn: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
  },
  error: {
    color: "#dc2626",
    marginTop: "0.5rem",
    fontSize: "0.875rem",
  },
  success: {
    color: "#059669",
    marginTop: "0.5rem",
    fontSize: "0.875rem",
  },
  collaboratorList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  collaboratorItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "4px",
    border: "1px solid #e5e7eb",
  },
  collaboratorName: {
    fontWeight: "600",
    color: "#1f2937",
  },
  collaboratorEmail: {
    color: "#6b7280",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
  collaboratorRole: {
    color: "#9ca3af",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
  },
  removeBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
  noCollaborators: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
  footer: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
    marginTop: "1.5rem",
  },
  closeBtn: {
    backgroundColor: "#6b7280",
    color: "white",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default TripShareModal;
