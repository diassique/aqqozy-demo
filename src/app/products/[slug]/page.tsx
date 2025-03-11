'use client';

import { useState, useEffect, use } from 'react';
import type { Usable } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { FullPageLoader } from '@/app/components/Loader';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
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
  manufacturer?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  quantity?: number;
  status?: string;
}

const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const resolvedParams = use<{ slug: string }>(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${resolvedParams.slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProduct(data);

        // Validate and set initial image URL
        const validImages = data.images.filter((img: { url?: string }) => {
          if (!img?.url) return false;
          const trimmedUrl = img.url.trim();
          return trimmedUrl.length > 0;
        });
        
        const firstValidImage = validImages.length > 0 ? validImages[0].url : null;
        const mainImageUrl = data.imageUrl ? data.imageUrl.trim() || null : null;
        
        setSelectedImageUrl(firstValidImage ?? mainImageUrl ?? null);
      } catch (err) {
        setError('Ошибка при загрузке товара');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Товар не найден'}
          </h1>
          <Link
            href="/products"
            className="text-[#1e3a8a] hover:underline"
          >
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-[1300px]">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#1e3a8a] transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/products" className="hover:text-[#1e3a8a] transition-colors">
            Каталог
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link 
            href={`/products?category=${product.category.slug}`}
            className="hover:text-[#1e3a8a] transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="md:bg-white md:rounded-2xl md:shadow-sm md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Product Images */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="relative">
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:w-[88px] pb-2 md:pb-0">
                  <div className="flex md:flex-col gap-2 p-1">
                    {product.images
                      .filter((image): image is typeof product.images[0] => {
                        return Boolean(image?.url && image.url.trim());
                      })
                      .map((image) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImageUrl(image.url)}
                          className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                            selectedImageUrl === image.url 
                              ? 'ring-2 ring-[#1e3a8a] ring-offset-1' 
                              : 'ring-1 ring-gray-200 hover:ring-[#1e3a8a] hover:ring-2 hover:ring-offset-1'
                          }`}
                        >
                          <Image
                            src={image.url?.trim() || BLANK_IMAGE}
                            alt={`${product.name} - изображение ${image.order}`}
                            fill
                            className="object-contain transition-transform duration-300 hover:scale-110"
                            sizes="80px"
                          />
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
                  <Zoom>
                    <Image
                      src={selectedImageUrl?.trim() || BLANK_IMAGE}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </Zoom>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="px-4 md:px-0">
              <div className="mb-1">
                <Link 
                  href={`/products?category=${product.category.slug}`}
                  className="text-sm text-gray-500 hover:text-[#1e3a8a] transition-colors"
                >
                  {product.category.name}
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-[#1e3a8a]">
                  {product.price.toLocaleString('ru-RU')} ₸
                </span>
                {product.isNew && (
                  <span className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full">
                    Новинка
                  </span>
                )}
              </div>

              {/* Characteristics */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Характеристики</h3>
                <div className="grid grid-cols-1 gap-0">
                  {product.manufacturer && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Производитель</span>
                      <span className="text-gray-900">{product.manufacturer}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Артикул</span>
                      <span className="text-gray-900">{product.sku}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Вес</span>
                      <span className="text-gray-900">{product.weight} кг</span>
                    </div>
                  )}
                  {product.dimensions && product.dimensions.length !== null && product.dimensions.width !== null && product.dimensions.height !== null && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Размеры</span>
                      <span className="text-gray-900">
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} см
                      </span>
                    </div>
                  )}
                  {product.quantity !== null && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Наличие</span>
                      <span className="text-gray-900">
                        {(() => {
                          switch (product.status) {
                            case 'OUT_OF_STOCK':
                              return <span className="text-red-500">Нет в наличии</span>;
                            case 'LOW_STOCK':
                              return <span className="text-orange-500">Заканчивается</span>;
                            case 'PREORDER':
                              return <span className="text-blue-500">Предзаказ</span>;
                            case 'DISCONTINUED':
                              return <span className="text-gray-500">Снят с производства</span>;
                            case 'IN_STOCK':
                            default:
                              return `${product.quantity} шт`;
                          }
                        })()}
                      </span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Категория</span>
                      <Link 
                        href={`/products?category=${product.category.slug}`}
                        className="text-[#1e3a8a] hover:underline"
                      >
                        {product.category.name}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-[#1e3a8a] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1e3a8a]/90 transition-colors">
                  Купить сейчас
                </button>
                <div className="flex items-center gap-2 text-gray-500">
                  <HelpCircle size={20} />
                  <span className="text-[16px]">Задайте нам вопрос</span>
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Поделиться:</span>
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${product.name} - ${window.location.href}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src="/icons/wpp-icon.svg"
                        alt="Share on WhatsApp"
                        width={24}
                        height={24}
                        className="h-auto"
                      />
                    </a>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src="/icons/tg-icon.svg"
                        alt="Share on Telegram"
                        width={24}
                        height={24}
                        className="h-auto"
                      />
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        // You might want to add a toast notification here
                      }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-4 bg-[#F8F9FB] rounded-lg">
                <div className="flex items-center justify-between px-6 py-4">
                  <h3 className="text-gray-600 font-medium">Безопасные платежи</h3>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/icons/kaspi.svg"
                      alt="Kaspi Bank"
                      width={30}
                      height={25}
                      className="h-auto"
                    />
                    <Image
                      src="/icons/visa-logo.svg"
                      alt="Visa"
                      width={45}
                      height={18}
                      className="h-auto"
                    />
                    <Image
                      src="/icons/mastercard-logo.svg"
                      alt="Mastercard"
                      width={45}
                      height={18}
                      className="h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <div className="container mx-auto px-4 max-w-[1300px]">
              <div className="flex gap-8">
                <button 
                  onClick={() => setActiveTab('description')}
                  className={`py-4 font-medium transition-colors ${
                    activeTab === 'description'
                      ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
                      : 'text-gray-600 hover:text-[#1e3a8a]'
                  }`}
                >
                  Описание
                </button>
                <button 
                  onClick={() => setActiveTab('additional')}
                  className={`py-4 font-medium transition-colors ${
                    activeTab === 'additional'
                      ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
                      : 'text-gray-600 hover:text-[#1e3a8a]'
                  }`}
                >
                  Дополнительная информация
                </button>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto py-8 max-w-[1300px]">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              {activeTab === 'description' ? (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-0">
                  {product.manufacturer && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Производитель</span>
                      <span className="text-gray-900">{product.manufacturer}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Артикул</span>
                      <span className="text-gray-900">{product.sku}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Вес</span>
                      <span className="text-gray-900">{product.weight} кг</span>
                    </div>
                  )}
                  {product.dimensions && product.dimensions.length !== null && product.dimensions.width !== null && product.dimensions.height !== null && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Размеры</span>
                      <span className="text-gray-900">
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} см
                      </span>
                    </div>
                  )}
                  {product.quantity !== null && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Наличие</span>
                      <span className="text-gray-900">
                        {(() => {
                          switch (product.status) {
                            case 'OUT_OF_STOCK':
                              return <span className="text-red-500">Нет в наличии</span>;
                            case 'LOW_STOCK':
                              return <span className="text-orange-500">Заканчивается</span>;
                            case 'PREORDER':
                              return <span className="text-blue-500">Предзаказ</span>;
                            case 'DISCONTINUED':
                              return <span className="text-gray-500">Снят с производства</span>;
                            case 'IN_STOCK':
                            default:
                              return `${product.quantity} шт`;
                          }
                        })()}
                      </span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 w-full sm:w-1/3 mb-1 sm:mb-0">Категория</span>
                      <Link 
                        href={`/products?category=${product.category.slug}`}
                        className="text-[#1e3a8a] hover:underline"
                      >
                        {product.category.name}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 