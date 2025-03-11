import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { headers } from 'next/headers';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Aqqozy - Интернет-магазин',
  description: 'Aqqozy интернет-магазин - ваш надежный поставщик товаров',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="ru">
      <body>
        {!isAdminRoute && <Header />}
        <main>{children}</main>
        {!isAdminRoute && <Footer />}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
