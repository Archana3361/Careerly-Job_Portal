import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import AdminSidebar from "../components/AdminSidebar";
import { jobs } from "../data/jobs";

const AdminDashboard = () => {
  const { applications, currentUser } = useApp();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="container py-5 text-center">
        <h4>Access denied.</h4>
        <Link to="/login" className="btn-plum btn mt-3">Log In as Admin</Link>
      </div>
    );
  }

  const stats = [
    { label: "Total Jobs", value: jobs.length, icon: "bi-briefcase", color: "#5A315D" },
    { label: "Active Jobs", value: jobs.filter(j => j.featured).length, icon: "bi-lightning", color: "#2E6B5E" },
    { label: "Applications", value: applications.length, icon: "bi-file-earmark-person", color: "#1D4E7A" },
    { label: "Shortlisted", value: applications.filter(a => a.status === "Shortlisted").length, icon: "bi-star", color: "#9B4F2D" },
    { label: "Interviews", value: applications.filter(a => a.status === "Interview").length, icon: "bi-camera-video", color: "#3D2C6B" },
  ];

  const recentApps = applications.slice(0, 5);
  const topJobs = jobs.slice(0, 5);

  const statusColors = {
    Applied: "rgba(90,49,93,0.12)", "Under Review": "rgba(255,193,7,0.15)",
    Shortlisted: "rgba(25,135,84,0.12)", Interview: "rgba(13,202,240,0.12)",
    Selected: "rgba(200,230,74,0.25)", Rejected: "rgba(220,53,69,0.1)"
  };
  const statusTextColors = {
    Applied: "var(--plum)", "Under Review": "#856404",
    Shortlisted: "#198754", Interview: "#0a5c6e",
    Selected: "#4a5c00", Rejected: "#dc3545"
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      <div style={{ width: 240, flexShrink: 0 }} className="d-none d-lg-block">
        <AdminSidebar />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "2rem 1.5rem" }}>
        <div className="mb-4">
          <span className="section-label">Admin overview</span>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--dark)", fontSize: "1.8rem", marginBottom: 0 }}>
            Dashboard
          </h2>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map(s => (
            <div key={s.label} className="col-6 col-lg">
              <div className="stat-card text-center">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem" }}>
                  <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: "1.2rem" }}></i>
                </div>
                <div className="stat-card-number">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Recent Applications */}
          <div className="col-lg-7">
            <div className="card-inner-section">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--dark)" }}>Recent Applications</div>
                <Link to="/admin/applications" className="view-all-link">View all <i className="bi bi-arrow-right"></i></Link>
              </div>

              {recentApps.map(app => (
                <div key={app.id} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.75rem 0", borderBottom: "1px solid var(--border)"
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "var(--plum)", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.8rem", flexShrink: 0
                  }}>
                    {(app.fullName || "C").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {app.fullName || "Candidate"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {app.jobTitle} · {app.company}
                    </div>
                  </div>
                  <span style={{
                    background: statusColors[app.status] || "var(--ivory)",
                    color: statusTextColors[app.status] || "var(--dark)",
                    fontSize: "0.68rem", fontWeight: 700, padding: "0.25rem 0.6rem",
                    borderRadius: 50, textTransform: "uppercase", letterSpacing: "0.04em",
                    whiteSpace: "nowrap"
                  }}>
                    {app.status}
                  </span>
                </div>
              ))}

              {recentApps.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "2rem" }}>
                  No applications yet.
                </p>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="col-lg-5">
            {/* Application Activity */}
            <div className="card-inner-section mb-4">
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--dark)", marginBottom: "1rem" }}>Application Activity</div>
              {[
                { label: "Applied", count: applications.filter(a => a.status === "Applied").length, max: applications.length },
                { label: "Under Review", count: applications.filter(a => a.status === "Under Review").length, max: applications.length },
                { label: "Shortlisted", count: applications.filter(a => a.status === "Shortlisted").length, max: applications.length },
                { label: "Interview", count: applications.filter(a => a.status === "Interview").length, max: applications.length },
              ].map(item => (
                <div key={item.label} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: "0.8rem", color: "var(--dark)" }}>{item.label}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--plum)" }}>{item.count}</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: item.max ? `${(item.count / item.max) * 100}%` : "0%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Jobs */}
            <div className="card-inner-section">
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--dark)", marginBottom: "1rem" }}>Top Performing Jobs</div>
              {topJobs.map((job, i) => (
                <div key={job.id} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.6rem 0", borderBottom: i < topJobs.length - 1 ? "1px solid var(--border)" : "none"
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: "var(--ivory)", color: "var(--plum)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "0.75rem", border: "1px solid var(--border)"
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{job.company}</div>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--plum)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {job.featured ? "Featured" : "Active"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
