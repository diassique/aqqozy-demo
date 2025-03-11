'use client';

import { Search, X, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';

interface SearchInputProps {
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export const SearchInput = ({
  onSearch,
  className = '',
  placeholder = 'Поиск товаров...',
}: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      onSearch?.(query);
      setIsLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`relative flex items-stretch transition-all duration-200 ${
          isFocused
            ? 'ring-2 ring-[#fa5a20] ring-offset-0'
            : 'ring-1 ring-gray-200'
        } bg-white rounded-xl overflow-hidden`}
      >
        <div className="flex items-center pl-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full py-3.5 px-3 text-base text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
        />
        {query && (
          <div className="flex items-center pr-2">
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-gray-400" />
            ) : (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X size={20} className="text-gray-400" />
              </button>
            )}
          </div>
        )}
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className={`flex items-center justify-center min-w-[56px] sm:min-w-[120px] text-white bg-[#fa5a20] hover:bg-[#d14d20] transition-colors`}
          aria-label="Search"
        >
          <span className="hidden sm:inline mr-2">Поиск</span>
          <Search size={20} />
        </button>
      </div>

      {/* Search suggestions container - can be populated later */}
      {isFocused && query && (
        <div className="absolute w-full mt-2 py-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          <div className="px-4 py-2 text-sm text-gray-500">
            Начните вводить для поиска...
          </div>
        </div>
      )}
    </div>
  );
}; 