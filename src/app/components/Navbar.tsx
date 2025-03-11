import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Строительный магазин
          </Link>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-gray-600">
              Главная
            </Link>
            <Link href="/categories" className="hover:text-gray-600">
              Категории
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 