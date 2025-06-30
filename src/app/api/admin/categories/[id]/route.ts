import { NextResponse } from 'next/server';
import { deleteCategory, updateCategory } from '@/lib/db';
import { turso } from '@/lib/turso';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const categoryId = parseInt(id, 10);
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Название категории обязательно' },
        { status: 400 }
      );
    }

    const updatedCategory = await updateCategory(categoryId, { name });

    if (!updatedCategory) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении категории' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const categoryId = parseInt(id, 10);

    // Check if category has products
    const { rows } = await turso.execute({
      sql: 'SELECT COUNT(*) as count FROM Product WHERE categoryId = ?',
      args: [categoryId]
    });
    
    const productsCount = Number(rows[0].count);

    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Нельзя удалить категорию, содержащую товары' },
        { status: 400 }
      );
    }

    const success = await deleteCategory(categoryId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении категории' },
      { status: 500 }
    );
  }
} 