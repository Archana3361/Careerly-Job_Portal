import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CandidateSidebar from "../components/CandidateSidebar";
import JobCard from "../components/JobCard";
import EmptyState from "../components/EmptyState";
import { jobs } from "../data/jobs";

const SavedJobs = () => {
  const { savedJobs, currentUser } = useApp();

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <Link to="/login" className="btn-plum btn">Please log in</Link>
      </div>
    );
  }

  const savedJobObjects = savedJobs
    .map(id => jobs.find(j => j.id === id))
    .filter(Boolean);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      <div style={{ width: 240, flexShrink: 0 }} className="d-none d-lg-block">
        <CandidateSidebar />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "2rem 1.5rem" }}>
        <div className="mb-4">
          <span className="section-label">Your collection</span>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--dark)", fontSize: "1.8rem", marginBottom: "0.25rem" }}>
            Saved Jobs
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {savedJobObjects.length} saved {savedJobObjects.length === 1 ? "job" : "jobs"}
          </p>
        </div>

        {savedJobObjects.length === 0 ? (
          <EmptyState
            icon="bi-bookmark"
            title="No saved jobs yet"
            subtitle="Browse jobs and bookmark the ones you're interested in."
            ctaLabel="Explore Jobs"
            ctaTo="/jobs"
          />
        ) : (
          <div className="row g-4">
            {savedJobObjects.map(job => (
              <div key={job.id} className="col-md-6 col-lg-4">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
