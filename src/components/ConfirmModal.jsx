import React from "react";

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, confirmLabel = "Confirm", confirmClass = "btn-plum btn" }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(33,27,36,0.5)",
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem"
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--warm-white)", borderRadius: "var(--radius-lg)",
          padding: "2rem", maxWidth: 400, width: "100%",
          boxShadow: "var(--shadow-lg)", border: "1.5px solid var(--border)"
        }}
        onClick={e => e.stopPropagation()}
      >
        <h5 style={{ fontFamily: "Playfair Display, serif", marginBottom: "0.75rem", color: "var(--dark)" }}>{title}</h5>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>{message}</p>
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn-ghost btn" onClick={onCancel}>Cancel</button>
          <button className={confirmClass} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
