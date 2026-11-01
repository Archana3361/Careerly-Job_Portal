import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CandidateSidebar from "../components/CandidateSidebar";

const notifIcons = {
  submitted: { icon: "bi-check-circle-fill", cls: "submitted", bg: "rgba(200,230,74,0.15)", color: "#5a6a00" },
  viewed: { icon: "bi-eye-fill", cls: "viewed", bg: "rgba(90,49,93,0.1)", color: "var(--plum)" },
  shortlisted: { icon: "bi-star-fill", cls: "shortlisted", bg: "rgba(25,135,84,0.12)", color: "#198754" },
  interview: { icon: "bi-calendar-check-fill", cls: "interview", bg: "rgba(13,202,240,0.12)", color: "#0a5c6e" },
  rejected: { icon: "bi-x-circle-fill", cls: "rejected", bg: "rgba(220,53,69,0.1)", color: "#dc3545" },
};

const timeAgo = (isoString) => {
  const diff = (new Date("2026-08-16T18:00:00") - new Date(isoString)) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const Notifications = () => {
  const { notifications, markNotificationRead, markAllRead, currentUser, unreadCount } = useApp();

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <Link to="/login" className="btn-plum btn">Please log in</Link>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      <div style={{ width: 240, flexShrink: 0 }} className="d-none d-lg-block">
        <CandidateSidebar />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "2rem 1.5rem" }}>
        <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <span className="section-label">Stay in the loop</span>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--dark)", fontSize: "1.8rem", marginBottom: 0 }}>
              Notifications
            </h2>
          </div>
          {unreadCount > 0 && (
            <button className="btn-outline-plum btn" style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }} onClick={markAllRead}>
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <i className="bi bi-bell-slash" style={{ fontSize: "3rem", color: "var(--lavender)", display: "block", marginBottom: "1rem" }}></i>
            <h5 style={{ fontFamily: "Inter", fontWeight: 700 }}>No notifications yet</h5>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>You'll be notified about your application activity here.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2" style={{ maxWidth: 680 }}>
            {notifications.map(n => {
              const { icon, bg, color } = notifIcons[n.type] || { icon: "bi-bell-fill", bg: "var(--lavender)", color: "var(--plum)" };

              return (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  style={{
                    background: n.read ? "var(--warm-white)" : "rgba(200,230,74,0.06)",
                    border: `1.5px solid ${n.read ? "var(--border)" : "rgba(200,230,74,0.3)"}`,
                    borderRadius: "var(--radius-lg)",
                    padding: "1rem 1.25rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: bg, color, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem"
                  }}>
                    <i className={`bi ${icon}`}></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--dark)" }}>
                        {n.title}
                        {!n.read && (
                          <span style={{ width: 8, height: 8, background: "var(--lime-dark)", borderRadius: "50%", display: "inline-block", marginLeft: 8 }}></span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {timeAgo(n.time)}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{n.message}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
