import React from "react";

export default function SearchBar({ onSearch }) {
  return (
    <div className="search-container">

      <input
        type="text"
        placeholder=" Rechercher un artiste..."
        onChange={(e) => onSearch(e.target.value)}
      />

    </div>
  );
}