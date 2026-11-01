import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CandidateSidebar from "../components/CandidateSidebar";
import JobCard from "../components/JobCard";
import InterviewCard from "../components/InterviewCard";
import StatusTracker from "../components/StatusTracker";
import { jobs } from "../data/jobs";

const profileFields = [
  { key: "name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "skills", label: "Skills" },
];

const CandidateDashboard = () => {
  const { currentUser, applications, notifications, savedJobs } = useApp();

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <Link to="/login" className="btn-plum btn">Please log in</Link>
      </div>
    );
  }

  const upcomingInterview = applications.find(a => a.status === "Interview" && a.interview);
  const recentApps = applications.slice(0, 3);
  const recentNotifs = notifications.slice(0, 4);
  const recommended = jobs.filter(j => j.featured).slice(0, 3);

  const filled = profileFields.filter(f => currentUser[f.key]).length;
  const completion = Math.round((filled / profileFields.length) * 100);

  const stats = [
    { label: "Applications", value: applications.length, icon: "bi-file-earmark-text", color: "#5A315D" },
    { label: "Shortlisted", value: applications.filter(a => a.status === "Shortlisted").length, icon: "bi-star", color: "#2E6B5E" },
    { label: "Interviews", value: applications.filter(a => a.status === "Interview").length, icon: "bi-camera-video", color: "#1D4E7A" },
    { label: "Saved Jobs", value: savedJobs.length, icon: "bi-bookmark", color: "#9B4F2D" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      {/* Sidebar */}
      <div style={{ width: 240, flexShrink: 0 }} className="d-none d-lg-block">
        <CandidateSidebar />
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, padding: "2rem 1.5rem", overflowX: "hidden" }}>
        {/* Greeting */}
        <div className="mb-4">
          <span className="section-label">{greeting}</span>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--dark)", fontSize: "1.8rem", marginBottom: "0.25rem" }}>
            {currentUser.name.split(" ")[0]}.
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Here's what's happening with your job search.
          </p>
        </div>

        {/* Stats row */}
        <div className="row g-3 mb-4">
          {stats.map(s => (
            <div key={s.label} className="col-6 col-lg-3">
              <div className="stat-card">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: "1.1rem" }}></i>
                  </div>
                </div>
                <div className="stat-card-number">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Left column */}
          <div className="col-lg-8">
            {/* Profile Completion */}
            <div className="card-inner-section mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--dark)" }}>Profile Completion</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {completion < 100
                      ? "Complete your profile to improve your opportunities."
                      : "Your profile is complete!"}
                  </div>
                </div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", fontWeight: 900, color: "var(--plum)" }}>
                  {completion}%
                </div>
              </div>
              <div className="progress mb-3">
                <div className="progress-bar" style={{ width: `${completion}%` }}></div>
              </div>
              {completion < 100 && (
                <Link to="/profile" className="btn-outline-plum btn" style={{ fontSize: "0.8rem", padding: "0.35rem 0.9rem" }}>
                  Complete Profile
                </Link>
              )}
            </div>

            {/* Upcoming Interview */}
            {upcomingInterview && (
              <div className="mb-4">
                <span className="section-label">Don't miss this</span>
                <InterviewCard
                  interview={upcomingInterview.interview}
                  jobTitle={upcomingInterview.jobTitle}
                  company={upcomingInterview.company}
                />
              </div>
            )}

            {/* Recent Applications */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="section-label" style={{ marginBottom: 0 }}>Recent Applications</span>
                <Link to="/my-applications" className="view-all-link">View all <i className="bi bi-arrow-right"></i></Link>
              </div>

              {recentApps.length === 0 ? (
                <div className="card-inner-section text-center py-4">
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No applications yet.</p>
                  <Link to="/jobs" className="btn-lime btn" style={{ fontSize: "0.8rem" }}>Browse Jobs</Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {recentApps.map(app => (
                    <div key={app.id} className="application-row">
                      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--dark)" }}>{app.jobTitle}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--plum)", fontWeight: 500, marginBottom: 6 }}>{app.company}</div>
                          <StatusTracker status={app.status} />
                        </div>
                        <span className={`status-pill ${app.status.replace(" ", ".")}`}>{app.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended */}
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="section-label" style={{ marginBottom: 0 }}>Recommended for You</span>
                <Link to="/jobs" className="view-all-link">Browse all <i className="bi bi-arrow-right"></i></Link>
              </div>
              <div className="row g-3">
                {recommended.map(job => (
                  <div key={job.id} className="col-md-4">
                    <JobCard job={job} compact />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-lg-4">
            {/* Quick Actions */}
            <div className="card-inner-section mb-4">
              <div className="filter-group-title mb-3">Quick Actions</div>
              <div className="d-flex flex-column gap-2">
                {[
                  { to: "/jobs", icon: "bi-search", label: "Find Jobs" },
                  { to: "/profile", icon: "bi-person-check", label: "Update Profile" },
                  { to: "/my-applications", icon: "bi-file-earmark-text", label: "View Applications" },
                  { to: "/saved-jobs", icon: "bi-bookmark", label: "Saved Jobs" },
                ].map(a => (
                  <Link
                    key={a.to}
                    to={a.to}
                    className="d-flex align-items-center gap-2 text-decoration-none"
                    style={{
                      padding: "0.6rem 0.75rem",
                      background: "var(--ivory)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      fontSize: "0.875rem",
                      color: "var(--dark)",
                      fontWeight: 500,
                      transition: "all 0.2s"
                    }}
                  >
                    <i className={`bi ${a.icon}`} style={{ color: "var(--plum)" }}></i>
                    {a.label}
                    <i className="bi bi-chevron-right ms-auto" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}></i>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="card-inner-section">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="filter-group-title" style={{ marginBottom: 0 }}>Recent Notifications</div>
                <Link to="/notifications" style={{ fontSize: "0.75rem", color: "var(--plum)", fontWeight: 600, textDecoration: "none" }}>All</Link>
              </div>
              {recentNotifs.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No notifications</p>
              ) : (
                recentNotifs.map(n => (
                  <div key={n.id} className="d-flex gap-2 mb-3 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: n.read ? "transparent" : "var(--lime-dark)",
                      marginTop: 6, flexShrink: 0
                    }}></div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--dark)", marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{n.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
