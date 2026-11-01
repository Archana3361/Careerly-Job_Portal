import React from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

const notifIcons = {
  submitted: { icon: "bi-check-circle", cls: "submitted" },
  viewed: { icon: "bi-eye", cls: "viewed" },
  shortlisted: { icon: "bi-star", cls: "shortlisted" },
  interview: { icon: "bi-calendar-event", cls: "interview" },
  rejected: { icon: "bi-x-circle", cls: "rejected" },
  status: { icon: "bi-arrow-repeat", cls: "viewed" },
};

const timeAgo = (isoString) => {
  const diff = (new Date("2026-08-16T18:00:00") - new Date(isoString)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useApp();

  return (
    <div className="notification-dropdown">
      <div
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--ivory)",
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--dark)" }}>
          Notifications {unreadCount > 0 && <span className="ms-1" style={{ background: "var(--lime)", color: "var(--dark)", fontSize: "0.7rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: 50 }}>{unreadCount}</span>}
        </span>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{ background: "none", border: "none", fontSize: "0.75rem", color: "var(--plum)", fontWeight: 600, cursor: "pointer" }}
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          No notifications yet
        </div>
      ) : (
        notifications.map((n) => {
          const { icon, cls } = notifIcons[n.type] || { icon: "bi-bell", cls: "viewed" };
          return (
            <div
              key={n.id}
              className={`notif-item ${!n.read ? "unread" : ""}`}
              onClick={() => markNotificationRead(n.id)}
            >
              {!n.read && <div className="notif-dot mt-1" style={{ marginTop: 8 }}></div>}
              <div className={`notif-icon ${cls}`}>
                <i className={`bi ${icon}`}></i>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--dark)", marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{n.message}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 4 }}>{timeAgo(n.time)}</div>
              </div>
            </div>
          );
        })
      )}

      <div style={{ padding: "0.6rem 1rem", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <Link
          to="/notifications"
          className="text-decoration-none"
          style={{ fontSize: "0.8rem", color: "var(--plum)", fontWeight: 600 }}
          onClick={onClose}
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
