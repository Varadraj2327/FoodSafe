import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  size?: 'md' | 'lg';
  autoNavigate?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearch,
  placeholder = 'Search food items (e.g. Milk, Turmeric, Honey)...',
  size = 'lg',
  autoNavigate = true,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (onSearch) {
      onSearch(trimmed);
    }
    if (autoNavigate && trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  const isLg = size === 'lg';

  return (
    <form onSubmit={handleFormSubmit} className="w-full relative group">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 text-emerald-600 dark:text-emerald-400 pointer-events-none">
          <Search className={isLg ? 'w-5 h-5' : 'w-4 h-4'} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className={`w-full rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-900/15 dark:border-emerald-500/20 text-slate-900 dark:text-emerald-100 placeholder:text-slate-400 dark:placeholder:text-emerald-400/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all ${
            isLg ? 'pl-12 pr-24 py-4 text-sm sm:text-base' : 'pl-10 pr-20 py-2.5 text-xs sm:text-sm'
          }`}
        />

        {/* Action Buttons Right */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-emerald-300 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-95"
            aria-label="Submit search"
          >
            <ArrowRight className={isLg ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          </button>
        </div>
      </div>
    </form>
  );
};
