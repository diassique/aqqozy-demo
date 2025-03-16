import { NextResponse } from 'next/server';
import { deleteCategory } from '@/lib/db';
import { turso } from '@/lib/turso';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    // Check if category has products
    const { rows } = await turso.execute({
      sql: 'SELECT COUNT(*) as count FROM Product WHERE categoryId = ?',
      args: [id]
    });
    
    const productsCount = rows[0].count;

    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Нельзя удалить категорию, содержащую товары' },
        { status: 400 }
      );
    }

    const success = await deleteCategory(id);
    
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