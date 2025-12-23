import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // The homepage now uses a video preview instead of a Three.js globe.
  // Place your video at `public/videos/animation.mp4` (see QUICKSTART.md)

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

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.leftSection}>
          <h1 style={styles.mainTitle}>Explore the World</h1>
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
                <div style={styles.destOverlay}>
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

        <div style={styles.rightSection}>
          <div style={styles.lottieContainer}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
              alt="World map"
              style={styles.worldImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 70px)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "0",
    marginTop: "0",
  },
  content: {
    display: "flex",
    maxWidth: "1400px",
    margin: "0 auto",
    height: "calc(100vh - 70px)",
  },
  leftSection: {
    flex: 1,
    padding: "40px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "white",
    overflowY: "auto",
  },
  rightSection: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: "3.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  subtitle: {
    fontSize: "1.3rem",
    marginBottom: "2rem",
    lineHeight: "1.6",
    opacity: "0.95",
  },
  destinationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
  },
  destCard: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    height: "150px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  destImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  destOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "1rem",
    transition: "background-color 0.3s ease",
  },
  destName: {
    margin: "0",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "white",
  },
  destDescription: {
    margin: "0.25rem 0 0 0",
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.9)",
  },
  ctaButtons: {
    display: "flex",
    gap: "1rem",
  },
  primaryBtn: {
    backgroundColor: "white",
    color: "#667eea",
    border: "none",
    padding: "12px 32px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    padding: "10px 30px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  videoContainer: {
    width: "100%",
    height: "500px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    overflow: "hidden",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  lottieContainer: {
    width: "100%",
    height: "500px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    overflow: "hidden",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  worldImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    filter: "brightness(1.05) contrast(1.02)",
  },
  globeText: {
    marginTop: "1rem",
    textAlign: "center",
    color: "white",
    fontSize: "0.95rem",
    opacity: "0.8",
  },
};

export default HomePage;
