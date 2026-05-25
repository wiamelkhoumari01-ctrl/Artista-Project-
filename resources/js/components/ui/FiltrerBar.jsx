import React from 'react';

export default function FiltrerBar({ categories, activeCategory, onFilterChange }) {
  return (
    <div className="filter-container">
      {categories.map(cat => (
        <button
          key={cat.id ?? 'tous'}
          className={activeCategory === cat.id ? 'active' : ''}
          onClick={() => onFilterChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}