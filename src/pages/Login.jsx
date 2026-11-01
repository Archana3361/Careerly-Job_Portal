import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const DEMO_USERS = [
  { email: "archana@demo.com", password: "demo123", name: "Archana Verma", role: "candidate" },
  { email: "admin@careerly.com", password: "admin123", name: "Admin User", role: "admin" },
];

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const stored = JSON.parse(localStorage.getItem("careerly_registered_users") || "[]");
      const allUsers = [...DEMO_USERS, ...stored];
      const user = allUsers.find(
        u => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
      );

      if (user) {
        await login(user);
        navigate(user.role === "admin" ? "/admin" : "/dashboard");
      } else {
        setError("Invalid email or password. Try: archana@demo.com / demo123");
      }
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="auth-card">
              <div className="text-center mb-4">
                <Link to="/" className="auth-header-brand text-decoration-none d-block mb-3">
                  Career<span>ly</span>
                </Link>
                <h4 style={{ fontFamily: "Playfair Display, serif", fontWeight: 800, color: "var(--dark)", marginBottom: "0.35rem" }}>
                  Welcome back
                </h4>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Sign in to continue to your account</p>
              </div>

              {error && (
                <div style={{ background: "rgba(220,53,69,0.08)", border: "1px solid rgba(220,53,69,0.2)", borderRadius: "var(--radius)", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#dc3545", marginBottom: "1rem" }}>
                  <i className="bi bi-exclamation-circle me-2"></i>{error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Your password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-lime btn w-100" disabled={loading} style={{ padding: "0.7rem" }}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  Sign In
                </button>
              </form>

              <p className="text-center mt-4" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "var(--plum)", fontWeight: 600, textDecoration: "none" }}>
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
