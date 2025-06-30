import { NextResponse } from 'next/server';
import { getProductsWithDetails, getProductsWithDetailsLimited, createProduct, getProductsWithCount } from '@/lib/db';

// Get all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 12;
    const categorySlug = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') as string, 10) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') as string, 10) : undefined;
    const sort = searchParams.get('sort') || 'latest';

    const result = await getProductsWithCount({
      page,
      limit,
      categorySlug,
      minPrice,
      maxPrice,
      sort,
    });
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке товаров' },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, priceIsFrom, images, categoryId } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Название, цена и категория обязательны' },
        { status: 400 }
      );
    }

    const product = await createProduct({
      name,
      description,
      price,
      priceIsFrom: priceIsFrom || false,
      categoryId,
      images: images || [],
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании товара' },
      { status: 500 }
    );
  }
} 