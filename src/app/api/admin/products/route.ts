import { NextResponse } from 'next/server';
import { getProductsWithDetails, createProduct } from '@/lib/db';

// Get all products
export async function GET() {
  try {
    const products = await getProductsWithDetails();
    return NextResponse.json(products);
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
    const { name, description, price, images, categoryId } = body;

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