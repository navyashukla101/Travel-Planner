import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AIChat from "../AIChat";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showAI, setShowAI] = useState(false);

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to={user ? "/dashboard" : "/"} style={styles.logo}>
          <span style={styles.logoIcon}>✈️</span>
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
                🤖
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
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "0.75rem 0",
    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.15)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "white",
    fontSize: "1.4rem",
    fontWeight: "700",
    textDecoration: "none",
    transition: "opacity 0.3s ease",
  },
  logoIcon: {
    fontSize: "1.8rem",
  },
  logoText: {
    letterSpacing: "0.5px",
  },
  menu: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  userName: {
    color: "white",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  signupLink: {
    color: "white",
    textDecoration: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "1.5px solid rgba(255, 255, 255, 0.5)",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  logoutBtn: {
    backgroundColor: "white",
    color: "#667eea",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  aiBtn: {
    background: "white",
    border: "none",
    padding: "0.45rem 0.65rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  aiPanel: {
    position: "fixed",
    right: 20,
    bottom: 20,
    width: 360,
    maxWidth: "calc(100% - 40px)",
    background: "white",
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
