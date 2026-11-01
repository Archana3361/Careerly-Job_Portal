import React from "react";

const locations = ["Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune", "Remote"];
const experiences = ["Fresher", "0–1 years", "1–3 years", "3–5 years", "5+ years"];
const jobTypes = ["Full-time", "Part-time", "Internship", "Contract", "Freelance"];
const workModes = ["Remote", "Hybrid", "Onsite"];
const categories = [
  "Software Development", "Data Science", "UI/UX Design",
  "Marketing", "Finance", "Human Resources", "Sales", "Cloud & DevOps"
];

const FilterPanel = ({ filters, onChange, onClear }) => {
  const toggle = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  const CheckGroup = ({ label, items, filterKey }) => (
    <div className="mb-4">
      <div className="filter-group-title">{label}</div>
      {items.map(item => (
        <div className="form-check mb-1" key={item}>
          <input
            className="form-check-input"
            type="checkbox"
            id={`${filterKey}-${item}`}
            checked={(filters[filterKey] || []).includes(item)}
            onChange={() => toggle(filterKey, item)}
          />
          <label className="form-check-label" htmlFor={`${filterKey}-${item}`}>{item}</label>
        </div>
      ))}
    </div>
  );

  const hasFilters = Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : Boolean(v));

  return (
    <div className="filter-panel">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--dark)" }}>Filters</span>
        {hasFilters && (
          <button
            className="btn"
            onClick={onClear}
            style={{ background: "none", border: "none", color: "var(--plum)", fontSize: "0.78rem", fontWeight: 600, padding: 0, cursor: "pointer" }}
          >
            Clear all
          </button>
        )}
      </div>

      <CheckGroup label="Location" items={locations} filterKey="locations" />
      <CheckGroup label="Experience" items={experiences} filterKey="experience" />
      <CheckGroup label="Job Type" items={jobTypes} filterKey="jobTypes" />
      <CheckGroup label="Work Mode" items={workModes} filterKey="workModes" />
      <CheckGroup label="Category" items={categories} filterKey="categories" />
    </div>
  );
};

export default FilterPanel;
