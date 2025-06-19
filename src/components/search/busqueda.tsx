import React from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="expoescom-searchbar">
      <span className="expoescom-search-icon">
        {/* SVG de lupa */}
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="10" cy="10" r="8" stroke="#5f2eea" strokeWidth="2"/>
          <line x1="16.0711" y1="16.4853" x2="20" y2="20" stroke="#5f2eea" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
      <input
        type="search"
        placeholder="Buscar proyecto..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="expoescom-search-input"
      />
    </div>
  );
}
