import React from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";

const links = [
  { to: "/dashboard", icon: "bi-grid-1x2", label: "Dashboard" },
  { to: "/jobs", icon: "bi-search", label: "Find Jobs" },
  { to: "/my-applications", icon: "bi-file-earmark-text", label: "My Applications" },
  { to: "/saved-jobs", icon: "bi-bookmark", label: "Saved Jobs" },
  { to: "/notifications", icon: "bi-bell", label: "Notifications" },
  { to: "/profile", icon: "bi-person-circle", label: "Profile" },
];

const CandidateSidebar = () => {
  const { currentUser, logout, unreadCount } = useApp();

  return (
    <div className="dashboard-sidebar d-flex flex-column" style={{ minHeight: "100vh" }}>
      <div className="sidebar-brand">Career<span>ly</span></div>

      {currentUser && (
        <div style={{ padding: "0 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "0.5rem" }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--lime)", color: "var(--dark)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.9rem", flexShrink: 0
            }}>
              {currentUser.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentUser.email}
              </div>
            </div>
          </div>
        </div>
      )}

      <nav style={{ flex: 1 }}>
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <i className={`bi ${icon}`}></i>
            <span>{label}</span>
            {label === "Notifications" && unreadCount > 0 && (
              <span style={{
                marginLeft: "auto",
                background: "var(--lime)",
                color: "var(--dark)",
                fontSize: "0.65rem",
                fontWeight: 700,
                padding: "0.1rem 0.4rem",
                borderRadius: 50,
              }}>
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button
          onClick={logout}
          className="d-flex align-items-center gap-2 w-100"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            color: "rgba(255,255,255,0.65)",
            padding: "0.5rem 0.75rem",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: "all 0.2s"
          }}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CandidateSidebar;
