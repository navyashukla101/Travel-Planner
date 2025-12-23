import React, { useState, useEffect, useContext } from "react";
import { getProfile, updateProfile } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
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

  if (loading) return <div>Loading profile...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>Profile Settings</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          Name
          <input
            name="name"
            value={profile.name || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            name="email"
            value={profile.email || ""}
            onChange={handleChange}
            disabled
          />
        </label>

        <label>
          Travel Style
          <select
            name="travelStyle"
            value={profile.travelStyle || "relaxed"}
            onChange={handleChange}
          >
            <option value="relaxed">Relaxed</option>
            <option value="packed">Packed</option>
            <option value="adventure">Adventure</option>
          </select>
        </label>

        <label>
          Budget Preference
          <select
            name="budgetPreference"
            value={profile.budgetPreference || "medium"}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Notes
          <textarea
            name="profileNotes"
            value={profile.profileNotes || ""}
            onChange={handleChange}
            rows={4}
          />
        </label>

        <label>
          Preferences (JSON)
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
            rows={6}
          />
        </label>

        <div>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
