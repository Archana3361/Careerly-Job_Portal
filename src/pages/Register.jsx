import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const user = { name: form.name, email: form.email, password: form.password, role: form.role };
    const stored = JSON.parse(localStorage.getItem("careerly_registered_users") || "[]");
    localStorage.setItem("careerly_registered_users", JSON.stringify([...stored, user]));

    await register(user);
    navigate(form.role === "admin" ? "/admin" : "/dashboard");
  };

  const set = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
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
                  Create your account
                </h4>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Join thousands of professionals finding great work</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Account type */}
                <div className="mb-4">
                  <label className="form-label">I am a</label>
                  <div className="d-flex gap-3">
                    {[
                      { val: "candidate", label: "Job Seeker", icon: "bi-person" },
                      { val: "admin", label: "Admin / Employer", icon: "bi-building" },
                    ].map(opt => (
                      <div
                        key={opt.val}
                        onClick={() => set("role", opt.val)}
                        style={{
                          flex: 1,
                          border: `2px solid ${form.role === opt.val ? "var(--plum)" : "var(--border)"}`,
                          borderRadius: "var(--radius-lg)",
                          padding: "1rem",
                          cursor: "pointer",
                          textAlign: "center",
                          background: form.role === opt.val ? "rgba(90,49,93,0.05)" : "var(--ivory)",
                          transition: "all 0.2s",
                        }}
                      >
                        <i className={`bi ${opt.icon}`} style={{ fontSize: "1.3rem", color: form.role === opt.val ? "var(--plum)" : "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}></i>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: form.role === opt.val ? "var(--plum)" : "var(--dark)" }}>{opt.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={e => set("confirmPassword", e.target.value)}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn-lime btn w-100" style={{ padding: "0.7rem" }}>
                  Create Account
                </button>
              </form>

              <p className="text-center mt-4" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "var(--plum)", fontWeight: 600, textDecoration: "none" }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
