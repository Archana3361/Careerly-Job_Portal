import React from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";

const links = [
  { to: "/admin", icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/admin/applications", icon: "bi-file-earmark-person", label: "Applications" },
  { to: "/jobs", icon: "bi-briefcase", label: "Browse Jobs" },
];

const AdminSidebar = () => {
  const { currentUser, logout } = useApp();

  return (
    <div className="dashboard-sidebar d-flex flex-column" style={{ minHeight: "100vh" }}>
      <div className="sidebar-brand">Career<span>ly</span> <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontFamily: "Inter", fontWeight: 500 }}>Admin</span></div>

      {currentUser && (
        <div style={{ padding: "0 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "0.5rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "white" }}>{currentUser.name}</div>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Administrator</div>
        </div>
      )}

      <nav style={{ flex: 1 }}>
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === "/admin"} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <i className={`bi ${icon}`}></i>
            <span>{label}</span>
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
          }}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
