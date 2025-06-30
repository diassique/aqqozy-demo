'use client';

import { Search, X, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceIsFrom: boolean;
  imageUrl: string;
  images: {
    id: number;
    url: string;
    order: number;
    productId: number;
  }[];
  category: {
    id: number;
    name: string;
    slug: string;
  };
  manufacturer?: string;
}

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
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search function
  const debounceSearch = useCallback(
    (searchQuery: string) => {
      const timeoutId = setTimeout(async () => {
        if (searchQuery.trim().length >= 2) {
          setIsLoading(true);
          try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`);
            if (response.ok) {
              const results = await response.json();
              setSearchResults(results);
              setShowSuggestions(true);
            }
          } catch (error) {
            console.error('Search error:', error);
          } finally {
            setIsLoading(false);
          }
        } else {
          setSearchResults([]);
          setShowSuggestions(false);
        }
      }, 300); // 300ms debounce delay

      return () => clearTimeout(timeoutId);
    },
    []
  );

  // Effect for debounced search
  useEffect(() => {
    const cleanup = debounceSearch(query);
    return cleanup;
  }, [query, debounceSearch]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    // Navigate to products page with search query
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setShowSuggestions(false);
    inputRef.current?.blur();
    
    // Call the onSearch callback if provided
    onSearch?.(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleProductClick = () => {
    setShowSuggestions(false);
    setQuery('');
  };

  const formatPrice = (price: number, priceIsFrom: boolean) => {
    return `${priceIsFrom ? 'от ' : ''}${price.toLocaleString('ru-RU')} ₸`;
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
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length >= 2 && searchResults.length > 0) {
              setShowSuggestions(true);
            }
          }}
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
          className={`flex items-center justify-center min-w-[56px] sm:min-w-[120px] text-white bg-[#fa5a20] hover:bg-[#d14d20] transition-colors disabled:opacity-50`}
          aria-label="Search"
        >
          <span className="hidden sm:inline mr-2">Поиск</span>
          <Search size={20} />
        </button>
      </div>

      {/* Search suggestions dropdown */}
      {showSuggestions && (searchResults.length > 0 || isLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute w-full mt-2 py-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
              <Loader2 size={16} className="animate-spin mr-2" />
              Поиск...
            </div>
          ) : (
            <>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={handleProductClick}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 relative mr-3">
                    <Image
                      src={product.images?.[0]?.url || product.imageUrl || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {product.category?.name}
                      {product.manufacturer && ` • ${product.manufacturer}`}
                    </div>
                    <div className="text-sm font-semibold text-[#fa5a20] mt-1">
                      {formatPrice(product.price, product.priceIsFrom)}
                    </div>
                  </div>
                </Link>
              ))}
              {query.trim() && (
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleSearch}
                    className="w-full px-4 py-2 text-left text-sm text-[#fa5a20] hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Search size={16} className="mr-2" />
                    Показать все результаты для "{query}"
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && searchResults.length === 0 && query.trim().length >= 2 && (
        <div
          ref={suggestionsRef}
          className="absolute w-full mt-2 py-4 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
        >
          <div className="px-4 text-sm text-gray-500 text-center">
            По запросу "{query}" ничего не найдено
          </div>
          <button
            onClick={handleSearch}
            className="w-full px-4 py-2 mt-2 text-sm text-[#fa5a20] hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Search size={16} className="mr-2" />
            Искать в каталоге
          </button>
        </div>
      )}
    </div>
  );
}; 