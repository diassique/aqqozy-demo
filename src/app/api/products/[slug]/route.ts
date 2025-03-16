import { NextResponse } from 'next/server';
import { getProductBySlug, getProductImages } from '@/lib/db';
import { turso } from '@/lib/turso';

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const product = await getProductBySlug(params.slug);

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      );
    }

    // Get product images
    const images = await getProductImages(product.id);

    // Get category
    const { rows: categoryRows } = await turso.execute({
      sql: 'SELECT * FROM Category WHERE id = ?',
      args: [product.categoryId]
    });
    
    // Format the category data to match the expected structure
    const category = categoryRows.length > 0 ? {
      id: categoryRows[0].id,
      name: categoryRows[0].name,
      slug: categoryRows[0].slug
    } : null;

    return NextResponse.json({
      ...product,
      category,
      images
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке товара' },
      { status: 500 }
    );
  }
} 