import React, { useState, useEffect, useContext } from "react";
import { getProfile, updateProfile } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const { updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await getProfile();
        if (mounted) {
          setProfile(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await updateProfile(profile);
      // update context and localStorage
      if (updateUser) updateUser(res.data);
      else localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading profile...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Profile Settings</h2>
        <p style={styles.subtitle}>
          Manage your account preferences and information
        </p>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              style={styles.input}
              placeholder="Your name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email (Read-only)</label>
            <input
              name="email"
              value={profile.email || ""}
              onChange={handleChange}
              disabled
              style={styles.inputDisabled}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Travel Style</label>
            <select
              name="travelStyle"
              value={profile.travelStyle || "relaxed"}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="relaxed">Relaxed</option>
              <option value="packed">Packed</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Budget Preference</label>
            <select
              name="budgetPreference"
              value={profile.budgetPreference || "medium"}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
            <label style={styles.label}>Travel Notes</label>
            <textarea
              name="profileNotes"
              value={profile.profileNotes || ""}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Add notes about your travel preferences..."
              rows={4}
            />
          </div>

          {/* <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
            <label style={styles.label}>Preferences (JSON)</label>
            <textarea
              name="preferences"
              value={
                profile.preferences
                  ? JSON.stringify(profile.preferences, null, 2)
                  : "{}"
              }
              onChange={(e) => {
                try {
                  const obj = JSON.parse(e.target.value);
                  setProfile((p) => ({ ...p, preferences: obj }));
                } catch (err) {
                  // ignore parse errors until save
                  setProfile((p) => ({ ...p, preferences: e.target.value }));
                }
              }}
              style={styles.textarea}
              rows={6}
            />
          </div> */}
        </div>

        <div style={styles.actionRow}>
          <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "3rem 1.5rem",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "calc(100vh - 70px)",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.2rem",
    color: "#1a202c",
    fontWeight: "700",
    margin: 0,
  },
  subtitle: {
    color: "#718096",
    fontSize: "1rem",
    marginTop: "0.5rem",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "2.5rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
  },
  label: {
    fontWeight: "600",
    color: "#2d3748",
    fontSize: "0.95rem",
  },
  input: {
    padding: "0.9rem 1rem",
    border: "1.5px solid #cbd5e0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },
  inputDisabled: {
    padding: "0.9rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#f7fafc",
    color: "#a0aec0",
    fontFamily: "inherit",
    cursor: "not-allowed",
  },
  select: {
    padding: "0.9rem 1rem",
    border: "1.5px solid #cbd5e0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    backgroundColor: "white",
    cursor: "pointer",
  },
  textarea: {
    padding: "0.9rem 1rem",
    border: "1.5px solid #cbd5e0",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    resize: "vertical",
  },
  actionRow: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
  },
  saveBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "0.9rem 2rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
  },
  error: {
    backgroundColor: "#fed7d7",
    color: "#9b2c2c",
    padding: "1rem 1.25rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontWeight: "500",
    border: "1px solid #fc8181",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 70px)",
    fontSize: "1.2rem",
    color: "#667eea",
  },
};
