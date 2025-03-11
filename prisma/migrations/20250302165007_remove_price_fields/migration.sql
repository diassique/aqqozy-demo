/*
  Warnings:

  - You are about to drop the column `discount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `oldPrice` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "quantity" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "sku" TEXT,
    "weight" REAL,
    "dimensions" JSONB,
    "manufacturer" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "dimensions", "id", "imageUrl", "isFeatured", "isNew", "isPublished", "manufacturer", "metaDescription", "metaTitle", "name", "price", "quantity", "sku", "slug", "status", "updatedAt", "weight") SELECT "categoryId", "createdAt", "description", "dimensions", "id", "imageUrl", "isFeatured", "isNew", "isPublished", "manufacturer", "metaDescription", "metaTitle", "name", "price", "quantity", "sku", "slug", "status", "updatedAt", "weight" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_isPublished_idx" ON "Product"("isPublished");
CREATE INDEX "Product_isFeatured_idx" ON "Product"("isFeatured");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
