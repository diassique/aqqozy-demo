/*
  Warnings:

  - You are about to drop the column `additionalPhones` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryInfo` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethods` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `socialMedia` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `workingHours` on the `CompanyInfo` table. All the data in the column will be lost.
  - Added the required column `telephone` to the `CompanyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workSchedule` to the `CompanyInfo` table without a default value. This is not possible if the table is not empty.
  - Made the column `whatsapp` on table `CompanyInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompanyInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telephone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "workSchedule" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CompanyInfo" ("address", "createdAt", "email", "id", "updatedAt", "whatsapp") SELECT "address", "createdAt", "email", "id", "updatedAt", "whatsapp" FROM "CompanyInfo";
DROP TABLE "CompanyInfo";
ALTER TABLE "new_CompanyInfo" RENAME TO "CompanyInfo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
