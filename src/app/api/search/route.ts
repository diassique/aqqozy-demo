import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 8;

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const products = await searchProducts(query, limit);
    
    return NextResponse.json(products);

  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске товаров' },
      { status: 500 }
    );
  }
} 