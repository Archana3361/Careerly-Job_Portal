import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import AdminSidebar from "../components/AdminSidebar";

const statusColors = {
  Applied: { bg: "rgba(90,49,93,0.1)", color: "var(--plum)" },
  "Under Review": { bg: "rgba(255,193,7,0.15)", color: "#856404" },
  Shortlisted: { bg: "rgba(25,135,84,0.12)", color: "#198754" },
  Interview: { bg: "rgba(13,202,240,0.12)", color: "#0a5c6e" },
  Selected: { bg: "rgba(200,230,74,0.25)", color: "#4a5c00" },
  Rejected: { bg: "rgba(220,53,69,0.1)", color: "#dc3545" },
};

const AdminApplications = () => {
  const { applications, currentUser } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="container py-5 text-center">
        <Link to="/login" className="btn-plum btn">Access Denied</Link>
      </div>
    );
  }

  const filtered = applications.filter(app => {
    const matchSearch = !search ||
      (app.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ["All", "Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"];

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      <div style={{ width: 240, flexShrink: 0 }} className="d-none d-lg-block">
        <AdminSidebar />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "2rem 1.5rem" }}>
        <div className="mb-4">
          <span className="section-label">Candidate pipeline</span>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--dark)", fontSize: "1.8rem", marginBottom: 0 }}>
            All Applications
          </h2>
        </div>

        {/* Filters */}
        <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: 280, background: "white" }}
            placeholder="Search candidate, job, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="d-flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button
                key={s}
                className={`pill-filter ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table — desktop */}
        <div className="card-inner-section d-none d-md-block" style={{ padding: 0, overflow: "hidden" }}>
          <table className="admin-table w-100">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job</th>
                <th>Applied Date</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                    No applications found.
                  </td>
                </tr>
              ) : (
                filtered.map(app => {
                  const sc = statusColors[app.status] || { bg: "var(--ivory)", color: "var(--dark)" };
                  return (
                    <tr key={app.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "var(--plum)", color: "white",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "0.8rem", flexShrink: 0
                          }}>
                            {(app.fullName || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--dark)" }}>
                              {app.fullName || "Candidate"}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{app.email || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--dark)" }}>{app.jobTitle}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--plum)" }}>{app.company}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{app.appliedDate}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.82rem", color: "var(--dark)" }}>{app.experience || "—"}</span>
                      </td>
                      <td>
                        <span style={{
                          background: sc.bg, color: sc.color,
                          fontSize: "0.68rem", fontWeight: 700, padding: "0.3rem 0.75rem",
                          borderRadius: 50, textTransform: "uppercase", letterSpacing: "0.04em"
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-plum btn"
                          style={{ fontSize: "0.75rem", padding: "0.3rem 0.8rem" }}
                          onClick={() => navigate(`/admin/applications/${app.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="d-md-none d-flex flex-column gap-3">
          {filtered.map(app => {
            const sc = statusColors[app.status] || { bg: "var(--ivory)", color: "var(--dark)" };
            return (
              <div key={app.id} className="card-inner-section">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--dark)" }}>
                      {app.fullName || "Candidate"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--plum)", fontWeight: 500 }}>{app.jobTitle}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{app.appliedDate}</div>
                  </div>
                  <span style={{
                    background: sc.bg, color: sc.color,
                    fontSize: "0.65rem", fontWeight: 700, padding: "0.25rem 0.6rem",
                    borderRadius: 50, textTransform: "uppercase", letterSpacing: "0.04em"
                  }}>
                    {app.status}
                  </span>
                </div>
                <button
                  className="btn-plum btn w-100"
                  style={{ fontSize: "0.8rem" }}
                  onClick={() => navigate(`/admin/applications/${app.id}`)}
                >
                  View Application
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>No applications found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;
