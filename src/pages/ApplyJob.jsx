import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById } from "../data/jobs";
import { useApp } from "../context/AppContext";
import ResumeUpload from "../components/ResumeUpload";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  qualification: "",
  experience: "",
  skills: "",
  coverLetter: "",
  resume: null,
};

const qualifications = ["High School", "Diploma", "B.Tech / B.E.", "B.Sc / B.A. / B.Com", "M.Tech / M.E.", "MBA", "M.Sc / MA", "PhD", "Other"];
const experienceOptions = ["Fresher", "Less than 1 year", "1–2 years", "2–3 years", "3–5 years", "5–8 years", "8+ years"];

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, applyToJob, hasApplied } = useApp();

  const job = getJobById(id);
  const [form, setForm] = useState({
    ...initialForm,
    fullName: currentUser?.name || "",
    email: currentUser?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <h4>Job not found.</h4>
        <Link to="/jobs" className="btn-plum btn mt-3">Back to Jobs</Link>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 480 }}>
        <div style={{ width: 64, height: 64, background: "var(--lavender)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.8rem", color: "var(--plum)" }}>
          <i className="bi bi-lock"></i>
        </div>
        <h4>Sign in to apply</h4>
        <p style={{ color: "var(--text-muted)" }}>You need to be logged in to apply for jobs.</p>
        <Link to="/login" className="btn-plum btn mt-2">Log In</Link>
        <span className="mx-2" style={{ color: "var(--text-muted)" }}>or</span>
        <Link to="/register" className="btn-lime btn mt-2">Create Account</Link>
      </div>
    );
  }

  if (hasApplied(job.id)) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 480 }}>
        <div style={{ width: 72, height: 72, background: "var(--lime)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem", color: "var(--dark)" }}>
          <i className="bi bi-check-lg"></i>
        </div>
        <h4>Already Applied</h4>
        <p style={{ color: "var(--text-muted)" }}>You have already applied for <strong>{job.title}</strong> at {job.company}.</p>
        <Link to="/my-applications" className="btn-plum btn mt-2">View My Applications</Link>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required.";
    if (!form.phone.trim() || !/^\+?[0-9\s\-]{8,15}$/.test(form.phone)) e.phone = "Valid phone number is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.resume) e.resume = "Resume is required.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    applyToJob({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      ...form,
      resume: form.resume?.name || "resume.pdf",
    });

    setSubmitted(true);
  };

  const set = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "var(--ivory)" }}>
        <div style={{
          background: "var(--warm-white)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "3rem 2.5rem",
          maxWidth: 500, width: "100%",
          textAlign: "center",
          boxShadow: "var(--shadow-lg)"
        }}>
          <div className="success-icon">
            <i className="bi bi-check-lg"></i>
          </div>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--lime-dark)", display: "block", marginBottom: "0.75rem" }}>
            Application Submitted
          </span>
          <h3 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--dark)", marginBottom: "0.75rem" }}>
            You're all set!
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.7 }}>
            Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been successfully submitted. We'll keep you updated.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/my-applications" className="btn-plum btn">
              <i className="bi bi-file-earmark-text me-2"></i>Track Application
            </Link>
            <Link to="/jobs" className="btn-ghost btn">Browse More Jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--ivory)", minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Header */}
      <div style={{ background: "var(--plum)", padding: "2.5rem 0" }}>
        <div className="container">
          <Link to={`/jobs/${job.id}`} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: "1rem" }}>
            <i className="bi bi-arrow-left"></i> Back to Job
          </Link>
          <div className="d-flex align-items-center gap-3">
            <div className="company-initial" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "white", marginBottom: "0.2rem", fontSize: "1.5rem" }}>
                Apply for {job.title}
              </h2>
              <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)" }}>
                {job.company} · {job.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} noValidate>
              {/* Personal Info */}
              <div className="card-inner-section mb-4">
                <div className="detail-section-title mb-3">Personal Information</div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                      value={form.fullName}
                      onChange={e => set("fullName", e.target.value)}
                      placeholder="Your full name"
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="you@email.com"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      value={form.phone}
                      onChange={e => set("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Current Location *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.location ? "is-invalid" : ""}`}
                      value={form.location}
                      onChange={e => set("location", e.target.value)}
                      placeholder="City, State"
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="card-inner-section mb-4">
                <div className="detail-section-title mb-3">Professional Details</div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Highest Qualification</label>
                    <select className="form-select" value={form.qualification} onChange={e => set("qualification", e.target.value)}>
                      <option value="">Select qualification</option>
                      {qualifications.map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Years of Experience</label>
                    <select className="form-select" value={form.experience} onChange={e => set("experience", e.target.value)}>
                      <option value="">Select experience</option>
                      {experienceOptions.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Key Skills</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.skills}
                      onChange={e => set("skills", e.target.value)}
                      placeholder="React, Node.js, Python (comma separated)"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Cover Letter</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={form.coverLetter}
                      onChange={e => set("coverLetter", e.target.value)}
                      placeholder="Tell the employer why you're the perfect fit for this role..."
                    />
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="card-inner-section mb-4">
                <div className="detail-section-title mb-3">Resume *</div>
                <ResumeUpload value={form.resume} onChange={val => set("resume", val)} />
                {errors.resume && (
                  <div style={{ color: "#dc3545", fontSize: "0.82rem", marginTop: "0.5rem" }}>
                    <i className="bi bi-exclamation-circle me-1"></i>{errors.resume}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="d-flex gap-3">
                <button type="submit" className="btn-lime btn" style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}>
                  <i className="bi bi-send me-2"></i>Submit Application
                </button>
                <Link to={`/jobs/${job.id}`} className="btn-ghost btn" style={{ padding: "0.75rem 1.5rem" }}>
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Job Summary Sidebar */}
          <div className="col-lg-4 d-none d-lg-block">
            <div className="card-inner-section" style={{ position: "sticky", top: 90 }}>
              <div className="detail-section-title mb-3">Job Summary</div>
              <h5 style={{ fontFamily: "Playfair Display, serif", fontWeight: 800, color: "var(--dark)", marginBottom: "0.25rem" }}>
                {job.title}
              </h5>
              <div style={{ color: "var(--plum)", fontWeight: 600, fontSize: "0.875rem", marginBottom: "1rem" }}>{job.company}</div>
              {[
                { icon: "bi-geo-alt", val: job.location },
                { icon: "bi-currency-rupee", val: job.salary },
                { icon: "bi-briefcase", val: job.experience },
                { icon: "bi-clock", val: job.jobType },
              ].map(m => (
                <div key={m.val} className="d-flex align-items-center gap-2 mb-2">
                  <i className={`bi ${m.icon}`} style={{ color: "var(--plum)", width: 16 }}></i>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{m.val}</span>
                </div>
              ))}
              <div className="mt-3">
                {job.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
