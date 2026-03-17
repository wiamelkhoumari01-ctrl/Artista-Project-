import React from "react";

export default function FiltrerBar({ categories, activeCategory, onFilterChange }) {
  return (
    <div className="filter-container">

      {categories.map((cat) => (
        <button
          key={cat}
          className={activeCategory === cat ? "active" : ""}
          onClick={() => onFilterChange(cat)}
        >
          {cat}
        </button>
      ))}

    </div>
  );
}