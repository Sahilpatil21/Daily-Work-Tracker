import React, { useState, useEffect, useRef } from 'react';
import { getSavedCompanies, saveCompanyName, syncFromServer } from '../services/companyService';

const CompanyAutocomplete = ({ name, value, onChange, required, placeholder, className }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => setQuery(value || ''), [value]);

  useEffect(() => {
    const all = getSavedCompanies();
    if (!query) {
      setSuggestions(all.slice(0, 10));
      // attempt to sync from server if possible
      syncFromServer().then((remote) => {
        if (!query) setSuggestions((remote || []).slice(0, 10));
      }).catch(() => {});
      return;
    }
    const q = query.toLowerCase();
    const filtered = all
      .map((name) => ({ name, idx: name.toLowerCase().indexOf(q) }))
      .filter((item) => item.idx !== -1)
      .sort((a, b) => a.idx - b.idx)
      .map((i) => i.name)
      .slice(0, 10);
    setSuggestions(filtered);
  }, [query]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange && onChange({ target: { name, value: val } });
    setOpen(true);
    setHighlight(-1);
  };

  const selectSuggestion = (val) => {
    setQuery(val);
    onChange && onChange({ target: { name, value: val } });
    saveCompanyName(val);
    setSuggestions(getSavedCompanies());
    // refresh from server in background
    syncFromServer().then((remote) => setSuggestions(remote || getSavedCompanies())).catch(() => {});
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlight >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[highlight]);
      } else {
        const trimmed = (query || '').trim();
        if (trimmed) saveCompanyName(trimmed);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleBlur = () => {
    const trimmed = (query || '').trim();
    if (trimmed) {
      saveCompanyName(trimmed);
      setSuggestions(getSavedCompanies());
      syncFromServer().then((remote) => setSuggestions(remote || getSavedCompanies())).catch(() => {});
    }
    // delay closing to allow click handlers to run
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        name={name}
        required={required}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto">
          {suggestions.map((s, idx) => (
            <li
              key={s}
              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
              onMouseEnter={() => setHighlight(idx)}
              className={`px-3 py-2 cursor-pointer ${idx === highlight ? 'bg-brand-100' : 'hover:bg-gray-100'}`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyAutocomplete;
