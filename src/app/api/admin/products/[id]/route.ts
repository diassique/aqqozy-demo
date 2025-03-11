import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get a single product
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке товара' },
      { status: 500 }
    );
  }
}

// Update a product
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      images, 
      categoryId,
      status,
      quantity,
      isPublished,
      isFeatured,
      isNew,
      sku,
      weight,
      dimensions,
      manufacturer,
      metaTitle,
      metaDescription,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Название, цена и категория обязательны' },
        { status: 400 }
      );
    }

    // First, delete existing images
    await prisma.productImage.deleteMany({
      where: { productId },
    });

    // Update the product with new data
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        imageUrl: images[0] || '',
        categoryId,
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
        status: status as any, // Type assertion to fix Prisma type error
        quantity,
        isPublished,
        isFeatured,
        isNew,
        sku,
        weight,
        dimensions,
        manufacturer,
        metaTitle,
        metaDescription,
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении товара' },
      { status: 500 }
    );
  }
}

// Delete a product
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // First delete all images associated with the product
    await prisma.productImage.deleteMany({
      where: { productId },
    });

    // Then delete the product
    await prisma.product.delete({
      where: { id: productId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    );
  }
} 