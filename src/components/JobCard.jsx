import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const workModeBadge = (mode) => {
  const map = {
    Remote: "badge-remote",
    Hybrid: "badge-hybrid",
    Onsite: "badge-onsite",
  };
  return map[mode] || "badge-onsite";
};

const JobCard = ({ job, compact = false }) => {
  const { isJobSaved, toggleSaveJob, currentUser } = useApp();
  const saved = isJobSaved(job.id);
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) { navigate("/login"); return; }
    toggleSaveJob(job.id);
  };

  const daysAgo = () => {
    const posted = new Date(job.postedDate);
    const now = new Date("2026-08-16");
    const diff = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
  };

  return (
    <div className={`job-card ${job.featured ? "featured" : ""}`}>
      {/* Header */}
      <div className="d-flex align-items-flex-start justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: 0 }}>
          <div
            className="company-initial"
            style={{
              background: job.companyId === 1 ? "#5A315D"
                : job.companyId === 2 ? "#2E6B5E"
                : job.companyId === 3 ? "#9B4F2D"
                : job.companyId === 4 ? "#1D4E7A"
                : job.companyId === 5 ? "#3D2C6B"
                : "#1B5E3B",
            }}
          >
            {job.company?.substring(0, 2).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="d-flex flex-wrap gap-1 mb-1">
              {job.featured && <span className="badge-featured">Featured</span>}
              {job.easyApply && <span className="badge-easy">Easy Apply</span>}
            </div>
            <Link
              to={`/jobs/${job.id}`}
              className="job-title d-block text-decoration-none"
              style={{ color: "var(--dark)" }}
            >
              {job.title}
            </Link>
            <div className="job-company">{job.company}</div>
          </div>
        </div>
        <button
          className={`save-btn ms-2 ${saved ? "saved" : ""}`}
          onClick={handleSave}
          title={saved ? "Unsave job" : "Save job"}
          style={{ flexShrink: 0 }}
        >
          <i className={saved ? "bi bi-bookmark-fill" : "bi bi-bookmark"}></i>
        </button>
      </div>

      {/* Meta */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="job-meta"><i className="bi bi-geo-alt"></i> {job.location}</span>
        <span className="job-meta"><i className="bi bi-currency-rupee"></i> {job.salary}</span>
        <span className="job-meta"><i className="bi bi-briefcase"></i> {job.experience}</span>
      </div>

      <div className="d-flex flex-wrap gap-1 mb-3">
        <span className={`badge-mode ${workModeBadge(job.workMode)}`}>{job.workMode}</span>
        <span className="badge-mode badge-onsite">{job.jobType}</span>
      </div>

      {/* Skills */}
      {!compact && (
        <div className="mb-3">
          {job.skills.slice(0, 4).map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="d-flex align-items-center justify-content-between mt-auto pt-2" style={{ borderTop: "1px solid var(--border)" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <i className="bi bi-clock me-1"></i>{daysAgo()}
        </span>
        <div className="d-flex gap-2">
          <Link to={`/jobs/${job.id}`} className="btn-outline-plum btn" style={{ padding: "0.35rem 0.9rem", fontSize: "0.8rem" }}>
            View
          </Link>
          <Link to={`/apply/${job.id}`} className="btn-lime btn" style={{ padding: "0.35rem 0.9rem", fontSize: "0.8rem" }}>
            Apply
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
