import React, { useState, useEffect, useRef } from 'react';
import { getDescriptionsByCompany } from '../services/workService';

const DescriptionAutocomplete = ({ name, value, onChange, required, placeholder, className, companyName, rows = 2 }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => setQuery(value || ''), [value]);

  useEffect(() => {
    if (!companyName) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const all = await getDescriptionsByCompany(companyName);
      if (!query) {
        setSuggestions(all.slice(0, 10));
        return;
      }
      const q = query.toLowerCase();
      const filtered = all
        .map((desc) => ({ desc, idx: desc.toLowerCase().indexOf(q) }))
        .filter((item) => item.idx !== -1)
        .sort((a, b) => a.idx - b.idx)
        .map((i) => i.desc)
        .slice(0, 10);
      setSuggestions(filtered);
    };

    fetchSuggestions();
  }, [query, companyName]);

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
      if (highlight >= 0 && !e.shiftKey) {
        e.preventDefault();
        selectSuggestion(suggestions[highlight]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" ref={containerRef}>
      <textarea
        name={name}
        required={required}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={className}
        rows={rows}
        autoComplete="off"
      ></textarea>
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg z-10 max-h-48 overflow-y-auto mt-0">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              onClick={() => selectSuggestion(suggestion)}
              className={`px-4 py-2 cursor-pointer transition-colors text-sm break-words whitespace-normal ${
                idx === highlight ? 'bg-brand-100 text-brand-900' : 'hover:bg-gray-100'
              }`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DescriptionAutocomplete;
