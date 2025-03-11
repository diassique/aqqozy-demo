'use client';

import Image from 'next/image';

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: '/icons/benefits/benefit-1.svg',
      title: 'Качество',
      description: 'Реализуем отборную продукцию соответствующую стандартам качества.'
    },
    {
      icon: '/icons/benefits/benefit-2.svg',
      title: 'Стоимость',
      description: 'У нас справедливые цены, предусмотрены скидки для клиентов, акции.'
    },
    {
      icon: '/icons/benefits/benefit-3.svg',
      title: 'Выбор',
      description: 'Постоянно расширяем ассортимент магазина, предлагая множество товаров.'
    },
    {
      icon: '/icons/benefits/benefit-4.svg',
      title: 'Объем',
      description: 'Реализуем продукты в розницу и оптом, можем поставить любую партию товара.'
    },
    {
      icon: '/icons/benefits/benefit-5.svg',
      title: 'Сервис',
      description: 'Специалисты внимательно вас проконсультируют и помогут с выбором товара.'
    },
    {
      icon: '/icons/benefits/benefit-6.svg',
      title: 'Доставка',
      description: 'Работаем по всему Казахстану, также отправляем в Кыргызстан (Бишкек)'
    }
  ];

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-[1300px]">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-12">
          Почему выбирают <span className="text-[#1e3a8a]">нас</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group bg-gray-50 rounded-2xl p-6 transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              
              <div className="relative">
                {/* Icon */}
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center transition-all duration-300">
                    <Image
                      src={benefit.icon}
                      alt={benefit.title}
                      width={48}
                      height={48}
                      className="text-[#1e3a8a] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[#1e3a8a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 