'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Loader } from './Loader';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  priceIsFrom: boolean;
  imageUrl: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  images: {
    id: number;
    url: string;
    order: number;
    productId: number;
  }[];
  isNew: boolean;
  status: string;
  saleType: string;
}

export const NewProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/products?limit=4&sort=latest');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching latest products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <section className="py-16 bg-[#ECF2F7] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
      
      <div className="container mx-auto px-4 max-w-[1300px] relative">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Новинки
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              Ознакомьтесь с нашими новыми поступлениями
            </p>
          </div>
          <Link 
            href="/products" 
            className="hidden md:inline-flex items-center text-[#1e3a8a] hover:text-[#1e3a8a]/80 transition-colors group"
          >
            <span className="text-lg font-medium border-b border-transparent group-hover:border-[#1e3a8a]/80 transition-colors">
              Перейти в каталог
            </span>
            <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="max-w-[300px] w-full mx-auto">
                <ProductCard
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  priceIsFrom={product.priceIsFrom}
                  imageUrl={product.imageUrl}
                  images={product.images}
                  category={product.category}
                  description={product.description}
                  viewMode="grid"
                  isNew={product.isNew}
                  status={product.status}
                  saleType={product.saleType}
                />
              </div>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-lg font-medium text-white bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 rounded-xl transition-colors"
          >
            Перейти в каталог
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}; 