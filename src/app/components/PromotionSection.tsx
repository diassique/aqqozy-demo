'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const PromotionSection = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-[1300px]">
      <div className="grid grid-cols-12 gap-6">
        {/* First Block - Tools and Discounts (Golden ratio: ~1.618) */}
        <div className="col-span-12 min-[1180px]:col-span-7 relative overflow-visible rounded-2xl shadow-lg group min-h-[300px]">
          <div className="absolute inset-0 rounded-2xl bg-[#F1F1F1]">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent min-[1180px]:block hidden" />
            <div className="absolute inset-0 bg-white/80 min-[1180px]:hidden block" />
          </div>
          <div className="absolute right-0 top-0 w-full h-full min-[1180px]:w-[400px] min-[1180px]:h-[300px] min-[1180px]:-right-5 min-[1180px]:-top-12 z-[1] min-[1180px]:z-20 pointer-events-none">
            <div className="relative w-full h-full min-[1180px]:absolute">
              <Image
                src="/images/tools-1.png"
                alt="Construction Tools"
                fill
                className="object-contain opacity-50 min-[1180px]:opacity-100"
                style={{ objectPosition: 'center center' }}
              />
            </div>
          </div>
          <div className="relative z-10 p-8">
            <div className="text-sm font-medium mb-4 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-md">
              Скидки до 20% на популярные товары
            </div>
            <h3 className="text-2xl font-bold text-[#0B4A72] mb-4 max-w-[300px]">
              Aqqozy представляет нашим клиентам скидки и лучшие условия на спецодежду и СИЗ
            </h3>
            <a 
              href="#" 
              className="inline-flex items-center text-[#E75825] hover:text-[#d14d20] transition-colors group/link"
            >
              <span className="text-lg font-medium border-b border-transparent group-hover/link:border-[#d14d20] transition-colors">
                Купить сейчас
              </span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Second Block - Workwear */}
        <div className="col-span-12 min-[1180px]:col-span-5 relative overflow-visible rounded-2xl bg-[#44C1FF] shadow-lg group min-h-[300px]">
          <div className="absolute right-0 bottom-0 w-full h-full min-[1180px]:w-[300px] min-[1180px]:h-[310px] min-[1180px]:-right-20 min-[1180px]:-bottom-1 z-[1] min-[1180px]:z-20 pointer-events-none">
            <div className="relative w-full h-full min-[1180px]:absolute">
              <Image
                src="/images/worker.png"
                alt="Worker in Uniform"
                fill
                className="object-contain opacity-50 min-[1180px]:opacity-100"
                style={{ objectPosition: 'center bottom' }}
              />
            </div>
          </div>
          <div className="relative z-10 p-8">
            <h3 className="text-3xl font-bold text-white mb-2">
              Спецодежда любого<br />
              типа для строительных<br />
              и хозяйственных работ
            </h3>
            <p className="text-white/90 text-xl mb-6">
              Широкий выбор спецодежды
            </p>
            <div className="relative">
              <a 
                href="#" 
                className="relative inline-flex items-center bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all group/link backdrop-blur-sm"
              >
                <span className="text-lg font-medium">
                  Смотреть товары
                </span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative w-full overflow-hidden rounded-2xl mt-6">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/cta-background.png"
            alt="Background"
            fill
            className="object-cover object-center rounded-2xl"
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
          />
          {/* Overlay with blue gradient - made slightly more transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-500/70 rounded-2xl" />
        </div>

        {/* Content - adjusted padding for better proportions */}
        <div className="relative px-6 py-10 md:px-12 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left max-w-[1300px] mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                Свяжитесь с нами
              </h2>
              <p className="text-lg md:text-xl text-white/90">
                Компания Aqqozy - лучший выбор!
              </p>
            </div>
            <button
              onClick={() => {
                // Modal logic will be added later
                console.log('Open contact modal');
              }}
              className="flex-shrink-0 px-8 py-3 bg-[#fa5a20] hover:bg-[#ff6027]/90 text-white rounded-lg 
                transition-all duration-200 transform hover:scale-105 
                font-medium text-lg shadow-lg hover:shadow-xl w-full md:w-auto"
            >
              Связаться с нами
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PromotionSection; 