import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getJobById, getSimilarJobs } from "../data/jobs";
import { getCompanyById } from "../data/companies";
import { useApp } from "../context/AppContext";
import JobCard from "../components/JobCard";

const workModeBadge = (mode) => {
  const map = { Remote: "badge-remote", Hybrid: "badge-hybrid", Onsite: "badge-onsite" };
  return map[mode] || "badge-onsite";
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob, currentUser, hasApplied, addToRecentlyViewed } = useApp();

  const job = getJobById(id);

  React.useEffect(() => {
    if (job) addToRecentlyViewed(job.id);
  }, [job?.id]);

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle" style={{ fontSize: "3rem", color: "var(--lavender)", display: "block", marginBottom: "1rem" }}></i>
        <h4>Job not found</h4>
        <Link to="/jobs" className="btn-plum btn mt-3">Back to Jobs</Link>
      </div>
    );
  }

  const company = getCompanyById(job.companyId);
  const similar = getSimilarJobs(job);
  const saved = isJobSaved(job.id);
  const applied = hasApplied(job.id);

  const handleSave = () => {
    if (!currentUser) { navigate("/login"); return; }
    toggleSaveJob(job.id);
  };

  return (
    <>
      {/* Hero */}
      <section className="job-details-hero">
        <div className="container">
          <div className="mb-3">
            <Link to="/jobs" style={{ fontSize: "0.8rem", color: "var(--plum)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <i className="bi bi-arrow-left"></i> Back to Jobs
            </Link>
          </div>

          <div className="row gy-4 align-items-start">
            <div className="col-lg-8">
              <div className="d-flex align-items-start gap-4 mb-4">
                <div
                  className="company-initial"
                  style={{
                    width: 64, height: 64, fontSize: "1.1rem", borderRadius: 12,
                    background: company?.color || "#5A315D", flexShrink: 0
                  }}
                >
                  {job.company.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {job.featured && <span className="badge-featured">Featured</span>}
                    {job.easyApply && <span className="badge-easy">Easy Apply</span>}
                  </div>
                  <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, color: "var(--dark)", marginBottom: "0.4rem" }}>
                    {job.title}
                  </h1>
                  <div style={{ fontSize: "1rem", color: "var(--plum)", fontWeight: 600 }}>{job.company}</div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4">
                {[
                  { icon: "bi-geo-alt", val: job.location },
                  { icon: "bi-currency-rupee", val: job.salary },
                  { icon: "bi-briefcase", val: job.experience },
                  { icon: "bi-clock", val: job.jobType },
                ].map(m => (
                  <div key={m.val} className="detail-meta-item">
                    <i className={`bi ${m.icon}`}></i>
                    <span>{m.val}</span>
                  </div>
                ))}
                <span className={`badge-mode ${workModeBadge(job.workMode)}`}>{job.workMode}</span>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card-inner-section">
                <div style={{ marginBottom: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <i className="bi bi-clock me-1"></i>
                  Posted on {new Date(job.postedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <div style={{ fontSize: "1.5rem", fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--plum)", marginBottom: "1rem" }}>
                  {job.salary}
                </div>
                <div className="d-flex flex-column gap-2">
                  {applied ? (
                    <div
                      className="w-100 text-center"
                      style={{
                        background: "rgba(25,135,84,0.1)", color: "#198754",
                        padding: "0.6rem", borderRadius: "var(--radius)",
                        fontWeight: 700, fontSize: "0.875rem"
                      }}
                    >
                      <i className="bi bi-check-circle me-2"></i>Application Submitted
                    </div>
                  ) : (
                    <Link to={`/apply/${job.id}`} className="btn-lime btn w-100 text-center">
                      <i className="bi bi-send me-2"></i>Apply Now
                    </Link>
                  )}
                  <button
                    className={`btn w-100 ${saved ? "btn-plum" : "btn-outline-plum"}`}
                    onClick={handleSave}
                  >
                    <i className={`bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"} me-2`}></i>
                    {saved ? "Job Saved" : "Save Job"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            {/* About */}
            <section className="mb-5">
              <div className="detail-section-title">About the Role</div>
              <p style={{ color: "var(--dark)", fontSize: "0.925rem", lineHeight: 1.8 }}>{job.description}</p>
            </section>

            {/* Responsibilities */}
            <section className="mb-5">
              <div className="detail-section-title">Responsibilities</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {job.responsibilities.map((r, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem", fontSize: "0.9rem", color: "var(--dark)" }}>
                    <div style={{ width: 20, height: 20, background: "var(--lime)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <i className="bi bi-check" style={{ fontSize: "0.75rem", color: "var(--dark)" }}></i>
                    </div>
                    {r}
                  </li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section className="mb-5">
              <div className="detail-section-title">Requirements</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {job.requirements.map((r, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem", fontSize: "0.9rem", color: "var(--dark)" }}>
                    <i className="bi bi-arrow-right-circle-fill" style={{ color: "var(--plum)", flexShrink: 0, marginTop: 3 }}></i>
                    {r}
                  </li>
                ))}
              </ul>
            </section>

            {/* Skills */}
            <section className="mb-5">
              <div className="detail-section-title">Required Skills</div>
              <div>
                {job.skills.map(s => (
                  <span key={s} className="skill-tag" style={{ margin: "0.2rem" }}>{s}</span>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section className="mb-5">
              <div className="detail-section-title">Benefits & Perks</div>
              <div className="row g-2">
                {job.benefits.map((b, i) => (
                  <div key={i} className="col-md-6">
                    <div style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      background: "var(--ivory)", borderRadius: "var(--radius)",
                      padding: "0.75rem", border: "1px solid var(--border)"
                    }}>
                      <i className="bi bi-star-fill" style={{ color: "var(--lime-dark)", fontSize: "0.8rem" }}></i>
                      <span style={{ fontSize: "0.875rem", color: "var(--dark)" }}>{b}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="col-lg-4">
            {/* Company card */}
            {company && (
              <div className="card-inner-section mb-4">
                <div className="detail-section-title">About the Company</div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="company-logo" style={{ background: company.color }}>
                    {company.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--dark)" }}>{company.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{company.industry}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
                  {company.description}
                </p>
                <div className="d-flex flex-column gap-1">
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="bi bi-people" style={{ color: "var(--plum)" }}></i> {company.size}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="bi bi-geo-alt" style={{ color: "var(--plum)" }}></i> {company.location}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--plum)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="bi bi-briefcase"></i> {company.openPositions} open positions
                  </span>
                </div>
              </div>
            )}

            {/* Job overview */}
            <div className="card-inner-section">
              <div className="detail-section-title">Job Overview</div>
              {[
                { icon: "bi-briefcase", label: "Job Type", val: job.jobType },
                { icon: "bi-laptop", label: "Work Mode", val: job.workMode },
                { icon: "bi-bar-chart", label: "Experience", val: job.experience },
                { icon: "bi-tag", label: "Category", val: job.category },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{ width: 36, height: 36, background: "var(--ivory)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`bi ${item.icon}`} style={{ color: "var(--plum)" }}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--dark)" }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Jobs */}
        {similar.length > 0 && (
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="section-label">You might also like</span>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontWeight: 800, marginBottom: "1.5rem" }}>Similar Jobs</h3>
            <div className="row g-4">
              {similar.map(j => (
                <div key={j.id} className="col-md-4">
                  <JobCard job={j} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JobDetails;
