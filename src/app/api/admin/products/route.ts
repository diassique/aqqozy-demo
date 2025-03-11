import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

// Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
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

    // Generate a random slug
    let slug = `${nanoid(10)}`;

    // Check if slug is unique (just in case, although collision is extremely unlikely)
    let existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    // In the rare case of a collision, generate a new slug
    while (existingProduct) {
      slug = `${nanoid(10)}`;
      existingProduct = await prisma.product.findUnique({
        where: { slug },
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        imageUrl: images[0] || '', // Keep the first image as the main image for backward compatibility
        categoryId,
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
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