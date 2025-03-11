'use client';

import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-[#F8F9FB] border-t border-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-[1300px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo/aqqozy-logo.svg"
                alt="Aqqozy"
                width={150}
                height={50}
                className="h-auto"
              />
            </Link>
            <p className="text-gray-600 text-sm max-w-[300px]">
              Большой выбор спецодежды
              и инструментов для строительства
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Магазин</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/catalog" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-medium text-gray-500 mb-2">Остались вопросы? Позвоните нам</h3>
            <a href="tel:+77018333837" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors block mb-4">
              +7 (701) 833-38-37
            </a>
            <div className="flex items-start gap-2 text-gray-600">
              <svg className="w-5 h-5 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>
                Брусиловского 107Б, бутик 115, 116., Алматы, Казахстан
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              ©2025 Все права защищены Aqqozy.kz
            </p>
            <div className="flex items-center gap-3">
              <Image
                src="/icons/kaspi.svg"
                alt="Kaspi Bank"
                width={25}
                height={25}
                className="h-auto"
              />
              <Image
                src="/icons/visa-logo.svg"
                alt="Visa"
                width={45}
                height={15}
                className="h-auto"
              />
              <Image
                src="/icons/mastercard-logo.svg"
                alt="Mastercard"
                width={45}
                height={15}
                className="h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 