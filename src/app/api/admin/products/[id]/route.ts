import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct, getProductImages } from '@/lib/db';
import { turso } from '@/lib/turso';

// Get a single product
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get product images
    const images = await getProductImages(id);

    // Get category name
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
      { error: 'Error fetching product' },
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
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
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
      priceIsFrom,
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

    const updatedProduct = await updateProduct(id, {
      name,
      description,
      price,
      priceIsFrom,
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
      images
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get product images
    const updatedImages = await getProductImages(id);

    // Get category name
    const { rows: categoryRows } = await turso.execute({
      sql: 'SELECT * FROM Category WHERE id = ?',
      args: [updatedProduct.categoryId]
    });
    
    // Format the category data to match the expected structure
    const category = categoryRows.length > 0 ? {
      id: categoryRows[0].id,
      name: categoryRows[0].name,
      slug: categoryRows[0].slug
    } : null;

    return NextResponse.json({
      ...updatedProduct,
      category,
      images: updatedImages
    });
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
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const success = await deleteProduct(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    );
  }
} 