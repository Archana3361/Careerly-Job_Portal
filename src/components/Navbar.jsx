import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const { currentUser, logout, unreadCount } = useApp();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const [showResourcesMenu, setShowResourcesMenu] = useState(false);
  const notifRef = useRef();
  const userRef = useRef();
  const exploreRef = useRef();
  const resourcesRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
      if (exploreRef.current && !exploreRef.current.contains(e.target)) setShowExploreMenu(false);
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) setShowResourcesMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="careerly-navbar navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Career<span>ly</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav mx-auto gap-1 align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/jobs">Find Jobs</NavLink>
            </li>

            {/* Explore groups the three job-discovery sections into one compact bookmark. */}
            <li className="nav-item position-relative" ref={exploreRef}>
              <button
                type="button"
                className={`nav-link nav-link-button ${showExploreMenu ? "active" : ""}`}
                onClick={() => {
                  setShowExploreMenu(v => !v);
                  setShowResourcesMenu(false);
                }}
              >
                Explore <i className="bi bi-chevron-down ms-1" style={{ fontSize: "0.65rem" }}></i>
              </button>
              {showExploreMenu && (
                <div className="nav-section-menu">
                  <a href="/#popular-categories" onClick={() => setShowExploreMenu(false)}>
                    <i className="bi bi-grid-3x3-gap"></i> Popular Categories
                  </a>
                  <a href="/#featured-jobs" onClick={() => setShowExploreMenu(false)}>
                    <i className="bi bi-briefcase"></i> Featured Jobs
                  </a>
                  <a href="/#work-from-anywhere" onClick={() => setShowExploreMenu(false)}>
                    <i className="bi bi-globe2"></i> Work From Anywhere
                  </a>
                </div>
              )}
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/#featured-companies">Companies</a>
            </li>

            {/* Resources groups learning content and testimonials without overcrowding the navbar. */}
            <li className="nav-item position-relative" ref={resourcesRef}>
              <button
                type="button"
                className={`nav-link nav-link-button ${showResourcesMenu ? "active" : ""}`}
                onClick={() => {
                  setShowResourcesMenu(v => !v);
                  setShowExploreMenu(false);
                }}
              >
                Resources <i className="bi bi-chevron-down ms-1" style={{ fontSize: "0.65rem" }}></i>
              </button>
              {showResourcesMenu && (
                <div className="nav-section-menu nav-section-menu-right">
                  <a href="/#career-resources" onClick={() => setShowResourcesMenu(false)}>
                    <i className="bi bi-book"></i> Career Resources
                  </a>
                  <a href="/#job-seeker-stories" onClick={() => setShowResourcesMenu(false)}>
                    <i className="bi bi-chat-quote"></i> What Job Seekers Say
                  </a>
                </div>
              )}
            </li>

            {currentUser?.role === "admin" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">Admin</NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {currentUser ? (
              <>
                {/* Notifications */}
                <div className="position-relative" ref={notifRef}>
                  <button
                    className="btn btn-ghost border-0 position-relative text-white"
                    style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6 }}
                    onClick={() => { setShowNotifs(v => !v); setShowUserMenu(false); }}
                  >
                    <i className="bi bi-bell" style={{ fontSize: "1.1rem" }}></i>
                    {unreadCount > 0 && (
                      <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                    )}
                  </button>
                  {showNotifs && (
                    <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 2000 }}>
                      <NotificationDropdown onClose={() => setShowNotifs(false)} />
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="position-relative" ref={userRef}>
                  <button
                    className="btn d-flex align-items-center gap-2"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 6,
                      color: "white",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      padding: "0.4rem 0.9rem",
                    }}
                    onClick={() => { setShowUserMenu(v => !v); setShowNotifs(false); }}
                  >
                    <div
                      style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: "var(--lime)", color: "var(--dark)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: 700
                      }}
                    >
                      {currentUser.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="d-none d-md-inline">{currentUser.name?.split(" ")[0]}</span>
                    <i className="bi bi-chevron-down" style={{ fontSize: "0.7rem" }}></i>
                  </button>

                  {showUserMenu && (
                    <div
                      style={{
                        position: "absolute", right: 0, top: "calc(100% + 8px)",
                        background: "var(--warm-white)", border: "1.5px solid var(--border)",
                        borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
                        minWidth: 200, zIndex: 2000, overflow: "hidden"
                      }}
                    >
                      <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", background: "var(--ivory)" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--dark)" }}>{currentUser.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{currentUser.email}</div>
                      </div>
                      {currentUser.role === "candidate" && (
                        <>
                          <Link to="/dashboard" className="d-block px-3 py-2 text-decoration-none" style={{ fontSize: "0.875rem", color: "var(--dark)" }} onClick={() => setShowUserMenu(false)}>
                            <i className="bi bi-grid me-2 text-plum"></i> Dashboard
                          </Link>
                          <Link to="/my-applications" className="d-block px-3 py-2 text-decoration-none" style={{ fontSize: "0.875rem", color: "var(--dark)" }} onClick={() => setShowUserMenu(false)}>
                            <i className="bi bi-file-earmark-text me-2 text-plum"></i> My Applications
                          </Link>
                          <Link to="/saved-jobs" className="d-block px-3 py-2 text-decoration-none" style={{ fontSize: "0.875rem", color: "var(--dark)" }} onClick={() => setShowUserMenu(false)}>
                            <i className="bi bi-bookmark me-2 text-plum"></i> Saved Jobs
                          </Link>
                          <Link to="/profile" className="d-block px-3 py-2 text-decoration-none" style={{ fontSize: "0.875rem", color: "var(--dark)" }} onClick={() => setShowUserMenu(false)}>
                            <i className="bi bi-person me-2 text-plum"></i> Profile
                          </Link>
                        </>
                      )}
                      {currentUser.role === "admin" && (
                        <Link to="/admin" className="d-block px-3 py-2 text-decoration-none" style={{ fontSize: "0.875rem", color: "var(--dark)" }} onClick={() => setShowUserMenu(false)}>
                          <i className="bi bi-speedometer2 me-2 text-plum"></i> Admin Dashboard
                        </Link>
                      )}
                      <div style={{ borderTop: "1px solid var(--border)" }}>
                        <button
                          className="btn d-block w-100 text-start px-3 py-2"
                          style={{ fontSize: "0.875rem", color: "#dc3545", background: "none", border: "none" }}
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost btn">Log In</Link>
                <Link to="/register" className="btn-lime btn">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
