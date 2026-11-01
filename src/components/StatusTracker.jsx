import React from "react";

const STEPS = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected"];

const StatusTracker = ({ status }) => {
  const isRejected = status === "Rejected";
  const activeSteps = isRejected
    ? ["Applied", "Under Review", "Rejected"]
    : STEPS;

  const currentIndex = isRejected
    ? activeSteps.indexOf("Rejected")
    : activeSteps.indexOf(status);

  return (
    <div>
      <div className="status-timeline">
        {activeSteps.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isRej = step === "Rejected";

          let dotClass = "";
          if (isRej && isCurrent) dotClass = "rejected";
          else if (isCurrent) dotClass = "active";
          else if (isDone) dotClass = "completed";

          return (
            <React.Fragment key={step}>
              <div className="status-step">
                <div className={`status-dot ${dotClass}`}>
                  {isDone ? (
                    <i className="bi bi-check" style={{ fontSize: "0.85rem" }}></i>
                  ) : isRej && isCurrent ? (
                    <i className="bi bi-x" style={{ fontSize: "0.85rem" }}></i>
                  ) : isCurrent ? (
                    <i className="bi bi-circle-fill" style={{ fontSize: "0.5rem" }}></i>
                  ) : (
                    <i className="bi bi-circle" style={{ fontSize: "0.5rem" }}></i>
                  )}
                </div>
                <div className={`status-label ${isCurrent ? "active" : ""}`} style={{ color: isRej && isCurrent ? "#dc3545" : undefined }}>
                  {step}
                </div>
              </div>
              {index < activeSteps.length - 1 && (
                <div className={`status-connector ${isDone || (isCurrent && !isRej) ? "completed" : ""}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;
