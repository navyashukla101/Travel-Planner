import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const destinations = [
    {
      name: "Eiffel Tower, Paris",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
      description: "Experience the charm of Paris",
    },
    {
      name: "Great Wall, China",
      image:
        "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop",
      description: "Explore ancient wonders",
    },
    {
      name: "Statue of Liberty, USA",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      description: "Discover American heritage",
    },
    {
      name: "Taj Mahal, India",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada",
      description: "Marvel at timeless beauty",
    },
  ];

  const pins = [
    { top: "28%", left: "42%", color: "#CFA14A" },
    { top: "36%", left: "62%", color: "#3F2B7A" },
    { top: "56%", left: "24%", color: "#CFA14A" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* LEFT — untouched */}
        <div style={styles.leftSection}>
          <h2 style={styles.mainTitle}>Explore the World</h2>
          <p style={styles.subtitle}>
            Plan your next adventure with ease. Discover amazing destinations
            and create unforgettable memories.
          </p>

          <div style={styles.destinationsGrid}>
            {destinations.map((dest, idx) => (
              <div key={idx} style={styles.destCard}>
                <img
                  src={dest.image}
                  alt={dest.name}
                  style={styles.destImage}
                />
                <div style={styles.destInfo}>
                  <h3 style={styles.destName}>{dest.name}</h3>
                  <p style={styles.destDescription}>{dest.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.ctaButtons}>
            {!user && (
              <button
                onClick={() => navigate("/signup")}
                style={styles.primaryBtn}
              >
                Get Started
              </button>
            )}

            {!user ? (
              <button
                onClick={() => navigate("/login")}
                style={styles.secondaryBtn}
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                style={styles.secondaryBtn}
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — fixed */}
        <div style={styles.rightSection}>
          <div style={styles.mapWrapper}>
            <img
              src="/assets/worldmap01.png"
              alt="World map"
              style={styles.worldImage}
            />

            {/* Fade towards content */}
            <div style={styles.mapGradient} />

            {pins.map((p, i) => (
              <div
                key={i}
                style={{
                  ...styles.pin,
                  top: p.top,
                  left: p.left,
                  backgroundColor: p.color,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 70px)",
    background: "rgba(234, 226, 214, 1)",
  },

  content: {
    display: "flex",
    maxWidth: "2000px",
    margin: "0 auto",
    height: "calc(100vh - 40px)",
  },

  leftSection: {
    flex: 3,
    padding: "80px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#111",
    overflowY: "hidden",
  },

  /* ✅ FULL HEIGHT RIGHT SIDE */
  rightSection: {
    flex: 2,
    padding: 0,
    height: "100%",
  },

  /* ✅ MAP FILLS RIGHT SIDE */
  mapWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden", 
  },

  /* ✅ MAP FILLS ENTIRE AREA */
  worldImage: {
    position: "absolute",
    inset: 0,
    width: "110%",
    height: "100%",
    objectFit: "cover",
    zIndex: 1,
  },

  /* ✅ FADE TOWARDS LEFT (CONTENT SIDE) */
  mapGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "50%",
    zIndex: 2,
    pointerEvents: "none",
    background:
      "linear-gradient(to right, rgba(234,226,214,1) 0%, rgba(234,226,214,0.85) 25%, rgba(234,226,214,0) 100%)",
  },


  mainTitle: {
    fontSize: "2.0rem",
    fontFamily: "'Playfair Display', serif",
    color: "#291804ff",
    
  },

  subtitle: {
    fontSize: "1.1rem",
    marginBottom: "2rem",
  },

  destinationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
  },

  destCard: {
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(20,20,20,0.06)",
  },

  destImage: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
  },

  destInfo: {
    background: "white",
    padding: "14px",
  },

  destName: {
    fontSize: "0.95rem",
    fontWeight: "700",
  },

  destDescription: {
    fontSize: "0.85rem",
    color: "#555",
  },

  ctaButtons: {
    display: "flex",
    gap: "1rem",
  },

  primaryBtn: {
    backgroundColor: "#111",
    color: "white",
    padding: "12px 28px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },

  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#111",
    border: "1px solid #000000ff",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default HomePage;
