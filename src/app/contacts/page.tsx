'use client';

import { MapPin, Clock, Phone, Mail, ExternalLink, Navigation2, MessageCircle, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container relative mx-auto px-4 py-20 max-w-[1300px]">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Контакты
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Свяжитесь с нами любым удобным способом. Мы всегда рады помочь!
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="relative py-20">
        {/* Background Pattern */}
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

        <div className="container relative mx-auto px-4 max-w-[1300px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                  Информация о магазине
                </h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="group flex items-start gap-6 hover:bg-blue-50/50 p-4 -mx-4 rounded-2xl transition-colors duration-300">
                    <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-800 mb-2">
                        Адрес магазина
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        Алматы, улица Брусиловского, 107Б,<br />
                        бутик 115, 116
                      </p>
                      <p className="inline-flex items-center gap-2 text-blue-600 mt-2 text-sm">
                        <Navigation2 className="w-4 h-4" /> 
                        Ближайшее метро: Сайран
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="group flex items-start gap-6 hover:bg-blue-50/50 p-4 -mx-4 rounded-2xl transition-colors duration-300">
                    <div className="flex-shrink-0 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-800 mb-2">
                        Режим работы
                      </h3>
                      <div className="space-y-1">
                        <p className="text-gray-600 text-lg">
                          <span className="font-medium">Понедельник - Пятница:</span> 9:00 - 18:00
                        </p>
                        <p className="text-gray-600 text-lg">
                          <span className="font-medium">Суббота - Воскресенье:</span> Выходной
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group flex items-start gap-6 hover:bg-blue-50/50 p-4 -mx-4 rounded-2xl transition-colors duration-300">
                    <div className="flex-shrink-0 p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-800 mb-2">
                        Телефон
                      </h3>
                      <a 
                        href="tel:+77018333837"
                        className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        +7 (701) 833-38-37
                      </a>
                      <p className="text-gray-500 text-sm mt-1">
                        Звонки принимаются в рабочее время
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group flex items-start gap-6 hover:bg-blue-50/50 p-4 -mx-4 rounded-2xl transition-colors duration-300">
                    <div className="flex-shrink-0 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-800 mb-2">
                        Электронная почта
                      </h3>
                      <a 
                        href="mailto:info@aqqozy.kz"
                        className="text-lg text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        info@aqqozy.kz
                      </a>
                      <p className="text-gray-500 text-sm mt-1">
                        Ответим в течение рабочего дня
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-[2rem] blur-2xl opacity-20" />
                <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/-/CHgXVUIN"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    className="absolute inset-0 w-full h-full"
                    allow="geolocation"
                  ></iframe>
                </div>
                
                {/* Map Link */}
                <div className="mt-6 text-center">
                  <a
                    href="https://yandex.kz/maps/ru/-/CHgXVUIN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group text-lg font-medium"
                  >
                    <span className="border-b border-transparent group-hover:border-blue-600 transition-colors">
                      Открыть в Яндекс Картах
                    </span>
                    <ExternalLink className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Способы оплаты
                </h3>
                <div className="flex items-center justify-center gap-6">
                  <Image
                    src="/icons/kaspi.svg"
                    alt="Kaspi Bank"
                    width={40}
                    height={40}
                    className="h-auto"
                  />
                  <Image
                    src="/icons/visa-logo.svg"
                    alt="Visa"
                    width={60}
                    height={20}
                    className="h-auto"
                  />
                  <Image
                    src="/icons/mastercard-logo.svg"
                    alt="Mastercard"
                    width={60}
                    height={20}
                    className="h-auto"
                  />
                </div>
                <p className="text-gray-600 text-center mt-4 text-sm">
                  Принимаем наличные и банковские карты
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 max-w-[1300px] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовы сделать покупку?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Посетите наш магазин или свяжитесь с нами для консультации
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-5 h-5 mr-2" />
              Посмотреть каталог
            </Link>
            <a
              href="tel:+77018333837"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Позвонить сейчас
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 