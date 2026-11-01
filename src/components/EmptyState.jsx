import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ icon = "bi-inbox", title, subtitle, ctaLabel, ctaTo }) => (
  <div className="empty-state">
    <i className={`bi ${icon}`}></i>
    <h5>{title}</h5>
    {subtitle && <p>{subtitle}</p>}
    {ctaLabel && ctaTo && (
      <Link to={ctaTo} className="btn-lime btn mt-3">{ctaLabel}</Link>
    )}
  </div>
);

export default EmptyState;
