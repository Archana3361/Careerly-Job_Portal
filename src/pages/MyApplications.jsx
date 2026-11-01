import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CandidateSidebar from "../components/CandidateSidebar";
import StatusTracker from "../components/StatusTracker";
import InterviewCard from "../components/InterviewCard";
import EmptyState from "../components/EmptyState";

const statusFilters = ["All", "Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"];

const MyApplications = () => {
  const { applications, currentUser } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <Link to="/login" className="btn-plum btn">Please log in</Link>
      </div>
    );
  }

  const filtered = activeFilter === "All"
    ? applications
    : applications.filter(a => a.status === activeFilter);

  const stats = {
    total: applications.length,
    review: applications.filter(a => a.status === "Under Review").length,
    shortlisted: applications.filter(a => a.status === "Shortlisted").length,
    interview: applications.filter(a => a.status === "Interview").length,
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      <div style={{ width: 240, flexShrink: 0 }} className="d-none d-lg-block">
        <CandidateSidebar />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "2rem 1.5rem" }}>
        <div className="mb-4">
          <span className="section-label">Manage your career</span>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--dark)", fontSize: "1.8rem", marginBottom: 0 }}>
            My Applications
          </h2>
        </div>

        {/* Summary stats */}
        <div className="row g-3 mb-4">
          {[
            { label: "Total Applications", value: stats.total, color: "var(--plum)" },
            { label: "Under Review", value: stats.review, color: "#856404" },
            { label: "Shortlisted", value: stats.shortlisted, color: "#198754" },
            { label: "Interviews", value: stats.interview, color: "#0a5c6e" },
          ].map(s => (
            <div key={s.label} className="col-6 col-lg-3">
              <div className="stat-card text-center">
                <div className="stat-card-number" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="d-flex flex-wrap gap-2 mb-4 horizontal-scroll" style={{ paddingBottom: "0.5rem" }}>
          {statusFilters.map(f => (
            <button
              key={f}
              className={`pill-filter ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
              {f === "All" && <span className="ms-1">({applications.length})</span>}
            </button>
          ))}
        </div>

        {/* Applications list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="bi-file-earmark-text"
            title="No applications found"
            subtitle={activeFilter === "All" ? "Start applying to jobs to see them here." : `No applications with status: ${activeFilter}`}
            ctaLabel={activeFilter === "All" ? "Browse Jobs" : undefined}
            ctaTo={activeFilter === "All" ? "/jobs" : undefined}
          />
        ) : (
          <div className="d-flex flex-column gap-3">
            {filtered.map(app => (
              <div key={app.id} className="application-row">
                <div
                  className="d-flex align-items-start justify-content-between gap-3 flex-wrap"
                  style={{ cursor: "pointer" }}
                  onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                >
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <h5 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "0.95rem", color: "var(--dark)", marginBottom: 0 }}>
                        {app.jobTitle}
                      </h5>
                      <span className={`status-pill ${app.status.replace(/ /g, ".")}`}>{app.status}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--plum)", fontWeight: 500, marginBottom: 8 }}>{app.company}</div>

                    {/* Status tracker */}
                    <div className="d-none d-md-block">
                      <StatusTracker status={app.status} />
                    </div>

                    <div className="d-flex flex-wrap gap-3 mt-2">
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                        <i className="bi bi-calendar3"></i> Applied {app.appliedDate}
                      </span>
                      {app.resume && (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                          <i className="bi bi-file-earmark-text"></i> {app.resume}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-2 align-items-center">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="btn-ghost btn"
                      style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }}
                      onClick={e => e.stopPropagation()}
                    >
                      View Job
                    </Link>
                    <button
                      className="btn"
                      style={{ background: "none", border: "none", padding: "0.3rem", color: "var(--text-muted)", fontSize: "0.9rem" }}
                    >
                      <i className={`bi bi-chevron-${expandedId === app.id ? "up" : "down"}`}></i>
                    </button>
                  </div>
                </div>

                {/* Expanded: interview card */}
                {expandedId === app.id && app.status === "Interview" && app.interview && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <InterviewCard
                      interview={app.interview}
                      jobTitle={app.jobTitle}
                      company={app.company}
                    />
                  </div>
                )}

                {expandedId === app.id && (
                  <div className="mt-3 pt-3 d-md-none" style={{ borderTop: "1px solid var(--border)" }}>
                    <StatusTracker status={app.status} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
