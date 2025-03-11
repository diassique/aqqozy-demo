'use client';

import { MapPin, Clock, Phone, Mail, ExternalLink, Navigation2 } from 'lucide-react';

export const AddressSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
      {/* Modern Line Pattern with Fade Effect */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: `
          linear-gradient(45deg, #e2e8f0 1px, transparent 1px),
          linear-gradient(-45deg, #e2e8f0 1px, transparent 1px),
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
        backgroundSize: '3rem 3rem, 3rem 3rem, 3rem 3rem, 3rem 3rem',
        opacity: '0.7',
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }} />

      <div className="container relative mx-auto px-4 py-24 max-w-[1300px]">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Как нас найти?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Мы находимся в удобном месте с отличной транспортной доступностью. Приезжайте к нам!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Contact Information */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <div className="space-y-1">
                {/* Address */}
                <div className="group flex items-start gap-6 hover:bg-blue-50/50 p-4 -mx-4 rounded-2xl transition-colors duration-300">
                  <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-800 mb-2">
                      Адрес
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Алматы, улица Брусиловского, 107Б,<br />
                      <span className="inline-flex items-center gap-2 text-blue-600 mt-1">
                        <Navigation2 className="w-4 h-4" /> метро Сайран
                      </span>
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="group flex items-start gap-6 hover:bg-blue-50/50 p-4 -mx-4 rounded-2xl transition-colors duration-300">
                  <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-800 mb-2">
                      Режим работы
                    </h3>
                    <div className="space-y-1">
                      <p className="text-gray-600 text-lg">
                        <span className="font-medium">Пн-Пт:</span> 9:00 - 18:00
                      </p>
                      <p className="text-gray-600 text-lg">
                        <span className="font-medium">Сб-Вс:</span> Выходной
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="group flex items-start gap-6 hover:bg-blue-50/50 p-4 -mx-4 rounded-2xl transition-colors duration-300">
                  <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-800 mb-2">
                      Свяжитесь с нами
                    </h3>
                    <div className="space-y-2">
                      <a 
                        href="tel:+77018333837"
                        className="text-lg text-gray-600 hover:text-blue-600 transition-colors block"
                      >
                        +7 (701) 833-38-37
                      </a>
                      <a 
                        href="mailto:info@aqqozy.kz"
                        className="text-lg text-gray-600 hover:text-blue-600 transition-colors block"
                      >
                        info@aqqozy.kz
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Link */}
              <a
                href="https://yandex.kz/maps/-/CDaWjZ7y"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <span className="border-b border-transparent group-hover:border-blue-600 transition-colors">
                  Открыть в Яндекс Картах
                </span>
                <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative h-[488px] rounded-3xl overflow-hidden shadow-2xl">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=76.889130%2C43.239768&mode=search&oid=43619739544&ol=biz&z=17"
                width="100%"
                height="100%"
                frameBorder="0"
                className="absolute inset-0 w-full h-full"
                allow="geolocation"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddressSection; 