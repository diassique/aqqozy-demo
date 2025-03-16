import { PrismaClient } from '@prisma/client';
import { turso } from '../src/lib/turso';

const prisma = new PrismaClient();

async function migrateData() {
  try {
    // Migrate Categories
    const categories = await prisma.category.findMany();
    for (const category of categories) {
      await turso.execute(
        `INSERT INTO Category (id, name, slug, description, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          category.id,
          category.name,
          category.slug,
          category.description,
          category.createdAt.toISOString(),
          category.updatedAt.toISOString(),
        ]
      );
    }
    console.log(`✅ Migrated ${categories.length} categories`);

    // Migrate Products
    const products = await prisma.product.findMany();
    for (const product of products) {
      await turso.execute(
        `INSERT INTO Product (
          id, name, slug, description, price, imageUrl, categoryId,
          createdAt, updatedAt, status, quantity, isPublished,
          isFeatured, isNew, sku, weight, dimensions, manufacturer,
          metaTitle, metaDescription
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )`,
        [
          product.id,
          product.name,
          product.slug,
          product.description,
          product.price,
          product.imageUrl,
          product.categoryId,
          product.createdAt.toISOString(),
          product.updatedAt.toISOString(),
          product.status,
          product.quantity,
          product.isPublished,
          product.isFeatured,
          product.isNew,
          product.sku,
          product.weight,
          product.dimensions ? JSON.stringify(product.dimensions) : null,
          product.manufacturer,
          product.metaTitle,
          product.metaDescription,
        ]
      );
    }
    console.log(`✅ Migrated ${products.length} products`);

    // Migrate Product Images
    const productImages = await prisma.productImage.findMany();
    for (const image of productImages) {
      await turso.execute(
        `INSERT INTO ProductImage (id, url, productId, order_num, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [
          image.id,
          image.url,
          image.productId,
          image.order,
          image.createdAt.toISOString(),
        ]
      );
    }
    console.log(`✅ Migrated ${productImages.length} product images`);

    // Migrate Admins
    const admins = await prisma.admin.findMany();
    for (const admin of admins) {
      await turso.execute(
        `INSERT INTO Admin (id, email, password, createdAt)
         VALUES (?, ?, ?, ?)`,
        [
          admin.id,
          admin.email,
          admin.password,
          admin.createdAt.toISOString(),
        ]
      );
    }
    console.log(`✅ Migrated ${admins.length} admins`);

    // Migrate Company Info
    const companyInfo = await prisma.companyInfo.findMany();
    for (const info of companyInfo) {
      await turso.execute(
        `INSERT INTO CompanyInfo (
          id, telephone, whatsapp, address, workSchedule,
          email, website, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          info.id,
          info.telephone,
          info.whatsapp,
          info.address,
          info.workSchedule,
          info.email,
          info.website,
          info.createdAt.toISOString(),
          info.updatedAt.toISOString(),
        ]
      );
    }
    console.log(`✅ Migrated ${companyInfo.length} company info records`);

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 