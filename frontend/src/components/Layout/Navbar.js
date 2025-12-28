import React, { useContext, useState } from "react";
import { Link, UNSAFE_WithHydrateFallbackProps } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AIChat from "../AIChat";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showAI, setShowAI] = useState(false);

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to={user ? "/dashboard" : "/"} style={styles.logo}>
          <img src="/assets/logo01.png" alt="Logo" style={styles.logoIcon} />{" "}
          <span style={styles.logoText}>Travel Planner</span>
        </Link>

        <div style={styles.menu}>
          {user ? (
            <>
              <Link to="/" style={styles.link}>
                Home
              </Link>
              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>
              <Link to="/trips" style={styles.link}>
                My Trips
              </Link>
              <Link to="/profile" style={styles.link}>
                Profile
              </Link>
              <span style={styles.userName}>{user.name}</span>
              <button onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
              <button
                onClick={() => setShowAI((s) => !s)}
                style={styles.aiBtn}
                title="Open AI Assistant for general queries"
              >
                <img
                  src="/assets/ailogo01.png"
                  alt="AI Assistant"
                  style={styles.aiIcon}
                />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/signup" style={styles.signupLink}>
                Get Started
              </Link>
              {/* AI button removed for unauthenticated users */}
            </>
          )}
        </div>
      </div>

      {user && showAI && (
        <div style={styles.aiPanel} onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <strong style={{ color: "#111" }}>AI Travel Assistant</strong>
            <button onClick={() => setShowAI(false)} style={styles.closeBtn}>
              ✖
            </button>
          </div>
          <AIChat />
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "rgba(176, 156, 123, 1)",
    padding: "0.5rem 0",
    boxShadow: "0 1px 0 rgba(16,24,40,0.04)",
    borderBottom: "3px solid #392e23ff",
    position: "sticky",
    top: 0,
    marginBottom: "0.07rem",
    zIndex: 100,
  },
  container: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "0 1.2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "50px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#111",
    fontSize: "1.25rem",
    fontWeight: "700",
    textDecoration: "none",
    transition: "opacity 0.8s ease",
  },
  logoIcon: {
    width: "120px",
    height: "160px",
    objectFit: "contain",
    backgroundColor: "transparent",
  },
  logoText: {
    letterSpacing: "0.5px",
    fontFamily: "'Playfair Display', serif",
    color: "#111",
  },
  menu: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  userName: {
    color: "#333",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  link: {
    color: "#333",
    textDecoration: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    border: "2px solid #000000ff",
    transition: "all 0.15s ease",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  signupLink: {
    color: "#111",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    backgroundColor: "transparent",
    borderRadius: "8px",
    border: "2px solid #000000ff",
    transition: "all 0.15s ease",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    color: "#111",
    border: "1px solid #000000ff",
    padding: "0.45rem 0.9rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.15s ease",
    fontSize: "0.9rem",
  },
  aiBtn: {
    background: "transparent",
    border: "1px solid #000000ff",
    padding: "0.11rem 0.55rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.5rem",
  },
  aiIcon: {
    width: "30px",
    height: "30px",
    objectFit: "full",
    pointerEvents: "none",
  },

  aiPanel: {
    position: "fixed",
    right: 20,
    bottom: 20,
    width: 360,
    maxWidth: "calc(100% - 40px)",
    background: "rgba(176, 156, 123, 1)",
    padding: 12,
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(15, 23, 42, 0.2)",
    zIndex: 2000,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Navbar;
