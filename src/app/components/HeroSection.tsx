'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, HardHat, Wrench, Shield, MessageCircle } from 'lucide-react';
import { ContactModal } from './ContactModal';

export const HeroSection = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
      
      <div className="container mx-auto px-4 max-w-[1300px]">
        <div className="flex flex-col lg:flex-row items-center py-6 lg:py-16 gap-8 lg:gap-12">
          {/* Image - Moved to top for mobile */}
          <div className="flex-1 relative w-full order-1 lg:order-2">
            <div className="relative w-full aspect-[16/10] lg:aspect-[4/3]">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#fa5a20] to-[#E75825] rounded-[2rem] blur-2xl opacity-20" />
              <div className="relative h-full">
                <Image
                  src="/images/hero-section.jpg"
                  alt="Спецодежда и инструменты"
                  fill
                  className="object-cover rounded-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Floating Card - Centered on mobile, left corner on desktop */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 lg:translate-x-0 lg:-bottom-6 lg:-left-6 bg-white p-3 lg:p-4 rounded-xl shadow-lg max-w-[200px] lg:max-w-[240px]">
                  <div className="flex items-start gap-2 lg:gap-3">
                    <div className="p-1.5 lg:p-2 bg-green-50 rounded-lg">
                      <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-sm lg:text-base text-gray-900">Гарантия качества</div>
                      <div className="text-xs lg:text-sm text-gray-500 mt-0.5 lg:mt-1">Сертифицированные товары</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative z-10 w-full order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 lg:mb-6">
              Профессиональная{' '}
              <span className="text-[#fa5a20]">спецодежда и инструменты</span>
            </h1>
            <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-xl">
              Широкий выбор качественной спецодежды и профессиональных инструментов для строительства и ремонта. Оснащаем профессионалов.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/products" 
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#fa5a20] hover:bg-[#d14d20] rounded-xl transition-colors duration-300"
              >
                Смотреть каталог
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/about" 
                className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-colors duration-300 border border-gray-200"
              >
                О компании
              </Link>
            </div>
            
            {/* Contact Us Button */}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="mt-4 inline-flex items-center px-6 py-3 text-base font-medium text-[#fa5a20] bg-white hover:bg-[#fff8f6] rounded-xl transition-colors duration-300 border border-[#fa5a20]"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Связаться с нами
            </button>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8 mt-8 lg:mt-12">
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <HardHat className="w-5 h-5 lg:w-6 lg:h-6 text-[#fa5a20]" />
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">20000+</div>
                </div>
                <div className="text-xs lg:text-sm text-gray-500 mt-1 text-center sm:text-left">Довольных клиентов</div>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 lg:w-6 lg:h-6 text-[#fa5a20]" />
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">1000+</div>
                </div>
                <div className="text-xs lg:text-sm text-gray-500 mt-1 text-center sm:text-left">Инструментов</div>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-[#fa5a20]" />
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">5 лет</div>
                </div>
                <div className="text-xs lg:text-sm text-gray-500 mt-1 text-center sm:text-left">На рынке</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}; 