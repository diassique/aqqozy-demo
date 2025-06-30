'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export const CategoriesMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#fa5a20] py-3 px-4 hover:bg-[#d14d20] transition-colors flex items-center gap-2 text-white font-medium rounded-lg"
      >
        <Menu className="w-5 h-5" />
        <span>Категории</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="
            fixed inset-0 bg-black/50 z-[100]
            lg:hidden
          "
        >
          <div 
            className="
              fixed inset-x-0 top-0 h-[100dvh] bg-white
              transition-transform duration-300 ease-out
              translate-y-0
            "
          >
            <div className="flex flex-col h-full">
              <div className="sticky top-0 bg-white p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">Категории</span>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors -mr-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="py-2">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#E75825] transition-colors text-[15px]"
                        onClick={() => setIsOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-[15px]">Нет доступных категорий</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isOpen && (
          <div 
            className="
              hidden lg:block absolute top-full left-0 mt-2 z-[101]
              w-64 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
            "
          >
            <div className="py-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#E75825] transition-colors text-[15px]"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2.5 text-gray-500 text-[15px]">Нет доступных категорий</div>
              )}
            </div>
          </div>
      )}
    </div>
  );
}; 