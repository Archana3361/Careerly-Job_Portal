import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="careerly-footer">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand mb-2">Career<span>ly</span></div>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", maxWidth: 280, lineHeight: 1.7 }}>
              Find opportunities that fit your future. Where great talent meets meaningful work.
            </p>
            <div className="d-flex gap-2 mt-3">
              {["twitter", "linkedin", "instagram", "github"].map(s => (
                <a key={s} href="#" className="social-icon">
                  <i className={`bi bi-${s}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <div className="footer-heading">For Job Seekers</div>
            <Link to="/jobs" className="footer-link">Find Jobs</Link>
            <Link to="/saved-jobs" className="footer-link">Saved Jobs</Link>
            <Link to="/my-applications" className="footer-link">Applications</Link>
            <Link to="/profile" className="footer-link">Profile</Link>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <div className="footer-heading">For Employers</div>
            <a href="#" className="footer-link">Post a Job</a>
            <a href="#" className="footer-link">Find Candidates</a>
            <a href="#" className="footer-link">Manage Jobs</a>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <div className="footer-heading">Company</div>
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Contact</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Blog</a>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <div className="footer-heading">Resources</div>
            <a href="#" className="footer-link">Resume Guide</a>
            <a href="#" className="footer-link">Interview Tips</a>
            <a href="#" className="footer-link">Salary Guide</a>
            <a href="#" className="footer-link">Career Advice</a>
          </div>
        </div>

        <div className="footer-bottom d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>© 2026 Careerly. All rights reserved.</span>
          <div className="d-flex gap-3">
            <a href="#" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
