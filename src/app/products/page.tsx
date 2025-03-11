'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Grid2X2, List, Filter, X } from 'lucide-react';
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

export default function ProductsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (err) {
        setError('Ошибка при загрузке товаров');
        console.error(err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCategories(data);
      } catch (err) {
        setError('Ошибка при загрузке категорий');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Only one resize handler - improved version
  useEffect(() => {
    let isMobile = window.innerWidth < 1024;
    
    const handleResize = () => {
      const wasOnMobile = isMobile;
      isMobile = window.innerWidth < 1024;
      
      // Only close filters when transitioning from mobile to desktop
      if (wasOnMobile && !isMobile) {
        setShowFilters(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category.slug === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    console.log('Filtering product:', {
      product,
      matchesCategory,
      matchesPrice,
      selectedCategory,
      priceRange
    });
    return matchesCategory && matchesPrice;
  });

  if (loading) {
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
              <div>
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
                    <span className="text-sm px-2 py-0.5 bg-gray-100 rounded-md text-gray-600">
                      {products.length}
                    </span>
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
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Популярные бренды</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity bg-white">
                    <Image
                      src="/brands/caterpillar.svg"
                      alt="Caterpillar"
                      width={150}
                      height={40}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity bg-white">
                    <Image
                      src="/brands/deltaplus.png"
                      alt="Delta Plus"
                      width={150}
                      height={40}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity bg-white">
                    <Image
                      src="/brands/stanley.png"
                      alt="Stanley"
                      width={150}
                      height={40}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity bg-white">
                    <Image
                      src="/brands/rodex.png"
                      alt="Rodex"
                      width={150}
                      height={40}
                      className="w-full h-auto object-contain"
                    />
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
                className="mt-8 w-full py-2.5 px-4 border border-gray-200 rounded-lg text-gray-600 hover:text-[#E75825] hover:border-[#E75825] transition-colors duration-300 text-sm font-medium"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar - Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Каталог товаров</h1>
                <span className="text-sm text-gray-500 mt-1">
                  {filteredProducts.length} товаров
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <Grid2X2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Product Count and View Mode */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                {filteredProducts.length} товаров
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <Grid2X2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                Товары не найдены
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    images={product.images || []}
                    category={product.category}
                    description={product.description}
                    viewMode={viewMode}
                    isNew={product.isNew}
                    status={product.status}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 