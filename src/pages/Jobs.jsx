import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { jobs } from "../data/jobs";
import JobCard from "../components/JobCard";
import FilterPanel from "../components/FilterPanel";
import { useApp } from "../context/AppContext";

const sorts = ["Relevance", "Newest", "Salary: High to Low", "Salary: Low to High"];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recentlyViewed } = useApp();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [locationSearch, setLocationSearch] = useState(searchParams.get("loc") || "");
  const [sort, setSort] = useState("Relevance");
  const [filters, setFilters] = useState({
    locations: [],
    experience: [],
    jobTypes: [],
    workModes: searchParams.get("workMode") ? [searchParams.get("workMode")] : [],
    categories: searchParams.get("category") ? [searchParams.get("category")] : [],
  });
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const q = searchParams.get("q");
    const loc = searchParams.get("loc");
    const cat = searchParams.get("category");
    const mode = searchParams.get("workMode");
    const exp = searchParams.get("experience");

    if (q) setSearch(q);
    if (loc) setLocationSearch(loc);
    if (cat || mode || exp) {
      setFilters(prev => ({
        ...prev,
        categories: cat ? [cat] : prev.categories,
        workModes: mode ? [mode] : prev.workModes,
        experience: exp ? [exp] : prev.experience,
      }));
    }
  }, []);

  const filtered = jobs.filter(job => {
    const q = search.toLowerCase();
    const l = locationSearch.toLowerCase();
    const matchQ = !q || job.title.toLowerCase().includes(q)
      || job.company.toLowerCase().includes(q)
      || job.skills.some(s => s.toLowerCase().includes(q))
      || job.category.toLowerCase().includes(q);
    const matchL = !l || job.location.toLowerCase().includes(l) || (l === "remote" && job.workMode === "Remote");
    const matchLoc = !filters.locations.length || filters.locations.some(loc => job.location.includes(loc) || (loc === "Remote" && job.workMode === "Remote"));
    const matchExp = !filters.experience.length || filters.experience.some(e => job.experience.includes(e));
    const matchType = !filters.jobTypes.length || filters.jobTypes.includes(job.jobType);
    const matchMode = !filters.workModes.length || filters.workModes.includes(job.workMode);
    const matchCat = !filters.categories.length || filters.categories.includes(job.category);

    return matchQ && matchL && matchLoc && matchExp && matchType && matchMode && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Newest") return new Date(b.postedDate) - new Date(a.postedDate);
    if (sort === "Salary: High to Low") return b.salaryMin - a.salaryMin;
    if (sort === "Salary: Low to High") return a.salaryMin - b.salaryMin;
    return b.featured - a.featured;
  });

  const paginated = sorted.slice(0, page * perPage);
  const hasMore = paginated.length < sorted.length;

  const recentJobs = recentlyViewed
    .map(id => jobs.find(j => j.id === id))
    .filter(Boolean)
    .slice(0, 3);

  const recommended = jobs.filter(j => j.featured).slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>
      {/* Hero */}
      <section className="jobs-page-hero">
        <div className="container">
          <div className="row align-items-center gy-3">
            <div className="col-lg-8">
              <span className="section-label">Browse opportunities</span>
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "0.25rem" }}>
                Explore Opportunities
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {filtered.length.toLocaleString()} jobs found
                {search && ` for "${search}"`}
                {filters.categories.length > 0 && ` in ${filters.categories.join(", ")}`}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-3">
            <div className="search-container" style={{ maxWidth: "100%", background: "white" }}>
              <i className="bi bi-search ms-2" style={{ color: "var(--text-muted)" }}></i>
              <input
                type="text"
                className="form-control"
                placeholder="Job title, skill or keyword..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ background: "white" }}
              />
              <div className="search-divider"></div>
              <i className="bi bi-geo-alt ms-2" style={{ color: "var(--text-muted)" }}></i>
              <input
                type="text"
                className="form-control"
                placeholder="Location..."
                value={locationSearch}
                onChange={e => { setLocationSearch(e.target.value); setPage(1); }}
                style={{ background: "white" }}
              />
              <button type="submit" className="btn-plum btn me-1">Search</button>
            </div>
          </form>

          {/* Sort + mobile filter toggle */}
          <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
              {["Remote", "Hybrid", "Fresher", "Internship"].map(tag => (
                <button
                  key={tag}
                  className={`pill-filter ${
                    (filters.workModes.includes(tag) || filters.experience.includes(tag) || filters.jobTypes.includes(tag)) ? "active" : ""
                  }`}
                  onClick={() => {
                    if (tag === "Remote" || tag === "Hybrid") {
                      const cur = filters.workModes;
                      setFilters({ ...filters, workModes: cur.includes(tag) ? cur.filter(v => v !== tag) : [...cur, tag] });
                    } else if (tag === "Fresher") {
                      const cur = filters.experience;
                      setFilters({ ...filters, experience: cur.includes(tag) ? cur.filter(v => v !== tag) : [...cur, tag] });
                    } else {
                      const cur = filters.jobTypes;
                      setFilters({ ...filters, jobTypes: cur.includes(tag) ? cur.filter(v => v !== tag) : [...cur, tag] });
                    }
                    setPage(1);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Sort:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "auto", fontSize: "0.8rem", background: "white" }}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {sorts.map(s => <option key={s}>{s}</option>)}
              </select>
              <button
                className="btn-ghost btn d-lg-none"
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                onClick={() => setShowFilterMobile(v => !v)}
              >
                <i className="bi bi-sliders me-1"></i>Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4">
        {/* Mobile filter */}
        {showFilterMobile && (
          <div className="mb-4 d-lg-none">
            <FilterPanel
              filters={filters}
              onChange={f => { setFilters(f); setPage(1); }}
              onClear={() => { setFilters({ locations: [], experience: [], jobTypes: [], workModes: [], categories: [] }); setPage(1); }}
            />
          </div>
        )}

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <FilterPanel
              filters={filters}
              onChange={f => { setFilters(f); setPage(1); }}
              onClear={() => { setFilters({ locations: [], experience: [], jobTypes: [], workModes: [], categories: [] }); setPage(1); }}
            />

            {/* Recently Viewed */}
            {recentJobs.length > 0 && (
              <div className="mt-4 card-inner-section">
                <div className="filter-group-title mb-3">Recently Viewed</div>
                {recentJobs.map(job => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="d-flex align-items-center gap-2 mb-2 text-decoration-none"
                    style={{ padding: "0.5rem", borderRadius: 6, transition: "background 0.2s" }}
                  >
                    <div className="company-initial" style={{ width: 32, height: 32, fontSize: "0.65rem", background: "#5A315D", borderRadius: 6 }}>
                      {job.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{job.company}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Listings */}
          <div className="col-lg-9">
            {paginated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                <i className="bi bi-search" style={{ fontSize: "3rem", color: "var(--lavender)", display: "block", marginBottom: "1rem" }}></i>
                <h5 style={{ fontFamily: "Inter", fontWeight: 700, color: "var(--dark)" }}>No jobs found</h5>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Try adjusting your search or removing filters.</p>
                <button
                  className="btn-plum btn mt-2"
                  onClick={() => {
                    setSearch(""); setLocationSearch("");
                    setFilters({ locations: [], experience: [], jobTypes: [], workModes: [], categories: [] });
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {paginated.map(job => (
                    <div key={job.id} className="col-md-6">
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-4">
                    <button className="btn-outline-plum btn" onClick={() => setPage(p => p + 1)}>
                      Load More Jobs <i className="bi bi-chevron-down ms-1"></i>
                    </button>
                  </div>
                )}

                {/* Recommended */}
                <div className="mt-5">
                  <div className="mb-3">
                    <span className="section-label">Recommended for you</span>
                    <h5 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: 0 }}>
                      Based on your activity
                    </h5>
                  </div>
                  <div className="row g-3">
                    {recommended.map(job => (
                      <div key={job.id} className="col-md-4">
                        <JobCard job={job} compact />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
