import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign Up</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem",
  },
  card: {
    backgroundColor: "white",
    padding: "3rem 2.5rem",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#1a202c",
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  inputGroup: {
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
  button: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "1rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.05rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "0.75rem",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
  },
  error: {
    backgroundColor: "#fed7d7",
    color: "#9b2c2c",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    marginTop: "1.5rem",
    color: "#718096",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Signup;
