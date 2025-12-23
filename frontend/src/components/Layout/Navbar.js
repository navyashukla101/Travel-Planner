import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          ✈️ Travel Planner
        </Link>

        <div style={styles.menu}>
          {user ? (
            <>
              <Link to="/" style={styles.link}>
                Dashboard
              </Link>
              <Link to="/profile" style={styles.link}>
                Profile
              </Link>
              <span style={styles.userName}>{user.name}</span>
              <button onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/signup" style={styles.link}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#2563eb",
    padding: "1rem 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "white",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none",
  },
  menu: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  userName: {
    color: "white",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  logoutBtn: {
    backgroundColor: "white",
    color: "#2563eb",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default Navbar;
