import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import AdminSidebar from "../components/AdminSidebar";
import StatusTracker from "../components/StatusTracker";
import ConfirmModal from "../components/ConfirmModal";

const interviewTypes = ["Video Call", "Phone Call", "In-Person", "Technical Round", "HR Round"];

const AdminApplicationDetails = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { applications, updateApplicationStatus, addNotification, currentUser } = useApp();

  const app = applications.find(a => a.id === parseInt(appId) || a.id === appId);

  const [showShortlistConfirm, setShowShortlistConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: "", time: "", type: "Video Call", link: "", message: ""
  });
  const [actionDone, setActionDone] = useState(null);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="container py-5 text-center">
        <Link to="/login" className="btn-plum btn">Access Denied</Link>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="container py-5 text-center">
        <h4>Application not found.</h4>
        <Link to="/admin/applications" className="btn-plum btn mt-3">Back</Link>
      </div>
    );
  }

  const handleShortlist = () => {
    updateApplicationStatus(app.id, "Shortlisted");
    addNotification({
      type: "shortlisted",
      title: "Congratulations! You've been shortlisted",
      message: `You have been shortlisted for ${app.jobTitle} at ${app.company}.`,
    });
    setShowShortlistConfirm(false);
    setActionDone("shortlisted");
  };

  const handleReject = () => {
    updateApplicationStatus(app.id, "Rejected");
    addNotification({
      type: "rejected",
      title: "Application Status Update",
      message: `Your application for ${app.jobTitle} at ${app.company} has been rejected.`,
    });
    setShowRejectConfirm(false);
    setActionDone("rejected");
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    if (!interviewForm.date || !interviewForm.time) {
      alert("Please provide date and time.");
      return;
    }
    updateApplicationStatus(app.id, "Interview", interviewForm);
    addNotification({
      type: "interview",
      title: "Interview Scheduled",
      message: `Your interview for ${app.jobTitle} at ${app.company} has been scheduled on ${interviewForm.date} at ${interviewForm.time}.`,
    });
    setShowInterviewForm(false);
    setActionDone("interview");
  };

  const currentStatus = applications.find(a => a.id === app.id)?.status || app.status;

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      <div style={{ width: 240, flexShrink: 0 }} className="d-none d-lg-block">
        <AdminSidebar />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "2rem 1.5rem" }}>
        <div className="mb-3">
          <Link to="/admin/applications" style={{ fontSize: "0.8rem", color: "var(--plum)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <i className="bi bi-arrow-left"></i> Back to Applications
          </Link>
        </div>

        <div className="mb-4">
          <span className="section-label">Application review</span>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 900, color: "var(--dark)", fontSize: "1.8rem", marginBottom: 0 }}>
            View Application
          </h2>
        </div>

        {/* Action success */}
        {actionDone && (
          <div style={{
            background: actionDone === "rejected" ? "rgba(220,53,69,0.08)" : "rgba(25,135,84,0.08)",
            border: `1px solid ${actionDone === "rejected" ? "rgba(220,53,69,0.2)" : "rgba(25,135,84,0.2)"}`,
            borderRadius: "var(--radius)",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            color: actionDone === "rejected" ? "#dc3545" : "#198754",
            marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <i className={`bi bi-${actionDone === "rejected" ? "x-circle" : "check-circle"}`}></i>
            {actionDone === "shortlisted" && "Candidate has been shortlisted. Notification sent."}
            {actionDone === "rejected" && "Application has been rejected. Notification sent."}
            {actionDone === "interview" && "Interview has been scheduled. Notification sent."}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            {/* Candidate Info */}
            <div className="card-inner-section mb-4">
              <div className="detail-section-title mb-3">Candidate Information</div>
              <div className="d-flex align-items-center gap-4 mb-4">
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "var(--plum)", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, flexShrink: 0
                }}>
                  {(app.fullName || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontFamily: "Playfair Display, serif", fontWeight: 800, color: "var(--dark)", marginBottom: "0.2rem" }}>
                    {app.fullName || "Candidate"}
                  </h4>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{app.email || "—"}</div>
                </div>
              </div>

              <div className="row g-3">
                {[
                  { label: "Email", val: app.email, icon: "bi-envelope" },
                  { label: "Phone", val: app.phone, icon: "bi-phone" },
                  { label: "Location", val: app.location, icon: "bi-geo-alt" },
                  { label: "Qualification", val: app.qualification, icon: "bi-mortarboard" },
                  { label: "Experience", val: app.experience, icon: "bi-briefcase" },
                  { label: "Skills", val: app.skills, icon: "bi-lightning" },
                ].map(f => (
                  <div key={f.label} className="col-md-6">
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                      <i className={`bi ${f.icon}`}></i> {f.label}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: f.val ? "var(--dark)" : "var(--text-muted)", fontStyle: f.val ? "normal" : "italic" }}>
                      {f.val || "Not provided"}
                    </div>
                  </div>
                ))}
              </div>

              {app.coverLetter && (
                <div className="mt-4">
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8 }}>
                    Cover Letter
                  </div>
                  <div style={{
                    background: "var(--ivory)", borderRadius: "var(--radius)", padding: "1rem",
                    fontSize: "0.875rem", color: "var(--dark)", lineHeight: 1.7, border: "1px solid var(--border)"
                  }}>
                    {app.coverLetter}
                  </div>
                </div>
              )}
            </div>

            {/* Applied Job */}
            <div className="card-inner-section mb-4">
              <div className="detail-section-title mb-3">Applied Position</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--dark)", marginBottom: 4 }}>{app.jobTitle}</div>
              <div style={{ fontSize: "0.875rem", color: "var(--plum)", fontWeight: 500, marginBottom: 8 }}>{app.company}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                <i className="bi bi-calendar3"></i> Applied on {app.appliedDate}
              </div>
            </div>

            {/* Interview form */}
            {showInterviewForm && (
              <div className="card-inner-section mb-4" style={{ border: "2px solid var(--plum)" }}>
                <div className="detail-section-title mb-3">Schedule Interview</div>
                <form onSubmit={handleScheduleInterview}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={interviewForm.date}
                        onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={interviewForm.time}
                        onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Interview Type</label>
                      <select
                        className="form-select"
                        value={interviewForm.type}
                        onChange={e => setInterviewForm({ ...interviewForm, type: e.target.value })}
                      >
                        {interviewTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Meeting Link / Location</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://meet.google.com/... or Office address"
                        value={interviewForm.link}
                        onChange={e => setInterviewForm({ ...interviewForm, link: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message to Candidate</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Any instructions or notes for the candidate..."
                        value={interviewForm.message}
                        onChange={e => setInterviewForm({ ...interviewForm, message: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn-plum btn">
                      <i className="bi bi-calendar-check me-2"></i>Schedule Interview
                    </button>
                    <button type="button" className="btn-ghost btn" onClick={() => setShowInterviewForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Actions sidebar */}
          <div className="col-lg-4">
            {/* Status */}
            <div className="card-inner-section mb-4">
              <div className="detail-section-title mb-3">Application Status</div>
              <StatusTracker status={currentStatus} />
            </div>

            {/* Resume */}
            {app.resume && (
              <div className="card-inner-section mb-4">
                <div className="detail-section-title mb-3">Resume</div>
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  background: "var(--ivory)", borderRadius: "var(--radius)", padding: "0.75rem",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ width: 36, height: 36, background: "rgba(90,49,93,0.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--plum)", fontSize: "1rem" }}>
                    <i className="bi bi-file-earmark-text"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--dark)" }}>{app.resume}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Resume</div>
                  </div>
                </div>
                <button className="btn-outline-plum btn w-100 mt-2" style={{ fontSize: "0.8rem" }}>
                  <i className="bi bi-eye me-2"></i>View Resume
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="card-inner-section">
              <div className="detail-section-title mb-3">Actions</div>
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn w-100"
                  style={{ background: "rgba(25,135,84,0.1)", color: "#198754", border: "1.5px solid rgba(25,135,84,0.2)", fontWeight: 600, fontSize: "0.875rem", padding: "0.6rem" }}
                  onClick={() => setShowShortlistConfirm(true)}
                  disabled={currentStatus === "Shortlisted" || currentStatus === "Interview" || currentStatus === "Selected" || currentStatus === "Rejected"}
                >
                  <i className="bi bi-star me-2"></i>Shortlist
                </button>
                <button
                  className="btn w-100"
                  style={{ background: "rgba(13,202,240,0.1)", color: "#0a5c6e", border: "1.5px solid rgba(13,202,240,0.2)", fontWeight: 600, fontSize: "0.875rem", padding: "0.6rem" }}
                  onClick={() => setShowInterviewForm(v => !v)}
                  disabled={currentStatus === "Rejected"}
                >
                  <i className="bi bi-calendar-event me-2"></i>Schedule Interview
                </button>
                <button
                  className="btn w-100"
                  style={{ background: "rgba(220,53,69,0.08)", color: "#dc3545", border: "1.5px solid rgba(220,53,69,0.15)", fontWeight: 600, fontSize: "0.875rem", padding: "0.6rem" }}
                  onClick={() => setShowRejectConfirm(true)}
                  disabled={currentStatus === "Rejected"}
                >
                  <i className="bi bi-x-circle me-2"></i>Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modals */}
      <ConfirmModal
        show={showShortlistConfirm}
        title="Shortlist Candidate"
        message={`Are you sure you want to shortlist ${app.fullName || "this candidate"} for ${app.jobTitle}? They will receive a notification.`}
        confirmLabel="Shortlist"
        confirmClass="btn w-100"
        onConfirm={handleShortlist}
        onCancel={() => setShowShortlistConfirm(false)}
      />

      <ConfirmModal
        show={showRejectConfirm}
        title="Reject Application"
        message={`Are you sure you want to reject ${app.fullName || "this candidate"}'s application for ${app.jobTitle}? This will notify the candidate.`}
        confirmLabel="Reject"
        confirmClass="btn"
        onConfirm={handleReject}
        onCancel={() => setShowRejectConfirm(false)}
      />
    </div>
  );
};

export default AdminApplicationDetails;
