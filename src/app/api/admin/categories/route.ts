import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

// Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Transform the response to include productCount
    const categoriesWithCount = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      productCount: category._count.products
    }));

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

    // Generate a random slug
    let slug = `${nanoid(10)}`;

    // Check if slug is unique (just in case, although collision is extremely unlikely)
    let existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    // In the rare case of a collision, generate a new slug
    while (existingCategory) {
      slug = `${nanoid(10)}`;
      existingCategory = await prisma.category.findUnique({
        where: { slug },
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return NextResponse.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      productCount: category._count.products
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании категории' },
      { status: 500 }
    );
  }
} 