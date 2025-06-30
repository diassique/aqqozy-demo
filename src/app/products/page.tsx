'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, Grid2X2, List, Filter, X, Loader as LoaderIcon } from 'lucide-react';
import { ProductCard } from '@/app/components/ProductCard';
import { FullPageLoader } from '@/app/components/Loader';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  priceIsFrom: boolean;
  imageUrl: string;
  categoryId: number;
  category: Category;
  images: {
    id: number;
    url: string;
    order: number;
    productId: number;
  }[];
  isNew: boolean;
  status: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
  const pages = [];
  const delta = 2;
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  const range: number[] = [];
  let l: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        pages.push(<span key={`ellipsis-start-${i}`} className="px-4 py-2">{l + 1}</span>);
      } else if (i - l !== 1) {
        pages.push(<span key={`ellipsis-end-${i}`} className="px-4 py-2">...</span>);
      }
    }
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`px-4 py-2 mx-1 rounded-lg ${currentPage === i ? 'bg-[#76B852] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
      >
        {i}
      </button>
    );
    l = i;
  }

  return (
    <div className="flex justify-center items-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Назад
      </button>
      {pages}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Вперед
      </button>
    </div>
  );
};

export default function ProductsPage() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = useCallback(async (page: number, isInitialLoad = false) => {
    if (!isInitialLoad) {
        setProductsLoading(true);
    }
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        category: selectedCategory,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
      });
      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при загрузке товаров');
      
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.total);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      if(isInitialLoad) {
        setInitialLoading(false);
      }
      setProductsLoading(false);
    }
  }, [selectedCategory, priceRange]);

  // Effect for initial category loading and first product fetch
  useEffect(() => {
    fetchProducts(1, true);
    
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCategories(data);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
      }
    };
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect for handling filters change
  useEffect(() => {
    if (initialLoading) return;
    if (currentPage !== 1) {
        setCurrentPage(1);
    } else {
        fetchProducts(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, priceRange]);
  
  // Effect for refetching when page changes
  useEffect(() => {
    if (initialLoading) return;
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Only one resize handler - improved version
  useEffect(() => {
    let isMobile = window.innerWidth < 1024;
    
    const handleResize = () => {
      const wasOnMobile = isMobile;
      isMobile = window.innerWidth < 1024;
      
      if (wasOnMobile && !isMobile) {
        setShowFilters(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  if (initialLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-[1300px]">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#E75825] transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">Каталог</span>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Каталог товаров</h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50"
          >
            {showFilters ? (
              <>
                <X className="w-4 h-4" />
                <span>Закрыть</span>
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                <span>Фильтры</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 lg:flex-shrink-0">
            {/* Mobile Overlay */}
            {showFilters && (
              <div 
                className="fixed inset-0 bg-[#43434380] z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              ></div>
            )}
            
            {/* Filter panel */}
            <div className={`
              fixed right-0 top-0 h-full w-[85%] max-w-[350px] z-50
              lg:static lg:z-auto lg:w-full lg:max-w-none lg:h-auto
              bg-white lg:bg-gray-50
              overflow-y-auto
              transition-transform duration-300 ease-in-out
              ${showFilters ? 'translate-x-0' : 'translate-x-full'} 
              lg:translate-x-0
              p-6 lg:p-0
              shadow-xl lg:shadow-none
            `}>
              <div className="flex justify-between items-center lg:hidden mb-6">
                <h2 className="text-xl font-semibold">Фильтр</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h2 className="hidden lg:block text-xl font-semibold mb-6">Фильтр</h2>
              
              {/* Price Range Slider */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Цена</h3>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="от"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="до"
                    />
                  </div>
                  <span className="flex items-center text-sm text-gray-500">₸</span>
                </div>
                <div className="relative">
                  <div className="h-1 bg-[#E8E8E8] rounded-full"></div>
                  <input
                    type="range"
                    min="0"
                    max="6000000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="absolute top-0 left-0 w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#76B852] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#76B852] [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="6000000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="absolute top-0 left-0 w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#76B852] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#76B852] [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Категории</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={selectedCategory === 'all'}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          if (showFilters) setShowFilters(false);
                        }}
                        className="hidden"
                      />
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        selectedCategory === 'all' ? 'bg-[#3B82F6]' : 'bg-gray-300'
                      }`}></div>
                      <span className={`text-[15px] transition-colors ${
                        selectedCategory === 'all' ? 'text-[#3B82F6] font-medium' : 'text-gray-700 group-hover:text-[#3B82F6]'
                      }`}>
                        Все категории
                      </span>
                    </div>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.slug}
                          checked={selectedCategory === category.slug}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            if (showFilters) setShowFilters(false);
                          }}
                          className="hidden"
                        />
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          selectedCategory === category.slug ? 'bg-[#3B82F6]' : 'bg-gray-300'
                        }`}></div>
                        <span className={`text-[15px] transition-colors ${
                          selectedCategory === category.slug ? 'text-[#3B82F6] font-medium' : 'text-gray-700 group-hover:text-[#3B82F6]'
                        }`}>
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm px-2 py-0.5 bg-gray-100 rounded-md text-gray-600">
                        {category.productCount}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Popular Brands */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Популярные бренды</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-[#76B852] transition-colors cursor-pointer">
                    <Image src="/brands/caterpillar.png" alt="Caterpillar" width={60} height={30} className="mx-auto" />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-[#76B852] transition-colors cursor-pointer">
                    <Image src="/brands/stanley.png" alt="Stanley" width={60} height={30} className="mx-auto" />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-[#76B852] transition-colors cursor-pointer">
                    <Image src="/brands/deltaplus.png" alt="Delta Plus" width={60} height={30} className="mx-auto" />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-[#76B852] transition-colors cursor-pointer">
                    <Image src="/brands/rodex.png" alt="Rodex" width={60} height={30} className="mx-auto" />
                  </div>
                </div>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, 6000000]);
                  if (showFilters) setShowFilters(false);
                }}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <main className="flex-1">
            {/* Top bar with view mode switcher */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="hidden lg:block text-2xl font-bold">Каталог товаров</h1>
              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                <span className="text-sm text-gray-500">
                  Показано {products.length} из {totalProducts} товаров
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'grid'
                        ? 'bg-[#76B852] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid2X2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'list'
                        ? 'bg-[#76B852] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {productsLoading ? (
              <div className="flex justify-center items-center h-96">
                 <LoaderIcon className="w-10 h-10 animate-spin text-[#E75825]" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
            ) : products.length > 0 ? (
              <>
                <div
                  className={`grid ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                      : 'grid-cols-1 gap-4'
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} viewMode={viewMode} />
                  ))}
                </div>
                {totalPages > 1 && (
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                 <Image src="/images/not-found.svg" alt="Не найдено" width={150} height={150} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить фильтры или сбросить их.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
} 