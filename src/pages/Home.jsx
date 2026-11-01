import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobs, getFeaturedJobs, getFresherJobs, getRemoteJobs } from "../data/jobs";
import { companies } from "../data/companies";
import { categories } from "../data/categories";
import { resources } from "../data/resources";
import JobCard from "../components/JobCard";
import { useApp } from "../context/AppContext";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Frontend Developer",
    company: "TechNova",
    text: "Careerly helped me find my first developer role without spending hours searching. The job recommendations were surprisingly accurate and the application process was seamless.",
    initials: "PS",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Data Analyst",
    company: "Orbit Systems",
    text: "Within two weeks of creating my profile, I had three shortlists. The status tracking feature kept me informed at every step — no more wondering where my application stood.",
    initials: "RM",
  },
  {
    id: 3,
    name: "Ananya Singh",
    role: "Graduate Trainee",
    company: "Nexora",
    text: "As a fresher, I was overwhelmed by job boards. Careerly's dedicated fresher section felt like it was built just for me. I landed my dream role in under a month.",
    initials: "AS",
  },
];

/* Inline bookmark button used in custom-layout sections */
const BookmarkBtn = ({ jobId }) => {
  const { isJobSaved, toggleSaveJob, currentUser } = useApp();
  const navigate = useNavigate();
  const saved = isJobSaved(jobId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) { navigate("/login"); return; }
    toggleSaveJob(jobId);
  };

  return (
    <button
      onClick={handleClick}
      title={saved ? "Remove bookmark" : "Save job"}
      style={{
        background: saved ? "rgba(200,230,74,0.15)" : "transparent",
        border: `1.5px solid ${saved ? "var(--lime-dark)" : "var(--border)"}`,
        borderRadius: 6,
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: saved ? "var(--lime-dark)" : "var(--text-muted)",
        flexShrink: 0,
        transition: "all 0.2s",
      }}
    >
      <i className={`bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"}`} style={{ fontSize: "0.9rem" }}></i>
    </button>
  );
};

/* Bookmark button styled for dark (plum) backgrounds */
const RemoteBookmarkBtn = ({ jobId }) => {
  const { isJobSaved, toggleSaveJob, currentUser } = useApp();
  const navigate = useNavigate();
  const saved = isJobSaved(jobId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) { navigate("/login"); return; }
    toggleSaveJob(jobId);
  };

  return (
    <button
      onClick={handleClick}
      title={saved ? "Remove bookmark" : "Save job"}
      style={{
        background: saved ? "rgba(200,230,74,0.18)" : "rgba(255,255,255,0.08)",
        border: `1.5px solid ${saved ? "var(--lime)" : "rgba(255,255,255,0.2)"}`,
        borderRadius: 6,
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: saved ? "var(--lime)" : "rgba(255,255,255,0.6)",
        flexShrink: 0,
        transition: "all 0.2s",
      }}
    >
      <i className={`bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"}`} style={{ fontSize: "0.9rem" }}></i>
    </button>
  );
};

