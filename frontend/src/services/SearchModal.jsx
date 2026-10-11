import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, FileText, MessageSquare, User, CornerDownLeft } from 'lucide-react';

const getIcon = (type) => {
  switch (type) {
    case 'lab': return <FileText className="w-4 h-4 text-muted" />;
    case 'room': return <MessageSquare className="w-4 h-4 text-muted" />;
    case 'user': return <User className="w-4 h-4 text-muted" />;
    default: return <FileText className="w-4 h-4 text-muted" />;
  }
};

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredResults = useMemo(() => {
    if (!query) return [];
    return []; // In a real app, this would filter results from a fetched list or API
      item.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 results
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleResultClick = (path) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center pt-20" onClick={onClose}>
      <div className="bg-panel w-full max-w-lg rounded-lg border border-card-border shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center border-b border-card-border p-4">
          <Search className="w-5 h-5 text-muted mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search for labs, rooms, users..."
            className="w-full bg-transparent text-text placeholder-muted focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="text-muted hover:text-text">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {query && filteredResults.length > 0 && (
            <ul className="space-y-2">
              {filteredResults.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleResultClick(item.path)}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-surface cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(item.type)}
                    <span className="text-text">{item.title}</span>
                  </div>
                  <CornerDownLeft className="w-4 h-4 text-muted" />
                </li>
              ))}
            </ul>
          )}
          {query && filteredResults.length === 0 && (
            <p className="text-center text-muted py-4">No results found for "{query}"</p>
          )}
          {!query && (
            <p className="text-center text-muted py-4">Start typing to search...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;