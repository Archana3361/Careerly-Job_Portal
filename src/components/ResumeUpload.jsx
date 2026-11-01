import React, { useRef, useState } from "react";

const ResumeUpload = ({ value, onChange }) => {
  const inputRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      alert("Please upload PDF, DOC or DOCX files only.");
      return;
    }
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (value) {
    return (
      <div className="resume-file-preview">
        <div className="resume-file-icon">
          <i className="bi bi-file-earmark-text"></i>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value.name || value}
          </div>
          {value.size && (
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {formatSize(value.size)}
            </div>
          )}
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn-ghost btn"
            style={{ padding: "0.25rem 0.7rem", fontSize: "0.75rem" }}
            onClick={() => inputRef.current.click()}
          >
            Change
          </button>
          <button
            type="button"
            className="btn btn-sm"
            style={{ padding: "0.25rem 0.7rem", fontSize: "0.75rem", background: "rgba(220,53,69,0.1)", color: "#dc3545", border: "none" }}
            onClick={() => onChange(null)}
          >
            Remove
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="d-none"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
    );
  }

  return (
    <div
      className={`resume-dropzone ${dragOver ? "drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <i className="bi bi-cloud-upload"></i>
      <div style={{ fontWeight: 600, color: "var(--dark)", marginBottom: 4 }}>
        Drop your resume here
      </div>
      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
        or <span style={{ color: "var(--plum)", fontWeight: 600, cursor: "pointer" }}>Choose File</span>
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 8 }}>
        Accepted formats: PDF, DOC, DOCX
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="d-none"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

export default ResumeUpload;
