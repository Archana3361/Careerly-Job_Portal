import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CandidateSidebar from "../components/CandidateSidebar";
import ResumeUpload from "../components/ResumeUpload";

const Profile = () => {
  const { currentUser, login } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(currentUser || {});
  const [resume, setResume] = useState(null);

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <Link to="/login" className="btn-plum btn">Please log in</Link>
      </div>
    );
  }

  const profileSections = [
    { key: "name", label: "Full Name", icon: "bi-person", placeholder: "Your full name" },
    { key: "email", label: "Email", icon: "bi-envelope", placeholder: "you@email.com", type: "email" },
    { key: "phone", label: "Phone", icon: "bi-phone", placeholder: "+91 98765 43210" },
    { key: "location", label: "Location", icon: "bi-geo-alt", placeholder: "City, State" },
    { key: "headline", label: "Headline", icon: "bi-text-left", placeholder: "e.g. Frontend Developer | React | 3 years" },
    { key: "skills", label: "Skills", icon: "bi-lightning", placeholder: "React, Python, Figma (comma separated)" },
  ];

  const filled = profileSections.filter(s => form[s.key]).length;
  const completion = Math.round((filled / profileSections.length) * 100);

  const handleSave = () => {
    login({ ...currentUser, ...form });
    setEditing(false);
  };

  const missingFields = profileSections.filter(s => !form[s.key]).map(s => s.label);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      <div style={{ width: 240, flexShrink: 0 }} className="d-none d-lg-block">
        <CandidateSidebar />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "2rem 1.5rem" }}>
        <div className="mb-4">
          <span className="section-label">Your professional identity</span>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--dark)", fontSize: "1.8rem", marginBottom: 0 }}>
            Profile
          </h2>
        </div>

        <div className="row g-4">
          {/* Main profile */}
          <div className="col-lg-8">
            <div className="card-inner-section mb-4">
              <div className="d-flex align-items-start justify-content-between mb-4">
                <div className="d-flex align-items-center gap-4">
                  <div className="profile-avatar">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "Playfair Display, serif", fontWeight: 800, marginBottom: "0.25rem", color: "var(--dark)" }}>
                      {currentUser.name}
                    </h4>
                    {form.headline && (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{form.headline}</p>
                    )}
                    <div style={{ fontSize: "0.8rem", color: "var(--plum)", fontWeight: 500 }}>{currentUser.email}</div>
                  </div>
                </div>
                <button
                  className={editing ? "btn-plum btn" : "btn-outline-plum btn"}
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                  onClick={() => editing ? handleSave() : setEditing(true)}
                >
                  {editing ? (
                    <><i className="bi bi-check me-1"></i>Save Changes</>
                  ) : (
                    <><i className="bi bi-pencil me-1"></i>Edit Profile</>
                  )}
                </button>
              </div>

              <div className="row g-3">
                {profileSections.map(s => (
                  <div key={s.key} className="col-md-6">
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      <i className={`bi ${s.icon}`}></i> {s.label}
                    </label>
                    {editing ? (
                      <input
                        type={s.type || "text"}
                        className="form-control"
                        value={form[s.key] || ""}
                        onChange={e => setForm({ ...form, [s.key]: e.target.value })}
                        placeholder={s.placeholder}
                      />
                    ) : (
                      <div style={{
                        padding: "0.5rem 0.75rem",
                        background: "var(--ivory)",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border)",
                        fontSize: "0.875rem",
                        color: form[s.key] ? "var(--dark)" : "var(--text-muted)",
                        minHeight: 38
                      }}>
                        {form[s.key] || <span style={{ fontStyle: "italic" }}>Not provided</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {editing && (
                <div className="mt-3 d-flex gap-2">
                  <button className="btn-lime btn" onClick={handleSave} style={{ fontSize: "0.875rem" }}>
                    <i className="bi bi-check me-1"></i>Save Changes
                  </button>
                  <button className="btn-ghost btn" onClick={() => setEditing(false)} style={{ fontSize: "0.875rem" }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Resume */}
            <div className="card-inner-section mb-4">
              <div className="detail-section-title mb-3">Resume</div>
              <ResumeUpload value={resume} onChange={setResume} />
            </div>

            {/* Experience placeholder */}
            <div className="card-inner-section mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="detail-section-title" style={{ marginBottom: 0 }}>Work Experience</div>
                <button className="btn-ghost btn" style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }}>
                  <i className="bi bi-plus me-1"></i>Add
                </button>
              </div>
              <div style={{ textAlign: "center", padding: "2rem", background: "var(--ivory)", borderRadius: "var(--radius)", border: "1.5px dashed var(--border)" }}>
                <i className="bi bi-briefcase" style={{ fontSize: "1.8rem", color: "var(--lavender)", display: "block", marginBottom: "0.5rem" }}></i>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: 0 }}>Add your work experience to stand out</p>
              </div>
            </div>

            {/* Education placeholder */}
            <div className="card-inner-section">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="detail-section-title" style={{ marginBottom: 0 }}>Education</div>
                <button className="btn-ghost btn" style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }}>
                  <i className="bi bi-plus me-1"></i>Add
                </button>
              </div>
              <div style={{ textAlign: "center", padding: "2rem", background: "var(--ivory)", borderRadius: "var(--radius)", border: "1.5px dashed var(--border)" }}>
                <i className="bi bi-mortarboard" style={{ fontSize: "1.8rem", color: "var(--lavender)", display: "block", marginBottom: "0.5rem" }}></i>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: 0 }}>Add your educational background</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Completion */}
            <div className="card-inner-section mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--dark)" }}>Profile Strength</div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 900, color: completion === 100 ? "#198754" : "var(--plum)" }}>
                  {completion}%
                </div>
              </div>
              <div className="progress mb-3">
                <div className="progress-bar" style={{ width: `${completion}%`, background: completion === 100 ? "#198754" : undefined }}></div>
              </div>

              {missingFields.length > 0 ? (
                <>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    Complete these to improve your visibility:
                  </div>
                  {missingFields.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <i className="bi bi-circle" style={{ color: "var(--lavender)", fontSize: "0.7rem" }}></i>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{f}</span>
                    </div>
                  ))}
                  <button
                    className="btn-outline-plum btn w-100 mt-2"
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => setEditing(true)}
                  >
                    Complete Profile
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  <i className="bi bi-check-circle-fill" style={{ fontSize: "1.5rem", color: "#198754", display: "block", marginBottom: "0.5rem" }}></i>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#198754" }}>Profile Complete!</div>
                </div>
              )}
            </div>

            {/* Role badge */}
            <div className="card-inner-section">
              <div className="detail-section-title mb-2">Account Type</div>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(90,49,93,0.07)",
                borderRadius: "var(--radius)",
                padding: "0.75rem",
              }}>
                <i className="bi bi-person-badge" style={{ color: "var(--plum)", fontSize: "1.3rem" }}></i>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--dark)", textTransform: "capitalize" }}>
                    {currentUser.role}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Member since 2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
