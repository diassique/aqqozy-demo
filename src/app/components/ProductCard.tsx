'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ImageIcon, User, Package, Store, MessageCircleQuestion } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ContactModal } from './ContactModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface ProductImage {
  id: number;
  url: string;
  order: number;
  productId: number;
}

interface ProductCardProps {
  name: string;
  slug: string;
  price: number;
  priceIsFrom?: boolean;
  imageUrl: string;
  images: ProductImage[];
  category?: {
    name?: string;
    slug?: string;
  };
  description?: string;
  viewMode?: 'grid' | 'list';
  status?: string;
  isNew?: boolean;
  saleType?: string;
}

export const ProductCard = ({ 
  name, 
  slug, 
  price, 
  priceIsFrom = false,
  imageUrl, 
  images = [], 
  category = {}, 
  description, 
  viewMode = 'grid',
  status = 'IN_STOCK',
  isNew = false,
  saleType = 'BOTH'
}: ProductCardProps) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const allImages = (images && images.length > 0 ? images.map(img => img.url) : (imageUrl ? [imageUrl] : []))
    .filter(url => url && !failedImages.has(url));

  // Function to strip HTML tags and return plain text
  const stripHtmlTags = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const handleImageError = (failedUrl: string) => {
    setFailedImages(prev => new Set([...prev, failedUrl]));
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OUT_OF_STOCK':
        return { text: 'Нет в наличии', className: 'text-red-500' };
      case 'LOW_STOCK':
        return { text: 'Заканчивается', className: 'text-orange-500' };
      case 'PREORDER':
        return { text: 'Предзаказ', className: 'text-blue-500' };
      case 'DISCONTINUED':
        return { text: 'Снят с производства', className: 'text-gray-500' };
      case 'IN_STOCK':
      default:
        return { text: 'В наличии', className: 'text-green-500' };
    }
  };

  const getSaleTypeInfo = (saleType: string) => {
    switch (saleType) {
      case 'RETAIL_ONLY':
        return { 
          text: 'Розница', 
          icon: <User className="w-3 h-3" />, 
          className: 'bg-blue-50 text-blue-700 border border-blue-200' 
        };
      case 'WHOLESALE_ONLY':
        return { 
          text: 'Опт', 
          icon: <Package className="w-3 h-3" />, 
          className: 'bg-purple-50 text-purple-700 border border-purple-200' 
        };
      case 'BOTH':
      default:
        return { 
          text: 'Розница + Опт', 
          icon: <Store className="w-3 h-3" />,
          className: 'bg-green-50 text-green-700 border border-green-200' 
        };
    }
  };

  const statusInfo = getStatusText(status);
  const saleTypeInfo = getSaleTypeInfo(saleType);

  const NoImagePlaceholder = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <ImageIcon className="w-12 h-12 text-gray-400" />
    </div>
  );

  if (viewMode === 'list') {
    return (
      <>
        <Link href={`/products/${slug}`} className="group block relative p-2 sm:p-3">
          <div className="flex gap-4 relative z-10">
            <div className="w-28 h-28 sm:w-48 sm:h-48 md:w-[220px] md:h-[200px] flex-shrink-0">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                {Boolean(isNew) && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 bg-[#E1FC49] text-black text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    Новинка
                  </div>
                )}
                {allImages.length > 0 ? (
                  <Image
                    src={allImages[0]}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 192px, 220px"
                    onError={() => handleImageError(allImages[0])}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    priority
                  />
                ) : (
                  <NoImagePlaceholder />
                )}
              </div>
            </div>
            
            <div className="flex-1 py-1 sm:py-2 flex flex-col min-h-28 sm:min-h-48 md:min-h-[200px]">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-gray-500">
                    {category?.name || 'Без категории'}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${saleTypeInfo.className}`}>
                    {saleTypeInfo.icon}
                    <span className="font-medium">{saleTypeInfo.text}</span>
                  </div>
                </div>
                
                <h3 className="mt-1 sm:mt-2 text-base sm:text-xl font-medium text-gray-900 group-hover:text-[#E75825] transition-colors line-clamp-2 sm:line-clamp-none">
                  {name}
                </h3>

                {description && (
                  <p className="mt-2 sm:mt-3 text-gray-600 line-clamp-2 text-xs sm:text-[14px]">
                    {stripHtmlTags(description)}
                  </p>
                )}
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    {priceIsFrom ? 'от ' : ''}{price.toLocaleString()} ₸
                  </div>
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsContactModalOpen(true);
                    }}
                    className="w-full bg-[#fa5a20] hover:bg-[#E75825]/90 text-white font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Заказать
                  </button>
                  <div className="flex items-center justify-between">
                    <div className={`text-left text-xs ${statusInfo.className}`}>
                      {statusInfo.text}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsContactModalOpen(true);
                      }}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      <MessageCircleQuestion className="w-3 h-3" />
                      <span>Есть вопросы?</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 group-hover:shadow-[0_3px_15px_rgba(0,0,0,0.07)] transition-all duration-300 rounded-2xl" />
        </Link>
        
        {/* Contact Modal */}
        <ContactModal 
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Link href={`/products/${slug}`} className="group block h-full relative p-3 max-w-full">
        <div className="flex flex-col h-full transition-all duration-300 relative z-10 max-w-full">
          <div className="relative aspect-square max-w-full">
            {Boolean(isNew) && (
              <div className="absolute top-3 right-3 z-20 bg-[#E1FC49] text-black text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                Новинка
              </div>
            )}
            {allImages.length > 0 ? (
              <Swiper
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                  bulletClass: 'swiper-pagination-bullet',
                }}
                loop={allImages.length > 1}
                allowTouchMove={true}
                className="h-full w-full [&_.swiper-pagination]:!bottom-4 [&_.swiper-pagination]:!z-20 
                  [&_.swiper-pagination-bullet]:!w-2 
                  [&_.swiper-pagination-bullet]:!h-2 
                  [&_.swiper-pagination-bullet]:!mx-1.5
                  [&_.swiper-pagination-bullet]:!bg-gray-300
                  [&_.swiper-pagination-bullet]:!opacity-100
                  [&_.swiper-pagination-bullet]:transition-colors
                  [&_.swiper-pagination-bullet]:duration-300
                  [&_.swiper-pagination-bullet]:hover:!bg-[#E75825]/70
                  [&_.swiper-pagination-bullet-active]:!bg-[#E75825]"
              >
                {allImages.map((image, index) => (
                  <SwiperSlide key={index} className="h-full w-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center">
                      <Image
                        src={image}
                        alt={`${name} - image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => handleImageError(image)}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                        priority={index === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <NoImagePlaceholder />
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-grow pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm text-gray-500">
                  {category?.name || 'Без категории'}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${saleTypeInfo.className}`}>
                  {saleTypeInfo.icon}
                  <span className="font-medium">{saleTypeInfo.text}</span>
                </div>
              </div>
              
              <h3 className="mt-1 text-[16px] font-medium text-gray-900 line-clamp-2 group-hover:text-[#E75825] transition-colors min-h-[2.75rem]">
                {name}
              </h3>
            </div>

            <div className="mt-auto pt-2">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  {priceIsFrom ? 'от ' : ''}{price.toLocaleString()} ₸
                </div>
                <div className="flex items-center space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsContactModalOpen(true);
                  }}
                  className="w-full bg-[#fa5a20] hover:bg-[#E75825]/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
                >
                  Заказать
                </button>
                <div className="flex items-center justify-between">
                  <div className={`text-left text-xs ${statusInfo.className}`}>
                    {statusInfo.text}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsContactModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <MessageCircleQuestion className="w-3 h-3" />
                    <span>Есть вопросы?</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 group-hover:shadow-[0_3px_15px_rgba(0,0,0,0.07)] transition-all duration-300 rounded-2xl" />
      </Link>
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}; 