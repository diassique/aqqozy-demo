import { NextResponse } from 'next/server';
import { getAllCategories, createCategory } from '@/lib/db';
import { turso } from '@/lib/turso';

// Get all categories
export async function GET() {
  try {
    const categories = await getAllCategories();
    
    // Get product counts for each category
    const categoriesWithCount = [];
    
    for (const category of categories) {
      const { rows } = await turso.execute({
        sql: 'SELECT COUNT(*) as count FROM Product WHERE categoryId = ?',
        args: [category.id]
      });
      
      categoriesWithCount.push({
        id: category.id,
        name: category.name,
        slug: category.slug,
        productCount: rows[0].count
      });
    }

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке категорий' },
      { status: 500 }
    );
  }
}

// Create a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Название категории обязательно' },
        { status: 400 }
      );
    }

    const category = await createCategory({ name });
    
    // Get product count (will be 0 for a new category)
    return NextResponse.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      productCount: 0
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании категории' },
      { status: 500 }
    );
  }
} 