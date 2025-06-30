'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { Phone, Mail, MapPin, Menu as MenuIcon, X } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { CategoriesMenu } from './CategoriesMenu';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100">
        {/* Top bar with contacts */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-2 max-w-[1300px] flex flex-wrap justify-between items-center text-sm">
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 text-[#E75825] mr-1.5" />
                <a href="tel:+77018333837" className="hover:text-[#E75825] transition-colors text-sm">
                  +7 (701) 833-38-37
                </a>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 text-[#E75825] mr-1.5" />
                <a href="mailto:info@aqqozy.kz" className="hover:text-[#E75825] transition-colors text-sm">
                  info@aqqozy.kz
                </a>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6 mt-2 sm:mt-0 w-full sm:w-auto justify-center">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 text-[#E75825] mr-1.5" />
                <span>г. Алматы</span>
              </div>
              <div className="text-gray-600">
                Режим работы: 09:00 - 20:00
              </div>
            </div>
          </div>
        </div>

        {/* Main header with logo and search */}
        <div className="container mx-auto px-4 py-4 sm:py-6 max-w-[1300px]">
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            <Logo className="flex-shrink-0 order-first" />
            
            <div className="flex-grow max-w-2xl hidden sm:block">
              <SearchInput />
            </div>
            
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link href="/about" className="text-gray-600 hover:text-[#E75825] transition-colors">О нас</Link>
              <Link href="/contacts" className="text-gray-600 hover:text-[#E75825] transition-colors">Контакты</Link>
            </div>

            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg order-last"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <MenuIcon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
          
          {/* Mobile Search */}
          <div className="sm:hidden mt-4">
            <SearchInput />
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-[#E75825] transition-colors py-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  О нас
                </Link>
                <Link 
                  href="/delivery" 
                  className="text-gray-600 hover:text-[#E75825] transition-colors py-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Доставка
                </Link>
                <Link 
                  href="/contacts" 
                  className="text-gray-600 hover:text-[#E75825] transition-colors py-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Контакты
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>
      
      {/* Sticky Navigation - separate from header */}
      <div className={`bg-gray-50 border-b border-gray-200 transition-all duration-300 py-2 ${
        isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'
      }`}>
        <div className="container mx-auto px-4 max-w-[1300px]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CategoriesMenu />
            </div>
            <div className="flex items-center overflow-x-auto">
              <Link 
                href="/" 
                className="px-4 py-3 text-gray-600 hover:text-[#E75825] transition-colors font-medium whitespace-nowrap"
              >
                Главная
              </Link>
              <Link 
                href="/products" 
                className="px-4 py-3 text-gray-600 hover:text-[#E75825] transition-colors font-medium whitespace-nowrap"
              >
                Все товары
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed navigation */}
      {isScrolled && <div className="h-20"></div>}
    </>
  );
};

export default Header; 