const Home = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const navigate = useNavigate();

  const featuredJobs = getFeaturedJobs().slice(0, 6);
  const fresherJobs = getFresherJobs().slice(0, 4);
  const remoteJobs = getRemoteJobs().slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.set("q", searchTitle);
    if (searchLocation) params.set("loc", searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <>
      {/* ====== HERO ====== */}
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7">
              <span className="hero-label">Your next opportunity</span>
              <h1 className="hero-heading">
                FIND WORK<br />
                THAT <span>MOVES</span><br />
                YOU.
              </h1>
              <p className="hero-sub">
                Discover opportunities that match your skills, goals and ambitions.
              </p>

              <form onSubmit={handleSearch}>
                <div className="search-container">
                  <i className="bi bi-search ms-2" style={{ color: "var(--text-muted)", flexShrink: 0 }}></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Job title, skill or keyword..."
                    value={searchTitle}
                    onChange={e => setSearchTitle(e.target.value)}
                  />
                  <div className="search-divider"></div>
                  <i className="bi bi-geo-alt ms-2" style={{ color: "var(--text-muted)", flexShrink: 0 }}></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Location..."
                    value={searchLocation}
                    onChange={e => setSearchLocation(e.target.value)}
                  />
                  <button type="submit" className="btn-lime btn me-1" style={{ whiteSpace: "nowrap" }}>
                    Search Jobs
                  </button>
                </div>
              </form>

              <div className="d-flex flex-wrap gap-2 mt-3">
                {["React Developer", "Data Scientist", "UI Designer", "Remote", "Fresher"].map(t => (
                  <button
                    key={t}
                    onClick={() => navigate(`/jobs?q=${t}`)}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.78rem",
                      padding: "0.3rem 0.75rem",
                      borderRadius: 50,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-float-card">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--plum)" }}>Featured Role</span>
                  <span className="badge-featured" style={{ marginLeft: "auto" }}>Featured</span>
                </div>

                {featuredJobs[0] && (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="company-initial" style={{ background: "#5A315D" }}>TN</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--dark)" }}>
                          {featuredJobs[0].title}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--plum)" }}>{featuredJobs[0].company}</div>
                      </div>
                      <BookmarkBtn jobId={featuredJobs[0].id} />
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="job-meta"><i className="bi bi-geo-alt"></i> {featuredJobs[0].location}</span>
                      <span className="job-meta"><i className="bi bi-currency-rupee"></i> {featuredJobs[0].salary}</span>
                    </div>

                    <div className="mb-3">
                      {featuredJobs[0].skills.slice(0, 3).map(s => (
                        <span key={s} className="skill-tag">{s}</span>
                      ))}
                    </div>

                    <Link to={`/jobs/${featuredJobs[0].id}`} className="btn-lime btn w-100 text-center d-block">
                      View Opportunity
                    </Link>
                  </>
                )}

                <div className="row g-2 mt-3">
                  <div className="col-4 text-center">
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 900, color: "var(--plum)" }}>10K+</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Jobs</div>
                  </div>
                  <div className="col-4 text-center" style={{ borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 900, color: "var(--plum)" }}>2.5K+</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Companies</div>
                  </div>
                  <div className="col-4 text-center">
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 900, color: "var(--plum)" }}>5K+</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Hired</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATS STRIP ====== */}
      <section className="stats-strip">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-0">
            {[
              { num: "10,000+", label: "Active Jobs" },
              { num: "2,500+", label: "Companies" },
              { num: "15,000+", label: "Job Seekers" },
              { num: "5,000+", label: "Successful Hires" },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="text-center px-4 py-2 flex-fill">
                  <div className="stat-number">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
                {i < 3 && <div className="stat-divider d-none d-md-block" style={{ height: 60 }}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CATEGORIES ====== */}
      <section id="popular-categories" className="page-section bg-warm-white">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-5 gap-3">
            <div>
              <span className="section-label">Browse by field</span>
              <h2 className="section-title mb-0">Popular Categories</h2>
            </div>
            <Link to="/jobs" className="view-all-link">Explore all <i className="bi bi-arrow-right"></i></Link>
          </div>

          <div className="row g-3">
            {categories.map(cat => (
              <div key={cat.id} className="col-6 col-md-4 col-lg-3">
                <Link
                  to={`/jobs?category=${encodeURIComponent(cat.slug)}`}
                  className="category-card"
                >
                  <i className={`bi ${cat.icon} category-icon`}></i>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.jobCount} open positions</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED JOBS ====== */}
      <section id="featured-jobs" className="page-section bg-ivory">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-5 gap-3">
            <div>
              <span className="section-label">Hand-picked for you</span>
              <h2 className="section-title mb-0">Featured Jobs</h2>
            </div>
            <Link to="/jobs" className="view-all-link">View all jobs <i className="bi bi-arrow-right"></i></Link>
          </div>

          <div className="row g-4">
            {featuredJobs.map(job => (
              <div key={job.id} className="col-md-6 col-lg-4">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FRESHER SECTION ====== */}
      <section className="page-section bg-warm-white">
        <div className="container">
          <div className="row align-items-start gy-4">
            <div className="col-lg-4">
              <span className="section-label">For new graduates</span>
              <h2 className="section-title">Start Your Career</h2>
              <p className="section-sub mb-4">
                Opportunities designed for students and fresh graduates ready to take their first step.
              </p>
              <Link to="/jobs?experience=Fresher" className="btn-plum btn">
                View All Fresher Jobs <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {fresherJobs.map(job => (
                  <div
                    key={job.id}
                    className="d-flex align-items-start gap-3 p-3"
                    style={{
                      background: "var(--warm-white)",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      transition: "all 0.2s"
                    }}
                  >
                    <div
                      className="company-initial"
                      style={{
                        background: job.companyId === 1 ? "#5A315D" : job.companyId === 4 ? "#1D4E7A" : job.companyId === 5 ? "#3D2C6B" : "#1B5E3B",
                        flexShrink: 0
                      }}
                    >
                      {job.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <Link to={`/jobs/${job.id}`} style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--dark)", textDecoration: "none" }}>
                          {job.title}
                        </Link>
                        <span
                          style={{
                            background: "rgba(200,230,74,0.2)", color: "#5a6a00",
                            fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.5rem",
                            borderRadius: 2, textTransform: "uppercase", letterSpacing: "0.06em"
                          }}
                        >
                          {job.jobType}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--plum)", fontWeight: 500, marginBottom: 6 }}>{job.company}</div>
                      <div className="d-flex flex-wrap gap-3">
                        <span className="job-meta"><i className="bi bi-geo-alt"></i> {job.location}</span>
                        <span className="job-meta"><i className="bi bi-currency-rupee"></i> {job.salary}</span>
                        <span className="job-meta"><i className="bi bi-briefcase"></i> {job.experience}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2 align-items-center" style={{ flexShrink: 0 }}>
                      <BookmarkBtn jobId={job.id} />
                      <Link to={`/apply/${job.id}`} className="btn-lime btn d-none d-sm-block" style={{ padding: "0.35rem 0.9rem", fontSize: "0.8rem" }}>
                        Apply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== REMOTE SECTION ====== */}
      <section id="work-from-anywhere" className="page-section" style={{ background: "var(--plum)" }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-5 gap-3">
            <div>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--lime)", display: "block", marginBottom: "0.75rem" }}>
                Location independent
              </span>
              <h2 className="section-title" style={{ color: "white", marginBottom: 0 }}>Work From Anywhere</h2>
            </div>
            <Link to="/jobs?workMode=Remote" style={{ color: "var(--lime)", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              All remote roles <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {remoteJobs.map(job => (
              <div key={job.id} className="col-md-6">
                <div style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  transition: "all 0.25s"
                }}>
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="company-initial" style={{ background: "rgba(255,255,255,0.12)" }}>
                        {job.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link to={`/jobs/${job.id}`} style={{ fontWeight: 700, fontSize: "0.95rem", color: "white", textDecoration: "none", display: "block" }}>
                          {job.title}
                        </Link>
                        <div style={{ fontSize: "0.8rem", color: "var(--lime)", fontWeight: 500 }}>{job.company}</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2" style={{ flexShrink: 0 }}>
                      <RemoteBookmarkBtn jobId={job.id} />
                      <span style={{
                        background: "var(--lime)", color: "var(--dark)",
                        fontSize: "0.65rem", fontWeight: 700, padding: "0.25rem 0.6rem",
                        borderRadius: 2, textTransform: "uppercase", letterSpacing: "0.06em"
                      }}>
                        Remote
                      </span>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-3 mb-3">
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="bi bi-currency-rupee"></i> {job.salary}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="bi bi-briefcase"></i> {job.experience}
                    </span>
                  </div>

                  <div className="mb-3">
                    {job.skills.slice(0, 4).map(s => (
                      <span key={s} style={{
                        display: "inline-block",
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "0.72rem",
                        padding: "0.2rem 0.5rem",
                        borderRadius: 2,
                        margin: "0.15rem",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <Link to={`/apply/${job.id}`} className="btn-lime btn w-100 text-center d-block" style={{ fontSize: "0.875rem" }}>
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== COMPANIES ====== */}
      <section id="featured-companies" className="page-section bg-ivory">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-5 gap-3">
            <div>
              <span className="section-label">Top employers</span>
              <h2 className="section-title mb-0">Featured Companies</h2>
            </div>
          </div>

          <div className="row g-4">
            {companies.map(company => (
              <div key={company.id} className="col-md-4 col-lg-2 col-6">
                <Link to={`/jobs?company=${company.id}`} className="company-card text-decoration-none text-center">
                  <div className="company-logo mx-auto" style={{ background: company.color }}>
                    {company.initials}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--dark)", marginBottom: 2 }}>{company.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>{company.industry}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--plum)", fontWeight: 600 }}>
                    {company.openPositions} open roles
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="page-section bg-warm-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">Simple process</span>
            <h2 className="section-title">How It Works</h2>
          </div>

          <div className="row g-4 position-relative">
            {[
              { num: "01", title: "Create Your Profile", desc: "Set up your candidate profile with your skills, experience and resume. It takes under 5 minutes." },
              { num: "02", title: "Discover Opportunities", desc: "Browse curated job listings or let our smart matching surface roles that fit your background." },
              { num: "03", title: "Apply & Get Hired", desc: "Apply with one click, track your application status in real time, and land your next opportunity." },
            ].map((step, i) => (
              <div key={step.num} className="col-md-4 how-step text-center">
                <div className="step-number">{step.num}</div>
                <div className="step-title">{step.title}</div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{step.desc}</p>
                {i < 2 && (
                  <div
                    className="d-none d-md-block"
                    style={{
                      position: "absolute",
                      top: "2rem",
                      left: i === 0 ? "50%" : "83.33%",
                      width: "33.33%",
                      height: 1,
                      background: "linear-gradient(to right, var(--lavender), transparent)",
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== RESOURCES ====== */}
      <section id="career-resources" className="page-section bg-ivory">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-5 gap-3">
            <div>
              <span className="section-label">Learn & grow</span>
              <h2 className="section-title mb-0">Career Resources</h2>
            </div>
          </div>

          <div className="row g-4">
            {resources.map(r => (
              <div key={r.id} className="col-md-6 col-lg-3">
                <div className="resource-card">
                  <div className="resource-icon">
                    <i className={`bi ${r.icon}`}></i>
                  </div>
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "var(--plum)",
                    display: "block", marginBottom: 8
                  }}>
                    {r.category}
                  </span>
                  <h5 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "var(--dark)", marginBottom: 8, lineHeight: 1.4 }}>
                    {r.title}
                  </h5>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>
                    {r.excerpt}
                  </p>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="bi bi-clock"></i> {r.readTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section id="job-seeker-stories" className="page-section bg-warm-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">Real stories</span>
            <h2 className="section-title">What Job Seekers Say</h2>
          </div>

          <div className="row g-4">
            {testimonials.map(t => (
              <div key={t.id} className="col-md-4">
                <div className="testimonial-card">
                  <p style={{ fontSize: "0.9rem", color: "var(--dark)", lineHeight: 1.7, marginBottom: "1.5rem", position: "relative" }}>
                    "{t.text}"
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--dark)" }}>{t.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--plum)", fontWeight: 500 }}>{t.role} · {t.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="cta-section">
        <div className="container text-center position-relative" style={{ zIndex: 1 }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--lime)", display: "block", marginBottom: "1rem" }}>
            Take the next step
          </span>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, color: "white", marginBottom: "1rem" }}>
            Ready for Your Next Move?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
            Your next opportunity could be closer than you think.
          </p>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <Link to="/jobs" className="btn-lime btn" style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}>
              Explore Jobs
            </Link>
            <Link to="/register" className="btn" style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.4)",
              color: "white",
              padding: "0.75rem 2rem",
              fontSize: "0.95rem",
              borderRadius: "var(--radius)",
              fontWeight: 600,
              transition: "all 0.2s"
            }}>
              Create Profile
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
