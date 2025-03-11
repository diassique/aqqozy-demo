'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ImageUpload } from '@/app/components/ImageUpload';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductImage {
  id: number;
  url: string;
  order: number;
  productId: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  images: ProductImage[];
  category: Category;
  categoryId: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    images: [] as string[],
    categoryId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadKey, setUploadKey] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts(data);
    } catch (err) {
      toast.error('Ошибка при загрузке товаров');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCategories(data);
    } catch (err) {
      toast.error('Ошибка при загрузке категорий');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const loadingToast = toast.loading('Создание товара...');
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        categoryId: parseInt(newProduct.categoryId)
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Товар успешно создан', { id: loadingToast });
      setNewProduct({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        images: [],
        categoryId: ''
      });
      setUploadKey(prev => prev + 1);
      fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка при создании товара', { id: loadingToast });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;

    const loadingToast = toast.loading('Удаление товара...');
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success('Товар успешно удален', { id: loadingToast });
      fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка при удалении товара', { id: loadingToast });
    }
  };

  return (
    <>
      <Head>
        <title>Управление товарами - Панель администратора</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
                  ← Назад к панели управления
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold mb-6">Управление товарами</h1>

            {/* Create Product Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Создать новый товар</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-700 p-3 rounded">
                    {success}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Название товара
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Цена
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Изображения товара (до 5 фото)
                  </label>
                  <ImageUpload
                    key={uploadKey}
                    onImagesUploaded={(urls) => setNewProduct({ ...newProduct, images: urls })}
                    currentImages={newProduct.images}
                    maxImages={5}
                  />
                </div>
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Категория
                  </label>
                  <select
                    id="categoryId"
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Создать товар
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium mb-4">Список товаров</h2>
                {isLoading ? (
                  <div className="text-gray-500">Загрузка...</div>
                ) : products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Название
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Цена
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Категория
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {product.price.toLocaleString()} ₸
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {product.category.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <Link
                                  href={`/admin/products/${product.id}/edit`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Редактировать
                                </Link>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Удалить
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500">Нет товаров</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 