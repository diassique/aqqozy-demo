'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { use } from 'react';
import { ImageUpload } from '@/app/components/ImageUpload';
import { FullPageLoader } from '@/app/components/Loader';
import RichTextEditor from '@/app/components/RichTextEditor';
import toast from 'react-hot-toast';

enum ProductStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  PREORDER = 'PREORDER',
  DISCONTINUED = 'DISCONTINUED'
}

enum SaleType {
  RETAIL_ONLY = 'RETAIL_ONLY',
  WHOLESALE_ONLY = 'WHOLESALE_ONLY',
  BOTH = 'BOTH'
}

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

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  priceIsFrom: boolean;
  images: string[];
  categoryId: string;
  status: ProductStatus;
  quantity: string;
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
  sku: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  manufacturer: string;
  metaTitle: string;
  metaDescription: string;
  saleType: SaleType;
}

export default function EditProductPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '0',
    priceIsFrom: false,
    images: [],
    categoryId: '',
    status: ProductStatus.IN_STOCK,
    quantity: '0',
    isPublished: true,
    isFeatured: false,
    isNew: false,
    sku: '',
    weight: '0',
    dimensions: {
      length: '0',
      width: '0',
      height: '0',
    },
    manufacturer: '',
    metaTitle: '',
    metaDescription: '',
    saleType: SaleType.BOTH,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        toast.error('Ошибка при загрузке категорий');
        console.error('Error:', err);
      }
    };

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const product = await response.json();
        
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: String(product.price || 0),
          priceIsFrom: product.priceIsFrom ?? false,
          images: product.images?.map((img: ProductImage) => img.url) || [],
          categoryId: String(product.categoryId || ''),
          status: product.status || ProductStatus.IN_STOCK,
          quantity: String(product.quantity || 0),
          isPublished: product.isPublished ?? true,
          isFeatured: product.isFeatured ?? false,
          isNew: product.isNew ?? false,
          sku: product.sku || '',
          weight: String(product.weight || 0),
          dimensions: {
            length: String(product.dimensions?.length || 0),
            width: String(product.dimensions?.width || 0),
            height: String(product.dimensions?.height || 0),
          },
          manufacturer: product.manufacturer || '',
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          saleType: product.saleType || SaleType.BOTH,
        });
      } catch (err) {
        toast.error('Ошибка при загрузке товара');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loadingToast = toast.loading('Обновление товара...');
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          priceIsFrom: formData.priceIsFrom,
          categoryId: parseInt(formData.categoryId) || 0,
          quantity: parseInt(formData.quantity) || 0,
          weight: parseFloat(formData.weight) || 0,
          dimensions: {
            length: parseFloat(formData.dimensions.length) || 0,
            width: parseFloat(formData.dimensions.width) || 0,
            height: parseFloat(formData.dimensions.height) || 0,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to update product');
      
      toast.success('Товар успешно обновлен', { id: loadingToast });
      router.push('/admin/products');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка при обновлении товара', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <>
      <Head>
        <title>Редактирование товара - Панель администратора</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">
                  ← Назад к списку товаров
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold mb-6">Редактирование товара</h1>

            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Основная информация</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Название товара
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Описание
                      </label>
                      <RichTextEditor
                        value={formData.description}
                        onChange={(value) => setFormData({ ...formData, description: value })}
                        placeholder="Введите описание товара..."
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Цена
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          id="price"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                          required
                          min="0"
                          step="0.01"
                        />
                        <label className="flex items-center gap-2 mt-1">
                          <input
                            type="checkbox"
                            checked={formData.priceIsFrom}
                            onChange={(e) => setFormData({ ...formData, priceIsFrom: e.target.checked })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">от</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                        Артикул (SKU)
                      </label>
                      <input
                        type="text"
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
                        Производитель
                      </label>
                      <input
                        type="text"
                        id="manufacturer"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Управление запасами</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Статус товара
                      </label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      >
                        <option value={ProductStatus.IN_STOCK}>В наличии</option>
                        <option value={ProductStatus.OUT_OF_STOCK}>Нет в наличии</option>
                        <option value={ProductStatus.LOW_STOCK}>Заканчивается</option>
                        <option value={ProductStatus.PREORDER}>Предзаказ</option>
                        <option value={ProductStatus.DISCONTINUED}>Снят с продажи</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Количество
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        min="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="saleType" className="block text-sm font-medium text-gray-700 mb-1">
                        Тип продажи
                      </label>
                      <select
                        id="saleType"
                        value={formData.saleType}
                        onChange={(e) => setFormData({ ...formData, saleType: e.target.value as SaleType })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      >
                        <option value={SaleType.RETAIL_ONLY}>Только в розницу</option>
                        <option value={SaleType.WHOLESALE_ONLY}>Только оптом</option>
                        <option value={SaleType.BOTH}>Оптом и в розницу</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Цены и маркетинг</h3>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Опубликован</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Рекомендуемый товар</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Новинка</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Физические характеристики</h3>
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Вес (кг)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      min="0"
                      step="0.001"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                        Длина (см)
                      </label>
                      <input
                        type="number"
                        id="length"
                        value={formData.dimensions.length}
                        onChange={(e) => setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, length: e.target.value }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                        Ширина (см)
                      </label>
                      <input
                        type="number"
                        id="width"
                        value={formData.dimensions.width}
                        onChange={(e) => setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, width: e.target.value }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                        Высота (см)
                      </label>
                      <input
                        type="number"
                        id="height"
                        value={formData.dimensions.height}
                        onChange={(e) => setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, height: e.target.value }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">SEO</h3>
                  <div>
                    <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Изображения товара (до 5 фото)</h3>
                  <ImageUpload
                    onImagesUploaded={(urls) => setFormData({ ...formData, images: urls })}
                    currentImages={formData.images}
                    maxImages={5}
                  />
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Категория
                  </label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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

                <div className="flex justify-end gap-4">
                  <Link
                    href="/admin/products"
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Отмена
                  </Link>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Сохранить изменения
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 