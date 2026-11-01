import React from "react";

const InterviewCard = ({ interview, jobTitle, company }) => {
  if (!interview) return null;

  return (
    <div className="interview-card">
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--lime)", marginBottom: 6 }}>
            Upcoming Interview
          </div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "white", marginBottom: 2 }}>{jobTitle}</div>
          <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>{company}</div>
        </div>
        <div style={{
          background: "var(--lime)",
          color: "var(--dark)",
          borderRadius: 6,
          padding: "0.35rem 0.75rem",
          fontSize: "0.75rem",
          fontWeight: 700,
        }}>
          {interview.type}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-3 mb-3">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <i className="bi bi-calendar3" style={{ color: "var(--lime)", fontSize: "0.9rem" }}></i>
          <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.85)" }}>{interview.date}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <i className="bi bi-clock" style={{ color: "var(--lime)", fontSize: "0.9rem" }}></i>
          <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.85)" }}>{interview.time}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <i className="bi bi-camera-video" style={{ color: "var(--lime)", fontSize: "0.9rem" }}></i>
          <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.85)" }}>{interview.link || interview.location}</span>
        </div>
      </div>

      {interview.message && (
        <div style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: 6,
          padding: "0.75rem",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "1rem",
          borderLeft: "3px solid var(--lime)"
        }}>
          {interview.message}
        </div>
      )}

      <a
        href={interview.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-lime btn w-100 text-center"
        style={{ display: "block" }}
      >
        <i className="bi bi-camera-video me-2"></i>Join Interview
      </a>
    </div>
  );
};

export default InterviewCard;
